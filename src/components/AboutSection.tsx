import React from 'react';
import { Flame, Beef, Heart, Sparkles, Award, ShieldCheck } from 'lucide-react';
import { RestaurantConfig } from '../types';

interface AboutSectionProps {
  config: RestaurantConfig;
}

export const AboutSection: React.FC<AboutSectionProps> = ({ config }) => {
  return (
    <section id="sobre" className="py-16 sm:py-24 bg-gradient-to-b from-[#FFF8E7] via-yellow-100/20 to-[#FFF8E7] border-t border-[#FDE68A] relative overflow-hidden">
      {/* Decorative shapes */}
      <div className="absolute top-1/2 right-0 -mr-32 w-80 h-80 rounded-full bg-orange-300/20 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Photos Grid */}
          <div className="lg:col-span-6 grid grid-cols-2 gap-4">
            <div className="space-y-4">
              <div className="rounded-3xl overflow-hidden shadow-lg border-4 border-white aspect-4/5">
                <img
                  src="https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?auto=format&fit=crop&w=600&q=80"
                  alt="Acarajé Tradicional frito no Dendê"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="bg-white p-4 rounded-2xl border border-[#FDE68A] shadow-xs text-center">
                <Flame className="w-6 h-6 text-red-600 fill-red-600 mx-auto mb-1" />
                <h4 className="font-black text-xs text-[#4A2C2A]">Azeite de Dendê da Terra</h4>
                <p className="text-[11px] text-[#4A2C2A]/70">Puro, aromático e frito na hora</p>
              </div>
            </div>

            <div className="space-y-4 pt-6">
              <div className="bg-gradient-to-br from-orange-600 to-red-600 p-4 rounded-2xl shadow-md text-white text-center">
                <Beef className="w-6 h-6 text-yellow-300 mx-auto mb-1" />
                <h4 className="font-black text-xs">Parrilla no Carvão</h4>
                <p className="text-[11px] text-yellow-100">Cortes nobres com maciez única</p>
              </div>
              <div className="rounded-3xl overflow-hidden shadow-lg border-4 border-white aspect-4/5">
                <img
                  src="https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80"
                  alt="Parrilla e Carnes na Brasa"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>
            </div>
          </div>

          {/* Story & Values */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-yellow-400 border border-orange-300 text-orange-950 font-black text-xs uppercase tracking-wider shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-red-600 fill-red-600" />
              <span>Nossa Essência Gastronômica</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-black text-[#4A2C2A] font-['Outfit'] tracking-tight">
              A Bahia em cada mordida, o <span className="text-orange-600">fogo sagrado</span> em cada corte.
            </h2>

            <p className="text-[#4A2C2A]/90 text-base sm:text-lg leading-relaxed font-medium">
              O <strong className="font-black text-[#4A2C2A]">Dendê e Brasa</strong> nasceu da união de duas paixões consagradas: a magia ancestral do acarajé e abará baianos feitos com respeito à tradição e ingredientes frescos da terra, somados à intensidade do fogo da brasa na parrilla.
            </p>

            <p className="text-[#4A2C2A]/75 text-sm sm:text-base leading-relaxed font-medium">
              Situado em Stella Maris no complexo Empório Greco, nosso espaço foi planejado para reunir a família e amigos ao redor de uma mesa farta, cerveja geladíssima, caipirinhas com frutas regionais e atendimento caloroso e alegre como a Bahia sabe oferecer.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
              <div className="flex items-start gap-3 p-3.5 bg-white rounded-2xl border border-[#FDE68A]">
                <div className="w-8 h-8 rounded-xl bg-yellow-100 text-orange-800 flex items-center justify-center shrink-0">
                  <Award className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-black text-xs text-[#4A2C2A]">Ingredientes Selecionados</h4>
                  <p className="text-[11px] text-[#4A2C2A]/70">Camarão defumado de qualidade e carnes certificadas</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3.5 bg-white rounded-2xl border border-[#FDE68A]">
                <div className="w-8 h-8 rounded-xl bg-red-100 text-red-700 flex items-center justify-center shrink-0">
                  <Heart className="w-4 h-4 fill-red-600" />
                </div>
                <div>
                  <h4 className="font-black text-xs text-[#4A2C2A]">Feito com Amor</h4>
                  <p className="text-[11px] text-[#4A2C2A]/70">Culinária afetiva que celebra o melhor de Salvador</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
