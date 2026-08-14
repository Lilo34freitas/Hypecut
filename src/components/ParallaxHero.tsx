import { motion } from 'framer-motion';
import { ButtonAgendar } from './ui/ButtonAgendar';
import { BlurText } from './ui/BlurText';

export const ParallaxHero = () => {
  return (
    <div 
      id="inicio"
      className="relative min-h-[100dvh] h-[100dvh] w-full flex items-center overflow-hidden bg-bg-darkest"
    >
      {/* Sleek Bottom Glow Divider */}
      <div className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#5E308A] to-transparent z-40 shadow-[0_0_15px_rgba(94,48,138,0.9)]" />

      {/* Background Video / Image - High Luminosity & Vibrant Visibility */}
      <div className="absolute inset-0 z-0 opacity-85">
        {/* Soft Radial Vignette + Left Reading Gradient (Clear Center Action) */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0B0908]/80 via-transparent to-[#0B0908]/40 z-10" />
        <div className="absolute inset-0 bg-gradient-to-t from-bg-darkest/90 via-transparent to-black/25 z-10" />
        <video 
          autoPlay 
          loop 
          muted 
          playsInline
          preload="auto"
          disablePictureInPicture
          disableRemotePlayback
          poster="/about_teste 2.png"
          ref={(el) => {
            if (el) {
              el.defaultMuted = true;
              el.muted = true;
              el.play().catch(() => {});
            }
          }}
          className="w-full h-full object-cover"
        >
          <source src="/SaveInta.com_AQMOscq4sfh22n2o0SFxu3bN1IkABNfyxTt16iOoF0IamHbXzDeH_Pbdi3adOoAcKvaJgEqP9NNfY_PraFGMu0vGJvc60o8hMCMUmtk.mp4" type="video/mp4" />
        </video>
      </div>

      {/* Content with Fixed Position relative to Hero container */}
      <div className="relative z-20 w-full px-6 md:px-12 lg:px-20 flex flex-col justify-end items-start h-full pt-20 pb-12 md:pb-16 lg:pb-12 xl:pb-14">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-[1200px] flex flex-col items-start"
        >
          <h1 className="font-display font-black text-4xl xs:text-5xl sm:text-7xl md:text-7xl lg:text-[3.75rem] xl:text-[4.5rem] 2xl:text-[5.25rem] min-[1800px]:text-[7.5rem] min-[2200px]:text-[9.5rem] text-text-primary uppercase leading-[1.05] tracking-[0.02em] sm:tracking-[0.03em] mb-2 md:mb-4 drop-shadow-[0_4px_16px_rgba(0,0,0,0.8)]">
            <BlurText text="ESTILO, PRECISÃO E ATITUDE" delay={90} animateBy="words" direction="top" />
          </h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
            className="text-[#9D68D3] font-black tracking-[3px] sm:tracking-[6px] md:tracking-[6px] lg:tracking-[6px] xl:tracking-[7px] 2xl:tracking-[8px] min-[1800px]:tracking-[10px] uppercase mt-3 sm:mt-4 md:mt-5 lg:mt-4 xl:mt-5 2xl:mt-6 text-sm sm:text-lg md:text-xl lg:text-lg xl:text-xl 2xl:text-2xl min-[1800px]:text-3xl ml-0.5 sm:ml-1 md:ml-2 drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)]"
          >
            Barber & Tattoo de Excelência
            <span className="inline-flex tracking-[2px] ml-1 text-white">
              <span className="dot-typing">.</span>
              <span className="dot-typing">.</span>
              <span className="dot-typing">.</span>
            </span>
          </motion.p>
        </motion.div>
      </div>

      {/* Floating Contact Card for Hero (Exibido apenas em telas/monitores ultra-wide de 21+ polegadas - 1920px+) */}
      <motion.div 
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.8, duration: 0.8 }}
        className="absolute bottom-0 right-0 min-[1920px]:right-[5%] z-30 bg-nav-bg p-8 md:p-12 lg:p-14 w-full md:w-[550px] lg:w-[600px] h-[320px] md:h-[380px] lg:h-[400px] flex-col justify-end shadow-[0_-10px_30px_rgba(0,0,0,0.15)] hidden min-[1920px]:flex"
      >
        <h3 className="text-4xl lg:text-5xl font-black text-nav-text mb-6 tracking-tight">(47) 99959-5843</h3>
        <p className="text-lg lg:text-xl font-medium text-nav-text/90 mb-3">Segunda-feira das 14h às 20h</p>
        <p className="text-lg lg:text-xl font-medium text-nav-text/90 mb-3">Terça-feira a sexta-feira das 09h às 21h</p>
        <p className="text-lg lg:text-xl font-medium text-nav-text/90 mb-6">Sábado das 08h às 17h</p>
        <div className="mt-auto self-start">
          <ButtonAgendar onClick={() => window.dispatchEvent(new CustomEvent('open-booking-modal'))} />
        </div>
      </motion.div>
    </div>
  );
};
