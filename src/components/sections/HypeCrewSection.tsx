import { motion } from 'framer-motion';
import { Scissors, Tag, Zap, Palette, ArrowRight, Sparkles, MessageCircle } from 'lucide-react';

interface BenefitItem {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const benefits: BenefitItem[] = [
  {
    icon: <Scissors size={24} className="text-[#5E308A]" />,
    title: "DESCONTOS EM SERVIÇOS",
    description: "Condições exclusivas em cortes, barba, químicas e projetos de tattoo no estúdio.",
  },
  {
    icon: <Tag size={24} className="text-[#5E308A]" />,
    title: "KITS & PRODUTOS",
    description: "Vantagens na compra de pomadas, óleos e itens de cuidados diários.",
  },
  {
    icon: <Zap size={24} className="text-[#5E308A]" />,
    title: "ACESSO PRIORITÁRIO & AGENDAMENTO FAST",
    description: "Prioridade de agenda em datas comemorativas e horários de pico.",
  },
  {
    icon: <Palette size={24} className="text-[#5E308A]" />,
    title: "FLASH TATTOOS & EVENTOS",
    description: "Convite VIP para eventos do estúdio, collabs e promoções relâmpago exclusivas para membros.",
  },
];

export const HypeCrewSection = () => {
  const whatsappUrl = "https://wa.me/5547999995843?text=Ol%C3%A1!%20Quero%20saber%20mais%20sobre%20como%20fazer%20parte%20da%20HypeCrew%20e%20garantir%20meus%20benef%C3%ADcios.";

  return (
    <section id="hypecrew" className="bg-[#0B0908] py-24 md:py-32 text-[#F2EAD9] relative overflow-hidden w-full border-t border-white/10">
      <div className="w-full px-6 md:px-12 lg:px-16 max-w-[1700px] mx-auto">
        
        {/* Section Header */}
        <div className="mb-12 md:mb-16">
          <div className="inline-block px-4 py-1 border border-white/20 bg-white/5 mb-3 text-[11px] font-black uppercase tracking-widest text-[#5E308A]">
            COMUNIDADE EXCLUSIVA
          </div>
          <h2 className="text-4xl md:text-6xl lg:text-7xl font-black uppercase text-[#F2EAD9] tracking-tight">
            FAÇA PARTE DA <span className="text-[#5E308A]">HYPECREW</span>
          </h2>
          <p className="text-[#F2EAD9]/80 text-xs md:text-sm font-bold uppercase tracking-wider max-w-3xl mt-2">
            Muito mais do que um corte ou uma tattoo. Um clube de estilo, benefícios reais e cultura urbana em Itajaí.
          </p>
        </div>

        {/* Main Content Grid: LEFT = Video & Phone Mockup, RIGHT = Manifesto & Benefits */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* LEFT COLUMN: Video Reel + Phone Mockup Overlay (lg:col-span-5) */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-5 relative"
          >
            {/* Main Reel Video Player - Sharp 90-degree corners (rounded-none) */}
            <div className="relative rounded-none border-2 border-white/20 shadow-2xl overflow-hidden bg-black h-[480px] sm:h-[560px] md:h-[620px] group">
              <video 
                src="/snapinsta-1784818023085.mp4" 
                autoPlay 
                loop 
                muted 
                playsInline 
                preload="auto"
                disablePictureInPicture
                disableRemotePlayback
                ref={(el) => {
                  if (el) {
                    el.defaultMuted = true;
                    el.muted = true;
                    el.play().catch(() => {});
                  }
                }}
                className="w-full h-full object-cover"
              />
              
              {/* Subtle Ambient Vignette Overlays */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/40 pointer-events-none" />
              
              <div className="absolute bottom-6 left-6 right-6 text-white z-10">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles size={16} className="text-[#5E308A]" />
                  <span className="text-xs font-black uppercase tracking-widest text-[#5E308A]">LIFESTYLE HYPECUT</span>
                </div>
                <p className="text-xs font-bold text-white/90 uppercase tracking-wider leading-relaxed">
                  Experiência urbana, cortes afiados e arte autêntica no nosso estúdio em Itajaí.
                </p>
              </div>
            </div>

            {/* Overlapping Phone Mockup Container displaying HypeCrew Logo */}
            <div className="absolute -bottom-8 -right-4 sm:-right-8 md:-bottom-10 md:-right-10 w-[200px] sm:w-[240px] md:w-[270px] z-20 pointer-events-none drop-shadow-2xl">
              <div className="relative w-full h-auto">
                <img 
                  src="/celular_hype.png" 
                  alt="Celular HypeCut" 
                  className="w-full h-auto object-contain relative z-10" 
                />
                
                {/* HypeCrew Official SVG Logo positioned seamlessly inside the Phone Screen */}
                <div className="absolute top-[28%] left-[23%] w-[54%] h-[44%] flex items-center justify-center z-20">
                  <img 
                    src="/Logo_navbar_H_crew_n2.svg" 
                    alt="Logo HypeCrew" 
                    className="w-full h-auto object-contain drop-shadow-lg animate-pulse" 
                  />
                </div>
              </div>
            </div>
          </motion.div>

          {/* RIGHT COLUMN: Manifesto & 4 Benefit Pillars (lg:col-span-7) */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="lg:col-span-7 space-y-8"
          >
            {/* O Manifesto Box */}
            <div className="rounded-none border-l-4 border-[#5E308A] bg-black/80 border border-white/10 p-6 md:p-8 space-y-3 shadow-2xl">
              <h3 className="text-sm font-black uppercase tracking-widest text-[#5E308A] flex items-center gap-2">
                <Sparkles size={16} /> O MANIFESTO HYPECREW
              </h3>
              <p className="text-white/90 text-sm md:text-base leading-relaxed font-semibold">
                "A HypeCrew nasceu para quem não aceita o comum. É a nossa rede de clientes e amigos que vivem o lifestyle da Hype Cut. Ao fazer parte, você garante regalias exclusivas dentro do estúdio e acesso prioritário a tudo o que acontece por aqui."
              </p>
            </div>

            {/* 4 Benefit Cards Grid (Strict 90-degree corners rounded-none) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
              {benefits.map((benefit, idx) => (
                <div
                  key={idx}
                  className="bg-black/90 border-2 border-white/10 p-6 rounded-none hover:border-[#5E308A] transition-all duration-300 shadow-xl group flex flex-col justify-between"
                >
                  <div>
                    <div className="mb-4 p-3 bg-white/5 inline-block border border-white/10 group-hover:border-[#5E308A] transition-colors rounded-none">
                      {benefit.icon}
                    </div>
                    <h4 className="text-sm md:text-base font-black uppercase tracking-wide text-white group-hover:text-[#5E308A] transition-colors mb-2 leading-snug">
                      {benefit.title}
                    </h4>
                    <p className="text-xs md:text-sm text-white/70 font-medium leading-relaxed">
                      {benefit.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Main Action CTA Button */}
            <div className="pt-4">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-3 py-5 px-8 md:px-10 rounded-none bg-[#7C4DFF] hover:bg-[#6C3DFF] text-white font-black text-xs md:text-sm uppercase tracking-widest transition-all duration-300 shadow-2xl group"
              >
                <MessageCircle size={20} className="group-hover:scale-110 transition-transform" />
                <span>QUERO ENTRAR NA HYPECREW</span>
                <ArrowRight size={18} className="group-hover:translate-x-1.5 transition-transform" />
              </a>
            </div>

          </motion.div>

        </div>

      </div>
    </section>
  );
};
