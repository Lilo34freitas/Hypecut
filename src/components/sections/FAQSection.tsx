import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus } from 'lucide-react';

interface FAQItem {
  q: string;
  a: string;
}

const faqs: FAQItem[] = [
  {
    q: "Como devo me preparar para a minha sessão de tatuagem?",
    a: "Recomendamos vir bem alimentado, hidratado e com a pele limpa. Evite o consumo de bebidas alcoólicas nas 24 horas anteriores à sessão e não tome remédios anticoagulantes sem orientação médica."
  },
  {
    q: "QUAIS SÃO OS CUIDADOS PÓS-TATUAGEM?",
    a: "Mantenha o local limpo e hidratado com a pomada recomendada. Evite exposição ao sol, banhos de mar ou piscina e não puxe as casquinhas durante o processo de cicatrização (que dura em média 15 a 20 dias)."
  },
  {
    q: "PRECISO AGENDAR HORÁRIO OU ATENDEM POR ORDEM DE CHEGADA?",
    a: "Para garantir o seu atendimento no melhor horário e sem espera, priorizamos o agendamento prévio. Porém, caso tenhamos encaixes disponíveis no dia, também realizamos atendimentos por ordem de chegada!"
  },
  {
    q: "QUAIS SÃO AS FORMAS DE PAGAMENTO ACEITAS?",
    a: "Aceitamos Pix, cartões de crédito, débito e dinheiro. Para sessões de tatuagem de maior porte, disponibilizamos parcelamento no cartão de crédito."
  },
  {
    q: "POSSO LEVAR UM ACOMPANHANTE NA MINHA SESSÃO?",
    a: "Com certeza! Nosso espaço conta com recepção confortável, bar, sinuca e ambiente climatizado para que seu acompanhante aproveite a experiência com tranquilidade."
  },
  {
    q: "QUAL A DURAÇÃO MÉDIA DO ATENDIMENTO DE CORTE E BARBA?",
    a: "Um serviço completo de barba e cabelo leva cerca de 45 a 60 minutos, focando na precisão dos detalhes, toalha quente e acabamento de alto padrão."
  }
];

const InstagramIcon = () => (
  <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
  </svg>
);

const FacebookIcon = () => (
  <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
    <path d="M9 8H6v4h3v12h5V12h3.642L18 8h-4V6.333C14 5.374 14.5 5 15.5 5H18V0h-3.808C10.592 0 9 1.592 9 4.814V8z"/>
  </svg>
);

const TikTokIcon = () => (
  <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.96-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.82.56-1.36 1.48-1.42 2.48-.12 1.13.43 2.27 1.35 2.92 1.05.74 2.47.8 3.58.19.98-.53 1.56-1.58 1.64-2.69.04-3.96.02-7.92.03-11.88z"/>
  </svg>
);

export const FAQSection = () => {
  // First item open by default
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="informacoes" className="bg-[#0B0908] text-white py-24 md:py-32 border-t border-white/10 relative overflow-hidden w-full scroll-mt-36 md:scroll-mt-48">
      <div className="w-full max-w-[1700px] mx-auto px-6 md:px-12 lg:px-16">
        
        {/* Grid Layout: Left Column (6 FAQs + Info Block) & Right Column (Vertical Image) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* LEFT COLUMN: Header, 6 Accordion Cards, and Expanded Info Block */}
          <div className="lg:col-span-7 flex flex-col justify-between space-y-10">
            
            {/* Title & Underline */}
            <div>
              <h2 className="text-4xl sm:text-5xl md:text-6xl font-black uppercase text-[#F2EAD9] tracking-tight mb-2">
                DÚVIDAS FREQUENTES
              </h2>
              {/* Sleek Thin Line matching Reference Print 2 (No Neon Glow) */}
              <div className="h-[2px] w-[80%] max-w-lg bg-[#5E308A] ml-auto mb-10" />

              {/* 6 Accordion Items (Sharp Rectangular Corners rounded-none) */}
              <div className="space-y-4">
                {faqs.map((faq, i) => {
                  const isOpen = openIndex === i;
                  return (
                    <div
                      key={i}
                      className={`rounded-none border-2 transition-colors duration-200 overflow-hidden cursor-pointer p-5 md:p-6 select-none ${
                        isOpen 
                          ? 'border-[#5E308A] bg-[#121212] text-white shadow-2xl' 
                          : 'border-transparent bg-[#F2EAD9] text-[#0B0908] hover:bg-white shadow-md'
                      }`}
                      onClick={() => setOpenIndex(isOpen ? null : i)}
                      role="button"
                      aria-expanded={isOpen}
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          setOpenIndex(isOpen ? null : i);
                        }
                      }}
                    >
                      <div className="flex items-center justify-between gap-4">
                        <h3 className={`font-extrabold uppercase text-sm sm:text-base md:text-lg tracking-wide transition-colors duration-200 ${isOpen ? 'text-[#5E308A]' : 'text-[#0B0908]'}`}>
                          {faq.q}
                        </h3>
                        <div className={`w-7 h-7 rounded-none flex items-center justify-center shrink-0 transition-colors duration-200 ${isOpen ? 'bg-[#5E308A] text-white' : 'bg-[#0B0908]/10 text-[#0B0908]'}`}>
                          {isOpen ? <Minus size={18} /> : <Plus size={18} />}
                        </div>
                      </div>

                      <AnimatePresence initial={false}>
                        {isOpen && (
                          <motion.div
                            key="content"
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ 
                              height: 'auto', 
                              opacity: 1,
                              transition: {
                                height: { duration: 0.28, ease: [0.16, 1, 0.3, 1] },
                                opacity: { duration: 0.2, ease: "easeOut" }
                              }
                            }}
                            exit={{ 
                              height: 0, 
                              opacity: 0,
                              transition: {
                                height: { duration: 0.22, ease: [0.16, 1, 0.3, 1] },
                                opacity: { duration: 0.15, ease: "easeIn" }
                              }
                            }}
                            className="overflow-hidden"
                          >
                            <div className="pt-4 mt-4 border-t border-white/10">
                              <p className="text-white/90 text-xs sm:text-sm md:text-base leading-relaxed font-semibold">
                                {faq.a}
                              </p>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* EXPANDED INFORMATION BLOCK */}
            <div className="pt-10 border-t border-white/15 space-y-10">
              
              {/* Row 1: Telefone / WhatsApp & Nosso Endereço */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                
                {/* Phone */}
                <div>
                  <span className="text-xs uppercase text-[#5E308A] font-black tracking-widest block mb-2">
                    CONTATO DIRETO / WHATSAPP
                  </span>
                  <a href="tel:5547999595843" className="font-black text-3xl sm:text-4xl text-white hover:text-[#5E308A] transition-colors tracking-wide block">
                    (47) 99959-5843
                  </a>
                </div>

                {/* Address */}
                <div>
                  <span className="text-xs uppercase text-[#5E308A] font-black tracking-widest block mb-2">
                    NOSSO ENDEREÇO
                  </span>
                  <h4 className="font-black text-xl sm:text-2xl text-white uppercase tracking-wider">
                    AV. GOV. ADOLFO KONDER, 1350
                  </h4>
                  <p className="text-sm sm:text-base text-white/80 font-semibold mt-1">
                    Sala 09 - São Vicente, Itajaí / SC - CEP 88308-002
                  </p>
                </div>

              </div>

              {/* Row 2: Horários & Larger Social Icons + Drastically Taller Purple CTA Button */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-end pt-8 border-t border-white/10">
                
                {/* Hours */}
                <div>
                  <span className="text-xs uppercase text-[#5E308A] font-black tracking-widest block mb-2">
                    HORÁRIOS DE FUNCIONAMENTO
                  </span>
                  <h4 className="font-black text-xl sm:text-2xl text-white uppercase tracking-wider mb-2">
                    ATENDIMENTO
                  </h4>
                  <ul className="text-sm sm:text-base text-white/90 space-y-1.5 font-semibold">
                    <li>Segunda-feira: <span className="font-black text-white">14h às 20h</span></li>
                    <li>Terça a Sexta-feira: <span className="font-black text-white">09h às 21h</span></li>
                    <li>Sábado: <span className="font-black text-white">08h às 17h</span></li>
                  </ul>
                </div>

                {/* Larger Social Icons & Drastically Taller Purple CTA Button */}
                <div className="flex flex-col gap-6 items-start md:items-end justify-between h-full">
                  {/* Larger Social Media Circles */}
                  <div className="flex items-center gap-4">
                    <a
                      href="https://instagram.com/hypecut.barber"
                      target="_blank"
                      rel="noreferrer"
                      className="w-15 h-15 rounded-full border-2 border-[#5E308A] text-[#5E308A] hover:bg-[#5E308A] hover:text-white flex items-center justify-center transition-all duration-300 shadow-md p-3.5"
                      aria-label="Instagram"
                    >
                      <InstagramIcon />
                    </a>
                    <a
                      href="https://facebook.com"
                      target="_blank"
                      rel="noreferrer"
                      className="w-15 h-15 rounded-full border-2 border-[#5E308A] text-[#5E308A] hover:bg-[#5E308A] hover:text-white flex items-center justify-center transition-all duration-300 shadow-md p-3.5"
                      aria-label="Facebook"
                    >
                      <FacebookIcon />
                    </a>
                    <a
                      href="https://wa.me/5547999995843"
                      target="_blank"
                      rel="noreferrer"
                      className="w-15 h-15 rounded-full border-2 border-[#5E308A] text-[#5E308A] hover:bg-[#5E308A] hover:text-white flex items-center justify-center transition-all duration-300 shadow-md p-3.5"
                      aria-label="TikTok"
                    >
                      <TikTokIcon />
                    </a>
                  </div>

                  {/* Bottom Row: Purple CTA Button with Uiverse Sliding Animation (Matching CTA Section) */}
                  <a
                    href="https://wa.me/5547999995843"
                    target="_blank"
                    rel="noreferrer"
                    className="Btn-purple w-full sm:w-auto min-w-[280px] font-black text-sm sm:text-base uppercase tracking-widest group"
                  >
                    <span>TENHO OUTRA DÚVIDA</span>
                    <span className="text-xl font-bold group-hover:translate-x-1.5 transition-transform relative z-10">›</span>
                  </a>
                </div>

              </div>

            </div>

          </div>

          {/* RIGHT COLUMN: Full-Height Vertical Photo (Fixed Height & Sticky to eliminate layout thrashes) */}
          <div className="lg:col-span-5 flex items-start lg:sticky lg:top-36">
            <div className="relative w-full h-[500px] sm:h-[600px] lg:h-[720px] rounded-none overflow-hidden border border-white/10 shadow-2xl">
              <img
                src="/FAQ_editado.png"
                alt="HypeCut Barber Experience"
                className="w-full h-full object-cover object-center rounded-none"
              />
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
