"use client";
import React, { useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectCards } from 'swiper/modules';
import Image from 'next/image';
import { motion, useScroll, useTransform } from 'framer-motion';

import 'swiper/css';
import 'swiper/css/effect-cards';

const images = [
  '/images/gallery1.jpg',
  '/images/gallery2.jpg',
  '/images/gallery3.jpg',
  '/images/gallery4.jpg',
];

export default function Gallery() {
  const containerRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const headerScale = useTransform(scrollYProgress, [0, 0.2], [1, 0.7]);
  const headerOpacity = useTransform(scrollYProgress, [0, 0.1], [1, 0.9]);

  return (
    <section ref={containerRef} className="py-12 bg-pink-50 relative">
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#d97706 2px, transparent 2px)', backgroundSize: '30px 30px' }}></div>
      
      {/* Sticky Header */}
      <div className="sticky top-0 z-30 py-4 mb-16 bg-pink-50/90 backdrop-blur-md shadow-sm border-b border-orange-200 w-full flex flex-col items-center justify-center origin-top">
        <motion.div style={{ scale: headerScale, opacity: headerOpacity }} className="text-center origin-top">
          <h2 className="text-6xl font-script text-orange-700">Pre-Wedding Memories</h2>
          <p className="text-xl text-orange-900 mt-0 font-serif italic">A glimpse into our beautiful moments together.</p>
        </motion.div>
      </div>

      <div className="w-full max-w-lg mx-auto pb-24 relative z-10 overflow-hidden px-4">
        <Swiper
          effect={'cards'}
          grabCursor={true}
          autoplay={{
            delay: 2500,
            disableOnInteraction: false,
          }}
          modules={[EffectCards, Autoplay]}
          className="w-[300px] md:w-[400px] h-[450px] md:h-[600px]"
        >
          {images.map((src, index) => (
            <SwiperSlide key={index} className="rounded-[2rem] overflow-hidden shadow-2xl border-8 border-white bg-white">
              <div className="relative w-full h-full">
                <Image 
                  src={src} 
                  alt={`Gallery Image ${index + 1}`} 
                  fill 
                  className="object-cover brightness-110 contrast-110 saturate-110" 
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}
