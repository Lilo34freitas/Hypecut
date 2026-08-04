import { ArrowUpRight } from 'lucide-react';

const InstagramIcon = () => (
  <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
  </svg>
);

export const Footer = () => {
  return (
    <footer id="contato" className="relative w-full bg-[#0B0908] text-[#F2EAD9] font-sans overflow-hidden">
      
      {/* Top Brand Dashed Divider Line */}
      <div className="w-full h-[3px] border-t-[3px] border-dashed border-[#5E308A] absolute top-0 left-0 right-0 z-20" />

      <div className="w-full px-6 md:px-12 lg:px-16 pt-16 md:pt-20 pb-12 max-w-[1700px] mx-auto">
        
        {/* Main Minimalist 4-Column Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-16 items-start pb-16 border-b border-white/10">
          
          {/* Column 1: Brand & Identity */}
          <div className="space-y-6">
            <img 
              src="/Logo_hypecut_letreiro_2.svg" 
              alt="HypeCut Barber & Tattoo Logo" 
              className="w-48 md:w-56 h-auto object-contain" 
            />
            <p className="text-[#F2EAD9]/70 text-xs md:text-sm leading-relaxed font-medium max-w-sm">
              Visagismo masculino e arte autoral na pele. Uma experiência de corte e tatuagem de alto padrão com biossegurança rigorosa em Itajaí.
            </p>
            <div>
              <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1 bg-[#5E308A]/20 text-[#5E308A] border border-[#5E308A]/40 inline-block rounded-none">
                EXCLUSIVIDADE & ATITUDE
              </span>
            </div>
          </div>

          {/* Column 2: Navigation Links */}
          <div className="space-y-4">
            <h4 className="text-xs font-black uppercase tracking-widest text-[#5E308A]">
              NAVEGAÇÃO
            </h4>
            <ul className="space-y-3 text-xs md:text-sm font-bold uppercase tracking-wider">
              <li>
                <a href="/" className="text-[#F2EAD9]/70 hover:text-[#5E308A] transition-colors">INÍCIO</a>
              </li>
              <li>
                <a href="/sobre" className="text-[#F2EAD9]/70 hover:text-[#5E308A] transition-colors">SOBRE A HYPECUT</a>
              </li>
              <li>
                <a href="/servicos" className="text-[#F2EAD9]/70 hover:text-[#5E308A] transition-colors">SERVIÇOS BARBEARIA</a>
              </li>
              <li>
                <a href="/tattoo" className="text-[#F2EAD9]/70 hover:text-[#5E308A] transition-colors">TATTOO STUDIO</a>
              </li>
            </ul>
          </div>

          {/* Column 3: Horários de Atendimento */}
          <div className="space-y-4">
            <h4 className="text-xs font-black uppercase tracking-widest text-[#5E308A]">
              HORÁRIO DE FUNCIONAMENTO
            </h4>
            <div className="space-y-3 text-xs md:text-sm font-medium text-[#F2EAD9]/80">
              <div className="flex justify-between items-center border-b border-white/5 pb-2">
                <span className="text-[#F2EAD9]/60">Segunda-feira</span>
                <span className="font-bold text-[#F2EAD9]">14h às 20h</span>
              </div>
              <div className="flex justify-between items-center border-b border-white/5 pb-2">
                <span className="text-[#F2EAD9]/60">Terça a Sexta</span>
                <span className="font-bold text-[#F2EAD9]">09h às 21h</span>
              </div>
              <div className="flex justify-between items-center border-b border-white/5 pb-2">
                <span className="text-[#F2EAD9]/60">Sábado</span>
                <span className="font-bold text-[#F2EAD9]">08h às 17h</span>
              </div>
              <div className="flex justify-between items-center pt-1">
                <span className="text-[#F2EAD9]/60">Domingo</span>
                <span className="text-[#5E308A] font-bold uppercase text-[11px]">Fechado</span>
              </div>
            </div>
          </div>

          {/* Column 4: Atendimento & Redes */}
          <div className="space-y-5">
            <h4 className="text-xs font-black uppercase tracking-widest text-[#5E308A]">
              ATENDIMENTO VIP
            </h4>
            
            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#F2EAD9]/50 block">
                TELEFONE / WHATSAPP
              </span>
              <a
                href="https://wa.me/5547999595843"
                target="_blank"
                rel="noreferrer"
                className="text-2xl font-black text-[#F2EAD9] hover:text-[#5E308A] transition-colors tracking-tight block"
              >
                (47) 99959-5843
              </a>
            </div>

            <div className="pt-2">
              <a
                href="https://wa.me/5547999595843"
                target="_blank"
                rel="noreferrer"
                className="w-full py-3.5 px-6 bg-[#5E308A] hover:bg-[#6C3DFF] text-[#F2EAD9] font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-all duration-300 shadow-xl rounded-none"
              >
                <span>AGENDAR NO WHATSAPP</span>
                <ArrowUpRight size={16} />
              </a>
            </div>

            <div className="flex items-center gap-4 pt-1">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 text-xs font-bold text-[#F2EAD9]/70 hover:text-[#5E308A] transition-colors"
              >
                <InstagramIcon />
                <span>@hype.cut</span>
              </a>
            </div>
          </div>

        </div>

        {/* Minimalist Sub-Footer */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-medium text-[#F2EAD9]/50">
          <p>© {new Date().getFullYear()} HYPECUT. Todos os direitos reservados.</p>
          <p className="text-[11px] uppercase tracking-widest text-[#F2EAD9]/70 font-semibold">
            ITAJAÍ • SANTA CATARINA
          </p>
        </div>

      </div>
    </footer>
  );
};
