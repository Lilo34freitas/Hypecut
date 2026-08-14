import { motion } from 'framer-motion';

interface HypeMarqueeProps {
  className?: string;
  speed?: number;
}

export const HypeMarquee = ({ className = '', speed = 22 }: HypeMarqueeProps) => {
  // Phrase repeated in solid Navbar Off-White (#F2EAD9) and Navbar Purple (#5E308A)
  const phrase = "VEM PRA HYPE";
  const items = Array.from({ length: 10 });

  return (
    <div className={`relative w-full overflow-hidden py-4 select-none ${className}`}>
      {/* Left Edge Gradient Fade */}
      <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-16 sm:w-24 md:w-32 bg-gradient-to-r from-[#0B0908] via-[#0B0908]/90 to-transparent z-20" />

      {/* Right Edge Gradient Fade */}
      <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-16 sm:w-24 md:w-32 bg-gradient-to-l from-[#0B0908] via-[#0B0908]/90 to-transparent z-20" />

      {/* Infinite Seamless Scrolling Track to the Left */}
      <div className="flex w-max">
        <motion.div
          animate={{ x: ['0%', '-50%'] }}
          transition={{
            ease: 'linear',
            duration: speed,
            repeat: Infinity,
          }}
          className="flex items-center gap-8 sm:gap-12 whitespace-nowrap will-change-transform"
        >
          {items.map((_, i) => (
            <div key={i} className="flex items-center gap-8 sm:gap-12">
              {/* Solid Navbar White (#F2EAD9) */}
              <span className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black uppercase text-[#F2EAD9] tracking-tight">
                {phrase}
              </span>

              <span className="text-xl sm:text-2xl text-[#5E308A] font-black">
                •
              </span>

              {/* Solid Navbar Purple (#5E308A) */}
              <span className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black uppercase text-[#5E308A] tracking-tight">
                {phrase}
              </span>

              <span className="text-xl sm:text-2xl text-[#F2EAD9]/50 font-black">
                •
              </span>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default HypeMarquee;
