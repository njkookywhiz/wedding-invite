"use client";
import { motion, useScroll, useTransform } from "framer-motion";
import { MapPin, Navigation } from "lucide-react";
import { useRef } from "react";

export default function Venue() {
  const containerRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const headerScale = useTransform(scrollYProgress, [0, 0.2], [1, 0.7]);
  const headerOpacity = useTransform(scrollYProgress, [0, 0.1], [1, 0.9]);

  return (
    <section ref={containerRef} className="py-12 bg-orange-100/50 relative">
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#be185d 2px, transparent 2px)', backgroundSize: '30px 30px' }}></div>
      
      {/* Sticky Header */}
      <div className="sticky top-0 z-30 py-4 mb-12 bg-orange-100/90 backdrop-blur-md shadow-sm border-b border-orange-200 w-full flex justify-center origin-top">
        <motion.h2 
          style={{ scale: headerScale, opacity: headerOpacity }}
          className="text-6xl font-script text-pink-700 drop-shadow-sm origin-top"
        >
          The Venue
        </motion.h2>
      </div>

      <div className="max-w-4xl mx-auto px-6 relative z-10 pb-12">
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="bg-orange-50 rounded-3xl p-8 md:p-12 shadow-xl border border-orange-200 text-center"
        >
          <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6 text-orange-600 shadow-inner">
            <MapPin className="w-10 h-10" />
          </div>
          
          <h3 className="text-3xl font-bold text-orange-900 mb-2 font-serif">Khatu Bagh Resort</h3>
          <p className="text-xl text-orange-800 mb-8 max-w-lg mx-auto">
            Near Khatu Shyam Ji Temple, Khatu, Sikar, Rajasthan 332602
          </p>

          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="text-left space-y-4 bg-orange-100/50 p-6 rounded-2xl border border-orange-200 h-full flex flex-col justify-center">
              <div>
                <h4 className="font-bold text-pink-700 text-lg">Date</h4>
                <p className="text-orange-900 text-xl font-medium mt-2">30th November 2026</p>
              </div>
            </div>
            
            <motion.a 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              href="https://maps.app.goo.gl/5zVXZUWg4SBpWwMA9" 
              target="_blank" 
              rel="noreferrer"
              className="flex items-center justify-center gap-3 bg-gradient-to-r from-orange-500 to-pink-500 text-white py-5 px-8 rounded-2xl text-xl font-bold shadow-lg hover:shadow-orange-500/30 transition-all"
            >
              <Navigation className="w-6 h-6" />
              Open in Google Maps
            </motion.a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
