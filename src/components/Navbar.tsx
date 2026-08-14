import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ChevronDown, Calendar, User as UserIcon, LogOut } from 'lucide-react';
import { cn } from '../utils/cn';
import { ContactModal } from './ui/ContactModal';
import { AuthModal } from './ui/AuthModal';
import { useAuth } from '../context/AuthContext';

export const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
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
            ? "bg-[#F2EAD9]/95 backdrop-blur-md border-b border-[#0B0908]/10 py-1.5 sm:py-2 shadow-md"
            : "bg-[#F2EAD9] py-2 sm:py-2.5 lg:py-3"
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
                  ? "w-[120px] sm:w-[140px] md:w-[160px] lg:w-[190px] xl:w-[220px]" 
                  : "w-[130px] sm:w-[155px] md:w-[180px] lg:w-[220px] xl:w-[260px]"
              )}
            />
          </a>

          {/* Desktop Menu */}
          <div className={cn(
            "hidden md:flex items-center transition-all duration-500 ease-in-out",
            effectiveScrolled ? "gap-2.5 lg:gap-4 xl:gap-5" : "gap-3 lg:gap-5 xl:gap-6"
          )}>
            <a 
              href="/" 
              className={cn(
                "font-bold tracking-wider text-nav-text hover:text-text-accent transition-all duration-500 uppercase",
                effectiveScrolled ? "text-[0.68rem] md:text-[0.7rem] xl:text-[0.78rem]" : "text-[0.72rem] md:text-[0.76rem] xl:text-[0.82rem]",
                location.pathname === '/' && "text-text-accent"
              )}
            >
              Início
            </a>

            <a 
              href="/sobre" 
              className={cn(
                "font-bold tracking-wider text-nav-text hover:text-text-accent transition-all duration-500 uppercase",
                effectiveScrolled ? "text-[0.68rem] md:text-[0.7rem] xl:text-[0.78rem]" : "text-[0.72rem] md:text-[0.76rem] xl:text-[0.82rem]",
                isAboutPage && "text-text-accent"
              )}
            >
              Sobre
            </a>

            {/* Dropdown Services (Trigger does not navigate, only subitems do) */}
            <div className="relative group cursor-pointer py-1.5">
              <button 
                type="button"
                className={cn(
                  "font-bold tracking-wider text-nav-text group-hover:text-text-accent transition-all duration-500 uppercase flex items-center gap-1 cursor-pointer bg-transparent border-none p-0 outline-none",
                  effectiveScrolled ? "text-[0.68rem] md:text-[0.7rem] xl:text-[0.78rem]" : "text-[0.72rem] md:text-[0.76rem] xl:text-[0.82rem]",
                  location.pathname.startsWith('/servicos') && "text-text-accent"
                )}
              >
                <span>Serviços</span>
                <ChevronDown size={effectiveScrolled ? 13 : 15} className="transition-transform duration-300 group-hover:rotate-180" />
              </button>
              
              {/* Dropdown Menu with padding bridge to prevent accidental closure */}
              <div className="absolute top-full left-0 pt-2 w-52 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-[10000]">
                <div className="bg-nav-bg border border-surface-border rounded-none shadow-xl flex flex-col py-2">
                  <a href="/servicos?categoria=masculino" className="px-4 py-2.5 text-[0.8rem] font-bold text-nav-text hover:bg-black/5 hover:text-text-accent uppercase tracking-wider transition-colors">Masculino</a>
                  <a href="/servicos?categoria=feminino" className="px-4 py-2.5 text-[0.8rem] font-bold text-nav-text hover:bg-black/5 hover:text-text-accent uppercase tracking-wider transition-colors">Femininos</a>
                  <a href="/servicos?categoria=tattoo" className="px-4 py-2.5 text-[0.8rem] font-bold text-nav-text hover:bg-black/5 hover:text-text-accent uppercase tracking-wider transition-colors">Tattoos</a>
                  <a href="/servicos" className="px-4 py-2.5 text-[0.8rem] font-black text-text-accent hover:bg-black/5 uppercase tracking-wider border-t border-black/10 transition-colors">Todos os serviços</a>
                </div>
              </div>
            </div>

            <a 
              href="/tattoo" 
              className={cn(
                "font-bold tracking-wider text-nav-text hover:text-text-accent transition-all duration-500 uppercase",
                effectiveScrolled ? "text-[0.68rem] md:text-[0.7rem] xl:text-[0.78rem]" : "text-[0.72rem] md:text-[0.76rem] xl:text-[0.82rem]",
                isTattooPage && "text-text-accent"
              )}
            >
              Tattoos
            </a>

            <button
              onClick={() => setIsContactModalOpen(true)}
              className={cn(
                "font-bold tracking-wider text-nav-text hover:text-text-accent transition-all duration-500 uppercase cursor-pointer",
                effectiveScrolled ? "text-[0.68rem] md:text-[0.7rem] xl:text-[0.78rem]" : "text-[0.72rem] md:text-[0.76rem] xl:text-[0.82rem]"
              )}
            >
              Contato
            </button>

            {/* USER ACCOUNT CHIP / LOGIN TRIGGER */}
            {isAuthenticated && user ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                  className="flex items-center gap-2 px-2.5 py-1 bg-[#5E308A]/10 border border-[#5E308A]/30 text-[#5E308A] hover:bg-[#5E308A]/20 transition-all font-extrabold text-[0.7rem] uppercase tracking-wider cursor-pointer"
                >
                  {user.avatarUrl ? (
                    <img src={user.avatarUrl} alt={user.name} className="w-4 h-4 rounded-full object-cover" />
                  ) : (
                    <UserIcon size={13} />
                  )}
                  <span>{user.name.split(' ')[0]}</span>
                  <ChevronDown size={12} />
                </button>

                {isUserDropdownOpen && (
                  <div className="absolute right-0 top-full mt-2 w-48 bg-[#0F0F12] border border-[#F2EAD9]/20 shadow-2xl flex flex-col py-2 z-[10000] text-[#F2EAD9]">
                    <div className="px-4 py-2 border-b border-[#F2EAD9]/10">
                      <p className="text-[11px] font-bold uppercase truncate">{user.name} {user.surname}</p>
                      <p className="text-[9px] text-[#F2EAD9]/50 truncate">{user.email}</p>
                    </div>
                    <button
                      onClick={() => {
                        setIsUserDropdownOpen(false);
                        window.dispatchEvent(new CustomEvent('open-manage-modal'));
                      }}
                      className="px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-left hover:bg-white/10 flex items-center gap-2 cursor-pointer"
                    >
                      <Calendar size={14} className="text-[#5E308A]" />
                      <span>Meus Agendamentos</span>
                    </button>
                    <button
                      onClick={() => {
                        setIsUserDropdownOpen(false);
                        logout();
                      }}
                      className="px-4 py-2 text-xs font-bold uppercase tracking-wider text-left hover:bg-red-500/20 text-red-400 flex items-center gap-2 cursor-pointer border-t border-[#F2EAD9]/10"
                    >
                      <LogOut size={14} />
                      <span>Sair da Conta</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => setIsAuthModalOpen(true)}
                className={cn(
                  "font-bold tracking-wider text-[#0B0908]/75 hover:text-[#5E308A] hover:bg-[#5E308A]/10 px-2.5 py-1 border border-[#0B0908]/15 hover:border-[#5E308A]/30 rounded-none transition-all duration-300 uppercase cursor-pointer whitespace-nowrap flex items-center gap-1.5",
                  effectiveScrolled ? "text-[0.66rem] md:text-[0.68rem] xl:text-[0.74rem]" : "text-[0.7rem] md:text-[0.74rem] xl:text-[0.78rem]"
                )}
              >
                <UserIcon size={13} className="text-[#5E308A]" />
                <span>Minha Conta</span>
              </button>
            )}

            {/* CTA AGENDAR Button on Far Right - Prominent Primary Action */}
            <button
              onClick={() => window.dispatchEvent(new CustomEvent('open-booking-modal'))}
              className={cn(
                "Btn-purple shrink-0 ml-1 sm:ml-3 whitespace-nowrap cursor-pointer shadow-[0_4px_16px_rgba(94,48,138,0.4)] hover:shadow-[0_6px_25px_rgba(94,48,138,0.65)] hover:scale-[1.02] active:scale-95 transition-all",
                effectiveScrolled ? "!h-8 sm:!h-9 !px-3 sm:!px-4 text-[0.72rem]" : "!h-9 sm:!h-10 !px-4 sm:!px-5 text-[0.76rem] sm:text-[0.8rem]"
              )}
            >
              <Calendar size={effectiveScrolled ? 14 : 16} />
              <span>AGENDAR HORÁRIO</span>
            </button>
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

              {isAuthenticated && user ? (
                <div className="pt-2 border-t border-white/10 space-y-2">
                  <p className="text-xs font-bold text-[#5E308A] uppercase">Logado como: {user.name}</p>
                  <button
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      window.dispatchEvent(new CustomEvent('open-manage-modal'));
                    }}
                    className="text-base font-bold uppercase tracking-wider text-[#F2EAD9] text-left cursor-pointer"
                  >
                    Meus Agendamentos
                  </button>
                  <button
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      logout();
                    }}
                    className="text-sm font-bold uppercase text-red-400 text-left cursor-pointer block"
                  >
                    Sair da Conta
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    setIsAuthModalOpen(true);
                  }}
                  className="text-base font-bold uppercase tracking-wider text-[#5E308A] text-left cursor-pointer"
                >
                  Minha Conta / Entrar
                </button>
              )}

              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  setIsContactModalOpen(true);
                }}
                className="text-base font-bold uppercase tracking-wider text-[#F2EAD9] text-left cursor-pointer"
              >
                Contato
              </button>
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  window.dispatchEvent(new CustomEvent('open-booking-modal'));
                }}
                className="w-full py-3 px-5 bg-[#5E308A] hover:bg-[#6C3DFF] text-[#F2EAD9] font-black text-xs uppercase tracking-widest rounded-none transition-all flex items-center justify-center gap-2 mt-2 shadow-lg cursor-pointer"
              >
                <Calendar size={16} />
                <span>AGENDAR HORÁRIO</span>
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Contact Modal Popup */}
      <ContactModal
        isOpen={isContactModalOpen}
        onClose={() => setIsContactModalOpen(false)}
      />

      {/* Auth Modal Popup */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </>
  );
};
