import { useState, useRef } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { CursorGrid } from '../ui/CursorGrid';

interface TattooStyle {
  id: string;
  title: string;
  subtitle: string;
  abrange: string;
  caracteristicas: string;
  mediaType: 'image' | 'video';
  mediaUrl: string;
  tag: string;
}

const tattooStyles: TattooStyle[] = [
  {
    id: 'lettering',
    title: 'LETTERING / CALIGRAFIA URBANA',
    subtitle: 'Chicano, Calligraffiti & Gótico',
    abrange: 'Chicano, Calligraffiti e fontes góticas customizadas.',
    caracteristicas: 'Letras em bloco, curvas ornamentadas, efeito 3D com sombras projetadas e encaixe anatômico perfeito (peças de canela e antebraço).',
    mediaType: 'video',
    mediaUrl: '/tattoos/SaveClip.App_AQOwcbPT3NPQi8kjmFVYprdJlrRMdqePsrGEwktc87Hqcmu120sO02pvk_Zhjl9AIHCuiOeHFKwo1GKDwhEK3wznmsP_gb1Ty4wUnms.mp4',
    tag: 'CHICANO & CALLIGRAFFITI',
  },
  {
    id: 'blackgrey',
    title: 'PRETO E CINZA REALISTA',
    subtitle: 'Retratos, Ícones & Arquitetura',
    abrange: 'Retratos, ícones e composições de cena (faróis, bússolas, arquitetura).',
    caracteristicas: 'Trabalho focado em transições suaves de sombras, profundidade, alto contraste e renderização realista de rostos e texturas.',
    mediaType: 'video',
    mediaUrl: '/tattoos/SaveClip.App_AQPDC8iejkPV-YkYNRwHl9CZjJsHW7YehuPzMqwu1V_40iG8fjyTZtOnEdM_Pcnhq5YPMslXSfl0_t3uTjWdp0JHzkVdbs-O3w2EU8w.mp4',
    tag: 'BLACK & GREY REALISTA',
  },
  {
    id: 'darkpop',
    title: 'DARK ART & CULTURA POP',
    subtitle: 'Surrealismo & Máscara MF DOOM',
    abrange: 'Estética sombria/surrealista (freira com elementos de terror) e referências da cultura hip-hop (máscara do MF DOOM).',
    caracteristicas: 'Uso de elementos do underground, contornos marcados e sombras densas para dar um tom mais obscuro e marcante às peças.',
    mediaType: 'video',
    mediaUrl: '/tattoos/SaveClip.App_AQOQG_R9G-aLtiDvZMzXtQ35EEhjWUZSc5Y0jwTAPfBWXWRQ9JEnoIHxOD8zcXTnVZcTUksYl-Lci2vRFeZ1iWdd3SvAgRhf8MibQh4.mp4',
    tag: 'DARK ART & HIP-HOP',
  },
];

export const TattooSection = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const sectionRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start 95%", "start 45%"]
  });

  const titleY = useTransform(scrollYProgress, [0, 0.45], [100, 0]);
  const titleOpacity = useTransform(scrollYProgress, [0, 0.3], [0, 1]);

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % tattooStyles.length);
  };

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + tattooStyles.length) % tattooStyles.length);
  };

  const currentStyle = tattooStyles[activeIndex];

  return (
    <section id="tattoo" ref={sectionRef} className="bg-[#0B0908] py-24 md:py-32 text-text-primary relative w-full overflow-hidden">
      
      {/* Ambient Interactive CursorGrid Background */}
      <CursorGrid color="#5E308A" gridOpacity={0.65} />

      <div className="w-full px-6 md:px-12 lg:px-16 max-w-[1700px] mx-auto relative z-10">
        
        {/* Header Layout */}
        <div className="mb-12 md:mb-16 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <span className="text-xs font-black uppercase tracking-widest text-[#5E308A] block mb-2">
              ESTÚDIO AUTORAL & HIGH PERFORMANCE
            </span>
            <motion.h2 
              style={{ y: titleY, opacity: titleOpacity }}
              className="text-4xl md:text-6xl lg:text-7xl font-black uppercase text-[#F2EAD9] tracking-tight leading-none"
            >
              ESTILOS DE TATTOO
            </motion.h2>
          </div>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="text-[#F2EAD9]/80 text-xs md:text-sm font-bold uppercase tracking-wider max-w-md leading-relaxed border-l-2 border-[#5E308A] pl-4"
          >
            Arte autoral na pele com biossegurança hospitalar, agulhas 100% descartáveis e ambiente exclusivo em Itajaí.
          </motion.p>
        </div>

        {/* MOBILE CAROUSEL (1 CARD POR VEZ) - APENAS EM RESOLUÇÕES MOBILE (<768px) */}
        <div className="block md:hidden w-full mb-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeIndex}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.3 }}
              className="relative min-h-[480px] border-2 border-[#5E308A] overflow-hidden flex flex-col justify-between p-6 bg-black"
            >
              {/* Media Background */}
              <div className="absolute inset-0 z-0 bg-black">
                {currentStyle.mediaType === 'video' ? (
                  <video
                    src={currentStyle.mediaUrl}
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-full object-cover opacity-85"
                  />
                ) : (
                  <img
                    src={currentStyle.mediaUrl}
                    alt={currentStyle.title}
                    className="w-full h-full object-cover opacity-85"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/75 to-black/30" />
              </div>

              {/* Content */}
              <div className="relative z-10 my-auto">
                <span className="text-xs font-black text-[#5E308A] uppercase tracking-widest block mb-2">
                  {currentStyle.subtitle}
                </span>
                <h3 className="text-2xl font-black uppercase tracking-tight text-[#F2EAD9] mb-4">
                  {currentStyle.title}
                </h3>

                <div className="space-y-3">
                  <div>
                    <p className="text-xs font-black text-[#5E308A] uppercase tracking-wider">ABRANGE:</p>
                    <p className="text-xs text-[#F2EAD9] font-medium">{currentStyle.abrange}</p>
                  </div>
                  <div>
                    <p className="text-xs font-black text-[#5E308A] uppercase tracking-wider">CARACTERÍSTICAS:</p>
                    <p className="text-xs text-[#F2EAD9] font-medium leading-relaxed">{currentStyle.caracteristicas}</p>
                  </div>
                </div>
              </div>

              {/* Bottom Action Bar */}
              <div className="flex items-center justify-between z-10 relative pt-4 border-t border-white/20">
                <span className="text-[11px] font-bold text-white/80 uppercase tracking-wider">
                  {currentStyle.tag}
                </span>
                <a
                  href="/tattoo"
                  className="p-3 bg-[#5E308A] text-white rounded-none flex items-center gap-2"
                >
                  <span className="text-xs font-black uppercase tracking-wider">VER ESTÚDIO</span>
                  <ArrowRight size={16} />
                </a>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Mobile Navigation Controls */}
          <div className="flex items-center justify-between mt-5 pt-4 border-t border-white/10">
            <button
              onClick={handlePrev}
              className="p-3 bg-black border border-white/20 hover:border-[#5E308A] text-white rounded-none flex items-center gap-2 cursor-pointer"
              aria-label="Anterior"
            >
              <ChevronLeft size={18} />
              <span className="text-xs font-bold uppercase">Anterior</span>
            </button>

            <span className="text-xs font-black tracking-widest text-[#F2EAD9]">
              0{activeIndex + 1} / 0{tattooStyles.length}
            </span>

            <button
              onClick={handleNext}
              className="p-3 bg-[#5E308A] hover:bg-[#4A2370] text-white rounded-none flex items-center gap-2 cursor-pointer shadow-lg"
              aria-label="Próximo"
            >
              <span className="text-xs font-bold uppercase">Próximo</span>
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        {/* DESKTOP ACCORDION CARDS - MANTIDO EM RESOLUÇÕES MAIORES (>=768px) */}
        <div className="hidden md:grid w-full min-h-[560px] md:min-h-[620px] grid-cols-1 lg:flex gap-6 items-stretch mb-10">
          {tattooStyles.map((style, idx) => {
            const isActive = activeIndex === idx;

            return (
              <motion.div
                key={style.id}
                onClick={() => setActiveIndex(idx)}
                onMouseEnter={() => setActiveIndex(idx)}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                className={`cursor-pointer rounded-none transition-all duration-500 ease-out border-2 overflow-hidden relative flex flex-col justify-between p-6 md:p-10 ${
                  isActive
                    ? 'lg:flex-[2.8] border-white/80'
                    : 'lg:flex-[1] border-white/20 hover:border-white/40 hover:brightness-110'
                }`}
              >
                {/* Background High-Visibility Media (Video / Image) */}
                <div className="absolute inset-0 z-0 bg-black">
                  {style.mediaType === 'video' ? (
                    <video
                      src={style.mediaUrl}
                      autoPlay
                      loop
                      muted
                      playsInline
                      className={`w-full h-full object-cover transition-all duration-500 ${
                        isActive ? 'opacity-90 scale-105' : 'opacity-70 scale-100 hover:opacity-85'
                      }`}
                    />
                  ) : (
                    <img
                      src={style.mediaUrl}
                      alt={style.title}
                      className={`w-full h-full object-cover transition-all duration-500 ${
                        isActive ? 'opacity-90 scale-105' : 'opacity-70 scale-100 hover:opacity-85'
                      }`}
                    />
                  )}
                  {/* Subtle Gradient Text Overlay for Contrast */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-black/30" />
                </div>

                {/* Center Content */}
                <div className="my-8 md:my-10 z-10 relative drop-shadow-md">
                  <span className="text-xs font-black text-[#5E308A] uppercase tracking-widest block mb-2">
                    {style.subtitle}
                  </span>
                  <h3 className={`font-black uppercase tracking-tight transition-all duration-300 ${
                    isActive 
                      ? 'text-2xl md:text-3xl lg:text-4xl text-[#F2EAD9] mb-4' 
                      : 'text-lg md:text-xl text-[#F2EAD9]/90'
                  }`}>
                    {style.title}
                  </h3>

                  {isActive && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-4"
                    >
                      <div className="space-y-2">
                        <p className="text-xs font-black text-[#5E308A] uppercase tracking-wider">
                          ABRANGE:
                        </p>
                        <p className="text-xs md:text-sm text-[#F2EAD9] font-medium mb-3">
                          {style.abrange}
                        </p>

                        <p className="text-xs font-black text-[#5E308A] uppercase tracking-wider">
                          CARACTERÍSTICAS:
                        </p>
                        <p className="text-xs md:text-sm text-[#F2EAD9] font-medium leading-relaxed">
                          {style.caracteristicas}
                        </p>
                      </div>
                      
                      <div className="text-xs font-bold text-[#F2EAD9]">
                        <span>Agulhas 100% Descartáveis & Assepsia Hospitalar</span>
                      </div>
                    </motion.div>
                  )}
                </div>

                {/* Bottom Action Bar */}
                <div className="flex items-center justify-between z-10 relative pt-4 border-t border-white/20">
                  <span className="text-[11px] font-bold text-white/80 uppercase tracking-wider hidden sm:inline">
                    {style.subtitle}
                  </span>
                  
                  <a
                    href="/tattoo"
                    onClick={(e) => e.stopPropagation()}
                    className={`p-3.5 rounded-none transition-all duration-300 flex items-center gap-2 ${
                      isActive 
                        ? 'bg-[#5E308A] text-white hover:bg-[#4A2370] shadow-lg' 
                        : 'bg-black/90 text-white hover:bg-white hover:text-black border border-white/20'
                    }`}
                  >
                    <span className="text-xs font-black uppercase tracking-wider">VER ESTÚDIO</span>
                    <ArrowRight size={16} />
                  </a>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Navigation Controls Bar (Pill Navigation & Arrows - Desktop) */}
        <div className="hidden md:flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-white/10">
          
          {/* Pill Tabs */}
          <div className="flex flex-wrap items-center gap-2 bg-black/90 p-2 border border-white/10 rounded-none w-full sm:w-auto justify-center sm:justify-start">
            {tattooStyles.map((style, idx) => (
              <button
                key={style.id}
                onClick={() => setActiveIndex(idx)}
                className={`px-4 py-2.5 rounded-none font-black text-xs uppercase tracking-wider transition-all duration-300 ${
                  activeIndex === idx
                    ? 'bg-[#5E308A] text-white shadow-md'
                    : 'text-white/70 hover:text-white hover:bg-white/10'
                }`}
              >
                0{idx + 1}. {style.title.split('/')[0]}
              </button>
            ))}
          </div>

          {/* Prev / Next Arrows */}
          <div className="flex items-center gap-3">
            <button
              onClick={handlePrev}
              className="p-3 bg-black border border-white/20 hover:border-[#5E308A] hover:text-[#5E308A] text-white rounded-none transition-all duration-300 cursor-pointer"
              aria-label="Estilo Anterior"
            >
              <ChevronLeft size={20} />
            </button>

            <button
              onClick={handleNext}
              className="p-3 bg-black border border-white/20 hover:border-[#5E308A] hover:text-[#5E308A] text-white rounded-none transition-all duration-300 cursor-pointer"
              aria-label="Próximo Estilo"
            >
              <ChevronRight size={20} />
            </button>

            <a
              href="/tattoo"
              className="py-3.5 px-6 bg-[#F2EAD9] hover:bg-white text-[#0B0908] font-black text-xs uppercase tracking-widest rounded-none transition-all duration-300 flex items-center gap-2 shadow-lg ml-2"
            >
              <span>PÁGINA TATTOO</span>
              <ArrowRight size={16} />
            </a>
          </div>

        </div>

        {/* Artist & Team Showcase CTA Banner Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-black/90 border border-white/20 p-8 md:p-10 rounded-none shadow-2xl flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8 mt-12 relative z-10 backdrop-blur-md"
        >
          <div>
            <div>
              <span className="text-xs font-black uppercase tracking-widest text-[#5E308A] block mb-1">
                CONHEÇA NOSSO TATUADOR & EQUIPE AUTORAL
              </span>
              <h3 className="text-2xl md:text-3xl font-black uppercase text-[#F2EAD9] tracking-tight mb-2">
                Arte Exclusiva Desenhada Especialmente Para a Sua Anatomia
              </h3>
              <p className="text-xs md:text-sm text-[#F2EAD9]/80 font-medium max-w-3xl leading-relaxed">
                Nossa equipe de tatuadores residentes é especialista em Lettering Chicano, Black & Grey Realista e Dark Art. Agende uma consultoria sem compromisso e crie um projeto autoral único.
              </p>
            </div>
          </div>

          <a
            href="/tattoo"
            className="w-full lg:w-auto py-4 px-8 rounded-none bg-[#5E308A] hover:bg-[#4A2370] text-white font-black text-xs md:text-sm uppercase tracking-widest flex items-center justify-center gap-3 transition-all duration-300 shadow-xl shrink-0 border border-white/20 group"
          >
            <span>CONHECER NOSSA EQUIPE & ESTÚDIO</span>
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </a>
        </motion.div>

      </div>
    </section>
  );
};
