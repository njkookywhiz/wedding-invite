"use client";
import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import { useRef } from "react";

export default function Hero() {
  const containerRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  // Ganesha Animations
  const ganeshaScale = useTransform(scrollYProgress, [0, 0.2, 0.4], [1, 1, 0.3]);
  const ganeshaY = useTransform(scrollYProgress, [0, 0.2, 0.4], ["0vh", "0vh", "-28vh"]);

  // Photos Animations
  const photosOpacity = useTransform(scrollYProgress, [0.3, 0.5], [0, 1]);
  const photosY = useTransform(scrollYProgress, [0.3, 0.5], ["20vh", "-5vh"]);
  const photosScale = useTransform(scrollYProgress, [0.3, 0.5], [0.6, 0.9]);

  // Names Animations
  const namesOpacity = useTransform(scrollYProgress, [0.5, 0.7], [0, 1]);
  const namesScale = useTransform(scrollYProgress, [0.5, 0.7], [0.5, 1]);
  
  // Parents Animations
  const parentsOpacity = useTransform(scrollYProgress, [0.7, 0.9], [0, 1]);
  const parentsY = useTransform(scrollYProgress, [0.7, 0.9], ["10vh", "0vh"]);

  return (
    <section ref={containerRef} className="relative h-[500vh] bg-gradient-to-r from-pink-200 via-orange-100 to-yellow-200 bg-[length:400%_400%] animate-gradient">
      
      {/* Sticky Container */}
      <div className="sticky top-0 h-screen w-full overflow-hidden flex flex-col items-center justify-center">
        
        {/* Decorative rich background pattern */}
        <div 
          className="absolute inset-0 opacity-10 pointer-events-none mix-blend-overlay" 
          style={{ 
            backgroundImage: 'url("https://www.transparenttextures.com/patterns/arabesque.png")',
            backgroundRepeat: 'repeat'
          }}
        ></div>
        
        {/* Animated Background Orbs */}
        <div className="absolute inset-0 pointer-events-none opacity-60">
          <motion.div 
            animate={{ scale: [1, 1.3, 1], rotate: [0, 90, 0] }}
            transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-[10%] left-[-10%] w-[500px] h-[500px] bg-orange-400 rounded-full mix-blend-multiply filter blur-[100px]"
          ></motion.div>
          <motion.div 
            animate={{ scale: [1, 1.4, 1], rotate: [0, -90, 0] }}
            transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
            className="absolute bottom-[10%] right-[-10%] w-[600px] h-[600px] bg-pink-400 rounded-full mix-blend-multiply filter blur-[100px]"
          ></motion.div>
        </div>
        
        {/* Content Wrapper */}
        <div className="relative z-10 w-full h-full flex flex-col items-center justify-center px-4">
          
          {/* Step 1: Ganesha & Shloka */}
          <motion.div 
            style={{ scale: ganeshaScale, y: ganeshaY }}
            className="absolute flex flex-col items-center justify-center w-full z-20 origin-top"
          >
            <Image src="/images/ganesh.png" alt="Ganesha" width={380} height={380} className="drop-shadow-2xl" />
            <p className="mt-8 text-orange-800 font-hindi text-3xl md:text-5xl tracking-wide text-center leading-relaxed drop-shadow-md font-bold">
              वक्रतुण्ड महाकाय सूर्यकोटि समप्रभ।<br/>
              निर्विघ्नं कुरु मे देव सर्वकार्येषु सर्वदा॥
            </p>
          </motion.div>

          {/* Step 2-4: Heroes Container */}
          <motion.div 
            style={{ opacity: photosOpacity, y: photosY, scale: photosScale }}
            className="absolute flex flex-col lg:flex-row items-center justify-center gap-4 lg:gap-20 w-full max-w-7xl mt-12"
          >
            
            {/* Bride */}
            <div className="flex flex-col items-center z-10 w-full">
              <div className="w-[180px] h-[180px] md:w-[260px] md:h-[260px] rounded-full overflow-hidden border-[10px] border-white/90 shadow-2xl relative bg-orange-50 mb-2 backdrop-blur-sm">
                <div className="w-full h-full relative rounded-full overflow-hidden border-2 border-orange-300">
                  <Image src="/images/ankita.jpg" alt="Ankita" fill className="object-cover object-[center_10%]" />
                </div>
              </div>
              
              <motion.h1 style={{ opacity: namesOpacity, scale: namesScale }} className="text-[4rem] md:text-[6rem] font-script leading-none text-pink-700 drop-shadow-md mb-1 bg-clip-text text-transparent bg-gradient-to-r from-pink-600 to-orange-600">
                Ankita
              </motion.h1>
              
              <motion.div style={{ opacity: parentsOpacity, y: parentsY }} className="flex flex-col items-center mt-1">
                <span className="font-script text-3xl md:text-4xl text-orange-600 mb-1 drop-shadow-sm">Daughter of</span>
                <p className="text-sm md:text-xl text-pink-700 font-serif font-bold bg-white/60 backdrop-blur-md px-6 py-2 rounded-full shadow-md whitespace-nowrap">
                  Mr. Narender Sharma & Mrs. Uma Sharma
                </p>
              </motion.div>
            </div>
            
            <motion.div 
              style={{ opacity: namesOpacity }}
              className="text-5xl md:text-[6rem] text-orange-500 font-script my-2 lg:my-0 drop-shadow-xl z-0"
            >
              &amp;
            </motion.div>
            
            {/* Groom */}
            <div className="flex flex-col items-center z-10 w-full">
              <div className="w-[180px] h-[180px] md:w-[260px] md:h-[260px] rounded-full overflow-hidden border-[10px] border-white/90 shadow-2xl relative bg-orange-50 mb-2 backdrop-blur-sm">
                <div className="w-full h-full relative rounded-full overflow-hidden border-2 border-orange-300">
                  <Image src="/images/neeraj.jpg" alt="Neeraj" fill className="object-cover object-[center_10%]" />
                </div>
              </div>
              
              <motion.h1 style={{ opacity: namesOpacity, scale: namesScale }} className="text-[4rem] md:text-[6rem] font-script leading-none text-pink-700 drop-shadow-md mb-1 bg-clip-text text-transparent bg-gradient-to-r from-pink-600 to-orange-600">
                Neeraj
              </motion.h1>
              
              <motion.div style={{ opacity: parentsOpacity, y: parentsY }} className="flex flex-col items-center mt-1">
                <span className="font-script text-3xl md:text-4xl text-orange-600 mb-1 drop-shadow-sm">Son of</span>
                <p className="text-sm md:text-xl text-pink-700 font-serif font-bold bg-white/60 backdrop-blur-md px-6 py-2 rounded-full shadow-md whitespace-nowrap">
                  Mr. Mohan Jha & Mrs. Ranju Jha
                </p>
              </motion.div>
            </div>
            
          </motion.div>

        </div>
        
        {/* Scroll Indicator */}
        <motion.div 
          animate={{ y: [0, 10, 0], opacity: [0.3, 1, 0.3] }} 
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute bottom-6 flex flex-col items-center"
        >
          <span className="text-orange-800 font-serif text-xs md:text-sm tracking-[0.3em] uppercase font-bold">Scroll Down</span>
          <div className="w-px h-8 md:h-12 bg-gradient-to-b from-orange-800 to-transparent mt-2"></div>
        </motion.div>
      </div>
    </section>
  );
}
