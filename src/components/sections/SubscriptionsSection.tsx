import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';

interface Combo {
  tag: string;
  title: string;
  description: string;
  badge?: string;
  theme: 'dark' | 'light';
  features: string[];
}

const combos: Combo[] = [
  {
    tag: 'SUPER COMBO',
    title: 'COMBO VIP COMPLETE',
    description: 'Experiência máxima de renovação do visual e cuidado facial profundo.',
    badge: 'EXCLUSIVO',
    theme: 'dark',
    features: [
      'CORTE DE CABELO MASCULINO STYLIST',
      'DESIGN E ALINHAMENTO DE SOBRANCELHA',
      'TRATAMENTO DE HIDRATAÇÃO CAPILAR',
      'DEPILAÇÃO DE ORELHA E NARIZ COM CERA',
      'LIMPEZA DE PELE E ESFOLIAÇÃO FACIAL',
    ],
  },
  {
    tag: 'MAIS VENDIDO',
    title: 'CABELO + BARBA + SOBRANCELHA',
    description: 'O combo mais pedido da casa: alinhamento completo do visual.',
    badge: 'POPULAR',
    theme: 'light',
    features: [
      'CORTE DE CABELO MASCULINO COMPLETO',
      'BARBATERAPIA COM TOALHA QUENTE',
      'DESENHO DE BARBA NA NAVALHA',
      'DESIGN DE SOBRANCELHA',
      'FINALIZAÇÃO COM PRODUTOS PREMIUM',
    ],
  },
  {
    tag: 'CLÁSSICO',
    title: 'CABELO + BARBA',
    description: 'Combinação tradicional para manter cabelo e barba no esquadro.',
    theme: 'dark',
    features: [
      'CORTE MASCULINO (DEGRADÊ OU CLÁSSICO)',
      'MODELAGEM E DESENHO DE BARBA',
      'BARBATERAPIA COMPLETA COM TOALHA QUENTE',
      'LAVAGEM CAPILAR E SECAGEM',
    ],
  },
  {
    tag: 'ESSENCIAL',
    title: 'CABELO + SOBRANCELHA',
    description: 'Corte de cabelo alinhado com o toque final na sobrancelha.',
    theme: 'light',
    features: [
      'CORTE MASCULINO STYLIST',
      'ALINHAMENTO DE SOBRANCELHA NA NAVALHA',
      'REZINHO E ACABAMENTO PRECIO',
      'FINALIZAÇÃO E POMADA MODELADORA',
    ],
  },
];

export const SubscriptionsSection = () => {
  const navigate = useNavigate();
  const [mobileIndex, setMobileIndex] = useState(0);

  const handleCardClick = () => {
    navigate('/servicos');
  };

  const handlePrev = () => {
    setMobileIndex((prev) => (prev === 0 ? combos.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setMobileIndex((prev) => (prev === combos.length - 1 ? 0 : prev + 1));
  };

  const currentCombo = combos[mobileIndex];
  const isCurrentLight = currentCombo.theme === 'light';

  return (
    <section
      id="combos"
      className="bg-gradient-to-b from-[#0B0908] via-[#2A1444] to-[#5E308A] py-24 md:py-32 text-[#F2EAD9] relative z-0 overflow-hidden w-full border-none outline-none"
    >
      <div id="assinaturas" className="absolute top-0 left-0" />

      {/* Right-Aligned Section Header */}
      <div className="w-full px-6 md:px-12 lg:px-16 max-w-[1700px] mx-auto mb-12 md:mb-16 text-right flex flex-col items-end">
        <h2 className="text-4xl md:text-6xl lg:text-7xl font-black uppercase text-[#F2EAD9] tracking-tight leading-none mb-3">
          COMBOS <span className="text-[#F2EAD9]">HYPECUT</span>
        </h2>
        <p className="text-[#F2EAD9]/80 text-xs md:text-sm font-bold uppercase tracking-wider max-w-2xl">
          A melhor combinação de serviços para renovar seu visual em uma única sessão.
        </p>
      </div>

      {/* MOBILE CAROUSEL (1 CARD POR VEZ) - APENAS EM RESOLUÇÕES MOBILE (<768px) */}
      <div className="block md:hidden w-full px-6 max-w-[1700px] mx-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={mobileIndex}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.3 }}
            onClick={handleCardClick}
            className={`relative flex flex-col justify-between p-6 border-2 w-full min-h-[540px] rounded-none cursor-pointer shadow-2xl ${
              isCurrentLight
                ? 'bg-[#F2EAD9] text-[#0B0908] border-[#F2EAD9]'
                : 'bg-[#000000] text-white border-white/20'
            }`}
          >
            {/* Card Content */}
            <div>
              {/* Combo Title */}
              <h3 className={`text-2xl font-black uppercase tracking-tight mb-3 leading-tight min-h-[48px] flex items-center ${
                isCurrentLight ? 'text-[#0B0908]' : 'text-[#F2EAD9]'
              }`}>
                {currentCombo.title}
              </h3>

              {/* Description Subtitle */}
              <p
                className={`text-xs font-medium mb-6 leading-relaxed ${
                  isCurrentLight ? 'text-[#0B0908]/80' : 'text-white/80'
                }`}
              >
                {currentCombo.description}
              </p>

              <div
                className={`w-full border-b border-dashed mb-6 ${
                  isCurrentLight ? 'border-[#0B0908]/25' : 'border-white/25'
                }`}
              />

              {/* Features Checklist */}
              <ul className="space-y-3 mb-8">
                {currentCombo.features.map((feature, fIdx) => (
                  <li
                    key={fIdx}
                    className={`flex items-start gap-3 text-xs font-bold uppercase tracking-wide leading-snug ${
                      isCurrentLight ? 'text-[#0B0908]' : 'text-white/90'
                    }`}
                  >
                    <Check
                      size={16}
                      className={`shrink-0 mt-0.5 ${
                        isCurrentLight ? 'text-[#0B0908]' : 'text-[#F2EAD9]'
                      }`}
                      strokeWidth={3}
                    />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Card CTA Action Button */}
            <div
              className={`w-full py-3.5 px-5 font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 rounded-none ${
                isCurrentLight
                  ? 'bg-[#0B0908] text-[#F2EAD9]'
                  : 'bg-[#F2EAD9] text-[#0B0908]'
              }`}
            >
              <span>VER VALORES E DETALHES</span>
              <ArrowRight size={16} />
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Mobile Navigation Controls (Both Black Buttons) */}
        <div className="flex items-center justify-between mt-6 pt-4 border-t border-white/10">
          <button
            onClick={handlePrev}
            className="py-3 px-5 bg-black border border-white/20 hover:border-white text-[#F2EAD9] rounded-none flex items-center gap-2 cursor-pointer shadow-md"
            aria-label="Combo Anterior"
          >
            <ChevronLeft size={18} />
            <span className="text-xs font-bold uppercase">Anterior</span>
          </button>

          <span className="text-xs font-black tracking-widest text-[#F2EAD9]">
            0{mobileIndex + 1} / 0{combos.length}
          </span>

          <button
            onClick={handleNext}
            className="py-3 px-5 bg-black border border-white/20 hover:border-white text-[#F2EAD9] rounded-none flex items-center gap-2 cursor-pointer shadow-md"
            aria-label="Próximo Combo"
          >
            <span className="text-xs font-bold uppercase">Próximo</span>
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      {/* DESKTOP GRID (4 CARDS) - MANTIDO EM RESOLUÇÕES MAIORES (>=768px) */}
      <div className="hidden md:block w-full px-6 md:px-12 lg:px-16 max-w-[1700px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 md:gap-8 items-stretch w-full">
          {combos.map((combo, index) => {
            const isLight = combo.theme === 'light';

            return (
              <motion.div
                key={combo.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.12 }}
                onClick={handleCardClick}
                className={`relative flex flex-col justify-between p-6 sm:p-8 border-2 w-full min-h-[580px] transition-all duration-300 rounded-none cursor-pointer group shadow-2xl ${
                  isLight
                    ? 'bg-[#F2EAD9] text-[#0B0908] border-[#F2EAD9] hover:border-black'
                    : 'bg-[#000000] text-white border-white/20 hover:border-white'
                }`}
              >
                {/* Card Content */}
                <div>
                  {/* Combo Title */}
                  <h3 className={`text-2xl md:text-3xl font-black uppercase tracking-tight mb-3 leading-tight min-h-[64px] flex items-center transition-colors ${
                    isLight ? 'text-[#0B0908] group-hover:text-[#0B0908]' : 'text-[#F2EAD9] group-hover:text-[#F2EAD9]'
                  }`}>
                    {combo.title}
                  </h3>

                  {/* Description Subtitle */}
                  <p
                    className={`text-xs md:text-sm font-medium mb-8 leading-relaxed ${
                      isLight ? 'text-[#0B0908]/80' : 'text-white/80'
                    }`}
                  >
                    {combo.description}
                  </p>

                  <div
                    className={`w-full border-b border-dashed mb-8 ${
                      isLight ? 'border-[#0B0908]/25' : 'border-white/25'
                    }`}
                  />

                  {/* Features Checklist */}
                  <ul className="space-y-3.5 mb-10">
                    {combo.features.map((feature, fIdx) => (
                      <li
                        key={fIdx}
                        className={`flex items-start gap-3 text-xs md:text-sm font-bold uppercase tracking-wide leading-snug ${
                          isLight ? 'text-[#0B0908]' : 'text-white/90'
                        }`}
                      >
                        <Check
                          size={18}
                          className={`shrink-0 mt-0.5 ${
                            isLight ? 'text-[#0B0908]' : 'text-[#F2EAD9]'
                          }`}
                          strokeWidth={3}
                        />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Card CTA Action Button */}
                <div
                  className={`w-full py-4 px-6 font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-all duration-300 rounded-none ${
                    isLight
                      ? 'bg-[#0B0908] text-[#F2EAD9] group-hover:bg-[#5E308A] group-hover:text-[#F2EAD9]'
                      : 'bg-[#F2EAD9] text-[#0B0908] group-hover:bg-[#5E308A] group-hover:text-[#F2EAD9]'
                  }`}
                >
                  <span>VER VALORES E DETALHES</span>
                  <ArrowRight size={16} className="group-hover:translate-x-1.5 transition-transform" />
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Footer CTA Button inviting to view full prices page - Off-White Navbar Color (Btn) */}
      <div className="mt-12 text-center flex justify-center">
        <button
          onClick={handleCardClick}
          className="Btn font-black text-xs sm:text-sm uppercase tracking-widest group"
        >
          <span>VER TODOS OS COMBOS E SERVIÇOS</span>
          <span className="text-xl font-bold group-hover:translate-x-1.5 transition-transform relative z-10">›</span>
        </button>
      </div>
    </section>
  );
};
