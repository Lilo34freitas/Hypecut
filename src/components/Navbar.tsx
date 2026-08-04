import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ChevronDown, Calendar } from 'lucide-react';
import { cn } from '../utils/cn';
import { ContactModal } from './ui/ContactModal';

export const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const location = useLocation();

  const isAboutPage = location.pathname === '/sobre';
  const isServicesPage = location.pathname === '/servicos';
  const isTattooPage = location.pathname === '/tattoo';
  const isFixedCompactPage = isServicesPage || isTattooPage;

  useEffect(() => {
    // Sync initial scroll position
    setIsScrolled(window.scrollY > 50);

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [location.pathname]);

  const handleSectionClick = (e: React.MouseEvent<HTMLAnchorElement>, sectionId: string) => {
    if (location.pathname === '/') {
      e.preventDefault();
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  // On subpages (/servicos, /tattoo), navbar is permanently compact. On home & /sobre, it responds to scroll.
  const effectiveScrolled = isFixedCompactPage || (isAboutPage ? isScrolled : isScrolled);

  // On /sobre page, navbar is completely hidden/transparent at top (scrollY <= 50) for maximum first impression impact
  const isHiddenOnAboutTop = isAboutPage && !isScrolled && !isMobileMenuOpen;

  return (
    <>
      <nav
        className={cn(
          "fixed top-0 left-0 w-full z-[9999] transition-all duration-500 ease-in-out transform pt-[env(safe-area-inset-top,0px)]",
          isHiddenOnAboutTop
            ? "opacity-0 -translate-y-8 pointer-events-none"
            : "opacity-100 translate-y-0 pointer-events-auto",
          effectiveScrolled
            ? "bg-[#F2EAD9]/95 backdrop-blur-md border-b border-[#0B0908]/10 py-2 lg:py-3 shadow-md"
            : "bg-[#F2EAD9] py-4 sm:py-6 lg:py-8"
        )}
      >
        <div className="w-full px-4 sm:px-6 lg:px-12 flex justify-between items-center">
          <a href="/" className="flex items-center">
            <img 
              src="/Logo_hypecut_letreiro_2.svg" 
              alt="HypeCut Logo" 
              className={cn(
                "h-auto object-contain object-left transition-all duration-500 ease-in-out",
                effectiveScrolled 
                  ? "w-[140px] sm:w-[170px] md:w-[190px] lg:w-[280px] xl:w-[350px]" 
                  : "w-[180px] sm:w-[220px] md:w-[230px] lg:w-[360px] xl:w-[550px]"
              )}
            />
          </a>

          {/* Desktop Menu */}
          <div className={cn(
            "hidden md:flex items-center transition-all duration-500 ease-in-out",
            effectiveScrolled ? "gap-2.5 lg:gap-4 xl:gap-6" : "gap-3 lg:gap-6 xl:gap-8"
          )}>
            <a 
              href="/" 
              className={cn(
                "font-bold tracking-wider text-nav-text hover:text-text-accent transition-all duration-500 uppercase",
                effectiveScrolled ? "text-[0.68rem] md:text-[0.7rem] xl:text-[0.8rem]" : "text-[0.75rem] md:text-[0.78rem] xl:text-[1rem]",
                location.pathname === '/' && "text-text-accent"
              )}
            >
              Início
            </a>

            <a 
              href="/sobre" 
              className={cn(
                "font-bold tracking-wider text-nav-text hover:text-text-accent transition-all duration-500 uppercase",
                effectiveScrolled ? "text-[0.68rem] md:text-[0.7rem] xl:text-[0.8rem]" : "text-[0.75rem] md:text-[0.78rem] xl:text-[1rem]",
                isAboutPage && "text-text-accent"
              )}
            >
              Sobre
            </a>

            {/* Dropdown Services */}
            <div className="relative group cursor-pointer">
              <a 
                href="/servicos" 
                className={cn(
                  "font-bold tracking-wider text-nav-text group-hover:text-text-accent transition-all duration-500 uppercase flex items-center gap-1",
                  effectiveScrolled ? "text-[0.68rem] md:text-[0.7rem] xl:text-[0.8rem]" : "text-[0.75rem] md:text-[0.78rem] xl:text-[1rem]",
                  location.pathname === '/servicos' && "text-text-accent"
                )}
              >
                Serviços <ChevronDown size={effectiveScrolled ? 13 : 16} className="transition-all duration-500" />
              </a>
              <div className="absolute top-full left-0 mt-4 w-52 bg-nav-bg border border-surface-border rounded-none shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 flex flex-col py-2 z-[10000]">
                <a href="/servicos?categoria=masculino" className="px-4 py-2.5 text-[0.8rem] font-bold text-nav-text hover:bg-black/5 hover:text-text-accent uppercase tracking-wider transition-colors">Masculino</a>
                <a href="/servicos?categoria=feminino" className="px-4 py-2.5 text-[0.8rem] font-bold text-nav-text hover:bg-black/5 hover:text-text-accent uppercase tracking-wider transition-colors">Femininos</a>
                <a href="/servicos?categoria=tattoo" className="px-4 py-2.5 text-[0.8rem] font-bold text-nav-text hover:bg-black/5 hover:text-text-accent uppercase tracking-wider transition-colors">Tattoos</a>
                <a href="/servicos" className="px-4 py-2.5 text-[0.8rem] font-black text-text-accent hover:bg-black/5 uppercase tracking-wider border-t border-black/10 transition-colors">Todos os serviços</a>
              </div>
            </div>

            <a 
              href="/#informacoes" 
              onClick={(e) => handleSectionClick(e, 'informacoes')}
              className={cn(
                "font-bold tracking-wider text-nav-text hover:text-text-accent transition-all duration-500 uppercase",
                effectiveScrolled ? "text-[0.68rem] md:text-[0.7rem] xl:text-[0.8rem]" : "text-[0.75rem] md:text-[0.78rem] xl:text-[1rem]"
              )}
            >
              Informações
            </a>

            <a 
              href="/tattoo" 
              className={cn(
                "font-bold tracking-wider text-nav-text hover:text-text-accent transition-all duration-500 uppercase",
                effectiveScrolled ? "text-[0.68rem] md:text-[0.7rem] xl:text-[0.8rem]" : "text-[0.75rem] md:text-[0.78rem] xl:text-[1rem]",
                isTattooPage && "text-text-accent"
              )}
            >
              Tattoos
            </a>

            <button
              onClick={() => setIsContactModalOpen(true)}
              className={cn(
                "font-bold tracking-wider text-nav-text hover:text-text-accent transition-all duration-500 uppercase cursor-pointer",
                effectiveScrolled ? "text-[0.68rem] md:text-[0.7rem] xl:text-[0.8rem]" : "text-[0.75rem] md:text-[0.78rem] xl:text-[1rem]"
              )}
            >
              Contato
            </button>

            {/* CTA AGENDAR Button on Far Right */}
            <a
              href="https://wa.me/5547999595843?text=Ol%C3%A1!%20Gostaria%20de%20agendar%20um%20hor%C3%A1rio%20na%20HypeCut."
              target="_blank"
              rel="noreferrer"
              className={cn(
                "Btn-purple shrink-0 ml-1.5 sm:ml-3 whitespace-nowrap cursor-pointer shadow-md",
                effectiveScrolled ? "!h-9 !px-3 md:!px-4 text-[0.72rem]" : "!h-10 md:!h-11 !px-4 md:!px-6 text-[0.78rem] md:text-[0.85rem]"
              )}
            >
              <Calendar size={effectiveScrolled ? 14 : 16} />
              <span>AGENDAR</span>
            </a>
          </div>

          {/* Mobile Toggle with 44px x 44px Touch Target */}
          <button
            className="md:hidden text-nav-text cursor-pointer p-2 min-w-[44px] min-h-[44px] flex items-center justify-center"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Abrir Menu"
          >
            {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="md:hidden absolute top-full left-0 w-full bg-[#0B0908] border-b border-white/10 py-5 px-6 flex flex-col gap-4 shadow-card text-[#F2EAD9] max-h-[calc(100dvh-5rem)] overflow-y-auto"
            >
              <a href="/" onClick={() => setIsMobileMenuOpen(false)} className="text-base font-bold uppercase tracking-wider text-[#F2EAD9]">Início</a>
              <a href="/sobre" onClick={() => setIsMobileMenuOpen(false)} className="text-base font-bold uppercase tracking-wider text-[#F2EAD9]">Sobre</a>
              <a href="/servicos" onClick={() => setIsMobileMenuOpen(false)} className="text-base font-bold uppercase tracking-wider text-[#F2EAD9]">Serviços</a>
              <a href="/tattoo" onClick={() => setIsMobileMenuOpen(false)} className="text-base font-bold uppercase tracking-wider text-[#F2EAD9]">Tattoos</a>
              <a href="/#informacoes" onClick={() => setIsMobileMenuOpen(false)} className="text-base font-bold uppercase tracking-wider text-[#F2EAD9]">Informações</a>
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  setIsContactModalOpen(true);
                }}
                className="text-base font-bold uppercase tracking-wider text-[#F2EAD9] text-left cursor-pointer"
              >
                Contato
              </button>
              <a
                href="https://wa.me/5547999595843?text=Ol%C3%A1!%20Gostaria%20de%20agendar%20um%20hor%C3%A1rio%20na%20HypeCut."
                target="_blank"
                rel="noreferrer"
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-full py-3 px-5 bg-[#5E308A] hover:bg-[#6C3DFF] text-[#F2EAD9] font-black text-xs uppercase tracking-widest rounded-none transition-all flex items-center justify-center gap-2 mt-2 shadow-lg"
              >
                <Calendar size={16} />
                <span>AGENDAR HORÁRIO</span>
              </a>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Contact Modal Popup */}
      <ContactModal
        isOpen={isContactModalOpen}
        onClose={() => setIsContactModalOpen(false)}
      />
    </>
  );
};
