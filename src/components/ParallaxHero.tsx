import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ButtonAgendar } from './ui/ButtonAgendar';

export const ParallaxHero = () => {
  const ref = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"]
  });

  // Parallax effects
  const yBg = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const yText = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <div 
      ref={ref}
      id="inicio"
      className="relative min-h-[100dvh] h-[100dvh] w-full flex items-center overflow-hidden bg-bg-darkest"
    >
      {/* Custom Bottom Dashed Line (traçado) full width */}
      <div className="absolute bottom-0 left-0 w-full h-[3px] border-b-[3px] border-dashed border-[#5E308A] z-40" />
      {/* Background Video / Image */}
      <motion.div 
        className="absolute inset-0 z-0 opacity-60"
        style={{ y: yBg }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-[#0B0908]/40 to-bg-darkest z-10" />
        <video 
          autoPlay 
          loop 
          muted 
          playsInline
          className="w-full h-full object-cover"
        >
          <source src="/SaveInta.com_AQMOscq4sfh22n2o0SFxu3bN1IkABNfyxTt16iOoF0IamHbXzDeH_Pbdi3adOoAcKvaJgEqP9NNfY_PraFGMu0vGJvc60o8hMCMUmtk.mp4" type="video/mp4" />
        </video>
      </motion.div>

      {/* Content */}
      <div className="relative z-20 w-full px-6 md:px-12 lg:px-20 flex flex-col justify-end items-start h-full pt-32 pb-20 md:pb-24 lg:pb-16 xl:pb-28">
        <motion.div 
          style={{ y: yText, opacity }}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="max-w-[1200px] flex flex-col items-start"
        >
          <h1 className="font-display font-black text-4xl xs:text-5xl sm:text-7xl md:text-[8rem] lg:text-[11rem] text-text-primary uppercase leading-[1.05] tracking-[0.02em] sm:tracking-[0.03em] mb-2 md:mb-4">
            ESTILO,<br/>PRECISÃO E<br/>ATITUDE
          </h1>
          
          <p className="text-[#5E308A] font-bold tracking-[3px] sm:tracking-[6px] md:tracking-[10px] uppercase mt-3 sm:mt-4 md:mt-8 text-sm sm:text-lg md:text-2xl lg:text-3xl ml-0.5 sm:ml-1 md:ml-2">
            Barber & Tattoo de Excelência
            <span className="inline-flex tracking-[2px] ml-1">
              <span className="dot-typing">.</span>
              <span className="dot-typing">.</span>
              <span className="dot-typing">.</span>
            </span>
          </p>
        </motion.div>
      </div>

      {/* Floating Contact Card for Hero */}
      <motion.div 
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.8, duration: 0.8 }}
        className="absolute bottom-0 right-0 lg:right-[5%] z-30 bg-nav-bg p-8 md:p-12 lg:p-14 w-full md:w-[550px] lg:w-[600px] h-[320px] md:h-[380px] lg:h-[400px] flex flex-col justify-end shadow-[0_-10px_30px_rgba(0,0,0,0.15)] hidden md:block"
      >
        <h3 className="text-4xl lg:text-5xl font-black text-nav-text mb-6 tracking-tight">(47) 99959-5843</h3>
        <p className="text-lg lg:text-xl font-medium text-nav-text/90 mb-3">Segunda-feira das 14h às 20h</p>
        <p className="text-lg lg:text-xl font-medium text-nav-text/90 mb-3">Terça-feira a sexta-feira das 09h às 21h</p>
        <p className="text-lg lg:text-xl font-medium text-nav-text/90 mb-6">Sábado das 08h às 17h</p>
        <div className="mt-auto self-start">
          <ButtonAgendar />
        </div>
      </motion.div>
    </div>
  );
};
