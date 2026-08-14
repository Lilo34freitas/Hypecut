import { useRef, useEffect, useState } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/sections/Footer';
import { ChevronLeft, ChevronRight, ArrowUpRight } from 'lucide-react';
import { BlurText } from '../components/ui/BlurText';

const teamMembers = [
  {
    id: 1,
    name: 'JONATHAN NEMECEK',
    role: 'Barbeiro & Fundador',
    specialties: 'Cortes na Tesoura • Visagismo • Barboterapia',
    image: '/jonathan.png',
    whatsappUrl: 'https://wa.me/5547999595843?text=Ol%C3%A1!%20Gostaria%20de%20agendar%20um%20hor%C3%A1rio%20com%20o%20Jonathan.',
  },
  {
    id: 2,
    name: 'BRUNO',
    role: 'Artista & Tatuador',
    specialties: 'Lettering • Dark Art • Freehand',
    image: '/bruno.png',
    whatsappUrl: 'https://wa.me/5547999595843?text=Ol%C3%A1!%20Gostaria%20de%20fazer%20um%20or%C3%A7amento%20de%20tattoo%20com%20o%20Bruno.',
  },
  {
    id: 3,
    name: 'BOSCO',
    role: 'Barbeiro',
    specialties: 'Cabelo Afro • Barba • Corte Americano',
    image: '/bosco.png',
    whatsappUrl: 'https://wa.me/5547999595843?text=Ol%C3%A1!%20Gostaria%20de%20agendar%20um%20hor%C3%A1rio%20com%20o%20Bosco.',
  },
  {
    id: 4,
    name: 'LUKINHA',
    role: 'Barbeiro',
    specialties: 'Moicano • Americano • Freestyle',
    image: '/Lukinha.png',
    whatsappUrl: 'https://wa.me/5547999595843?text=Ol%C3%A1!%20Gostaria%20de%20agendar%20um%20hor%C3%A1rio%20com%20o%20Lukinha.',
  },
  {
    id: 5,
    name: 'MATHEUS',
    role: 'Tatuador',
    specialties: 'Realismo • Preto e Cinza • Fine Line',
    image: '/matheus.png',
    whatsappUrl: 'https://wa.me/5547999595843?text=Ol%C3%A1!%20Gostaria%20de%20fazer%20um%20or%C3%A7amento%20de%20tattoo%20com%20o%20Matheus.',
  },
  {
    id: 6,
    name: 'PORKS',
    role: 'Mídias & Conteúdo',
    specialties: 'Redes Sociais • Identidade Visual • Vídeo',
    image: '/porks.png',
    whatsappUrl: 'https://wa.me/5547999595843?text=Ol%C3%A1!%20Gostaria%20de%20falar%20com%20a%20equipe%20de%20m%C3%ADdia%20da%20HypeCut.',
  },
];

const TeamCarousel = () => {
  const [mobileIndex, setMobileIndex] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start 95%", "start 40%"]
  });

  const titleY = useTransform(scrollYProgress, [0, 0.45], [60, 0]);
  const titleOpacity = useTransform(scrollYProgress, [0, 0.3], [0, 1]);

  // Ultra-smooth easing scroll function for desktop
  const smoothScrollTo = (targetScroll: number, duration: number = 700) => {
    if (!carouselRef.current) return;
    const start = carouselRef.current.scrollLeft;
    const change = targetScroll - start;
    const startTime = performance.now();

    const easeInOutCubic = (t: number) =>
      t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;

    const animateScroll = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = easeInOutCubic(progress);

      if (carouselRef.current) {
        carouselRef.current.scrollLeft = start + change * easedProgress;
      }

      if (progress < 1) {
        requestAnimationFrame(animateScroll);
      }
    };

    requestAnimationFrame(animateScroll);
  };

  const handlePrev = () => {
    setMobileIndex((prev) => (prev === 0 ? teamMembers.length - 1 : prev - 1));

    if (carouselRef.current) {
      const target = Math.max(0, carouselRef.current.scrollLeft - 360);
      smoothScrollTo(target, 700);
    }
  };

  const handleNext = () => {
    setMobileIndex((prev) => (prev === teamMembers.length - 1 ? 0 : prev + 1));

    if (carouselRef.current) {
      const maxScroll = carouselRef.current.scrollWidth - carouselRef.current.clientWidth;
      const target = Math.min(maxScroll, carouselRef.current.scrollLeft + 360);
      smoothScrollTo(target, 700);
    }
  };

  const currentMember = teamMembers[mobileIndex];

  return (
    <section ref={sectionRef} className="bg-[#121212] py-20 md:py-28 text-[#F2EAD9] relative overflow-hidden w-full">
      {/* Brand Section Divider Line with Center Accent */}
      <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-[#5E308A] to-transparent absolute top-0 left-0 right-0 z-20" />
      <div className="w-full px-6 md:px-12 lg:px-16 max-w-[1700px] mx-auto relative z-10 space-y-8">
        
        {/* Header with Title and Navigation Controls */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-2">
          <div>
            <div className="overflow-hidden">
              <motion.h2 
                style={{ y: titleY, opacity: titleOpacity }}
                className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black uppercase text-[#F2EAD9] tracking-tight leading-none"
              >
                <BlurText text="EQUIPE HYPECUT" delay={90} animateBy="words" direction="top" />
              </motion.h2>
            </div>
          </div>

          <div className="flex items-center justify-between md:justify-end w-full md:w-auto gap-4">
            <p className="hidden xl:block text-[#F2EAD9]/80 text-xs md:text-sm font-bold uppercase tracking-wider max-w-md leading-relaxed border-l-2 border-[#5E308A] pl-4 mr-4">
              Deslize para navegar pelos nossos especialistas em formato Story.
            </p>

            <span className="md:hidden text-xs font-black tracking-widest text-[#F2EAD9]">
              0{mobileIndex + 1} / 0{teamMembers.length}
            </span>

            {/* Navigation Buttons with Smooth Hover/Click Transitions */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handlePrev}
                aria-label="Anterior"
                className="w-12 h-12 rounded-none bg-black/70 hover:bg-[#5E308A] border border-white/20 hover:border-[#5E308A] text-white flex items-center justify-center transition-all duration-300 active:scale-90 shadow-lg cursor-pointer"
              >
                <ChevronLeft size={26} />
              </button>

              <button
                type="button"
                onClick={handleNext}
                aria-label="Próximo"
                className="w-12 h-12 rounded-none bg-[#5E308A] md:bg-black/70 hover:bg-[#5E308A] border border-[#5E308A] md:border-white/20 hover:border-[#5E308A] text-white flex items-center justify-center transition-all duration-300 active:scale-90 shadow-lg cursor-pointer"
              >
                <ChevronRight size={26} />
              </button>
            </div>
          </div>
        </div>

        {/* MOBILE SINGLE CARD (1 CARD CENTRALIZADO E 100% INTEIRO POR VEZ - <768px) */}
        <div className="block md:hidden w-full max-w-[320px] mx-auto py-2">
          <AnimatePresence mode="wait">
            <motion.div
              key={mobileIndex}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.3 }}
              className="w-full aspect-[9/16] relative border-2 border-[#5E308A] shadow-2xl overflow-hidden bg-black rounded-none"
            >
              {/* Full Story Photo Background */}
              <img
                src={currentMember.image}
                alt={currentMember.name}
                className="w-full h-full object-cover"
              />

              {/* Instagram Story Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-95" />

              {/* Top Role Tag */}
              <div className="absolute top-4 left-4 right-4 z-10 flex flex-col gap-2">
                <div className="w-full h-1 bg-white/30 rounded-none overflow-hidden relative">
                  <div className="absolute inset-0 bg-[#5E308A]" />
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-black text-[#F2EAD9] bg-[#5E308A] px-3 py-1.5 uppercase tracking-widest rounded-none shadow-md border border-white/10">
                    {currentMember.role}
                  </span>
                </div>
              </div>

              {/* Bottom Info Overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-6 z-10 flex flex-col gap-2">
                <h3 className="text-2xl font-black uppercase text-[#F2EAD9] tracking-tight leading-none drop-shadow-md">
                  {currentMember.name}
                </h3>

                <p className="text-xs font-medium text-[#F2EAD9]/90 leading-snug drop-shadow">
                  {currentMember.specialties}
                </p>

                {/* CTA Button */}
                <a
                  href={currentMember.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 w-full py-3 bg-[#5E308A] hover:bg-[#4A2370] text-white text-xs font-black uppercase tracking-wider rounded-none flex items-center justify-center gap-2 transition-all duration-300 shadow-lg hover:scale-[1.02] active:scale-95"
                >
                  <span>AGENDAR COM {currentMember.name.split(' ')[0]}</span>
                  <ArrowUpRight size={16} />
                </a>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* DESKTOP HORIZONTAL STORY CAROUSEL (>=768px) with Edge Fade Indicator */}
        <div className="relative">
          {/* Right Edge Fade Overlay indicating more content */}
          <div className="hidden md:block pointer-events-none absolute right-0 top-0 bottom-0 w-28 lg:w-40 bg-gradient-to-l from-[#121212] via-[#121212]/80 to-transparent z-20" />

          <div
            ref={carouselRef}
            className="hidden md:flex gap-6 md:gap-8 overflow-x-auto scrollbar-none py-4 px-1 select-none"
          >
            {teamMembers.map((member) => (
              <div
                key={member.id}
                className="flex-shrink-0 rounded-none w-[270px] sm:w-[310px] md:w-[340px] aspect-[9/16] relative border border-white/20 hover:border-[#5E308A] transition-all duration-500 shadow-2xl overflow-hidden group bg-black cursor-pointer"
              >
                {/* Full Story Photo Background */}
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />

                {/* Instagram Story Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-90 transition-opacity duration-300 group-hover:opacity-95" />

                {/* Top Story Accent Bar & Role Tag */}
                <div className="absolute top-4 left-4 right-4 z-10 flex flex-col gap-2">
                  <div className="w-full h-1 bg-white/30 rounded-none overflow-hidden relative">
                    <div className="absolute inset-0 bg-[#5E308A] origin-right scale-x-0 group-hover:origin-left group-hover:scale-x-100 transition-transform duration-500 ease-in-out" />
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-black text-[#F2EAD9] bg-[#5E308A] px-3 py-1.5 uppercase tracking-widest rounded-none shadow-md border border-white/10">
                      {member.role}
                    </span>
                  </div>
                </div>

                {/* Bottom Info Overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-6 z-10 flex flex-col gap-2">
                  <h3 className="text-2xl sm:text-3xl font-black uppercase text-[#F2EAD9] tracking-tight group-hover:text-[#5E308A] transition-colors leading-none drop-shadow-md">
                    {member.name}
                  </h3>

                  <p className="text-xs sm:text-sm font-medium text-[#F2EAD9]/90 leading-snug drop-shadow">
                    {member.specialties}
                  </p>

                  {/* CTA Button (No border radius) */}
                  <a
                    href={member.whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 w-full py-3 bg-[#5E308A] hover:bg-[#4A2370] text-white text-xs font-black uppercase tracking-wider rounded-none flex items-center justify-center gap-2 transition-all duration-300 shadow-lg group-hover:shadow-[0_8px_20px_rgba(94,48,138,0.5)] hover:scale-[1.02] active:scale-95"
                  >
                    <span>AGENDAR COM {member.name.split(' ')[0]}</span>
                    <ArrowUpRight size={16} />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};

export const AboutPage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="bg-[#121212] min-h-screen text-text-primary font-sans selection:bg-[#5E308A] selection:text-white">
      <Navbar />

      <main className="pt-0">
        
        {/* Full-bleed Video Background Hero Section */}
        <section className="relative w-full h-[75vh] md:h-[90vh] overflow-hidden flex items-center justify-center bg-[#121212]">
          
          {/* Background Video */}
          <video 
            autoPlay 
            loop 
            muted 
            playsInline
            className="absolute inset-0 w-full h-full object-cover opacity-75"
          >
            <source src="/video_pagina_sobre.mp4" type="video/mp4" />
          </video>

          {/* Seamless Gradient Overlays */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#121212] via-transparent to-transparent z-10 opacity-90 h-32" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#121212] via-[#121212]/30 to-transparent z-10" />

          {/* Title Overlay centered over video */}
          <div className="relative z-20 w-full max-w-[1400px] px-6 md:px-12 flex flex-col items-center justify-center text-center mt-12 md:mt-16">
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="w-full flex items-center justify-center"
            >
              <h1 className="text-3xl md:text-6xl lg:text-7xl font-black uppercase text-text-primary tracking-widest text-center drop-shadow-[0_10px_20px_rgba(0,0,0,0.9)]">
                HYPECUT BARBER & TATTOO
              </h1>
            </motion.div>

          </div>
        </section>

        {/* Text Content Sections with High Contrast & Visual Cleanliness */}
        <section className="py-16 pb-20 bg-[#0B0908] relative z-20 border-t border-white/10">
          <div className="max-w-4xl mx-auto px-6 md:px-12 space-y-12 text-[#F2EAD9] leading-relaxed font-medium">
            
            {/* Section 1: A MELHOR BARBEARIA DE ITAJAÍ */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6 }}
              className="space-y-4 border-l-2 border-[#5E308A] pl-6"
            >
              <h2 className="text-2xl md:text-4xl font-black uppercase text-[#F2EAD9] tracking-tight">
                A MELHOR BARBEARIA DE ITAJAÍ
              </h2>
              <p className="text-base md:text-lg text-[#F2EAD9]/90 leading-loose">
                Desde 2017, somos especialistas no cuidado da beleza masculina, oferecendo serviços de excelência em barba, cabelo, bigode e sobrancelhas. Nosso compromisso é superar expectativas, aprimorando continuamente nossas técnicas para estar sempre à frente das tendências e proporcionar um atendimento personalizado que valorize o estilo único de cada cliente.
              </p>
              <p className="text-base md:text-lg text-[#F2EAD9]/90 leading-loose">
                Mais do que transformar a aparência, acreditamos que nossos serviços promovem bem-estar e elevam a autoestima. Cada corte, cada detalhe, é pensado para oferecer uma experiência exclusiva, trazendo confiança e segurança para quem nos escolhe.
              </p>
            </motion.div>

            {/* Section 2: NOSSO COMPROMISSO */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6 }}
              className="space-y-4 border-l-2 border-[#5E308A] pl-6 pt-2"
            >
              <h3 className="text-xl md:text-3xl font-black uppercase text-[#F2EAD9] tracking-tight">
                NOSSO COMPROMISSO
              </h3>
              <p className="text-base md:text-lg text-[#F2EAD9]/90 leading-loose">
                Do primeiro contato ao toque final do corte, priorizamos respeito e profissionalismo. Nosso compromisso é compreender suas expectativas e oferecer um serviço impecável, alinhado ao seu estilo.
              </p>
              <p className="text-base md:text-lg text-[#F2EAD9]/90 leading-loose">
                Disponibilizamos um ambiente moderno e um sistema de agendamento ágil e eficiente, garantindo um atendimento exclusivo e de alto nível. Nossa equipe, altamente qualificada e experiente, entrega resultados impecáveis alinhados às suas expectativas.
              </p>
            </motion.div>

            {/* Section 3: NOSSOS SERVIÇOS */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6 }}
              className="space-y-4 border-l-2 border-[#5E308A] pl-6 pt-2"
            >
              <h3 className="text-xl md:text-3xl font-black uppercase text-[#F2EAD9] tracking-tight">
                NOSSOS SERVIÇOS
              </h3>
              <p className="text-base md:text-lg text-[#F2EAD9]/90 leading-loose">
                Além dos cortes tradicionais, como máquina, degradê navalhado e clássico, realizamos:
              </p>
              <ul className="space-y-2.5 text-base md:text-lg pl-2 text-[#F2EAD9]/95">
                <li className="flex items-center gap-3"><span className="w-1.5 h-1.5 bg-[#5E308A] inline-block shrink-0" /> Barboterapia com toalha quente</li>
                <li className="flex items-center gap-3"><span className="w-1.5 h-1.5 bg-[#5E308A] inline-block shrink-0" /> Limpeza facial profunda</li>
                <li className="flex items-center gap-3"><span className="w-1.5 h-1.5 bg-[#5E308A] inline-block shrink-0" /> Design e alinhamento de sobrancelhas</li>
                <li className="flex items-center gap-3"><span className="w-1.5 h-1.5 bg-[#5E308A] inline-block shrink-0" /> Limpeza de ouvidos e nariz com cera</li>
                <li className="flex items-center gap-3"><span className="w-1.5 h-1.5 bg-[#5E308A] inline-block shrink-0" /> Aplicação e manutenção de prótese capilar não cirúrgica</li>
                <li className="flex items-center gap-3"><span className="w-1.5 h-1.5 bg-[#5E308A] inline-block shrink-0" /> Coloração e pigmentação de cabelos e barbas</li>
              </ul>
              <p className="text-base md:text-lg pt-2 font-bold text-[#F2EAD9]">
                Basta nos contar o que deseja e garantimos um resultado que supere suas expectativas!
              </p>
            </motion.div>

            {/* Section 4: NOSSO ESPAÇO */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6 }}
              className="space-y-4 border-l-2 border-[#5E308A] pl-6 pt-2"
            >
              <h3 className="text-xl md:text-3xl font-black uppercase text-[#F2EAD9] tracking-tight">
                NOSSO ESPAÇO
              </h3>
              <p className="text-base md:text-lg text-[#F2EAD9]/90 leading-loose">
                Proporcionamos um ambiente descontraído e aconchegante, onde cada visita se transforma em um momento de lazer, relaxamento e cuidado pessoal com cerveja gelada, sinuca e atendimento de alto padrão.
              </p>
            </motion.div>

          </div>
        </section>

        {/* Story Carousel with Full Team Info */}
        <TeamCarousel />

      </main>

      <Footer />
    </div>
  );
};
