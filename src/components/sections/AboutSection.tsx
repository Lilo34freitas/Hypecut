
import { motion } from 'framer-motion';
import { Section } from '../ui/Section';
import { Button } from '../ui/Button';

export const AboutSection = () => {
  return (
    <Section id="sobre" className="relative overflow-hidden">
      <div className="flex flex-col lg:flex-row items-center gap-16">
        
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="w-full lg:w-1/2 relative"
        >
          <div className="relative aspect-[4/5] w-full rounded-2xl overflow-hidden border border-surface-border">
            <div className="absolute inset-0 bg-gradient-to-tr from-bg-darkest/80 to-transparent z-10" />
            <img 
              src="/656879116_18042637244774674_7904715273304612539_n.jpg" 
              alt="Sobre a Barbearia" 
              className="object-cover w-full h-full"
            />
          </div>
          <div className="absolute -bottom-8 -right-8 w-48 h-48 bg-bg-card border border-surface-border backdrop-blur-xl rounded-2xl p-6 shadow-glow hidden md:flex flex-col justify-center items-center">
            <span className="text-4xl font-display font-bold text-text-accent mb-2">5+</span>
            <span className="text-text-primary text-center text-sm font-semibold">Anos de Experiência</span>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="w-full lg:w-1/2"
        >
          <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-6">
            Sobre a Hype Cut <span className="text-text-accent">em Itajaí</span>
          </h2>
          <div className="space-y-6 text-text-secondary text-lg">
            <p>
              Especialistas no cuidado da beleza masculina, oferecendo serviços de excelência em barba, cabelo e tatuagem. Nosso compromisso é superar expectativas, aprimorando continuamente nossas técnicas para proporcionar um atendimento personalizado que valorize o estilo único de cada cliente.
            </p>
            <p>
              Do primeiro contato ao toque final, priorizamos respeito e profissionalismo. Um ambiente moderno, pensado para você relaxar enquanto cuidamos do seu visual.
            </p>
          </div>
          <div className="mt-10">
            <Button variant="secondary" size="lg">Conhecer o Espaço</Button>
          </div>
        </motion.div>

      </div>
    </Section>
  );
};
