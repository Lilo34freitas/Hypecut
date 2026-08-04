import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface WhatsAppWidgetProps {
  phoneNumber?: string;
  defaultMessage?: string;
  phrases?: string[];
}

export const WhatsAppWidget = ({
  phoneNumber = '5547999995843',
  defaultMessage = 'Olá! Vim pelo site e gostaria de tirar uma dúvida.',
  phrases = [
    'Estamos online! Tire suas dúvidas',
    'Dúvidas? Fale conosco!',
    'Quer agendar? Chama no Zap!',
  ],
}: WhatsAppWidgetProps) => {
  const [isVisible, setIsVisible] = useState(true);
  const [isPastHero, setIsPastHero] = useState(false);
  const [displayText, setDisplayText] = useState('');
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [typingSpeed, setTypingSpeed] = useState(100);

  // Scroll listener to detect when user scrolls past Hero section
  useEffect(() => {
    const handleScroll = () => {
      const heroThreshold = Math.min(window.innerHeight * 0.55, 450);
      setIsPastHero(window.scrollY > heroThreshold);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Typewriter effect logic matching the exact behavior on orestescabeleireiro.com.br
  useEffect(() => {
    if (!isVisible || !isPastHero) return;

    const currentPhrase = phrases[phraseIndex % phrases.length];

    const timer = setTimeout(() => {
      if (!isDeleting) {
        // Typing characters
        setDisplayText(currentPhrase.substring(0, displayText.length + 1));
        setTypingSpeed(75 + Math.random() * 35); // Natural human typing speed

        // Finished typing current phrase
        if (displayText === currentPhrase) {
          // Pause before deleting
          setTypingSpeed(2500);
          setIsDeleting(true);
        }
      } else {
        // Deleting characters
        setDisplayText(currentPhrase.substring(0, displayText.length - 1));
        setTypingSpeed(35);

        // Finished deleting current phrase
        if (displayText === '') {
          setIsDeleting(false);
          setPhraseIndex((prev) => prev + 1);
          setTypingSpeed(300);
        }
      }
    }, typingSpeed);

    return () => clearTimeout(timer);
  }, [displayText, isDeleting, phraseIndex, phrases, typingSpeed, isVisible, isPastHero]);

  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(defaultMessage)}`;
  const showBubble = isVisible && isPastHero;

  return (
    <div className="fixed bottom-4 right-4 xs:bottom-5 xs:right-5 sm:bottom-8 sm:right-8 md:bottom-10 md:right-10 z-[9999] flex flex-col items-end pointer-events-none select-none">
      {/* Interactive Tooltip Card / Bubble (Appears ONLY after Hero Section) */}
      <AnimatePresence>
        {showBubble && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.85 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 15, scale: 0.85 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="pointer-events-auto relative mb-3 w-[230px] xs:w-[270px] sm:w-[320px] bg-[#F2EAD9] text-[#0B0908] rounded-2xl shadow-[0_16px_40px_rgba(0,0,0,0.45)] border border-[#0B0908]/15 p-3 sm:p-4 flex flex-col cursor-pointer transition-all hover:shadow-[0_20px_50px_rgba(0,0,0,0.55)] group"
            onClick={() => window.open(whatsappUrl, '_blank', 'noopener,noreferrer')}
          >
            {/* Pointer Arrow / Speech Bubble Tail (Navbar Color) */}
            <div className="absolute -bottom-2 right-6 sm:right-8 w-3.5 h-3.5 bg-[#F2EAD9] rotate-45 border-r border-b border-[#0B0908]/15 pointer-events-none" />

            {/* Header: Live Status Dot + Text + Close Button */}
            <div className="flex items-center justify-between gap-2 pb-1.5 border-b border-[#0B0908]/10">
              <div className="flex items-center gap-2">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00D757] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#00D757]"></span>
                </span>
                <span className="text-[10px] sm:text-xs font-black tracking-wider text-[#00A843] uppercase">
                  ONLINE AGORA
                </span>
              </div>

              {/* Close Button */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsVisible(false);
                }}
                className="p-1 -mr-1 rounded-full text-[#0B0908]/50 hover:text-[#0B0908] hover:bg-[#0B0908]/10 transition-colors"
                title="Fechar dica"
                aria-label="Fechar"
              >
                <X className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </button>
            </div>

            {/* Body: Animated Typewriter Message */}
            <div className="mt-2 text-xs sm:text-[15px] font-bold text-[#0B0908] leading-snug min-h-[38px] sm:min-h-[44px] flex items-center pr-1">
              <span>{displayText}</span>
              <span className="inline-block w-[2.5px] h-[15px] sm:h-[17px] bg-[#00D757] ml-0.5 animate-pulse" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main WhatsApp Green Floating Button (Responsive sizing for small mobile screens like iPhone SE) */}
      <div className="relative pointer-events-auto">
        {/* Pulsing Outer Glow / Ripple Effect */}
        <span className="absolute -inset-1.5 rounded-full bg-[#00D757] opacity-45 animate-ping pointer-events-none" />

        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Falar pelo WhatsApp"
          className="relative flex items-center justify-center w-12 h-12 xs:w-14 xs:h-14 sm:w-16 sm:h-16 bg-[#00D757] hover:bg-[#00C24E] text-white rounded-full shadow-[0_8px_24px_rgba(0,215,87,0.5)] transition-all duration-300 hover:scale-110 active:scale-95 group focus:outline-none focus:ring-4 focus:ring-[#00D757]/40"
        >
          {/* Custom SVG WhatsApp Chat Bubble Icon */}
          <svg
            className="w-6 h-6 xs:w-7 xs:h-7 sm:w-8 sm:h-8 fill-current transition-transform duration-300 group-hover:scale-105"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
          </svg>
        </a>
      </div>
    </div>
  );
};
