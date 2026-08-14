import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/sections/Footer';
import { ArrowRight, MessageSquare, Clock, Play, User, ChevronLeft, ChevronRight, ChevronDown, ChevronUp, X } from 'lucide-react';
import { CursorGrid } from '../components/ui/CursorGrid';
import { BlurText } from '../components/ui/BlurText';

interface FlashTattoo {
  id: number;
  title: string;
  artist: 'BRUNO' | 'MATHEUS';
  category: 'lettering' | 'blackgrey' | 'darkpop';
  categoryLabel: string;
  abrange: string;
  caracteristicas: string;
  timeEstimate: string;
  tag: string;
  mediaType: 'image' | 'video';
  mediaUrl: string;
}

interface TattooArtist {
  id: number;
  name: string;
  role: string;
  specialties: string;
  description: string;
  image: string;
  imagePosition?: string;
  whatsappUrl: string;
}

const tattooArtists: TattooArtist[] = [
  {
    id: 1,
    name: 'BRUNO',
    role: 'ARTISTA & TATUADOR',
    specialties: 'LETTERING • DARK ART • FREEHAND',
    description: 'Especialista em Lettering urbano, Calligraffiti e Dark Art com traços marcantes, composição anatômica e projetos 100% autorais desenvolvidos sob medida.',
    image: '/bruno.png',
    imagePosition: 'object-center',
    whatsappUrl: 'https://wa.me/5547999595843?text=Ol%C3%A1!%20Gostaria%20de%20fazer%20um%20or%C3%A7amento%20de%20tattoo%20com%20o%20Bruno.',
  },
  {
    id: 2,
    name: 'MATHEUS',
    role: 'ARTISTA & TATUADOR',
    specialties: 'REALISMO • PRETO E CINZA • FINE LINE',
    description: 'Especialista em Preto e Cinza realista, retratismo, arquitetura e Fine Line com transições de sombra ultra suaves, profundidade e alto contraste.',
    image: '/matheus.png',
    imagePosition: 'object-top',
    whatsappUrl: 'https://wa.me/5547999595843?text=Ol%C3%A1!%20Gostaria%20de%20fazer%20um%20or%C3%A7amento%20de%20tattoo%20com%20o%20Matheus.',
  },
];

const flashCatalog: FlashTattoo[] = [
  // BRUNO WORKS (All 100% Actual Tattoo Works)
  {
    id: 1,
    title: 'Lettering Chicano & Fontes em Bloco 3D',
    artist: 'BRUNO',
    category: 'lettering',
    categoryLabel: 'Lettering / Caligrafia Urbana',
    abrange: 'Chicano, Calligraffiti e fontes góticas customizadas.',
    caracteristicas: 'Letras em bloco, curvas ornamentadas, efeito 3D com sombras projetadas e encaixe anatômico perfeito.',
    timeEstimate: '3h - 5h',
    tag: 'CHICANO WEST COAST',
    mediaType: 'video',
    mediaUrl: '/tattoos/SaveClip.App_AQOwcbPT3NPQi8kjmFVYprdJlrRMdqePsrGEwktc87Hqcmu120sO02pvk_Zhjl9AIHCuiOeHFKwo1GKDwhEK3wznmsP_gb1Ty4wUnms.mp4',
  },
  {
    id: 2,
    title: 'Gótico & Calligraffiti com Traços Geométricos',
    artist: 'BRUNO',
    category: 'lettering',
    categoryLabel: 'Lettering / Caligrafia Urbana',
    abrange: 'Chicano, Calligraffiti e fontes góticas customizadas.',
    caracteristicas: 'Traços retos, pesados e ornamentos fluidos acompanhando a anatomia corporal.',
    timeEstimate: '2h - 4h',
    tag: 'CALLIGRAFFITI GÓTICO',
    mediaType: 'image',
    mediaUrl: '/tattoos/SaveClip.App_673036502_18467470579099364_3304125423509251625_n.jpg',
  },
  {
    id: 3,
    title: 'Freira Surrealista & Dark Art',
    artist: 'BRUNO',
    category: 'darkpop',
    categoryLabel: 'Dark Art & Cultura Pop',
    abrange: 'Estética sombria e surrealismo sombrio.',
    caracteristicas: 'Elementos do underground, contornos marcados e sombras densas marcantes.',
    timeEstimate: '4h - 6h',
    tag: 'DARK ART SURREAL',
    mediaType: 'image',
    mediaUrl: '/tattoos/SaveClip.App_488768108_18405512761099364_224217219942315869_n.jpg',
  },
  {
    id: 4,
    title: 'Dark Art Sombria & Ilustração Underground',
    artist: 'BRUNO',
    category: 'darkpop',
    categoryLabel: 'Dark Art & Cultura Pop',
    abrange: 'Ilustração dark, crânios e simbolismos mistos.',
    caracteristicas: 'Composição gráfica em alto contraste com sombreamento rústico e estilo autoral.',
    timeEstimate: '3h - 5h',
    tag: 'DARK ART',
    mediaType: 'image',
    mediaUrl: '/tattoos/SaveClip.App_488834598_18405512821099364_3186619251666135512_n.jpg',
  },
  {
    id: 5,
    title: 'Sessão Lettering Freehand em Vídeo',
    artist: 'BRUNO',
    category: 'lettering',
    categoryLabel: 'Lettering / Caligrafia Urbana',
    abrange: 'Processo completo de desenvolvimento em pele.',
    caracteristicas: 'Demonstração de precisão na aplicação do traço e pigmentação escura.',
    timeEstimate: '3h - 5h',
    tag: 'PROCESSO EM VÍDEO',
    mediaType: 'video',
    mediaUrl: '/tattoos/SaveClip.App_AQO6H2V424-U9ro0pssCpOw9Md2waGHfjySQWN9ELr0TZU4UtLKXftyJu7BpP9U5A-ykLeq6AUCjvxCBhrHG8tlYHjVGpNBvFnlwtEA.mp4',
  },
  {
    id: 6,
    title: 'Cultura Pop Urbana & Referências Anime',
    artist: 'BRUNO',
    category: 'darkpop',
    categoryLabel: 'Dark Art & Cultura Pop',
    abrange: 'Referências de anime, streetwear e cultura urbana.',
    caracteristicas: 'Traço limpo misturando referências de cultura pop com sombras e hachuras.',
    timeEstimate: '3h - 5h',
    tag: 'ANIME & POP',
    mediaType: 'image',
    mediaUrl: '/tattoos/SaveClip.App_499241456_18410833714099364_7747679165738643204_n.jpg',
  },
  {
    id: 7,
    title: 'Cultura Hip-Hop & Máscara MF DOOM',
    artist: 'BRUNO',
    category: 'darkpop',
    categoryLabel: 'Dark Art & Cultura Pop',
    abrange: 'Ícones da cultura hip-hop e música underground.',
    caracteristicas: 'Linework bem definido com sombreamento limpo e alto contraste.',
    timeEstimate: '3h - 5h',
    tag: 'MF DOOM / HIP-HOP',
    mediaType: 'video',
    mediaUrl: '/tattoos/SaveClip.App_AQOQG_R9G-aLtiDvZMzXtQ35EEhjWUZSc5Y0jwTAPfBWXWRQ9JEnoIHxOD8zcXTnVZcTUksYl-Lci2vRFeZ1iWdd3SvAgRhf8MibQh4.mp4',
  },
  {
    id: 8,
    title: 'Pop Culture Urbana & Linework Definido',
    artist: 'BRUNO',
    category: 'darkpop',
    categoryLabel: 'Dark Art & Cultura Pop',
    abrange: 'Estética urbana e linework contínuo.',
    caracteristicas: 'Traços contínuos precisos com sombreamento limpo e elementos urbanos.',
    timeEstimate: '3h - 4h',
    tag: 'URBAN POP ART',
    mediaType: 'image',
    mediaUrl: '/tattoos/SaveClip.App_496856627_18409642369099364_2460761979064904008_n.jpg',
  },
  {
    id: 9,
    title: 'Sessão Dark Art & Cultura Pop em Vídeo',
    artist: 'BRUNO',
    category: 'darkpop',
    categoryLabel: 'Dark Art & Cultura Pop',
    abrange: 'Tatuagem em andamento com técnica mista.',
    caracteristicas: 'Contraste denso e aplicação contínua de agulha de sombreamento.',
    timeEstimate: '4h - 6h',
    tag: 'PROCESSO EM VÍDEO',
    mediaType: 'video',
    mediaUrl: '/tattoos/SaveClip.App_AQMKrCTzijQwvIlRQa0LYxPdHd5L3XcT8G2ypIwdhurJ234O8Wkkr5-BP_DqqAaMB8CDLw5gce04-wGKvT__TVl2n-GfZ4X7w2zTGEA.mp4',
  },

  // MATHEUS WORKS
  {
    id: 10,
    title: 'Preto e Cinza com Sombreamento Suave',
    artist: 'MATHEUS',
    category: 'blackgrey',
    categoryLabel: 'Preto e Cinza Realista (Black & Grey)',
    abrange: 'Retratos, ícones e composições de cena.',
    caracteristicas: 'Trabalho focado em transições suaves de sombras, profundidade e alto contraste.',
    timeEstimate: '4h - 6h',
    tag: 'BLACK & GREY',
    mediaType: 'video',
    mediaUrl: '/tattoos/SaveClip.App_AQPDC8iejkPV-YkYNRwHl9CZjJsHW7YehuPzMqwu1V_40iG8fjyTZtOnEdM_Pcnhq5YPMslXSfl0_t3uTjWdp0JHzkVdbs-O3w2EU8w.mp4',
  },
  {
    id: 11,
    title: 'Retrato Realista Geisha & Textura de Pele',
    artist: 'MATHEUS',
    category: 'blackgrey',
    categoryLabel: 'Preto e Cinza Realista (Black & Grey)',
    abrange: 'Retratos e figuras com texturas minuciosas.',
    caracteristicas: 'Renderização realista de rostos, sombras suaves e detalhes minuciosos.',
    timeEstimate: '5h - 7h',
    tag: 'RETRATISMO REALISTA',
    mediaType: 'image',
    mediaUrl: '/tattoos/SaveClip.App_704839581_18472608043099364_5670568029484276502_n.jpg',
  },
  {
    id: 12,
    title: 'Arquitetura Gótica, Faróis & Bússolas',
    artist: 'MATHEUS',
    category: 'blackgrey',
    categoryLabel: 'Preto e Cinza Realista (Black & Grey)',
    abrange: 'Composições de cena, arquitetura e ícones.',
    caracteristicas: 'Composição detalhada com castelos góticos, faróis e elementos anatômicos.',
    timeEstimate: '4h - 6h',
    tag: 'ARQUITETURA & ÍCONES',
    mediaType: 'image',
    mediaUrl: '/tattoos/SaveClip.App_670652850_18466746298099364_8986252105308367098_n.jpg',
  },
  {
    id: 13,
    title: 'Leão Realista & Sombreamento de Alto Contraste',
    artist: 'MATHEUS',
    category: 'blackgrey',
    categoryLabel: 'Preto e Cinza Realista (Black & Grey)',
    abrange: 'Realismo animal e retratismo de vida selvagem.',
    caracteristicas: 'Textura realista de pelagem, iluminação dramática e alto contraste de pretos.',
    timeEstimate: '4h - 7h',
    tag: 'REALISMO ANIMAL',
    mediaType: 'image',
    mediaUrl: '/tattoos/SaveClip.App_479477019_18395956357099364_4861996376889164369_n.jpg',
  },
  {
    id: 14,
    title: 'Fine Line & Geometria Delicada',
    artist: 'MATHEUS',
    category: 'blackgrey',
    categoryLabel: 'Preto e Cinza Realista (Black & Grey)',
    abrange: 'Traços finos, micro-realismo e elementos geométricos.',
    caracteristicas: 'Precisão em linhas finas, acabamento delicado e sombreamento pontilhado.',
    timeEstimate: '2h - 4h',
    tag: 'FINE LINE',
    mediaType: 'image',
    mediaUrl: '/tattoos/SaveClip.App_520404921_18419015125099364_1101570493192456206_n.jpg',
  },
  {
    id: 15,
    title: 'Sombreamento Anatômico & Preto e Cinza',
    artist: 'MATHEUS',
    category: 'blackgrey',
    categoryLabel: 'Preto e Cinza Realista (Black & Grey)',
    abrange: 'Encaixe anatômico e sombreamento contínuo em braço.',
    caracteristicas: 'Gradientes de cinza suaves que acompanham a musculatura do corpo.',
    timeEstimate: '4h - 6h',
    tag: 'PRETO & CINZA ANATÔMICO',
    mediaType: 'image',
    mediaUrl: '/tattoos/SaveClip.App_670154034_18466183363099364_1075662602550053393_n.jpg',
  },
  {
    id: 16,
    title: 'Projeto Realista Autoral de Alto Impacto',
    artist: 'MATHEUS',
    category: 'blackgrey',
    categoryLabel: 'Preto e Cinza Realista (Black & Grey)',
    abrange: 'Composição surrealista em preto e cinza.',
    caracteristicas: 'Contraste elevado com realismo fotográfico e iluminação direcional.',
    timeEstimate: '5h - 7h',
    tag: 'REALISMO AUTORAL',
    mediaType: 'image',
    mediaUrl: '/tattoos/SaveClip.App_670410471_18465989605099364_5293589269951694255_n.jpg',
  },
  {
    id: 17,
    title: 'Fechamento de Braço Realista em Camadas',
    artist: 'MATHEUS',
    category: 'blackgrey',
    categoryLabel: 'Preto e Cinza Realista (Black & Grey)',
    abrange: 'Fechamentos completos de braço e perna.',
    caracteristicas: 'Transições perfeitas entre os elementos com sombras profundas e brilho.',
    timeEstimate: '6h - 8h',
    tag: 'FECHAMENTO REALISTA',
    mediaType: 'image',
    mediaUrl: '/tattoos/SaveClip.App_703147054_18472608016099364_7274394117461345494_n.jpg',
  },
  {
    id: 18,
    title: 'Composição Preto & Cinza de Alta Precisão',
    artist: 'MATHEUS',
    category: 'blackgrey',
    categoryLabel: 'Preto e Cinza Realista (Black & Grey)',
    abrange: 'Detalhes em micro-realismo e texturas tridimensionais.',
    caracteristicas: 'Pigmentação homogênea com transições ultra limpas.',
    timeEstimate: '4h - 6h',
    tag: 'PRETO & CINZA VIP',
    mediaType: 'image',
    mediaUrl: '/tattoos/SaveClip.App_703147054_18472608070099364_8334995600074187478_n.jpg',
  },
  {
    id: 19,
    title: 'Sessão Preto e Cinza em Vídeo',
    artist: 'MATHEUS',
    category: 'blackgrey',
    categoryLabel: 'Preto e Cinza Realista (Black & Grey)',
    abrange: 'Gravação em tempo real da aplicação do pigmento.',
    caracteristicas: 'Técnica de agulha magnética com agulhas ANVISA e biossegurança.',
    timeEstimate: '4h - 6h',
    tag: 'PROCESSO EM VÍDEO',
    mediaType: 'video',
    mediaUrl: '/tattoos/SaveClip.App_AQM7GS3QpwOZsFBtJzjwu8bF1O8SS-46Fi1ZliZBX-J3dCS8QtJ2YQzNbfAROMAS0J3CVDsItRAEqnAwE3QoWIJ9Jhtuqlgu-gu70sw.mp4',
  },
  {
    id: 20,
    title: 'Aplicação de Pigmentos Realista em Vídeo',
    artist: 'MATHEUS',
    category: 'blackgrey',
    categoryLabel: 'Preto e Cinza Realista (Black & Grey)',
    abrange: 'Detalhes de sombreamento suave em vídeo.',
    caracteristicas: 'Transições suaves de tom de pele para sombra escura.',
    timeEstimate: '4h - 6h',
    tag: 'PROCESSO EM VÍDEO',
    mediaType: 'video',
    mediaUrl: '/tattoos/SaveClip.App_AQPrQTAw-loKBmuQB3XtwfVHkJqdcGc7OZRw-mKBqejTl5Q1TDo51p-M9mJdHOXrHvEHBGf2-Y57OfNKADlhd-Gx-6HniLttFinhMLY.mp4',
  },
];

// Interactive Horizontal Carousel Component for Artist Works
const ArtistCarousel = ({
  artistName,
  items,
  onSelectTattoo,
}: {
  artistName: string;
  items: FlashTattoo[];
  onSelectTattoo: (item: FlashTattoo) => void;
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  // Smooth animated scroll function using cubic ease-out
  const smoothScroll = (direction: 'left' | 'right') => {
    if (!scrollRef.current) return;
    const container = scrollRef.current;
    const scrollAmount = direction === 'left' ? -290 : 290;
    const targetScroll = container.scrollLeft + scrollAmount;

    const start = container.scrollLeft;
    const change = targetScroll - start;
    const startTime = performance.now();
    const duration = 450;

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      container.scrollLeft = start + change * ease;

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  };

  return (
    <div className="h-full flex flex-col justify-between bg-black/80 border border-white/15 p-5 md:p-6 rounded-none shadow-2xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 shrink-0">
        <div>
          <span className="text-[10px] font-black uppercase tracking-widest text-[#5E308A] block mb-0.5">
            PORTFÓLIO EXCLUSIVO EM CARROSSEL
          </span>
          <h4 className="text-lg md:text-xl font-black uppercase text-[#F2EAD9] tracking-tight">
            GALERIA DE TRABALHOS DE <span className="text-[#5E308A]">{artistName}</span> ({items.length} PROJETOS)
          </h4>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
          <motion.button
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.92 }}
            onClick={() => smoothScroll('left')}
            className="w-9 h-9 bg-black border border-white/20 hover:border-[#5E308A] hover:bg-[#5E308A] text-[#F2EAD9] flex items-center justify-center transition-colors rounded-none cursor-pointer shadow-md"
            aria-label="Anterior"
          >
            <ChevronLeft size={18} />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.92 }}
            onClick={() => smoothScroll('right')}
            className="w-9 h-9 bg-black border border-white/20 hover:border-[#5E308A] hover:bg-[#5E308A] text-[#F2EAD9] flex items-center justify-center transition-colors rounded-none cursor-pointer shadow-md"
            aria-label="Próximo"
          >
            <ChevronRight size={18} />
          </motion.button>
        </div>
      </div>

      {/* Smooth Scroll Container */}
      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto scrollbar-none py-1 px-1 select-none items-stretch"
      >
        {items.map((item) => (
          <div
            key={item.id}
            onClick={() => onSelectTattoo(item)}
            className="flex-shrink-0 w-[260px] sm:w-[280px] h-[300px] bg-black border border-white/15 hover:border-[#5E308A] rounded-none overflow-hidden transition-all duration-300 group flex flex-col justify-between shadow-xl cursor-pointer"
          >
            {/* Media Box */}
            <div className="w-full h-44 relative bg-black overflow-hidden shrink-0">
              {item.mediaType === 'video' ? (
                <div className="w-full h-full relative">
                  <video
                    src={item.mediaUrl}
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
                  />
                  <div className="absolute top-2.5 right-2.5 bg-[#5E308A] text-[#F2EAD9] px-2 py-0.5 text-[9px] font-black uppercase flex items-center gap-1 shadow-md z-10">
                    <Play size={9} fill="#F2EAD9" />
                    <span>VÍDEO REAL</span>
                  </div>
                </div>
              ) : (
                <img
                  src={item.mediaUrl}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />
            </div>

            {/* Content Details */}
            <div className="p-3.5 flex-1 flex flex-col justify-between space-y-2">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 bg-[#5E308A]/20 text-[#5E308A] border border-[#5E308A]/40 rounded-none inline-block">
                    {item.tag}
                  </span>
                  <span className="text-[9px] font-bold text-[#F2EAD9]/60 uppercase">
                    {item.timeEstimate}
                  </span>
                </div>
                <h5 className="text-xs font-black uppercase text-[#F2EAD9] tracking-tight group-hover:text-[#5E308A] transition-colors leading-snug line-clamp-2 min-h-[2.25rem]">
                  {item.title}
                </h5>
              </div>

              <div className="pt-2 border-t border-white/10 flex items-center justify-between shrink-0">
                <span className="text-[9px] font-bold text-[#F2EAD9]/50">POR {item.artist}</span>
                <span className="text-[9px] font-bold text-[#5E308A] uppercase tracking-wider">VER DETALHES +</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export const TattooPage = () => {
  const [isGalleryExpanded, setIsGalleryExpanded] = useState(false);
  const [selectedTattoo, setSelectedTattoo] = useState<FlashTattoo | null>(null);
  const galeriaRef = useRef<HTMLDivElement>(null);

  // Close modal on Escape key press & lock body scroll
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelectedTattoo(null);
    };

    if (selectedTattoo) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedTattoo]);

  const brunoItems = flashCatalog.filter((item) => item.artist === 'BRUNO');
  const matheusItems = flashCatalog.filter((item) => item.artist === 'MATHEUS');

  const toggleGallery = () => {
    if (!isGalleryExpanded) {
      setIsGalleryExpanded(true);
    } else {
      setIsGalleryExpanded(false);
      // Smoothly scroll to gallery section header
      if (galeriaRef.current) {
        const yOffset = -120;
        const y = galeriaRef.current.getBoundingClientRect().top + window.pageYOffset + yOffset;
        window.scrollTo({ top: Math.max(0, y), behavior: 'smooth' });
      }
    }
  };

  const getWhatsAppLink = (tattooTitle?: string, artistName?: string) => {
    const text = tattooTitle 
      ? `Olá! Gostaria de fazer um orçamento para a tattoo: "${tattooTitle}"${artistName ? ` com o tatuador ${artistName}` : ''} no estúdio HypeCut.`
      : `Olá! Quero fazer um orçamento para uma tattoo exclusiva no estúdio HypeCut.`;
    return `https://wa.me/5547999595843?text=${encodeURIComponent(text)}`;
  };

  return (
    <div className="bg-[#0B0908] min-h-screen text-[#F2EAD9] selection:bg-[#5E308A] selection:text-[#F2EAD9] relative">
      <Navbar />

      {/* Main Content Container */}
      <main className="w-full pt-52 md:pt-64 pb-16 px-6 md:px-12 lg:px-16 max-w-[1700px] mx-auto">
        
        {/* Page Header Hero */}
        <div className="mb-16 border-b border-white/10 pb-12">
          <h1 className="text-7xl sm:text-8xl md:text-9xl lg:text-[10rem] font-black uppercase text-[#F2EAD9] tracking-tight leading-none mb-6">
            <BlurText text="TATTOO" delay={90} animateBy="letters" direction="top" />
          </h1>

          <p className="text-[#F2EAD9]/80 text-sm md:text-base font-bold uppercase tracking-wider max-w-3xl leading-relaxed">
            Arte autoral na pele com a maior biossegurança de Itajaí. Agulhas 100% descartáveis, pigmentos de alta qualidade regulamentados pela ANVISA e ambiente climatizado.
          </p>
        </div>

        {/* Biosafety Guarantee Banner */}
        <div className="bg-black border-2 border-[#5E308A] p-8 md:p-10 rounded-none mb-20 shadow-2xl flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
          <div>
            <span className="text-xs font-black uppercase tracking-widest text-[#5E308A] block mb-1">
              PADRÃO HOSPITALAR DE HIGIENE
            </span>
            <h3 className="text-2xl md:text-3xl font-black uppercase text-[#F2EAD9] tracking-tight mb-2">
              100% MATERIAIS DESCARTÁVEIS & BIOSSEGURANÇA CERTIFICADA
            </h3>
            <p className="text-xs md:text-sm text-[#F2EAD9]/80 font-medium max-w-3xl">
              Seguimos rigorosamente os protocolos de assepsia e esterilização da ANVISA. Cada agulha, biqueira e película protetora é descartada imediatamente após o uso.
            </p>
          </div>

          <a
            href={getWhatsAppLink()}
            target="_blank"
            rel="noreferrer"
            className="Btn-purple w-full lg:w-auto font-black text-xs md:text-sm uppercase tracking-widest shrink-0 cursor-pointer shadow-xl"
          >
            <span>SOLICITAR ORÇAMENTO VIA WHATSAPP</span>
            <MessageSquare size={18} />
          </a>
        </div>

        {/* SECTION 1: Equipe de Tatuadores */}
        <div className="mb-20 pt-4">
          <div className="mb-12">
            <span className="text-xs font-bold text-[#5E308A] uppercase tracking-widest block mb-1">
              ARTISTAS EXCLUSIVOS HYPECUT
            </span>
            <h2 className="text-3xl md:text-5xl lg:text-6xl font-black uppercase text-[#F2EAD9] tracking-tight">
              NOSSA EQUIPE DE TATUADORES
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10">
            {tattooArtists.map((artist) => (
              <motion.div
                key={artist.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4 }}
                className="bg-black border-2 border-white/10 hover:border-[#5E308A] rounded-none shadow-2xl overflow-hidden flex flex-col md:flex-row group transition-all duration-300"
              >
                {/* Artist Image Container */}
                <div className="md:w-5/12 h-64 md:h-80 relative overflow-hidden bg-[#18181b] shrink-0">
                  <img
                    src={artist.image}
                    alt={artist.name}
                    className={`w-full h-full object-cover ${artist.imagePosition || 'object-center'} group-hover:scale-105 transition-transform duration-500`}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent md:bg-gradient-to-r md:from-transparent md:to-black/80" />
                </div>

                {/* Artist Details */}
                <div className="md:w-7/12 p-6 md:p-8 flex flex-col justify-between space-y-4 bg-black">
                  <div>
                    <span className="inline-block px-2.5 py-0.5 bg-[#5E308A] text-[#F2EAD9] font-black text-[10px] uppercase tracking-widest mb-3">
                      {artist.role}
                    </span>
                    <h3 className="text-3xl md:text-4xl font-black uppercase text-[#F2EAD9] tracking-tight mb-2 group-hover:text-[#5E308A] transition-colors">
                      {artist.name}
                    </h3>
                    <p className="text-xs font-bold text-[#5E308A] uppercase tracking-wider mb-3">
                      {artist.specialties}
                    </p>
                    <p className="text-xs md:text-sm text-[#F2EAD9]/80 font-medium leading-relaxed">
                      {artist.description}
                    </p>
                  </div>

                  <a
                    href={artist.whatsappUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full py-3 px-5 bg-white/10 hover:bg-[#5E308A] text-[#F2EAD9] font-black text-xs uppercase tracking-wider rounded-none transition-all duration-300 flex items-center justify-center gap-2 mt-4 shadow-md"
                  >
                    <span>ORÇAMENTO COM {artist.name}</span>
                    <ArrowRight size={14} />
                  </a>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* SECTION 2: Carrosséis dos Tatuadores */}
        <div className="mb-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
            <ArtistCarousel artistName="BRUNO" items={brunoItems} onSelectTattoo={(item) => setSelectedTattoo(item)} />
            <ArtistCarousel artistName="MATHEUS" items={matheusItems} onSelectTattoo={(item) => setSelectedTattoo(item)} />
          </div>
        </div>

        {/* SECTION 3: GALERIA */}
        <div ref={galeriaRef} className="mb-16 scroll-mt-36">
          <div className="mb-10">
            <span className="text-xs font-bold text-[#5E308A] uppercase tracking-widest block mb-1">
              PORTFÓLIO COMPLETO DE PROJETOS REAIS ({flashCatalog.length} TRABALHOS)
            </span>
            <h2 className="text-4xl md:text-6xl font-black uppercase text-[#F2EAD9] tracking-tight">
              GALERIA
            </h2>
          </div>

          {/* Galeria Container with Buttery-Smooth Height Transition (Zero Cut / Zero Recoil) */}
          <div 
            className={`relative overflow-hidden transition-[max-height] duration-700 ease-in-out ${
              isGalleryExpanded 
                ? 'max-h-[8500px]' 
                : 'max-h-[2600px] md:max-h-[1900px] lg:max-h-[1280px]'
            }`}
          >
            {/* Galeria Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-4">
              {flashCatalog.map((item) => (
                <div
                  key={item.id}
                  onClick={() => setSelectedTattoo(item)}
                  className="bg-black border-2 border-white/10 hover:border-[#5E308A] rounded-none shadow-2xl flex flex-col justify-between overflow-hidden transition-all duration-300 group cursor-pointer"
                >
                  {/* Media Container */}
                  <div className="w-full h-72 relative overflow-hidden bg-black">
                    {item.mediaType === 'video' ? (
                      <div className="w-full h-full relative">
                        <video
                          src={item.mediaUrl}
                          autoPlay
                          loop
                          muted
                          playsInline
                          preload="metadata"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
                        />
                        <div className="absolute top-3 right-3 bg-[#5E308A] text-[#F2EAD9] px-2.5 py-1 rounded-none text-[10px] font-black uppercase flex items-center gap-1 shadow-md z-10 pointer-events-none">
                          <Play size={10} fill="#F2EAD9" />
                          <span>VÍDEO REAL</span>
                        </div>
                      </div>
                    ) : (
                      <img
                        src={item.mediaUrl}
                        alt={item.title}
                        loading="lazy"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
                      />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80 pointer-events-none" />

                    {/* Artist Tag Overlay */}
                    <div className="absolute bottom-3 left-3 bg-black/90 border border-white/20 text-[#F2EAD9] px-2.5 py-1 rounded-none text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5 shadow-lg z-10 pointer-events-none">
                      <User size={12} className="text-[#5E308A]" />
                      <span>POR {item.artist}</span>
                    </div>
                  </div>

                  {/* Content Details */}
                  <div className="p-6 md:p-8 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
                        <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1 bg-[#5E308A]/20 text-[#5E308A] border border-[#5E308A]/40 rounded-none">
                          {item.categoryLabel}
                        </span>
                        <span className="text-[10px] font-bold text-[#F2EAD9]/70 uppercase tracking-widest border border-white/10 px-2 py-0.5 rounded-none">
                          {item.tag}
                        </span>
                      </div>

                      <h3 className="text-xl font-black uppercase text-[#F2EAD9] tracking-tight mb-3 group-hover:text-[#5E308A] transition-colors">
                        {item.title}
                      </h3>

                      <div className="space-y-2 mb-6">
                        <p className="text-xs font-bold text-[#5E308A] uppercase tracking-wider">
                          ABRANGE: <span className="text-[#F2EAD9] font-medium text-xs normal-case">{item.abrange}</span>
                        </p>
                        <p className="text-xs font-bold text-[#5E308A] uppercase tracking-wider">
                          CARACTERÍSTICAS: <span className="text-[#F2EAD9]/90 font-medium text-xs normal-case">{item.caracteristicas}</span>
                        </p>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                      <div className="flex items-center gap-2 text-xs font-bold text-[#F2EAD9]/70">
                        <Clock size={16} className="text-[#5E308A]" />
                        <span>{item.timeEstimate}</span>
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedTattoo(item);
                        }}
                        className="py-2.5 px-4 bg-white/10 hover:bg-[#5E308A] text-[#F2EAD9] font-black text-xs uppercase tracking-wider rounded-none transition-all duration-300 flex items-center gap-2 cursor-pointer"
                      >
                        <span>VER EXPANDIDO</span>
                        <ArrowRight size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Smooth Ambient Bottom Gradient Overlay when Collapsed */}
            {!isGalleryExpanded && (
              <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-44 bg-gradient-to-t from-[#0B0908] via-[#0B0908]/90 to-transparent z-10 transition-opacity duration-500" />
            )}
          </div>

          {/* VER MAIS / VER MENOS BUTTON */}
          <div className="mt-12 text-center relative z-20">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={toggleGallery}
              className="Btn-purple font-black text-xs md:text-sm uppercase tracking-widest inline-flex items-center gap-3 cursor-pointer shadow-xl border border-white/10"
            >
              <span>{isGalleryExpanded ? 'VER MENOS' : `VER MAIS TRABALHOS (${flashCatalog.length - 6} RESTANTES)`}</span>
              {isGalleryExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </motion.button>
          </div>
        </div>

      </main>

      {/* SECTION 4: Why Choose HypeCut with CursorGrid & No Icons */}
      <section className="relative overflow-hidden w-full py-16 md:py-24 bg-[#0B0908] border-t border-white/10">
        {/* Ambient Interactive CursorGrid Background */}
        <div className="absolute inset-0 z-0 opacity-100 pointer-events-none">
          <CursorGrid color="#5E308A" gridOpacity={0.55} maxOpacity={1.0} fillOpacity={0.3} radius={220} cellSize={65} />
        </div>

        <div className="relative z-10 max-w-[1700px] mx-auto px-6 md:px-12 lg:px-16">
          <div className="text-center max-w-4xl mx-auto mb-16">
            <span className="text-xs md:text-sm font-black text-[#5E308A] uppercase tracking-widest block mb-3">
              EXCELÊNCIA EM CADA PROCESSO
            </span>
            <h2 className="uppercase tracking-tight leading-none">
              <span className="text-2xl sm:text-3xl md:text-4xl font-black text-[#F2EAD9] block mb-2">
                POR QUE FAZER SUA
              </span>
              <span className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-[#5E308A] block">
                TATTOO NA HYPECUT?
              </span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-[#18181b] border border-white/20 hover:border-[#5E308A] p-6 md:p-8 rounded-none transition-all duration-300 shadow-xl">
              <h4 className="text-lg font-black uppercase text-[#F2EAD9] mb-2">Artistas Exclusivos</h4>
              <p className="text-xs text-[#F2EAD9]/80 font-medium leading-relaxed">
                Tatuadores especializados em Lettering Urbana, Black & Grey Realista e Dark Art & Cultura Pop.
              </p>
            </div>

            <div className="bg-[#18181b] border border-white/20 hover:border-[#5E308A] p-6 md:p-8 rounded-none transition-all duration-300 shadow-xl">
              <h4 className="text-lg font-black uppercase text-[#F2EAD9] mb-2">Materiais ANVISA</h4>
              <p className="text-xs text-[#F2EAD9]/80 font-medium leading-relaxed">
                Tintas de alta fixação testadas dermatologicamente e liberadas pela ANVISA.
              </p>
            </div>

            <div className="bg-[#18181b] border border-white/20 hover:border-[#5E308A] p-6 md:p-8 rounded-none transition-all duration-300 shadow-xl">
              <h4 className="text-lg font-black uppercase text-[#F2EAD9] mb-2">Assepsia Rigorosa</h4>
              <p className="text-xs text-[#F2EAD9]/80 font-medium leading-relaxed">
                Biqueiras e agulhas 100% descartáveis e esterilização contínua antes e pós-sessão.
              </p>
            </div>

            <div className="bg-[#18181b] border border-white/20 hover:border-[#5E308A] p-6 md:p-8 rounded-none transition-all duration-300 shadow-xl">
              <h4 className="text-lg font-black uppercase text-[#F2EAD9] mb-2">Acompanhamento Pós</h4>
              <p className="text-xs text-[#F2EAD9]/80 font-medium leading-relaxed">
                Orientação completa de cicatrização e produtos recomendados para máxima durabilidade.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* TATTOO WORK LIGHTBOX POPUP MODAL */}
      <AnimatePresence>
        {selectedTattoo && (
          <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 sm:p-6 md:p-8 overflow-y-auto">
            {/* Backdrop Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedTattoo(null)}
              className="fixed inset-0 bg-black/90 backdrop-blur-md cursor-pointer"
            />

            {/* Modal Container */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative w-full max-w-4xl bg-black border-2 border-[#5E308A] rounded-none shadow-2xl z-10 overflow-hidden my-auto text-[#F2EAD9]"
            >
              {/* Modal Top Header Bar with Logo */}
              <div className="p-4 sm:p-5 bg-[#0B0908] border-b border-white/15 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src="/Logo_hypecut_letreiro_2.svg"
                    alt="HypeCut Logo"
                    className="h-8 sm:h-10 w-auto object-contain"
                  />
                </div>

                <button
                  onClick={() => setSelectedTattoo(null)}
                  className="p-2 bg-black hover:bg-[#5E308A] text-[#F2EAD9] transition-colors rounded-none cursor-pointer border border-white/20"
                  aria-label="Fechar janela"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Modal Content: Left Media + Right Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 bg-black">
                {/* Left Column: Full Media Preview */}
                <div className="w-full h-80 sm:h-96 md:h-full relative bg-black flex items-center justify-center overflow-hidden border-b md:border-b-0 md:border-r border-white/10 p-6 sm:p-8">
                  {selectedTattoo.mediaType === 'video' ? (
                    <video
                      src={selectedTattoo.mediaUrl}
                      autoPlay
                      loop
                      controls
                      playsInline
                      className="w-full h-full object-contain max-h-[480px]"
                    />
                  ) : (
                    <img
                      src={selectedTattoo.mediaUrl}
                      alt={selectedTattoo.title}
                      className="w-full h-full object-contain max-h-[480px]"
                    />
                  )}
                </div>

                {/* Right Column: Complete Details & WhatsApp CTA */}
                <div className="p-6 sm:p-8 flex flex-col justify-between space-y-6 bg-[#0B0908]">
                  <div className="space-y-4">
                    <h3 className="text-2xl sm:text-3xl font-black uppercase text-[#F2EAD9] tracking-tight leading-snug">
                      {selectedTattoo.title}
                    </h3>

                    <div className="space-y-3 pt-2 text-xs sm:text-sm">
                      <p className="font-bold text-[#5E308A] uppercase tracking-wider">
                        ESTIMATIVA DE TEMPO: <span className="text-[#F2EAD9] font-medium">{selectedTattoo.timeEstimate}</span>
                      </p>
                      <p className="font-bold text-[#5E308A] uppercase tracking-wider">
                        ABRANGE: <span className="text-[#F2EAD9] font-medium normal-case">{selectedTattoo.abrange}</span>
                      </p>
                      <p className="font-bold text-[#5E308A] uppercase tracking-wider">
                        CARACTERÍSTICAS: <span className="text-[#F2EAD9]/90 font-medium normal-case">{selectedTattoo.caracteristicas}</span>
                      </p>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-white/10 space-y-3">
                    <a
                      href={getWhatsAppLink(selectedTattoo.title, selectedTattoo.artist)}
                      target="_blank"
                      rel="noreferrer"
                      className="Btn-purple w-full font-black text-xs sm:text-sm uppercase tracking-widest flex items-center justify-center gap-3 cursor-pointer shadow-xl"
                    >
                      <span>SOLICITAR ORÇAMENTO DESTE TRABALHO</span>
                      <ArrowRight size={18} />
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
};
