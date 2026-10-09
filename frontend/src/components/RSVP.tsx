"use client";
import { useState, useRef } from "react";
import Confetti from "react-confetti";
import { useWindowSize } from "react-use";
import { toast } from "sonner";
import { motion, useScroll, useTransform } from "framer-motion";
import { saveRsvp } from "@/app/actions/rsvp";

export default function RSVP() {
  const [transport, setTransport] = useState("");
  const [carStatus, setCarStatus] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const { width, height } = useWindowSize();
  const containerRef = useRef<HTMLElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const headerScale = useTransform(scrollYProgress, [0, 0.2], [1, 0.7]);
  const headerOpacity = useTransform(scrollYProgress, [0, 0.1], [1, 0.9]);

  const availableSeats = 4; 

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name"),
      people: formData.get("people"),
      room: formData.get("room"),
      transport: formData.get("transport"),
      carStatus: formData.get("carStatus"),
      vacantSeats: formData.get("vacantSeats") || 0,
    };

    const res = await saveRsvp(data);
    setIsSubmitting(false);

    if (res.success) {
      setSubmitted(true);
      toast.success("RSVP Submitted! We can't wait to see you.", {
        style: { background: '#fdf4ff', color: '#be185d', border: '1px solid #fbcfe8' }
      });
    } else {
      toast.error("Oops! Something went wrong. Please try again.");
    }
  };

  return (
    <section ref={containerRef} className="py-12 bg-gradient-to-br from-orange-100 to-yellow-100 relative">
      {submitted && <Confetti width={width} height={height} recycle={false} numberOfPieces={500} colors={['#fbbf24', '#f472b6', '#34d399', '#f87171']} />}
      
      {/* Sticky Header */}
      <div className="sticky top-0 z-30 py-4 mb-12 bg-gradient-to-br from-orange-100 to-yellow-100/90 backdrop-blur-md shadow-sm border-b border-orange-200 w-full flex flex-col items-center justify-center origin-top">
        <motion.div style={{ scale: headerScale, opacity: headerOpacity }} className="text-center origin-top">
          <h2 className="text-6xl font-script text-orange-700 drop-shadow-sm">RSVP & Travel</h2>
          <p className="text-orange-900 mt-0 font-serif">Please let us know if you'll be joining us.</p>
        </motion.div>
      </div>

      <div className="max-w-3xl mx-auto px-6 pb-20 relative z-10">
        {submitted ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-green-50 text-green-800 p-8 rounded-2xl text-center border border-green-200"
          >
            <h3 className="text-3xl font-serif mb-2">Thank You!</h3>
            <p className="text-lg">Your details have been saved. We can't wait to celebrate with you!</p>
            <button onClick={() => setSubmitted(false)} className="mt-6 text-sm text-green-600 underline hover:text-green-800">Submit another response</button>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-orange-50/50 p-6 md:p-10 rounded-3xl border border-orange-200 shadow-xl space-y-8">
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-orange-900 mb-2">Full Name</label>
                <input required name="name" type="text" className="w-full px-4 py-3 rounded-xl border border-orange-200 focus:ring-2 focus:ring-orange-400 outline-none transition-all shadow-sm" placeholder="Enter your name" />
              </div>
              <div>
                <label className="block text-sm font-bold text-orange-900 mb-2">Number of People</label>
                <input required name="people" type="number" min="1" className="w-full px-4 py-3 rounded-xl border border-orange-200 focus:ring-2 focus:ring-orange-400 outline-none transition-all shadow-sm" placeholder="1" />
              </div>
            </div>

            <div className="grid md:grid-cols-1 gap-6">
              <div>
                <label className="block text-sm font-bold text-orange-900 mb-2">Room / Accommodation Preference</label>
                <select name="room" className="w-full px-4 py-3 rounded-xl border border-orange-200 focus:ring-2 focus:ring-orange-400 outline-none transition-all shadow-sm">
                  <option value="">Select preference</option>
                  <option value="single">Single Room</option>
                  <option value="shared">Shared Room</option>
                  <option value="none">Not staying (No room required)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-orange-900 mb-2">Mode of Transport</label>
              <select 
                required 
                name="transport"
                value={transport} 
                onChange={(e) => setTransport(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-orange-200 focus:ring-2 focus:ring-orange-400 outline-none transition-all shadow-sm"
              >
                <option value="">How are you arriving?</option>
                <option value="car">By Car</option>
                <option value="train">By Train</option>
                <option value="bus">By Bus</option>
                <option value="flight">By Flight</option>
              </select>
            </div>

            {transport === "car" && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="bg-gradient-to-br from-orange-100 to-yellow-100 p-6 rounded-2xl border border-orange-200 shadow-sm"
              >
                <h4 className="font-bold text-orange-800 mb-4 flex items-center gap-2">
                  🚗 Carpooling Options
                  <span className="bg-orange-100 text-orange-700 text-xs px-3 py-1 rounded-full animate-pulse border border-orange-200">
                    {availableSeats} seats available currently
                  </span>
                </h4>
                
                <div className="space-y-4">
                  <label className="flex items-center gap-3 cursor-pointer p-2 hover:bg-orange-50 rounded-lg transition-colors">
                    <input type="radio" name="carStatus" value="need" onChange={(e) => setCarStatus(e.target.value)} className="w-4 h-4 text-orange-500 focus:ring-orange-500 border-gray-300" />
                    <span className="text-orange-900 font-medium">I want to adjust/share a ride with someone</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer p-2 hover:bg-orange-50 rounded-lg transition-colors">
                    <input type="radio" name="carStatus" value="have" onChange={(e) => setCarStatus(e.target.value)} className="w-4 h-4 text-orange-500 focus:ring-orange-500 border-gray-300" />
                    <span className="text-orange-900 font-medium">I have vacant seats to share</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer p-2 hover:bg-orange-50 rounded-lg transition-colors">
                    <input type="radio" name="carStatus" value="none" onChange={(e) => setCarStatus(e.target.value)} className="w-4 h-4 text-orange-500 focus:ring-orange-500 border-gray-300" />
                    <span className="text-orange-900 font-medium">Just driving myself/my family</span>
                  </label>
                </div>

                {carStatus === "have" && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-4 p-2">
                    <label className="block text-sm font-bold text-orange-900 mb-2">How many vacant seats?</label>
                    <input type="number" name="vacantSeats" min="1" className="w-full md:w-1/3 px-4 py-2 rounded-xl border border-orange-200 focus:ring-2 focus:ring-orange-400 outline-none shadow-sm" placeholder="e.g. 2" />
                  </motion.div>
                )}
              </motion.div>
            )}

            <button type="submit" disabled={isSubmitting} className="w-full bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white font-bold py-4 rounded-xl transition-all shadow-lg hover:shadow-orange-500/30 hover:-translate-y-1 text-lg disabled:opacity-70 disabled:hover:-translate-y-0">
              {isSubmitting ? "Submitting..." : "Confirm RSVP"}
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
