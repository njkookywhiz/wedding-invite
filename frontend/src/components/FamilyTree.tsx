"use client";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

const familyData = {
  bride: {
    parents: "Mr. Narender Sharma & Mrs. Uma Sharma",
    siblings: [
      { name: "Ankita Sharma", relation: "The Bride", isSelf: true },
      { name: "Abhishek Sharma", relation: "Younger Brother" }
    ]
  },
  groom: {
    parents: "Mr. Mohan Jha & Mrs. Ranju Jha",
    siblings: [
      { name: "Pankaj Jha", relation: "Elder Brother", spouse: "Puja Jha", children: ["Elisha Jha"] },
      { name: "Neeraj Kumar Jha", relation: "The Groom", isSelf: true },
      { name: "Arti Jha", relation: "Younger Sister", spouse: "Onkar Jha", children: ["Anubhavi Jha"] },
      { name: "Pooja Panday", relation: "Youngest Sister", spouse: "Abhishek Panday" }
    ]
  }
};

const Node = ({ title, subtitle, spouse, details, isSelf }: { title: string, subtitle?: string, spouse?: string, details?: string[], isSelf?: boolean }) => (
  <motion.div 
    whileHover={{ scale: 1.05, y: -5 }}
    className={`border-2 rounded-2xl p-4 md:p-5 text-center shadow-md w-full md:w-56 lg:w-64 transition-all relative z-10 ${
      isSelf 
        ? "bg-gradient-to-br from-yellow-200 to-orange-300 border-yellow-400 hover:shadow-yellow-300 scale-105" 
        : "bg-gradient-to-br from-pink-100 to-orange-100 border-orange-200 hover:shadow-orange-200"
    }`}
  >
    <p className={`text-[9px] md:text-[10px] uppercase tracking-widest font-bold mb-1 md:mb-2 ${isSelf ? "text-orange-800" : "text-orange-600"}`}>{subtitle}</p>
    <h4 className={`font-serif text-lg md:text-xl leading-tight ${isSelf ? "text-orange-950 font-bold" : "text-pink-700"}`}>{title}</h4>
    
    {spouse && (
      <div className="mt-1 md:mt-2 flex flex-col items-center">
        <span className="text-orange-400 font-serif italic text-xs">&amp;</span>
        <h4 className="font-serif text-base md:text-lg text-pink-700 leading-tight">{spouse}</h4>
      </div>
    )}
    
    {details && details.length > 0 && (
      <div className="mt-2 pt-2 border-t border-orange-200 text-[10px] md:text-xs text-orange-900 font-medium">
        {details.map((d, i) => <div key={i}>{d}</div>)}
      </div>
    )}
  </motion.div>
);

export default function FamilyTree() {
  const containerRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const headerScale = useTransform(scrollYProgress, [0, 0.2], [1, 0.7]);
  const headerOpacity = useTransform(scrollYProgress, [0, 0.1], [1, 0.9]);

  return (
    <section ref={containerRef} className="py-12 bg-orange-50/50 relative">
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#d97706 2px, transparent 2px)', backgroundSize: '30px 30px' }}></div>
      
      {/* Sticky Header */}
      <div className="sticky top-0 z-30 py-4 mb-16 bg-orange-50/90 backdrop-blur-md shadow-sm border-b border-orange-200 w-full flex justify-center origin-top">
        <motion.h2 
          style={{ scale: headerScale, opacity: headerOpacity }}
          className="text-6xl font-script text-orange-700 drop-shadow-sm origin-top"
        >
          Meet the Families
        </motion.h2>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 relative z-10 pb-20">
        <div className="flex flex-col gap-24 items-center">
          {/* Bride's Side */}
          <div className="flex flex-col items-center w-full">
            <h3 className="text-3xl font-serif text-pink-600 mb-10 bg-pink-100 px-8 py-2 rounded-full shadow-sm sticky top-32 z-20">Bride's Family</h3>
            <motion.div initial={{ opacity: 0, scale: 0.8 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}>
              <Node title="Mr. Narender Sharma" spouse="Mrs. Uma Sharma" subtitle="Parents" />
            </motion.div>
            <div className="h-12 w-1 bg-gradient-to-b from-orange-300 to-pink-300 my-0 rounded-full"></div>
            
            <div className="flex flex-wrap justify-center gap-4 mt-0 w-full relative">
              {familyData.bride.siblings.map((sib, i) => (
                <motion.div key={i} initial={{ opacity: 0, scale: 0.8 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.2 }}>
                  <Node title={sib.name} subtitle={sib.relation} isSelf={sib.isSelf} />
                </motion.div>
              ))}
            </div>
          </div>

          {/* Groom's Side */}
          <div className="flex flex-col items-center w-full">
            <h3 className="text-3xl font-serif text-pink-600 mb-10 bg-pink-100 px-8 py-2 rounded-full shadow-sm sticky top-32 z-20">Groom's Family</h3>
            <motion.div initial={{ opacity: 0, scale: 0.8 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}>
              <Node title="Mr. Mohan Jha" spouse="Mrs. Ranju Jha" subtitle="Parents" />
            </motion.div>
            <div className="h-12 w-1 bg-gradient-to-b from-orange-300 to-pink-300 my-0 rounded-full relative z-0"></div>
            
            {/* Siblings Row */}
            <div className="flex flex-col md:flex-row flex-wrap justify-center gap-10 mt-0 w-full relative pt-4">
               {/* Connecting horizontal line for desktop */}
               <div className="hidden md:block absolute top-0 left-1/4 right-1/4 h-1 bg-gradient-to-r from-orange-300 via-pink-300 to-orange-300 rounded-full z-0"></div>
              
              {familyData.groom.siblings.map((sib, i) => (
                <div key={i} className="flex flex-col items-center relative">
                  <div className="hidden md:block absolute -top-4 w-1 h-4 bg-orange-300 z-0"></div>
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.8 }} 
                    whileInView={{ opacity: 1, scale: 1 }} 
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.2 }}
                    className="z-10"
                  >
                    <Node 
                      title={sib.name} 
                      spouse={sib.spouse}
                      subtitle={sib.relation}
                      details={sib.children ? [`Children: ${sib.children.join(", ")}`] : undefined}
                      isSelf={sib.isSelf}
                    />
                  </motion.div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
