"use client";
import { useState, useEffect, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

export default function Countdown() {
  const [timeLeft, setTimeLeft] = useState({
    days: 0, hours: 0, minutes: 0, seconds: 0
  });
  const [isOver, setIsOver] = useState(false);
  const containerRef = useRef<HTMLElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const headerOpacity = useTransform(scrollYProgress, [0, 0.3], [0, 1]);
  const headerY = useTransform(scrollYProgress, [0, 0.3], ["10vh", "0vh"]);
  
  const timerOpacity = useTransform(scrollYProgress, [0.3, 0.6], [0, 1]);
  const timerScale = useTransform(scrollYProgress, [0.3, 0.6], [0.8, 1]);

  useEffect(() => {
    const targetDate = new Date("2026-11-29T09:00:00").getTime();

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetDate - now;

      if (distance < 0) {
        clearInterval(interval);
        setIsOver(true);
      } else {
        setTimeLeft({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000)
        });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  if (isOver) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, type: "spring" }}
        className="py-16 bg-pink-50 text-center"
      >
        <h2 className="text-5xl md:text-7xl font-script text-pink-600 mb-4 animate-pulse">The Big Day is Here!</h2>
        <p className="text-2xl text-orange-900 font-serif">Welcome to the celebration.</p>
      </motion.div>
    );
  }

  return (
    <section ref={containerRef} className="relative h-[250vh] bg-gradient-to-b from-orange-100 via-pink-100 to-orange-50 border-y border-orange-200">
      <div className="sticky top-0 h-screen w-full flex flex-col items-center justify-center overflow-hidden">
        
        <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: 'radial-gradient(#d97706 2px, transparent 2px)', backgroundSize: '30px 30px' }}></div>
        
        <div className="max-w-5xl mx-auto px-6 text-center relative z-10 w-full">
          <motion.div 
            style={{ opacity: headerOpacity, y: headerY }}
            className="mb-12 flex flex-col items-center"
          >
            <span className="font-script text-[4rem] md:text-[6rem] text-pink-500 mb-0 leading-none drop-shadow-sm">The Journey begins in</span>
            <h2 className="text-3xl md:text-5xl font-serif text-orange-700 uppercase tracking-widest bg-clip-text text-transparent bg-gradient-to-r from-orange-600 to-pink-600 mt-4">Counting down to Forever</h2>
            <div className="h-1 w-24 bg-gradient-to-r from-orange-400 to-pink-400 mt-6 rounded-full"></div>
          </motion.div>
          
          <motion.div 
            style={{ opacity: timerOpacity, scale: timerScale }}
            className="flex flex-wrap justify-center gap-4 md:gap-8"
          >
            {Object.entries(timeLeft).map(([unit, value], index) => (
              <div key={unit} className="flex flex-col items-center">
                <div className="w-20 h-20 md:w-32 md:h-32 bg-gradient-to-br from-white to-orange-50 rounded-2xl flex items-center justify-center border-4 border-orange-100 shadow-xl mb-3 relative overflow-hidden">
                  <div className="absolute inset-0 bg-orange-50/40 backdrop-blur-sm z-0"></div>
                  <span className="text-4xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-orange-600 to-pink-600 z-10 font-serif drop-shadow-sm">{value}</span>
                </div>
                <span className="text-sm md:text-base uppercase tracking-[0.2em] text-orange-800 font-bold">{unit}</span>
              </div>
            ))}
          </motion.div>
        </div>

      </div>
    </section>
  );
}
