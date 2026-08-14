import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { MoltenMetal } from './MoltenMetal';

interface MaskedHeadingProps {
  text?: string;
  className?: string;
  height?: string;
}

export const MaskedHeading: React.FC<MaskedHeadingProps> = ({
  text = 'vem pra Hype',
  className = '',
  height = '140px'
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setMousePos({ x, y });
  };

  const handleMouseLeave = () => {
    setMousePos({ x: 0, y: 0 });
  };

  const maskId = 'masked-heading-mask';

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ height }}
      className={`relative w-full overflow-hidden flex items-center justify-center select-none ${className}`}
    >
      {/* Background WebGL Molten Metal Canvas */}
      <div className="absolute inset-0 w-full h-full pointer-events-auto">
        <MoltenMetal
          color1="#5E308A"
          color2="#C084FC"
          color3="#FFFFFF"
          speed={0.4}
          scale={3.5}
          detail={3}
          glow={1.8}
          coreSize={0.12}
          swirl={1.2}
          fold={-0.2}
          blackPoint={0.04}
          brightness={1.35}
          colorMode="molten"
          grain
          grainIntensity={0.04}
          mouseInteraction
          mouseStrength={0.35}
          opacity={1}
        />
      </div>

      {/* SVG Knockout Mask: Text cut-out revealing MoltenMetal */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none z-10"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <mask id={maskId}>
            <rect width="100%" height="100%" fill="white" />
            <text
              x="50%"
              y="53%"
              textAnchor="middle"
              dominantBaseline="middle"
              fill="black"
              style={{
                fontSize: 'clamp(2rem, 5.2vw, 4.4rem)',
                fontFamily: 'Montserrat, sans-serif',
                fontWeight: 950,
                letterSpacing: '-0.02em',
                textTransform: 'uppercase'
              }}
            >
              {text}
            </text>
          </mask>
        </defs>

        <rect
          width="100%"
          height="100%"
          fill="#0B0908"
          mask={`url(#${maskId})`}
        />
      </svg>

      {/* Front Outlined Glow Text with Parallax */}
      <motion.div
        animate={{
          x: mousePos.x * 10,
          y: mousePos.y * 6
        }}
        transition={{ type: 'spring', damping: 20, stiffness: 120 }}
        className="relative z-20 pointer-events-none flex items-center justify-center"
      >
        <span
          className="font-black uppercase tracking-tight text-transparent select-none drop-shadow-[0_0_25px_rgba(192,132,252,0.45)]"
          style={{
            fontSize: 'clamp(2rem, 5.2vw, 4.4rem)',
            fontFamily: 'Montserrat, sans-serif',
            fontWeight: 950,
            letterSpacing: '-0.02em',
            WebkitTextStroke: '1px rgba(242, 234, 217, 0.4)'
          }}
        >
          {text}
        </span>
      </motion.div>

      {/* Subtle Glowing Accent Borders */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#5E308A]/60 to-transparent z-30" />
      <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#5E308A]/60 to-transparent z-30" />
    </div>
  );
};

export default MaskedHeading;
