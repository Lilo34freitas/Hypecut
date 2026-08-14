import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, Compass } from 'lucide-react';

const InstagramIcon = () => (
  <svg className="w-4 h-4 text-[#5E308A] fill-current shrink-0" viewBox="0 0 24 24">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
  </svg>
);

const TikTokIcon = () => (
  <svg className="w-4 h-4 text-[#5E308A] fill-current shrink-0" viewBox="0 0 24 24">
    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.96-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.82.56-1.36 1.48-1.42 2.48-.12 1.13.43 2.27 1.35 2.92 1.05.74 2.47.8 3.58.19.98-.53 1.56-1.58 1.64-2.69.04-3.96.02-7.92.03-11.88z"/>
  </svg>
);

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

        {/* BOTTOM: Unit Highlight Card with All Contacts & Socials on the same line (Borderless) */}
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

          {/* Contact & Social Details on the same line */}
          <div className="flex flex-wrap items-center gap-4 sm:gap-6 lg:gap-8 text-xs md:text-sm text-[#0B0908] font-bold">
            <a 
              href="https://wa.me/5547999595843" 
              target="_blank" 
              rel="noreferrer" 
              className="flex items-center gap-2 hover:text-[#5E308A] transition-colors group"
            >
              <Phone size={16} className="text-[#5E308A] group-hover:scale-110 transition-transform" />
              <span>(47) 99959-5843</span>
            </a>

            <a 
              href="mailto:contato@hypecut.com.br" 
              className="flex items-center gap-2 hover:text-[#5E308A] transition-colors group"
            >
              <Mail size={16} className="text-[#5E308A] group-hover:scale-110 transition-transform" />
              <span>contato@hypecut.com.br</span>
            </a>

            <a 
              href="https://instagram.com/hypecut.barber" 
              target="_blank" 
              rel="noreferrer" 
              className="flex items-center gap-2 hover:text-[#5E308A] transition-colors group"
            >
              <InstagramIcon />
              <span>@hypecut.barber</span>
            </a>

            <a 
              href="https://wa.me/5547999995843" 
              target="_blank" 
              rel="noreferrer" 
              className="flex items-center gap-2 hover:text-[#5E308A] transition-colors group"
            >
              <TikTokIcon />
              <span>TikTok</span>
            </a>
          </div>
        </motion.div>

      </div>
    </section>
  );
};
