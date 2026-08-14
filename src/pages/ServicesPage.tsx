import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Layers, CheckCircle2 } from 'lucide-react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/sections/Footer';
import { ButtonAgendar } from '../components/ui/ButtonAgendar';
import { CursorGrid } from '../components/ui/CursorGrid';
import { BlurText } from '../components/ui/BlurText';

interface ServiceItem {
  title: string;
  description: string;
  price: string;
  badge?: string;
}

const masculinoServices: ServiceItem[] = [
  { title: "Cabelo", description: "Corte masculino completo (moderno ou tradicional) com alinhamento e finalização", price: "R$ 50,00" },
  { title: "Tintura", description: "Coloração capilar profissional e cobertura dos fios", price: "R$ 80,00" },
  { title: "Barba", description: "Modelagem, desenho preciso das linhas e barboterapia com toalha quente", price: "R$ 45,00" },
  { title: "Hidratação", description: "Tratamento de nutrição profunda para saúde e brilho dos fios", price: "R$ 30,00" },
  { title: "Relaxamento Capilar", description: "Alinhamento, redução de volume e controle de frizz", price: "R$ 45,00" },
  { title: "Matizador", description: "Neutralização de tons amarelados e realce da cor", price: "R$ 30,00" },
  { title: "Luzes", description: "Técnica de iluminação e mechas masculinas platinadas ou douradas", price: "R$ 190,00", badge: "DESTAQUE" },
  { title: "Sobrancelha", description: "Design e alinhamento do desenho na navalha ou tesoura", price: "R$ 10,00" },
  { title: "Limpeza de Pele", description: "Esfoliação facial, remoção de cravos e desobstrução de poros", price: "R$ 45,00" },
  { title: "Depilação Orelha / Nariz", description: "Remoção prática e sem dor de pelos com cera quente", price: "R$ 20,00" },
];

const femininoServices: ServiceItem[] = [
  { title: "Corte Feminino", description: "Corte estilizado com diagnóstico capilar, secagem e finalização", price: "R$ 100,00", badge: "POPULAR" },
  { title: "Tintura Cabelo", description: "Aplicação de tinta profissional com pigmentação intensa e brilho", price: "R$ 80,00" },
  { title: "Hidratação", description: "Tratamento intensivo de nutrição e restauração da fibra capilar", price: "R$ 40,00" },
  { title: "Relaxamento Capilar", description: "Alinhamento térmico e redução de volume para fios mais soltos", price: "R$ 45,00" },
  { title: "Limpeza de Pele", description: "Higienização facial profunda, esfoliação e hidratação calmante", price: "R$ 45,00" },
];

const combosServices: ServiceItem[] = [
  { 
    title: "Cabelo + Sobrancelha + Hidratação + Nariz + Limpeza de Pele", 
    description: "Combo VIP completo para renovação total do visual e cuidado facial", 
    price: "R$ 140,00",
    badge: "SUPER COMBO"
  },
  { 
    title: "Cabelo + Barba + Sobrancelha", 
    description: "O combo mais pedido da casa: alinhamento completo de cabelo, barba e sobrancelha", 
    price: "R$ 85,00",
    badge: "MAIS VENDIDO"
  },
  { 
    title: "Cabelo + Barba", 
    description: "Corte de cabelo completo acompanhado de barboterapia com toalha quente", 
    price: "R$ 80,00" 
  },
  { 
    title: "Cabelo + Sobrancelha", 
    description: "Corte de cabelo alinhado com design de sobrancelha na navalha", 
    price: "R$ 60,00" 
  },
];

const tattooServices: ServiceItem[] = [
  {
    title: "Tatuagem Autoral (Sessão)",
    description: "Projetos exclusivos de Lettering, Dark, Realismo e Freehand com nossos artistas",
    price: "Sob Consulta",
    badge: "EXCLUSIVO"
  }
];

export const ServicesPage = () => {
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState<'masculino' | 'feminino' | 'combos' | 'tattoo'>('masculino');

  useEffect(() => {
    window.scrollTo(0, 0);
    const cat = searchParams.get('categoria');
    if (cat && ['masculino', 'feminino', 'combos', 'tattoo'].includes(cat)) {
      setActiveTab(cat as 'masculino' | 'feminino' | 'combos' | 'tattoo');
    }
  }, [searchParams]);

  const getServices = () => {
    switch (activeTab) {
      case 'masculino': return masculinoServices;
      case 'feminino': return femininoServices;
      case 'combos': return combosServices;
      case 'tattoo': return tattooServices;
    }
  };

  const currentServices = getServices();

  return (
    <div className="bg-[#121212] min-h-screen text-[#F2EAD9] font-sans selection:bg-[#5E308A] selection:text-white">
      <Navbar />

      {/* Increased top padding (pt-40 md:pt-52) so header is positioned with comfortable breathing room below Navbar */}
      <main className="pt-40 md:pt-52 pb-24 relative overflow-hidden">
        {/* Ambient Interactive CursorGrid Background */}
        <div className="absolute inset-0 z-0 opacity-90 pointer-events-none">
          <CursorGrid color="#5E308A" gridOpacity={0.25} maxOpacity={0.8} fillOpacity={0.12} radius={180} cellSize={65} />
        </div>

        <div className="w-full px-6 md:px-12 lg:px-16 max-w-[1700px] mx-auto relative z-10">

          {/* Left-Aligned Header Section */}
          <div className="text-left mb-12 pb-6 border-b border-[#F2EAD9]/10">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-black uppercase tracking-tight text-[#F2EAD9] mb-4 text-left">
                <BlurText text="SERVIÇOS HYPE" delay={90} animateBy="words" direction="top" />
              </h1>
              <p className="text-[#F2EAD9]/70 text-xs md:text-sm font-medium leading-relaxed text-left max-w-3xl">
                Confira em detalhes todas as nossas opções de corte, cuidados com a barba, tratamentos capilares, estéticos e tattoo autoral.
              </p>
            </motion.div>
          </div>

          {/* Category Tab Switcher - Symmetrical 2x2 Mobile Grid & Flex Desktop */}
          <div className="w-full sm:w-auto flex justify-start mb-10">
            <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-1.5 p-1.5 bg-[#18181b] border border-[#F2EAD9]/20 rounded-none shadow-xl w-full sm:w-auto" role="tablist" aria-label="Categorias de Serviços">
              <button
                onClick={() => setActiveTab('masculino')}
                className={`h-11 sm:h-10 px-3 sm:px-5 font-extrabold text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-all rounded-none cursor-pointer w-full sm:w-auto ${
                  activeTab === 'masculino'
                    ? 'bg-[#5E308A] text-[#F2EAD9] shadow-md'
                    : 'bg-transparent text-[#F2EAD9]/70 hover:bg-white/10 hover:text-[#F2EAD9]'
                }`}
                role="tab"
                aria-selected={activeTab === 'masculino'}
              >
                <img 
                  src="/icones_homem.svg" 
                  alt="Homem" 
                  className={`w-4 h-4 shrink-0 object-contain filter invert ${activeTab === 'masculino' ? 'brightness-200' : 'opacity-70'}`} 
                />
                <span>MASCULINO</span>
              </button>

              <button
                onClick={() => setActiveTab('feminino')}
                className={`h-11 sm:h-10 px-3 sm:px-5 font-extrabold text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-all rounded-none cursor-pointer w-full sm:w-auto ${
                  activeTab === 'feminino'
                    ? 'bg-[#5E308A] text-[#F2EAD9] shadow-md'
                    : 'bg-transparent text-[#F2EAD9]/70 hover:bg-white/10 hover:text-[#F2EAD9]'
                }`}
                role="tab"
                aria-selected={activeTab === 'feminino'}
              >
                <img 
                  src="/icones_mulher.svg" 
                  alt="Mulher" 
                  className={`w-4 h-4 shrink-0 object-contain filter invert ${activeTab === 'feminino' ? 'brightness-200' : 'opacity-70'}`} 
                />
                <span>FEMININO</span>
              </button>

              <button
                onClick={() => setActiveTab('combos')}
                className={`h-11 sm:h-10 px-3 sm:px-5 font-extrabold text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-all rounded-none cursor-pointer w-full sm:w-auto ${
                  activeTab === 'combos'
                    ? 'bg-[#5E308A] text-[#F2EAD9] shadow-md'
                    : 'bg-transparent text-[#F2EAD9]/70 hover:bg-white/10 hover:text-[#F2EAD9]'
                }`}
                role="tab"
                aria-selected={activeTab === 'combos'}
              >
                <Layers size={16} className={`shrink-0 ${activeTab === 'combos' ? 'text-[#F2EAD9]' : 'opacity-70'}`} />
                <span>COMBOS</span>
              </button>

              <button
                onClick={() => setActiveTab('tattoo')}
                className={`h-11 sm:h-10 px-3 sm:px-5 font-extrabold text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-all rounded-none cursor-pointer w-full sm:w-auto ${
                  activeTab === 'tattoo'
                    ? 'bg-[#5E308A] text-[#F2EAD9] shadow-md'
                    : 'bg-transparent text-[#F2EAD9]/70 hover:bg-white/10 hover:text-[#F2EAD9]'
                }`}
                role="tab"
                aria-selected={activeTab === 'tattoo'}
              >
                <img 
                  src="/icones_tatto.svg" 
                  alt="Tattoo" 
                  className={`w-4 h-4 shrink-0 object-contain filter invert ${activeTab === 'tattoo' ? 'brightness-200' : 'opacity-70'}`} 
                />
                <span>TATTOO</span>
              </button>
            </div>
          </div>

          {/* Services List Grid - Hardware-Accelerated 60fps Category Transition */}
          <AnimatePresence mode="popLayout">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-x-10 lg:gap-x-12 gap-y-4 w-full"
            >
              {currentServices.map((service) => (
                <div
                  key={service.title}
                  onClick={() => {
                    window.dispatchEvent(
                      new CustomEvent('open-booking-modal', {
                        detail: { serviceTitle: service.title }
                      })
                    );
                  }}
                  className="group relative py-5 px-6 rounded-none border border-[#F2EAD9]/20 hover:border-[#5E308A] bg-[#18181b] hover:bg-[#221f28] transition-all duration-300 flex items-center justify-between overflow-hidden shadow-lg cursor-pointer"
                >
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#5E308A] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  <div className="pr-4 transition-transform duration-300 group-hover:translate-x-2">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <h3 className="text-base md:text-lg font-bold text-[#F2EAD9] uppercase group-hover:text-[#F2EAD9] transition-colors tracking-wide">
                        {service.title}
                      </h3>
                      {service.badge && (
                        <span className="bg-[#5E308A] text-[#F2EAD9] text-[10px] font-black px-2 py-0.5 rounded-none uppercase tracking-wider shadow-sm">
                          {service.badge}
                        </span>
                      )}
                    </div>
                    <p className="text-xs md:text-sm text-[#F2EAD9]/70 font-medium leading-relaxed">
                      {service.description}
                    </p>
                  </div>

                  <div className="flex flex-col items-end gap-2 shrink-0">
                    <span className="text-lg md:text-2xl font-black text-[#F2EAD9] group-hover:text-[#5E308A] transition-all duration-300 whitespace-nowrap">
                      {service.price}
                    </span>
                    <button className="px-3 py-1.5 bg-[#5E308A] group-hover:bg-[#6C3DFF] text-[#F2EAD9] text-[10px] font-black uppercase tracking-wider transition-all flex items-center gap-1.5 shadow-md">
                      <span>Agendar</span>
                      <ArrowRight size={12} />
                    </button>
                  </div>
                </div>
              ))}
            </motion.div>
          </AnimatePresence>

          {/* Guarantee / Info Cards - Off-White #F2EAD9 Text */}
          <div className="mt-16 w-full grid grid-cols-1 md:grid-cols-3 gap-6 pt-10 border-t border-[#F2EAD9]/10">
            <div className="p-6 rounded-none bg-[#18181b] border border-[#F2EAD9]/10 flex flex-col items-start text-left">
              <CheckCircle2 size={28} className="text-[#5E308A] mb-3 hidden md:block" />
              <h4 className="font-bold uppercase text-[#F2EAD9] mb-1">Atendimento VIP</h4>
              <p className="text-xs text-[#F2EAD9]/60">Ambiente climatizado, cerveja gelada cortesia e profissionais de ponta.</p>
            </div>
            <div className="p-6 rounded-none bg-[#18181b] border border-[#F2EAD9]/10 flex flex-col items-start text-left">
              <CheckCircle2 size={28} className="text-[#5E308A] mb-3 hidden md:block" />
              <h4 className="font-bold uppercase text-[#F2EAD9] mb-1">Produtos Premium</h4>
              <p className="text-xs text-[#F2EAD9]/60">Utilizamos apenas linhas de cosméticos e tratamentos de alta performance.</p>
            </div>
            <div className="p-6 rounded-none bg-[#18181b] border border-[#F2EAD9]/10 flex flex-col items-start text-left">
              <CheckCircle2 size={28} className="text-[#5E308A] mb-3 hidden md:block" />
              <h4 className="font-bold uppercase text-[#F2EAD9] mb-1">Agendamento Fácil</h4>
              <p className="text-xs text-[#F2EAD9]/60">Escolha o melhor horário via WhatsApp ou pelo nosso aplicativo parceiro.</p>
            </div>
          </div>

          {/* CTA Section below Menu */}
          <div className="mt-14 text-center flex flex-col items-center">
            <p className="text-[#F2EAD9]/80 text-sm md:text-base font-medium mb-6">
              Deseja agendar seu atendimento ou tirar dúvidas pelo WhatsApp?
            </p>
            <ButtonAgendar text="AGENDAR PELO WHATSAPP" href="https://wa.me/5547999995843" />
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
};
