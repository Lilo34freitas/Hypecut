import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MapPin, Phone, Mail, Clock, Calendar, ArrowRight, ExternalLink, CreditCard } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ContactModal = ({ isOpen, onClose }: ContactModalProps) => {
  const navigate = useNavigate();

  // Close on Escape key press & lock body scroll
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  const handleNavigateServices = () => {
    onClose();
    navigate('/servicos');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          {/* Backdrop Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-md cursor-pointer"
          />

          {/* Modal Container - Navbar Off-White #F2EAD9 Background & 0 Border Radius */}
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative w-full max-w-2xl bg-[#F2EAD9] text-[#0B0908] rounded-none border-2 border-[#5E308A] shadow-2xl z-10 overflow-hidden my-auto"
          >
            {/* Top Purple Accent Line */}
            <div className="w-full h-1.5 bg-[#5E308A]" />

            {/* Modal Header */}
            <div className="p-6 md:p-8 pb-4 flex items-start justify-between border-b border-[#0B0908]/15">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 md:gap-4 pr-4">
                <img 
                  src="/Logo_hypecut_letreiro_2.svg" 
                  alt="HypeCut Logo" 
                  className="h-9 md:h-11 w-auto object-contain shrink-0" 
                />
                <div>
                  <h3 className="text-xl md:text-2xl lg:text-3xl font-black uppercase text-[#0B0908] tracking-tight leading-none">
                    HYPECUT <span className="text-[#5E308A]">BARBER & TATTOO</span>
                  </h3>
                  <p className="text-xs md:text-sm font-semibold text-[#0B0908]/70 mt-1">
                    Estilo, atitude e atendimento de excelência em Itajaí.
                  </p>
                </div>
              </div>

              {/* Close Button */}
              <button
                onClick={onClose}
                className="p-2 bg-[#0B0908] hover:bg-[#5E308A] text-[#F2EAD9] transition-colors rounded-none shrink-0 shadow-md cursor-pointer"
                aria-label="Fechar janela"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 md:p-8 space-y-6 max-h-[70vh] overflow-y-auto">
              
              {/* Contact & Location Grid - Equal height & symmetrical alignment */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 items-stretch">
                
                {/* Column 1: Info & Telefone */}
                <div className="bg-[#0B0908]/5 p-4 md:p-5 border border-[#0B0908]/15 flex flex-col justify-between space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-[#5E308A] text-[#F2EAD9] flex items-center justify-center shrink-0 rounded-none shadow-sm mt-0.5">
                      <MapPin size={18} />
                    </div>
                    <div>
                      <strong className="block text-xs font-black uppercase tracking-wider text-[#5E308A]">
                        Endereço
                      </strong>
                      <p className="text-xs md:text-sm font-bold text-[#0B0908]/90 leading-snug mt-0.5">
                        Av. Gov. Adolfo Konder, 1350
                      </p>
                      <p className="text-xs font-semibold text-[#0B0908]/70">
                        Cidade Nova, Itajaí - SC, 88308-002
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-[#5E308A] text-[#F2EAD9] flex items-center justify-center shrink-0 rounded-none shadow-sm mt-0.5">
                      <Phone size={18} />
                    </div>
                    <div>
                      <strong className="block text-xs font-black uppercase tracking-wider text-[#5E308A]">
                        WhatsApp / Telefone
                      </strong>
                      <a
                        href="https://wa.me/5547999595843"
                        target="_blank"
                        rel="noreferrer"
                        className="text-sm md:text-base font-black text-[#0B0908] hover:text-[#5E308A] transition-colors inline-block mt-0.5"
                      >
                        (47) 99959-5843
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-[#5E308A] text-[#F2EAD9] flex items-center justify-center shrink-0 rounded-none shadow-sm mt-0.5">
                      <Mail size={18} />
                    </div>
                    <div>
                      <strong className="block text-xs font-black uppercase tracking-wider text-[#5E308A]">
                        E-mail
                      </strong>
                      <a
                        href="mailto:contato@hypecut.com.br"
                        className="text-xs md:text-sm font-bold text-[#0B0908] hover:text-[#5E308A] transition-colors block mt-0.5"
                      >
                        contato@hypecut.com.br
                      </a>
                    </div>
                  </div>
                </div>

                {/* Column 2: Horários de Atendimento */}
                <div className="bg-[#0B0908]/5 p-4 md:p-5 border border-[#0B0908]/15 flex flex-col justify-between space-y-3">
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <Clock size={16} className="text-[#5E308A]" />
                      <strong className="text-xs font-black uppercase tracking-wider text-[#0B0908]">
                        Horários de Atendimento
                      </strong>
                    </div>

                    <div className="space-y-2 text-xs font-semibold text-[#0B0908]/85">
                      <div className="flex justify-between border-b border-[#0B0908]/10 pb-1.5">
                        <span>Segunda-feira</span>
                        <span className="font-bold text-[#0B0908]">14h às 20h</span>
                      </div>
                      <div className="flex justify-between border-b border-[#0B0908]/10 pb-1.5">
                        <span>Terça a Sexta</span>
                        <span className="font-bold text-[#0B0908]">09h às 21h</span>
                      </div>
                      <div className="flex justify-between border-b border-[#0B0908]/10 pb-1.5">
                        <span>Sábado</span>
                        <span className="font-bold text-[#0B0908]">08h às 17h</span>
                      </div>
                      <div className="flex justify-between pt-0.5">
                        <span>Domingo</span>
                        <span className="font-bold text-[#5E308A]">Fechado</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 flex items-center gap-2 text-[11px] font-bold text-[#0B0908]/70 border-t border-[#0B0908]/10">
                    <CreditCard size={14} className="text-[#5E308A] shrink-0" />
                    <span>Aceitamos Pix, Cartões de Crédito/Débito e Dinheiro</span>
                  </div>
                </div>

              </div>

              {/* GPS Shortcuts */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <a
                  href="https://www.google.com/maps/search/?api=1&query=Av.+Gov.+Adolfo+Konder,+1350+-+Cidade+Nova,+Itaja%C3%AD+-+SC"
                  target="_blank"
                  rel="noreferrer"
                  className="py-2.5 px-3 bg-[#0B0908] hover:bg-[#5E308A] text-[#F2EAD9] font-bold text-[11px] uppercase tracking-wider flex items-center justify-center gap-2 transition-colors rounded-none"
                >
                  <img src="/google-maps.png" alt="Google Maps" className="w-4 h-4 object-contain" />
                  <span>Google Maps</span>
                  <ExternalLink size={12} className="opacity-70" />
                </a>

                <a
                  href="https://waze.com/ul?q=Av.%20Gov.%20Adolfo%20Konder,%201350%20Itajai"
                  target="_blank"
                  rel="noreferrer"
                  className="py-2.5 px-3 bg-[#0B0908] hover:bg-[#5E308A] text-[#F2EAD9] font-bold text-[11px] uppercase tracking-wider flex items-center justify-center gap-2 transition-colors rounded-none"
                >
                  <img src="/waze.png" alt="Waze" className="w-4 h-4 object-contain" />
                  <span>Waze</span>
                  <ExternalLink size={12} className="opacity-70" />
                </a>
              </div>

            </div>

            {/* Modal Footer / CTAs */}
            <div className="p-6 md:p-8 pt-4 bg-[#0B0908]/5 border-t border-[#0B0908]/15 flex flex-col sm:flex-row items-center justify-between gap-3">
              <button
                onClick={handleNavigateServices}
                className="w-full sm:w-auto px-5 py-3 bg-transparent hover:bg-[#0B0908]/10 text-[#0B0908] border border-[#0B0908] font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-colors rounded-none cursor-pointer"
              >
                <span>VER NOSSOS SERVIÇOS</span>
                <ArrowRight size={14} />
              </button>

              <a
                href="https://wa.me/5547999595843?text=Ol%C3%A1!%20Gostaria%20de%20agendar%20um%20hor%C3%A1rio%20na%20HypeCut."
                target="_blank"
                rel="noreferrer"
                className="Btn-purple w-full sm:w-auto font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 cursor-pointer shadow-md"
              >
                <Calendar size={16} />
                <span>AGENDAR PELO WHATSAPP</span>
              </a>
            </div>

          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
