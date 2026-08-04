import { ArrowRight } from 'lucide-react';

export const CTASection = () => {
  return (
    <section className="w-full relative py-20 md:py-28 overflow-hidden bg-[#F2EAD9] text-[#0B0908] border-t border-b border-[#0B0908]/10">
      
      {/* Content Container (Full Width, Centered Elements, Solid Off-White Background) */}
      <div className="relative z-10 w-full px-6 md:px-12 max-w-[1700px] mx-auto flex flex-col items-center justify-center text-center">
        
        {/* Flanking Horizontal Lines with Original Navbar Logo */}
        <div className="flex items-center justify-center gap-4 sm:gap-8 w-full max-w-4xl mb-8">
          <div className="h-[2px] flex-1 bg-[#0B0908]/20 rounded-none" />
          <img 
            src="/Logo_hypecut_letreiro_2.svg" 
            alt="HypeCut Logo" 
            className="h-16 sm:h-20 md:h-24 w-auto object-contain drop-shadow-sm" 
          />
          <div className="h-[2px] flex-1 bg-[#0B0908]/20 rounded-none" />
        </div>

        {/* Main Title */}
        <h2 className="text-4xl sm:text-6xl md:text-7xl xl:text-8xl font-black uppercase tracking-tight text-[#0B0908] leading-none mb-6">
          AGENDE SEU HORÁRIO
        </h2>

        {/* Subtitle */}
        <p className="text-[#0B0908]/80 text-sm sm:text-base md:text-lg font-bold uppercase tracking-wider max-w-2xl mb-10 leading-relaxed">
          Garantia de atendimento impecável, estilo afiado e a verdadeira experiência HypeCut.
        </p>

        {/* Custom Interactive Button with Purple Brand Color & Uiverse Sliding Curtain Animation */}
        <a
          href="https://wa.me/5547999595843?text=Ol%C3%A1!%20Gostaria%20de%20agendar%20um%20hor%C3%A1rio%20na%20HypeCut."
          target="_blank"
          rel="noreferrer"
          className="Btn-purple !h-14 !px-8 sm:!px-10 text-xs sm:text-sm md:text-base font-black tracking-widest uppercase shadow-2xl cursor-pointer"
        >
          <span>CLIQUE AQUI E AGENDE PELO WHATSAPP</span>
          <ArrowRight size={20} className="relative z-10" />
        </a>

      </div>
    </section>
  );
};
