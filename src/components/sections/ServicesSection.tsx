import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUpRight, ChevronLeft, ChevronRight } from 'lucide-react';

const mobileServices = [
  {
    tag: 'ALTA PERFORMANCE',
    title: 'Cabelo, Barba & Estilo',
    description: 'Visagismo sob medida, alinhamento preciso e barboterapia com toalha quente. A combinação perfeita para transformar e elevar sua presença.',
    bg: '/cardumservices.png'
  },
  {
    tag: 'ESTÉTICA & RENOVAÇÃO',
    title: 'Cuidados Faciais & Limpeza Profunda',
    description: 'Esfoliação, remoção de cravos e tratamento para renovar a pele e alinhar sobrancelhas com máxima precisão.',
    bg: '/SaveInta.com_653721504_18040225667774674_6088000243970909444_n.jpg'
  },
  {
    tag: 'ATENDIMENTO FEMININO',
    title: 'Corte Estilizado & Nutrição Capilar',
    description: 'Diagnóstico capilar exclusivo, secagem, finalização e tratamentos intensivos para restauração profunda e brilho dos fios.',
    bg: '/SaveInta.com_653433741_18040225697774674_5252593049442545512_n.jpg'
  },
  {
    tag: 'ARTE & EXCLUSIVIDADE',
    title: 'Estúdio Tattoo & Autoral',
    description: 'Projetos exclusivos de Lettering, Realismo e Dark desenhados sob medida por nossos artistas.',
    bg: '/SaveInta.com_425781754_17945864729774674_1186814180928611337_n.jpg'
  }
];

export const ServicesSection = () => {
  const navigate = useNavigate();
  const [mobileIndex, setMobileIndex] = useState(0);

  const handleCardClick = () => {
    navigate('/servicos');
  };

  const handlePrev = () => {
    setMobileIndex((prev) => (prev === 0 ? mobileServices.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setMobileIndex((prev) => (prev === mobileServices.length - 1 ? 0 : prev + 1));
  };

  return (
    <section id="servicos" className="bg-[#0B0908] py-24 md:py-32 text-text-primary relative w-full overflow-hidden">
      <div className="w-full px-6 md:px-12 lg:px-16 max-w-[1700px] mx-auto">
        
        {/* Header Layout matching the HypeCut official brand design */}
        <div className="mb-12 md:mb-16">
          <h2 className="text-4xl md:text-6xl lg:text-7xl font-black uppercase text-[#F2EAD9] tracking-tight">
            NOSSOS <span className="text-[#5E308A]">SERVIÇOS</span>
          </h2>
        </div>

        {/* MOBILE CAROUSEL (1 CARD POR VEZ) - APENAS EM RESOLUÇÕES MOBILE (<768px) */}
        <div className="block md:hidden w-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={mobileIndex}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.3 }}
              onClick={handleCardClick}
              className="relative min-h-[440px] rounded-none border-2 border-white/20 hover:border-white/40 shadow-2xl flex flex-col justify-end p-6 bg-black cursor-pointer overflow-hidden"
            >
              {/* Background Image */}
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700"
                style={{ backgroundImage: `url('${mobileServices[mobileIndex].bg}')` }}
              />

              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/55 to-transparent z-10 opacity-90" />

              {/* Floating Top Right Arrow Badge */}
              <div className="absolute top-5 right-5 z-20 w-10 h-10 rounded-none bg-black/80 border border-white/20 flex items-center justify-center text-white">
                <ArrowUpRight size={20} />
              </div>

              {/* Content */}
              <div className="relative z-20">
                <span className="inline-block px-3 py-1 bg-[#5E308A] text-white font-black text-[10px] uppercase tracking-widest mb-2">
                  {mobileServices[mobileIndex].tag}
                </span>
                <h3 className="text-2xl font-black text-white uppercase tracking-tight mb-2 leading-tight">
                  {mobileServices[mobileIndex].title}
                </h3>
                <p className="text-xs text-white/80 font-medium leading-relaxed">
                  {mobileServices[mobileIndex].description}
                </p>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Mobile Brand Dashed Divider Line */}
          <div className="w-full h-[3px] border-t-[3px] border-dashed border-[#5E308A] my-5" />

          {/* Mobile Navigation Controls with Navbar Off-White Buttons */}
          <div className="flex items-center justify-between">
            <button
              onClick={handlePrev}
              className="py-3 px-5 bg-[#F2EAD9] hover:bg-white text-[#0B0908] font-black rounded-none flex items-center gap-2 cursor-pointer shadow-md"
              aria-label="Card Anterior"
            >
              <ChevronLeft size={18} />
              <span className="text-xs font-black uppercase">Anterior</span>
            </button>

            <span className="text-xs font-black tracking-widest text-[#F2EAD9]">
              0{mobileIndex + 1} / 0{mobileServices.length}
            </span>

            <button
              onClick={handleNext}
              className="py-3 px-5 bg-[#F2EAD9] hover:bg-white text-[#0B0908] font-black rounded-none flex items-center gap-2 cursor-pointer shadow-md"
              aria-label="Próximo Card"
            >
              <span className="text-xs font-black uppercase">Próximo</span>
              <ChevronRight size={18} strokeWidth={2.5} />
            </button>
          </div>
        </div>

        {/* DESKTOP BENTO GRID LAYOUT - MANTIDO EM RESOLUÇÕES MAIORES (>=768px) */}
        <div className="hidden md:grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          
          {/* CARD 01 (Destaque Principal - Esquerda) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            onClick={handleCardClick}
            className="lg:col-span-6 relative min-h-[460px] md:min-h-[580px] lg:min-h-[640px] rounded-none border-2 border-white/20 hover:border-[#5E308A] transition-all duration-500 group cursor-pointer shadow-2xl flex flex-col justify-end p-8 md:p-10 bg-black"
          >
            {/* Background Image */}
            <div
              className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-105"
              style={{ backgroundImage: `url('/cardumservices.png')` }}
            />

            {/* Gradient Overlay for Text Legibility */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/50 to-transparent z-10 opacity-90 group-hover:opacity-80 transition-opacity duration-300" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-transparent to-transparent z-10" />

            {/* Floating Top Right Arrow Badge (Sharp 90deg Square) */}
            <div className="absolute top-6 right-6 z-20 w-10 h-10 rounded-none bg-black/80 border border-white/20 flex items-center justify-center text-white group-hover:bg-[#5E308A] group-hover:border-[#5E308A] transition-all duration-300 shadow-lg">
              <ArrowUpRight size={20} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </div>

            {/* Content Container */}
            <div className="relative z-20">
              <span className="inline-block px-3 py-1 bg-[#5E308A] text-white font-black text-[11px] uppercase tracking-widest mb-3">
                ALTA PERFORMANCE
              </span>
              <h3 className="text-2xl md:text-4xl lg:text-5xl font-black text-white uppercase tracking-tight mb-4 group-hover:text-[#5E308A] transition-colors leading-tight">
                Cabelo, Barba & Estilo
              </h3>
              <p className="text-xs md:text-sm text-white/80 font-medium leading-relaxed max-w-xl">
                Visagismo sob medida, alinhamento preciso e barboterapia com toalha quente. A combinação perfeita para transformar e elevar sua presença.
              </p>
            </div>
          </motion.div>

          {/* Right Column Container */}
          <div className="lg:col-span-6 flex flex-col gap-6">
            
            {/* CARD 02 (Superior - Direita) */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              onClick={handleCardClick}
              className="relative h-[280px] md:h-[300px] lg:h-[308px] rounded-none border-2 border-white/20 hover:border-[#5E308A] transition-all duration-500 group cursor-pointer shadow-xl flex flex-col justify-end p-6 md:p-8 bg-black"
            >
              {/* Background Image */}
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-105"
                style={{ backgroundImage: `url('/SaveInta.com_653721504_18040225667774674_6088000243970909444_n.jpg')` }}
              />

              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/50 to-transparent z-10 opacity-90 group-hover:opacity-80 transition-opacity duration-300" />

              {/* Floating Arrow Badge (Sharp Square) */}
              <div className="absolute top-5 right-5 z-20 w-9 h-9 rounded-none bg-black/80 border border-white/20 flex items-center justify-center text-white group-hover:bg-[#5E308A] group-hover:border-[#5E308A] transition-all duration-300 shadow-lg">
                <ArrowUpRight size={18} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </div>

              {/* Content */}
              <div className="relative z-20">
                <span className="inline-block px-2.5 py-0.5 bg-[#5E308A] text-white font-black text-[10px] uppercase tracking-widest mb-2">
                  ESTÉTICA & RENOVAÇÃO
                </span>
                <h3 className="text-xl md:text-2xl lg:text-3xl font-black text-white uppercase tracking-tight mb-2 group-hover:text-[#5E308A] transition-colors">
                  Cuidados Faciais & Limpeza Profunda
                </h3>
                <p className="text-xs md:text-sm text-white/80 font-medium leading-relaxed max-w-lg">
                  Esfoliação, remoção de cravos e tratamento para renovar a pele e alinhar sobrancelhas com máxima precisão.
                </p>
              </div>
            </motion.div>

            {/* Bottom Split Row (CARD 03 & CARD 04 Side-by-Side) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 flex-1">
              
              {/* CARD 03 (Inferior Esquerdo - Direita) */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
                onClick={handleCardClick}
                className="relative h-[270px] md:h-[295px] lg:h-[308px] rounded-none border-2 border-white/20 hover:border-[#5E308A] transition-all duration-500 group cursor-pointer shadow-xl flex flex-col justify-end p-6 bg-black"
              >
                {/* Background Image */}
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-105"
                  style={{ backgroundImage: `url('/SaveInta.com_653433741_18040225697774674_5252593049442545512_n.jpg')` }}
                />

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/50 to-transparent z-10 opacity-90 group-hover:opacity-80 transition-opacity duration-300" />

                {/* Floating Arrow Badge (Sharp Square) */}
                <div className="absolute top-5 right-5 z-20 w-8 h-8 rounded-none bg-black/80 border border-white/20 flex items-center justify-center text-white group-hover:bg-[#5E308A] group-hover:border-[#5E308A] transition-all duration-300 shadow-lg">
                  <ArrowUpRight size={16} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </div>

                {/* Content */}
                <div className="relative z-20">
                  <span className="inline-block px-2.5 py-0.5 bg-[#5E308A] text-white font-black text-[10px] uppercase tracking-widest mb-1.5">
                    ATENDIMENTO FEMININO
                  </span>
                  <h3 className="text-lg md:text-xl font-black text-white uppercase tracking-tight mb-2 group-hover:text-[#5E308A] transition-colors leading-tight">
                    Corte Estilizado & Nutrição Capilar
                  </h3>
                  <p className="text-xs text-white/80 font-medium leading-relaxed">
                    Diagnóstico capilar exclusivo, secagem, finalização e tratamentos intensivos para restauração profunda e brilho dos fios.
                  </p>
                </div>
              </motion.div>

              {/* CARD 04 (Inferior Direito - Direita) */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 }}
                onClick={handleCardClick}
                className="relative h-[270px] md:h-[295px] lg:h-[308px] rounded-none border-2 border-white/20 hover:border-[#5E308A] transition-all duration-500 group cursor-pointer shadow-xl flex flex-col justify-end p-6 bg-black"
              >
                {/* Background Image */}
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-105"
                  style={{ backgroundImage: `url('/SaveInta.com_425781754_17945864729774674_1186814180928611337_n.jpg')` }}
                />

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/50 to-transparent z-10 opacity-90 group-hover:opacity-80 transition-opacity duration-300" />

                {/* Floating Arrow Badge (Sharp Square) */}
                <div className="absolute top-5 right-5 z-20 w-8 h-8 rounded-none bg-black/80 border border-white/20 flex items-center justify-center text-white group-hover:bg-[#5E308A] group-hover:border-[#5E308A] transition-all duration-300 shadow-lg">
                  <ArrowUpRight size={16} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </div>

                {/* Content */}
                <div className="relative z-20">
                  <span className="inline-block px-2.5 py-0.5 bg-[#5E308A] text-white font-black text-[10px] uppercase tracking-widest mb-1.5">
                    ARTE & EXCLUSIVIDADE
                  </span>
                  <h3 className="text-lg md:text-xl font-black text-white uppercase tracking-tight mb-2 group-hover:text-[#5E308A] transition-colors leading-tight">
                    Estúdio Tattoo & Autoral
                  </h3>
                  <p className="text-xs text-white/80 font-medium leading-relaxed">
                    Projetos exclusivos de Lettering, Realismo e Dark desenhados sob medida por nossos artistas.
                  </p>
                </div>
              </motion.div>

            </div>

          </div>

        </div>

        {/* Footer CTA Button inviting to view full prices page - FAQ Style Btn-purple */}
        <div className="mt-14 text-center flex justify-center">
          <button
            onClick={handleCardClick}
            className="Btn-purple font-black text-xs sm:text-sm uppercase tracking-widest group"
          >
            <span>VER TABELA COMPLETA DE SERVIÇOS & VALORES</span>
            <span className="text-xl font-bold group-hover:translate-x-1.5 transition-transform relative z-10">›</span>
          </button>
        </div>

      </div>
    </section>
  );
};
