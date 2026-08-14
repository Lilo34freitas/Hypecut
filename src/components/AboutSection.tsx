import { motion } from 'framer-motion';
import { Wifi, Car, Snowflake, Scissors, Beer, Cookie, Baby, Accessibility } from 'lucide-react';
import { ButtonAgendar } from './ui/ButtonAgendar';
import { BlurText } from './ui/BlurText';

const features = [
  { icon: Wifi, text: 'WI-FI GRÁTIS' },
  { icon: Car, text: 'ESTACIONAMENTO' },
  { icon: Snowflake, text: 'AMBIENTE CLIMATIZADO' },
  { icon: Scissors, text: 'PROFISSIONAIS QUALIFICADOS' },
  { icon: Beer, text: 'CERVEJA GELADA' },
  { icon: Cookie, text: 'SNACKS' },
  { icon: Baby, text: 'ATENDE CRIANÇAS' },
  { icon: Accessibility, text: 'ACESSIBILIDADE' },
];

export const AboutSection = () => {
  return (
    <section id="sobre" className="relative bg-bg-darkest py-24 w-full border-b border-white/10 overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-20">
        
        {/* Top Part: Image and Text */}
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-20 items-stretch">
          
          {/* Image */}
          <motion.div 
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.8 }}
            className="w-full lg:w-[50%]"
          >
            <div className="relative border border-surface-border p-2 rounded-xl bg-black/20 w-full h-full shadow-2xl">
              <img 
                src="/about_teste%202.png" 
                alt="Sobre a Hype Cut" 
                className="w-full h-full object-cover object-top rounded-lg grayscale hover:grayscale-0 transition-all duration-700"
              />
            </div>
          </motion.div>

          {/* Text Content */}
          <motion.div 
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.8 }}
            className="w-full lg:w-[50%] flex flex-col items-start justify-between py-1"
          >
            <h2 className="text-4xl lg:text-5xl lg:text-[3.5rem] font-black text-text-primary mb-8 uppercase tracking-tight leading-tight">
              <BlurText text="SOBRE O MOVIMENTO HYPECUT" delay={80} animateBy="words" direction="top" />
            </h2>
            
            <div className="space-y-6 text-base sm:text-lg text-[#F2EAD9]/95 mb-10 font-normal leading-relaxed text-left">
              <p>
                A Hype Cut é especialista no cuidado do visual masculino e na arte urbana, unindo o melhor da barbearia de alta precisão a um estúdio de tattoo exclusivo. Nosso compromisso é estar sempre à frente das tendências, aprimorando continuamente nossas técnicas de corte, barba e pigmentação para destacar a identidade única de cada cliente.
              </p>
              <p>
                Mais do que transformar sua imagem, acreditamos que estilo é atitude, presença e autoestima. Cada corte de cabelo, cada acabamento de barba e cada traço na pele são pensados para oferecer uma experiência autêntica, trazendo confiança e destaque para quem faz parte da nossa comunidade.
              </p>
              <p>
                Do primeiro contato até o toque final do atendimento, priorizamos a precisão, o profissionalismo e o respeito ao seu tempo. Nosso foco é compreender seu estilo, alinhar expectativas e entregar um resultado impecável que represente exatamente quem você é.
              </p>
              <p>
                Disponibilizamos um ambiente moderno e um sistema de agendamento prático e ágil, além de planos de assinatura exclusivos para você manter o visual sempre atualizado com máxima conveniência e alto padrão.
              </p>
            </div>

            <ButtonAgendar text="SAIBA MAIS" href="/sobre" />
          </motion.div>

        </div>

        {/* Features Grid */}
        <div className="mt-12 sm:mt-16 pt-8 sm:pt-12 border-t border-surface-border">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-y-6 sm:gap-y-12 gap-x-4 lg:gap-x-8 w-full place-items-start">
            {features.map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  className="flex items-center justify-start gap-3 sm:gap-4 lg:gap-6 group w-full p-2 bg-black/20 sm:bg-transparent rounded-none"
                >
                  <Icon className="w-9 h-9 sm:w-12 sm:h-12 lg:w-16 lg:h-16 text-text-accent group-hover:scale-110 transition-transform duration-300 flex-shrink-0" />
                  <span className="text-white font-bold text-xs sm:text-sm lg:text-base tracking-wider uppercase leading-tight">
                    {feature.text}
                  </span>
                </motion.div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
};
