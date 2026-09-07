import React from 'react';
import {
  Flame,
  Beef,
  MapPin,
  Sparkles,
  MessageCircle,
  ArrowRight,
  Utensils,
  Play,
  Film
} from 'lucide-react';
import { RestaurantConfig } from '../types';

interface HeroProps {
  config: RestaurantConfig;
  onScrollToMenu: () => void;
  onScrollToPromos: () => void;
  onScrollToVideo?: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  config,
  onScrollToMenu,
  onScrollToPromos,
  onScrollToVideo
}) => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-orange-500/15 via-[#FFF8E7] to-[#FFF8E7] pt-8 pb-16 lg:pt-14 lg:pb-24">
      {/* Decorative background glows */}
      <div className="absolute top-0 right-0 -mr-24 -mt-24 w-96 h-96 rounded-full bg-gradient-to-br from-orange-400/20 to-red-500/15 blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-0 -ml-24 w-80 h-80 rounded-full bg-gradient-to-tr from-yellow-300/25 to-orange-500/15 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Text content */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-yellow-400 border border-orange-300 text-orange-950 text-xs font-black uppercase tracking-wider shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-red-600 fill-red-600" />
              <span>Stella Maris • Salvador - Bahia</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-[#4A2C2A] tracking-tight font-['Outfit'] leading-[1.1]">
              Onde o <span className="bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">Dendê Quente</span> encontra o <span className="text-orange-600">Fogo da Brasa</span>
            </h1>

            <p className="text-lg sm:text-xl text-[#4A2C2A]/90 max-w-2xl font-medium leading-relaxed">
              O sabor autêntico do <strong className="font-black text-[#4A2C2A]">Acarajé e Abará artesanais</strong> fritos no puro dendê da Bahia com a suculência incomparável da <strong className="font-black text-[#4A2C2A]">Parrilla e carnes nobres</strong>.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <button
                onClick={onScrollToMenu}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-4 rounded-2xl bg-orange-600 hover:bg-orange-700 text-white font-black text-base shadow-[4px_4px_0px_0px_rgba(74,44,42,1)] hover:shadow-lg active:scale-98 transition-all cursor-pointer"
              >
                <Utensils className="w-5 h-5 text-yellow-300" />
                <span>Explorar Cardápio</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={onScrollToPromos}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-4 rounded-2xl bg-yellow-400 hover:bg-yellow-300 text-orange-950 border-2 border-orange-300 font-black text-base shadow-sm transition-all cursor-pointer"
              >
                <Flame className="w-5 h-5 text-red-600 fill-red-600" />
                <span>Promoções do Chef</span>
              </button>

              <a
                href={`https://wa.me/${config.whatsappNumber}?text=${encodeURIComponent('Olá Dendê e Brasa! Gostaria de fazer um pedido pelo WhatsApp.')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-4 rounded-2xl bg-green-500 hover:bg-green-600 text-white font-black text-base shadow-md hover:shadow-lg transition-all cursor-pointer"
              >
                <MessageCircle className="w-5 h-5" />
                <span>Pedir no WhatsApp</span>
              </a>
            </div>

            {/* Micro badges / selling points */}
            <div className="grid grid-cols-3 gap-3 pt-6 border-t border-[#FDE68A]">
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-2.5 text-center sm:text-left bg-white/70 backdrop-blur-xs p-3 rounded-2xl border border-[#FDE68A]">
                <div className="w-9 h-9 rounded-xl bg-orange-100 flex items-center justify-center text-orange-600 shrink-0 font-bold">
                  <Flame className="w-5 h-5 fill-orange-500" />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-black text-[#4A2C2A]">Dendê Artesanal</h4>
                  <p className="text-[11px] text-[#4A2C2A]/70">Acarajé frito na hora</p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-2.5 text-center sm:text-left bg-white/70 backdrop-blur-xs p-3 rounded-2xl border border-[#FDE68A]">
                <div className="w-9 h-9 rounded-xl bg-red-100 flex items-center justify-center text-red-600 shrink-0 font-bold">
                  <Beef className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-black text-[#4A2C2A]">Parrilla no Carvão</h4>
                  <p className="text-[11px] text-[#4A2C2A]/70">Cortes nobres e macios</p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-2.5 text-center sm:text-left bg-white/70 backdrop-blur-xs p-3 rounded-2xl border border-[#FDE68A]">
                <div className="w-9 h-9 rounded-xl bg-yellow-100 flex items-center justify-center text-yellow-800 shrink-0 font-bold">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-black text-[#4A2C2A]">Empório Greco</h4>
                  <p className="text-[11px] text-[#4A2C2A]/70">Stella Maris Salvador</p>
                </div>
              </div>
            </div>
          </div>

          {/* Visual Showcase / Collage (No duplicate video player here) */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              {/* Primary Showcase Card: Culinary & Venue */}
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-stone-900 group">
                <img
                  src="https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1000&q=80"
                  alt="Dendê e Brasa Parrilla e Gastronomia Baiana"
                  className="w-full h-80 sm:h-96 object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/20" />

                {/* Top Badges */}
                <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between z-10">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-[11px] font-black border border-white/20 shadow-sm">
                    <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
                    <span>EMPORIO GRECO • STELLA MARIS</span>
                  </span>

                  <span className="px-3 py-1 rounded-full bg-red-600/90 backdrop-blur-md text-white text-[11px] font-black shadow-sm">
                    ⭐ 4.9 Salvador
                  </span>
                </div>

                {/* Bottom Overlay with CTA to Video Section */}
                <div className="absolute bottom-4 left-4 right-4 text-white z-10 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="inline-block px-3 py-1 rounded-full bg-orange-600 text-white font-black text-[11px] uppercase tracking-wider shadow-md">
                      Ambiente & Gastronomia
                    </span>
                    <span className="text-[11px] text-yellow-300 font-bold">
                      Mesas ao Ar Livre
                    </span>
                  </div>

                  <h3 className="text-xl font-black font-['Outfit'] text-white">
                    Parrilla Brava & Tradição Baiana
                  </h3>

                  <p className="text-xs text-stone-200 font-medium line-clamp-2">
                    Cortes nobres na brasa, acarajé artesanal no puro dendê e telão ao vivo no coração de Stella Maris.
                  </p>

                  {/* Direct button to scroll to the single large video */}
                  {onScrollToVideo && (
                    <button
                      onClick={onScrollToVideo}
                      className="w-full mt-2 py-3 px-4 rounded-xl bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white font-black text-xs shadow-lg transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer flex items-center justify-center gap-2 group/btn"
                    >
                      <Film className="w-4 h-4 text-yellow-300 group-hover/btn:scale-110 transition-transform" />
                      <span>🎬 Assistir ao Vídeo do Espaço (Veja Abaixo)</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
                    </button>
                  )}
                </div>
              </div>

              {/* Floating Discount Pill */}
              <div className="absolute -top-4 -right-2 sm:-right-4 bg-yellow-400 text-orange-950 font-black text-xs px-4 py-2 rounded-full shadow-lg border border-orange-300 flex items-center gap-1.5 animate-bounce z-20">
                <Sparkles className="w-4 h-4 text-red-600 fill-red-600" />
                <span>Ofertas da Semana</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
