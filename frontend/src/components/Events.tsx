"use client";
import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import { useRef } from "react";

export default function Events() {
  const containerRef = useRef<HTMLElement>(null);
  
  // Create a scroll-linked animation experience
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  // Background smoothly scales up as user scrolls
  const bgScale = useTransform(scrollYProgress, [0, 1], [1, 1.2]);
  
  // Overlay darkens slightly to reveal text clearly
  const overlayOpacity = useTransform(scrollYProgress, [0, 0.4, 0.6], [0, 0.6, 0.8]);
  
  // Staggered Text Animations
  const t1Y = useTransform(scrollYProgress, [0.15, 0.3], ["50px", "0px"]);
  const t1O = useTransform(scrollYProgress, [0.15, 0.3], [0, 1]);

  const t2Y = useTransform(scrollYProgress, [0.2, 0.35], ["50px", "0px"]);
  const t2O = useTransform(scrollYProgress, [0.2, 0.35], [0, 1]);

  const t3Y = useTransform(scrollYProgress, [0.25, 0.4], ["50px", "0px"]);
  const t3O = useTransform(scrollYProgress, [0.25, 0.4], [0, 1]);

  const t4Y = useTransform(scrollYProgress, [0.3, 0.45], ["50px", "0px"]);
  const t4O = useTransform(scrollYProgress, [0.3, 0.45], [0, 1]);

  const t5Y = useTransform(scrollYProgress, [0.35, 0.5], ["50px", "0px"]);
  const t5O = useTransform(scrollYProgress, [0.35, 0.5], [0, 1]);

  return (
    <section ref={containerRef} className="relative h-[250vh] bg-gradient-to-b from-orange-50 via-pink-50 to-yellow-50 border-y border-orange-200">
      <div className="sticky top-0 h-screen w-full overflow-hidden flex flex-col items-center justify-center">
        
        {/* Full Screen Parallax Background */}
        <motion.div style={{ scale: bgScale }} className="absolute inset-0 w-full h-full origin-center">
          <Image 
            src="/images/barat.jpg" 
            alt="The Barat" 
            fill 
            className="object-cover object-center opacity-[0.25]"
            priority
          />
        </motion.div>

        {/* Colorful Celebration Overlay (Light) */}
        <motion.div 
          style={{ opacity: overlayOpacity }} 
          className="absolute inset-0 bg-gradient-to-t from-orange-200/60 via-pink-100/40 to-transparent mix-blend-overlay"
        ></motion.div>

        {/* Scroll Revealed Content */}
        <div className="relative z-10 flex flex-col items-center justify-center text-center px-6 max-w-4xl h-full pb-10">
          
          <motion.span 
            style={{ y: t1Y, opacity: t1O }}
            className="text-red-700 font-sans tracking-[0.4em] uppercase text-xs md:text-lg mb-4 drop-shadow-sm font-black bg-white/70 backdrop-blur-md px-6 py-2 rounded-full border border-pink-200"
          >
            The Grand Celebration
          </motion.span>
          
          <motion.h2 
            style={{ y: t2Y, opacity: t2O }}
            className="text-[5rem] md:text-[10rem] font-script leading-none mb-2"
            animate={{ 
              textShadow: [
                "0px 5px 15px rgba(0,0,0,0.5)", 
                "0px 0px 30px rgba(234,179,8,0.8)", 
                "0px 5px 15px rgba(0,0,0,0.5)"
              ] 
            }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          >
            <span style={{ WebkitTextStroke: "2px #ca8a04", color: "#facc15" }}>The Barat</span>
          </motion.h2>
          
          <motion.div style={{ y: t2Y, opacity: t2O }} className="h-1 w-48 md:w-64 bg-gradient-to-r from-transparent via-pink-400 to-transparent mb-6"></motion.div>
          
          <motion.h3 
            style={{ y: t3Y, opacity: t3O }}
            className="text-3xl md:text-5xl font-serif text-pink-700 mb-6 drop-shadow-sm font-bold"
          >
            30th November 2026
          </motion.h3>
          
          <motion.div 
            style={{ y: t4Y, opacity: t4O }}
            className="inline-block bg-gradient-to-r from-orange-400 to-pink-500 px-10 py-3 rounded-full border border-pink-200 text-white font-bold tracking-[0.2em] text-xl md:text-2xl shadow-lg mb-6"
          >
            5:00 PM
          </motion.div>
          
          <motion.p 
            style={{ y: t5Y, opacity: t5O }}
            className="text-lg md:text-2xl text-pink-700 font-serif italic max-w-3xl leading-relaxed bg-white/50 p-4 rounded-xl backdrop-blur-md border border-pink-200"
          >
            Join the vibrant procession as we dance our way to celebrate the union of two souls. Expect music, lights, and endless joy!
          </motion.p>
        </div>

      </div>
    </section>
  );
}
