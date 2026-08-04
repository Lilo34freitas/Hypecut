import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, ArrowRight, Compass } from 'lucide-react';

export const LocationSection = () => {
  return (
    <section id="localizacao" className="bg-[#0B0908] py-24 md:py-32 text-[#F2EAD9] relative overflow-hidden w-full">
      {/* Top Accent Dashed Divider Line */}
      <div className="w-full h-[3px] border-t-[3px] border-dashed border-[#5E308A] absolute top-0 left-0" />

      <div className="w-full px-6 md:px-12 lg:px-16 max-w-[1700px] mx-auto">
        
        {/* Section Header - Giant Title, No Badge, No Subtitle */}
        <div className="mb-12 md:mb-16">
          <h2 className="text-6xl sm:text-7xl md:text-8xl xl:text-9xl font-black uppercase text-[#F2EAD9] tracking-tight leading-none">
            ONDE <span className="text-[#5E308A]">ESTAMOS</span>
          </h2>
        </div>

        {/* Main Location Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* LEFT: Google Maps Interactive Iframe (lg:col-span-8, Borderless) */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-8 rounded-none shadow-2xl relative bg-[#18181b] overflow-hidden min-h-[380px] md:min-h-[480px] flex flex-col justify-end"
          >
            <iframe 
              title="Mapa de Localização HypeCut"
              src="https://maps.google.com/maps?q=Av.+Gov.+Adolfo+Konder,+1350+-+Cidade+Nova,+Itaja%C3%AD+-+SC&t=&z=15&ie=UTF8&iwloc=&output=embed"
              className="w-full h-full absolute inset-0 border-0"
              allowFullScreen={false}
              loading="lazy"
            />
          </motion.div>

          {/* RIGHT: Unit Details Panel in Cream Off-White #F2EAD9 (lg:col-span-4, Borderless) */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="lg:col-span-4 bg-[#F2EAD9] text-[#0B0908] p-8 md:p-10 rounded-none shadow-2xl flex flex-col justify-between space-y-8"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="px-3 py-1 text-[10px] font-black uppercase tracking-widest bg-[#0B0908] text-[#F2EAD9] rounded-none">
                  UNIDADE ÚNICA
                </span>
                <Compass size={22} className="text-[#5E308A]" />
              </div>

              <h3 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-[#0B0908] mb-3 leading-tight">
                ITAJAÍ - CENTRO / CIDADE NOVA
              </h3>

              <div className="flex items-start gap-3 text-xs md:text-sm text-[#0B0908]/80 font-bold leading-relaxed mb-6">
                <MapPin size={18} className="text-[#5E308A] shrink-0 mt-0.5" />
                <span>Av. Gov. Adolfo Konder, 1350 - Cidade Nova, Itajaí - SC, 88308-002</span>
              </div>

              <div className="w-full border-b border-[#0B0908]/20 mb-6" />

              <p className="text-xs text-[#0B0908]/80 font-bold uppercase tracking-wider leading-relaxed">
                Clique nos botões abaixo para abrir o endereço direto no seu aplicativo de navegação favorito:
              </p>
            </div>

            {/* GPS Direct Redirection Buttons */}
            <div className="space-y-3 pt-2">
              <a
                href="https://www.google.com/maps/search/?api=1&query=Av.+Gov.+Adolfo+Konder,+1350+-+Cidade+Nova,+Itaja%C3%AD+-+SC"
                target="_blank"
                rel="noreferrer"
                className="w-full py-4 px-5 rounded-none bg-[#0B0908] hover:bg-black text-white font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 transition-all duration-300 shadow-md group"
              >
                <img src="/google-maps.png" alt="Google Maps" className="w-5 h-5 object-contain group-hover:scale-110 transition-transform shrink-0" />
                <span>ABRIR NO GOOGLE MAPS</span>
              </a>

              <a
                href="https://waze.com/ul?q=Av.%20Gov.%20Adolfo%20Konder,%201350%20Itajai"
                target="_blank"
                rel="noreferrer"
                className="w-full py-4 px-5 rounded-none bg-[#0B0908] hover:bg-black text-white font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 transition-all duration-300 shadow-md group"
              >
                <img src="/waze.png" alt="Waze" className="w-5 h-5 object-contain group-hover:scale-110 transition-transform shrink-0" />
                <span>ABRIR NO WAZE</span>
              </a>
            </div>
          </motion.div>

        </div>

        {/* BOTTOM: Unit Highlight Card in Cream Off-White #F2EAD9 (Borderless) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="bg-[#F2EAD9] text-[#0B0908] p-6 md:p-8 lg:p-10 rounded-none shadow-2xl flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 mt-8"
        >
          {/* Unit Name & Address */}
          <div>
            <h4 className="text-xl md:text-2xl font-black uppercase text-[#0B0908] tracking-tight mb-1.5">
              Itajaí – Cidade Nova
            </h4>
            <p className="text-xs md:text-sm text-[#0B0908]/80 font-semibold tracking-wide">
              Av. Gov. Adolfo Konder, 1350 - Cidade Nova, Itajaí
            </p>
          </div>

          {/* Contact Details */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 lg:gap-8 text-xs md:text-sm text-[#0B0908] font-bold border-y lg:border-y-0 lg:border-x border-[#0B0908]/20 py-4 lg:py-0 lg:px-8 w-full lg:w-auto">
            <a 
              href="https://wa.me/5547999995843" 
              target="_blank" 
              rel="noreferrer" 
              className="flex items-center gap-2 hover:text-[#5E308A] transition-colors"
            >
              <Phone size={16} className="text-[#5E308A]" />
              <span>(47) 99959-5843</span>
            </a>

            <a 
              href="mailto:contato@hypecut.com.br" 
              className="flex items-center gap-2 hover:text-[#5E308A] transition-colors"
            >
              <Mail size={16} className="text-[#5E308A]" />
              <span>contato@hypecut.com.br</span>
            </a>
          </div>

          {/* Single Action Button titled GALERIA */}
          <a
            href="/sobre"
            className="w-full lg:w-auto py-4 px-8 rounded-none bg-[#0B0908] hover:bg-black text-white font-black text-xs md:text-sm uppercase tracking-widest flex items-center justify-center gap-3 transition-all duration-300 shadow-lg group shrink-0"
          >
            <span>GALERIA</span>
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </a>
        </motion.div>

      </div>
    </section>
  );
};
