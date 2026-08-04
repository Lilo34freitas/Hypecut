import { Star, ExternalLink, Quote } from 'lucide-react';

interface Review {
  name: string;
  avatar: string;
  avatarBg: string;
  date: string;
  rating: number;
  text: string;
  localGuide?: boolean;
}

const reviews: Review[] = [
  {
    name: "Felipe",
    avatar: "F",
    avatarBg: "bg-purple-600",
    date: "há 3 meses",
    rating: 5,
    text: "Cortar cabelo era apenas uma espera chata em um sofazinho, na hype o ambiente é diferenciado, o corte é sempre alinhado como o combinado e às vezes uma indicação de corte que se encaixa melhor, todo corte é uma terapia e faz o serviço chato se tornar um encontro de amigos com boas risadas, quem cola ali sempre é muito bem recebido.",
  },
  {
    name: "Thiago S Oliveira",
    avatar: "TO",
    avatarBg: "bg-amber-600",
    date: "há 3 meses",
    rating: 5,
    text: "3 anos que eu corto cabelo na Hype, desde sua abertura. Atendimento é sempre impecável, e o serviço? Nem se fala. Hype não é só uma \"barbearia\" ou um \"studio de tatuagem\". Hype é um movimento. É arte.",
  },
  {
    name: "José C Magno",
    avatar: "JM",
    avatarBg: "bg-[#5E308A]",
    date: "há 4 meses",
    rating: 5,
    text: "Finalmente encontrei o lugar que acerta meu corte de cabelo. Tive um probleminha no agendamento do horário, mas fui bem atendido e direcionado a outro profissional. Barbeiro Bosco muito atencioso e competente.",
  },
  {
    name: "Nuno Viana",
    avatar: "NV",
    avatarBg: "bg-blue-600",
    date: "há 3 meses",
    rating: 5,
    text: "O Jonathan conversa sobre o corte, faz sugestões. Atendimento especializado, atendeu minha expectativa, corte com tesoura sem usar a máquina. Bom demais, recomendo.",
  },
  {
    name: "Matheus Gabriel",
    avatar: "MG",
    avatarBg: "bg-emerald-600",
    date: "há 2 meses",
    rating: 5,
    text: "atendimento incrível, minha primeira vez e o Lucas me atendeu super bem 🤙🏼",
  },
  {
    name: "Thiago Vieira",
    avatar: "TV",
    avatarBg: "bg-indigo-600",
    date: "há 4 meses",
    rating: 5,
    text: "Melhor barbearia de Itajaí, ótimo ambiente e qualidade em todos os barbeiros, já cortei com todos e sempre padrão.",
  },
  {
    name: "Paulo Wais",
    avatar: "PW",
    avatarBg: "bg-[#5E308A]",
    date: "há 3 meses",
    rating: 5,
    text: "Eu simplesmente não vivo sem a Hype na minha vida 💖💖💖💖 sou cliente a anos! Muita resenha e profissionalismo tanto na barbearia e na tattoo 💖",
  },
  {
    name: "Eduarda Schotten",
    avatar: "ES",
    avatarBg: "bg-pink-600",
    date: "há 3 meses",
    rating: 5,
    text: "Ótimo atendimento, Sempre tratam meu menino muito bem e com muita paciência 💖",
  },
  {
    name: "Pedro H. lopes",
    avatar: "PL",
    avatarBg: "bg-teal-600",
    date: "há 3 meses",
    rating: 5,
    text: "Ambiente top, barbeiros excelentes, muito bom!!!",
  },
  {
    name: "Roberth Freitas",
    avatar: "RF",
    avatarBg: "bg-amber-600",
    date: "há 3 meses",
    rating: 5,
    localGuide: true,
    text: "Serviços de excelência, estética mais braba da região!",
  },
  {
    name: "Benedito Mello da Silva",
    avatar: "BS",
    avatarBg: "bg-cyan-600",
    date: "há 3 meses",
    rating: 5,
    text: "Barbeiros e ambiente muito show, super indico",
  },
];

const GoogleGIcon = () => (
  <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
  </svg>
);

export const TestimonialsSection = () => {
  // Duplicate array for seamless infinite looping marquee
  const marqueeReviews = [...reviews, ...reviews];

  return (
    <section id="depoimentos" className="bg-[#5E308A] py-24 md:py-32 text-[#F2EAD9] relative overflow-hidden w-full -mt-3 z-10 border-none outline-none">

      {/* Full-Bleed Layout Container */}
      <div className="w-full pl-6 md:pl-12 lg:pl-16 pr-0 flex flex-col lg:flex-row items-stretch justify-between gap-12 lg:gap-16">

        {/* LEFT COLUMN: Title Header + Google Score Card */}
        <div className="w-full lg:w-[480px] xl:w-[540px] shrink-0 pr-6 lg:pr-0 flex flex-col justify-between gap-10">

          {/* ESPAÇO 1: Badge, Title & Subtitle */}
          <div>
            <div className="inline-flex items-center gap-2 px-5 py-2 rounded-none bg-black/20 border border-white/20 mb-6 text-xs font-black text-[#F2EAD9] tracking-wider uppercase">
              <GoogleGIcon />
              <span>AVALIAÇÕES VERIFICADAS</span>
            </div>

            <h2 className="text-5xl md:text-7xl xl:text-8xl font-black uppercase text-[#F2EAD9] tracking-tight leading-none mb-6">
              AVALIAÇÕES NO <br />
              <span className="text-[#0B0908]">GOOGLE</span>
            </h2>

            <p className="text-[#F2EAD9]/90 text-base md:text-lg font-bold uppercase tracking-wider leading-relaxed">
              Confira o que nossos clientes dizem sobre o atendimento, estrutura e experiência HypeCut.
            </p>
          </div>

          {/* ESPAÇO 2: Google Rating Card Banner (Sharp 90-degree corners rounded-none) */}
          <div className="w-full bg-[#0B0908] text-white border-2 border-white/20 p-8 md:p-10 rounded-none shadow-2xl space-y-6">
            <div className="flex items-center gap-5">
              <div className="w-18 h-18 rounded-none bg-[#5E308A] text-white font-black text-4xl flex items-center justify-center shrink-0 shadow-lg p-4">
                5.0
              </div>
              <div>
                <div className="flex items-center gap-1 mb-1.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={20} className="text-amber-400 fill-amber-400" />
                  ))}
                </div>
                <p className="text-xs md:text-sm font-bold uppercase tracking-wider text-white/90">
                  Pontuação máxima (5,0★) baseada em 48+ avaliações reais
                </p>
              </div>
            </div>

            <a
              href="https://www.bing.com/search?q=hypcut+barbearia+&qs=n&form=QBRE&sp=-1&lq=0&pq=hypcut+barbearia+%5D&sc=12-18&sk=&cvid=66A78F88B67E403BBB55F626CCB431FF"
              target="_blank"
              rel="noreferrer"
              className="w-full py-5 px-6 rounded-none bg-white text-[#0B0908] hover:bg-[#5E308A] hover:text-white font-black text-xs md:text-sm uppercase tracking-widest flex items-center justify-center gap-3 transition-all duration-300 shadow-md group"
            >
              <GoogleGIcon />
              <span>VER NO GOOGLE</span>
              <ExternalLink size={18} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </a>
          </div>

        </div>

        {/* RIGHT COLUMN: Infinite Marquee Cards Track */}
        <div className="w-full flex-1 overflow-hidden relative py-4 flex items-center">
          {/* Left Fade Shadow Overlay matching the Roxo background */}
          <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-[#5E308A] to-transparent z-10 pointer-events-none" />

          {/* Continuous Infinite Marquee Track */}
          <div className="animate-marquee gap-8">
            {marqueeReviews.map((review, i) => (
              <div
                key={`${review.name}-${i}`}
                className="bg-[#0B0908] text-white border-2 border-white/20 p-8 md:p-10 rounded-none w-[360px] sm:w-[420px] md:w-[460px] shrink-0 flex flex-col justify-between hover:border-white transition-all duration-300 shadow-2xl group min-h-[340px]"
              >
                <div>
                  {/* Header: Avatar, Name, Local Guide & Google G */}
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex items-center gap-3.5">
                      <div className={`w-12 h-12 rounded-full ${review.avatarBg} text-white font-black text-base flex items-center justify-center shadow-md shrink-0`}>
                        {review.avatar}
                      </div>
                      <div>
                        <h4 className="font-black text-white text-base md:text-lg leading-tight uppercase group-hover:text-[#5E308A] transition-colors tracking-wide">
                          {review.name}
                        </h4>
                        {review.localGuide && (
                          <span className="text-[11px] font-bold text-amber-400 block tracking-wider uppercase mt-0.5">
                            ★ Local Guide
                          </span>
                        )}
                        <span className="text-xs text-white/50 block font-medium mt-0.5">
                          {review.date}
                        </span>
                      </div>
                    </div>

                    <GoogleGIcon />
                  </div>

                  {/* Rating Stars */}
                  <div className="flex items-center gap-1 mb-5">
                    {[...Array(review.rating)].map((_, sIdx) => (
                      <Star key={sIdx} size={17} className="text-amber-400 fill-amber-400" />
                    ))}
                  </div>

                  {/* Review Quote */}
                  <p className="text-white/90 text-xs md:text-sm leading-relaxed font-semibold">
                    "{review.text}"
                  </p>
                </div>

                <div className="mt-8 pt-4 border-t border-white/10 flex items-center justify-between text-[11px] text-white/50 font-bold uppercase tracking-widest">
                  <span>Avaliação Verificada no Google</span>
                  <Quote size={16} className="text-[#7C4DFF]/60" />
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};
