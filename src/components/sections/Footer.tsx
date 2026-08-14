import { ArrowUpRight, Clock, Phone, MapPin, Sparkles, Scissors } from 'lucide-react';
import { HypeMarquee } from '../ui/HypeMarquee';

const InstagramIcon = () => (
  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
  </svg>
);

const TikTokIcon = () => (
  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.96-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.82.56-1.36 1.48-1.42 2.48-.12 1.13.43 2.27 1.35 2.92 1.05.74 2.47.8 3.58.19.98-.53 1.56-1.58 1.64-2.69.04-3.96.02-7.92.03-11.88z"/>
  </svg>
);

// Single Clean Full-Width Divider Line
const InkDivider = () => (
  <div className="w-full relative py-4 overflow-hidden flex items-center justify-center">
    <div className="w-full h-[1.5px] bg-gradient-to-r from-transparent via-[#5E308A] to-transparent shadow-[0_0_12px_rgba(94,48,138,0.8)]" />
  </div>
);

export const Footer = () => {
  return (
    <footer id="contato" className="relative w-full bg-[#0B0908] text-[#F2EAD9] font-sans overflow-hidden border-t border-[#5E308A]/30">
      
      {/* AUTHORIAL TATTOO / INK TOP GRAPHIC ACCENT */}
      <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-transparent via-[#9D68D3] to-transparent shadow-[0_0_20px_rgba(157,104,211,0.9)] z-20" />
      
      {/* Subtle Flash Tattoo / Hand-Drawn Background Watermark Texture */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-[0.025] mix-blend-screen bg-repeat z-0"
        style={{
          backgroundImage: `radial-gradient(#5E308A 1px, transparent 1px), radial-gradient(#9D68D3 1px, #0B0908 1px)`,
          backgroundSize: '40px 40px',
          backgroundPosition: '0 0, 20px 20px'
        }}
      />

      <div className="relative z-10 w-full px-6 md:px-12 lg:px-16 pt-16 md:pt-24 pb-12 max-w-[1700px] mx-auto space-y-16">
        
        {/* ASYMMETRIC 2-BLOCK HEROIC LAYOUT */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* BRAND BLOCK (5 cols): Prominent, displaced, bold brand signature */}
          <div className="lg:col-span-5 space-y-8 lg:pr-8">
            
            {/* Logo with Soft Violet Backlight Glow */}
            <div className="relative inline-block group">
              <div className="absolute -inset-4 bg-[#5E308A]/15 blur-xl rounded-full pointer-events-none group-hover:bg-[#5E308A]/30 transition-all duration-500" />
              <img 
                src="/Logo_hypecut_letreiro_2.svg" 
                alt="HypeCut Barber & Tattoo Logo" 
                className="relative w-56 sm:w-64 md:w-72 h-auto object-contain drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)]" 
              />
            </div>

            {/* Brand Manifesto Paragraph */}
            <p className="text-[#F2EAD9]/80 text-sm md:text-base leading-relaxed font-normal max-w-lg text-left">
              A união definitiva entre o visagismo masculino de alta precisão e a arte autoral na pele. Elevamos seu estilo e autoestima com técnicas de vanguarda e padrão cirúrgico de biossegurança em Itajaí.
            </p>

            {/* SIGNATURE BANNER: EXCLUSIVIDADE & ATITUDE */}
            <div className="pt-2">
              <div className="relative inline-flex items-center gap-3 px-5 py-3 bg-black/60 border-y border-[#5E308A]/40">
                <Scissors size={18} className="text-[#9D68D3] shrink-0" />
                <span className="text-xs sm:text-sm font-black uppercase tracking-[0.25em] text-[#F2EAD9]">
                  EXCLUSIVIDADE & ATITUDE
                </span>
                <Sparkles size={16} className="text-[#9D68D3] shrink-0" />
              </div>
            </div>

            {/* Location Quick Badge */}
            <div className="flex items-center gap-2.5 text-xs text-[#F2EAD9]/70 font-semibold pt-1">
              <MapPin size={15} className="text-[#9D68D3] shrink-0" />
              <span>Av. Gov. Adolfo Konder, 1350 • Cidade Nova, Itajaí - SC</span>
            </div>

          </div>

          {/* RIGHT ASYMMETRIC CONTENT GRID (7 cols) */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 lg:gap-10 pt-2 lg:pt-0">
            
            {/* COLUMN 1: Navegação Rápida */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-[#5E308A] shrink-0" />
                <h4 className="text-xs font-black uppercase tracking-widest text-[#9D68D3]">
                  EXPLORAR
                </h4>
              </div>

              <ul className="space-y-3 text-xs md:text-sm font-bold uppercase tracking-wider">
                <li>
                  <a href="/" className="text-[#F2EAD9]/70 hover:text-white hover:translate-x-1 inline-flex items-center gap-1.5 transition-all">
                    <span>Início</span>
                  </a>
                </li>
                <li>
                  <a href="/sobre" className="text-[#F2EAD9]/70 hover:text-white hover:translate-x-1 inline-flex items-center gap-1.5 transition-all">
                    <span>Sobre a HypeCut</span>
                  </a>
                </li>
                <li>
                  <a href="/servicos" className="text-[#F2EAD9]/70 hover:text-white hover:translate-x-1 inline-flex items-center gap-1.5 transition-all">
                    <span>Serviços Barber</span>
                  </a>
                </li>
                <li>
                  <a href="/tattoo" className="text-[#F2EAD9]/70 hover:text-white hover:translate-x-1 inline-flex items-center gap-1.5 transition-all">
                    <span>Tattoo Studio</span>
                  </a>
                </li>
              </ul>
            </div>

            {/* COLUMN 2: Horários de Atendimento */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Clock size={14} className="text-[#9D68D3]" />
                <h4 className="text-xs font-black uppercase tracking-widest text-[#9D68D3]">
                  FUNCIONAMENTO
                </h4>
              </div>

              <div className="space-y-3 text-xs md:text-sm font-medium text-[#F2EAD9]/80">
                <div className="flex justify-between items-center border-b border-white/5 pb-2">
                  <span className="text-[#F2EAD9]/60">Segunda</span>
                  <span className="font-bold text-[#F2EAD9]">14h – 20h</span>
                </div>
                <div className="flex justify-between items-center border-b border-white/5 pb-2">
                  <span className="text-[#F2EAD9]/60">Ter a Sex</span>
                  <span className="font-bold text-[#F2EAD9]">09h – 21h</span>
                </div>
                <div className="flex justify-between items-center border-b border-white/5 pb-2">
                  <span className="text-[#F2EAD9]/60">Sábado</span>
                  <span className="font-bold text-[#F2EAD9]">08h – 17h</span>
                </div>
                <div className="flex justify-between items-center pt-1">
                  <span className="text-[#F2EAD9]/60">Domingo</span>
                  <span className="text-[#C084FC] font-black uppercase text-[10px] tracking-wider bg-[#5E308A]/20 px-2 py-0.5 border border-[#5E308A]/40">
                    Fechado
                  </span>
                </div>
              </div>
            </div>

            {/* COLUMN 3: ATENDIMENTO VIP */}
            <div className="space-y-5 sm:col-span-2 md:col-span-1">
              <div className="flex items-center gap-2">
                <Phone size={14} className="text-[#9D68D3]" />
                <h4 className="text-xs font-black uppercase tracking-widest text-[#9D68D3]">
                  ATENDIMENTO VIP
                </h4>
              </div>
              
              {/* PHONE NUMBER - CLEAN & CRISP (NO NEON GLOW) */}
              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#F2EAD9]/50 block">
                  WHATSAPP DIRETO
                </span>
                <a
                  href="https://wa.me/5547999595843"
                  target="_blank"
                  rel="noreferrer"
                  className="text-2xl sm:text-3xl font-black text-[#F2EAD9] hover:text-[#C084FC] transition-all duration-300 tracking-tight block"
                >
                  (47) 99959-5843
                </a>
              </div>

              {/* VIP Booking Button with Signature Btn-purple Sliding Animation */}
              <div>
                <button
                  type="button"
                  onClick={() => window.dispatchEvent(new CustomEvent('open-booking-modal'))}
                  className="Btn-purple w-full font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 cursor-pointer shadow-xl !h-12 !rounded-none"
                >
                  <span>AGENDAR HORÁRIO</span>
                  <ArrowUpRight size={16} className="relative z-10" />
                </button>
              </div>

              {/* Social Channels with Custom Brand Badges */}
              <div className="flex items-center gap-3 pt-2">
                <a
                  href="https://instagram.com/hypecut.barber"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Instagram HypeCut"
                  className="flex items-center gap-2 px-3 py-2 bg-black/60 hover:bg-[#5E308A]/30 border border-white/15 hover:border-[#9D68D3] text-[#F2EAD9] hover:text-[#C084FC] transition-all text-xs font-bold uppercase tracking-wider rounded-none"
                >
                  <InstagramIcon />
                  <span>Instagram</span>
                </a>

                <a
                  href="https://wa.me/5547999995843"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="TikTok HypeCut"
                  className="flex items-center gap-2 px-3 py-2 bg-black/60 hover:bg-[#5E308A]/30 border border-white/15 hover:border-[#9D68D3] text-[#F2EAD9] hover:text-[#C084FC] transition-all text-xs font-bold uppercase tracking-wider rounded-none"
                >
                  <TikTokIcon />
                  <span>TikTok</span>
                </a>
              </div>

            </div>

            {/* VEM PRA HYPE - INFINITE HORIZONTAL MARQUEE LOOP */}
            <div className="sm:col-span-2 md:col-span-3 pt-6 overflow-hidden">
              <HypeMarquee speed={22} className="w-full" />
            </div>

          </div>

        </div>

        {/* ORGANIC INK STROKE DIVIDER */}
        <InkDivider />

        {/* SUB-FOOTER WITH GEOGRAPHIC SIGNATURE */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 text-xs font-medium text-[#F2EAD9]/60">
          <p>© {new Date().getFullYear()} HYPECUT BARBER & TATTOO. Todos os direitos reservados.</p>
          
          <div className="flex items-center gap-4 text-[11px] font-black uppercase tracking-widest text-[#F2EAD9]/80">
            <span className="text-[#9D68D3]">ITAJAÍ</span>
            <span>•</span>
            <span>SANTA CATARINA</span>
            <span>•</span>
            <span className="text-[#C084FC]">BRASIL</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
