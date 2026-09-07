import React from 'react';
import { Flame, Instagram, Phone, MapPin, Lock, ExternalLink, Heart } from 'lucide-react';
import { RestaurantConfig } from '../types';

interface FooterProps {
  config: RestaurantConfig;
  onOpenAdmin: () => void;
}

export const Footer: React.FC<FooterProps> = ({ config, onOpenAdmin }) => {
  return (
    <footer className="bg-[#1C120C] text-stone-300 pt-16 pb-12 border-t border-amber-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-stone-800">
          {/* Col 1: Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-red-600 p-0.5 shadow-md">
                <div className="w-full h-full bg-[#2A1608] rounded-[10px] flex items-center justify-center">
                  <Flame className="w-5 h-5 text-amber-400" />
                </div>
              </div>
              <span className="font-extrabold text-2xl tracking-tight text-white font-['Outfit']">
                Dendê <span className="text-red-500">&</span> Brasa
              </span>
            </div>
            <p className="text-xs text-stone-400 leading-relaxed">
              O encontro sagrado do autêntico acarajé e abará baianos com a parrilla e carnes nobres na brasa viva.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a
                href={config.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-xl bg-stone-800 hover:bg-pink-600 text-stone-300 hover:text-white flex items-center justify-center transition-colors"
                aria-label="Instagram Dendê e Brasa"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href={`https://wa.me/${config.whatsappNumber}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-xl bg-stone-800 hover:bg-emerald-600 text-stone-300 hover:text-white flex items-center justify-center transition-colors"
                aria-label="WhatsApp Dendê e Brasa"
              >
                <Phone className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Col 2: Navigation Links */}
          <div className="space-y-3">
            <h4 className="text-white font-extrabold text-sm uppercase tracking-wider font-['Outfit']">
              Navegação
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <a href="#cardapio" className="hover:text-amber-400 transition-colors">
                  Cardápio Completo
                </a>
              </li>
              <li>
                <a href="#promocoes" className="hover:text-amber-400 transition-colors">
                  Promoções Especiais
                </a>
              </li>
              <li>
                <a href="#sobre" className="hover:text-amber-400 transition-colors">
                  Nossa História & Tradição
                </a>
              </li>
              <li>
                <a href="#localizacao" className="hover:text-amber-400 transition-colors">
                  Localização em Stella Maris
                </a>
              </li>
              <li>
                <a
                  href={config.cardapioUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 hover:text-amber-400 transition-colors text-amber-500"
                >
                  <span>Cardápio no Dguests</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
            </ul>
          </div>

          {/* Col 3: Hours summary */}
          <div className="space-y-3">
            <h4 className="text-white font-extrabold text-sm uppercase tracking-wider font-['Outfit']">
              Horários
            </h4>
            <div className="space-y-1.5 text-xs text-stone-400">
              <p>
                <strong className="text-stone-200">Terça a Quinta:</strong> 17:00 às 23:30
              </p>
              <p>
                <strong className="text-stone-200">Sexta:</strong> 17:00 às 00:30
              </p>
              <p>
                <strong className="text-stone-200">Sábado:</strong> 12:00 às 00:30 (Almoço & Jantar)
              </p>
              <p>
                <strong className="text-stone-200">Domingo:</strong> 12:00 às 22:00
              </p>
              <p className="text-stone-500 italic pt-1">Segunda-feira fechado.</p>
            </div>
          </div>

          {/* Col 4: Location & Admin */}
          <div className="space-y-3">
            <h4 className="text-white font-extrabold text-sm uppercase tracking-wider font-['Outfit']">
              Onde Estamos
            </h4>
            <p className="text-xs text-stone-400 leading-relaxed">
              {config.address.street}, {config.address.number} - {config.address.complement}
              <br />
              {config.address.neighborhood}, {config.address.city} - {config.address.state}
            </p>

            <div className="pt-2">
              <button
                onClick={onOpenAdmin}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white text-xs font-semibold border border-stone-700 transition-colors cursor-pointer"
              >
                <Lock className="w-3.5 h-3.5 text-amber-400" />
                <span>Área Administrativa (Preços & Cardápio)</span>
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500">
          <p>© {new Date().getFullYear()} Dendê e Brasa - Todos os direitos reservados.</p>
          <p className="flex items-center gap-1">
            Feito com <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500" /> para a culinária de Salvador, Bahia.
          </p>
        </div>
      </div>
    </footer>
  );
};
