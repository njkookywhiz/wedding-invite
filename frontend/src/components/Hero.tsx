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

  // Names & Couple Container Animations
  const namesOpacity = useTransform(scrollYProgress, [0.3, 0.55], [0, 1]);
  const namesY = useTransform(scrollYProgress, [0.3, 0.55], ["15vh", "0vh"]);
  const namesScale = useTransform(scrollYProgress, [0.3, 0.55], [0.8, 1]);
  
  // Parents Details Animations (reveal smoothly after names)
  const parentsOpacity = useTransform(scrollYProgress, [0.55, 0.8], [0, 1]);
  const parentsY = useTransform(scrollYProgress, [0.55, 0.8], ["5vh", "0vh"]);

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

          {/* Step 2-3: Names & Parent Details Container */}
          <motion.div 
            style={{ opacity: namesOpacity, y: namesY, scale: namesScale }}
            className="absolute flex flex-col items-center justify-center w-full max-w-6xl mt-16 px-4"
          >
            <div className="flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-16 w-full">
              
              {/* Bride Details */}
              <div className="flex flex-col items-center text-center w-full max-w-md">
                <span className="text-xs md:text-sm uppercase tracking-[0.3em] text-orange-600 font-bold mb-1">
                  The Bride
                </span>
                <h1 className="text-[4.5rem] md:text-[7rem] font-script leading-tight text-pink-700 drop-shadow-md py-1">
                  Ankita
                </h1>
                
                <motion.div style={{ opacity: parentsOpacity, y: parentsY }} className="flex flex-col items-center mt-2">
                  <span className="font-script text-2xl md:text-3xl text-orange-600 mb-1">Daughter of</span>
                  <p className="text-sm md:text-lg text-pink-700 font-serif font-bold bg-white/70 backdrop-blur-md px-6 py-2.5 rounded-full shadow-md border border-orange-200/60 whitespace-nowrap">
                    Mr. Narender Sharma & Mrs. Uma Sharma
                  </p>
                </motion.div>
              </div>
              
              {/* Decorative & Separator */}
              <div className="flex flex-col items-center my-2 lg:my-0">
                <span className="text-4xl md:text-6xl text-orange-400 font-script drop-shadow-sm">&amp;</span>
                <div className="hidden lg:block w-px h-24 bg-gradient-to-b from-transparent via-orange-400 to-transparent mt-2"></div>
              </div>
              
              {/* Groom Details */}
              <div className="flex flex-col items-center text-center w-full max-w-md">
                <span className="text-xs md:text-sm uppercase tracking-[0.3em] text-orange-600 font-bold mb-1">
                  The Groom
                </span>
                <h1 className="text-[4.5rem] md:text-[7rem] font-script leading-tight text-pink-700 drop-shadow-md py-1">
                  Neeraj
                </h1>
                
                <motion.div style={{ opacity: parentsOpacity, y: parentsY }} className="flex flex-col items-center mt-2">
                  <span className="font-script text-2xl md:text-3xl text-orange-600 mb-1">Son of</span>
                  <p className="text-sm md:text-lg text-pink-700 font-serif font-bold bg-white/70 backdrop-blur-md px-6 py-2.5 rounded-full shadow-md border border-orange-200/60 whitespace-nowrap">
                    Mr. Mohan Jha & Mrs. Ranju Jha
                  </p>
                </motion.div>
              </div>

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
