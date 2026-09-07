import React from 'react';
import {
  MapPin,
  Clock,
  Navigation,
  Phone,
  Instagram,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  Car,
  Baby,
  Dog,
  Music
} from 'lucide-react';
import { RestaurantConfig } from '../types';
import { checkStoreOpenStatus } from '../lib/utils';

interface LocationAndHoursProps {
  config: RestaurantConfig;
}

export const LocationAndHours: React.FC<LocationAndHoursProps> = ({ config }) => {
  const openStatus = checkStoreOpenStatus(config.hours);
  const currentDayCode = new Date().getDay();

  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    `${config.name} ${config.address.street} ${config.address.number} ${config.address.neighborhood} ${config.address.city} ${config.address.state}`
  )}`;

  const wazeUrl = `https://waze.com/ul?q=${encodeURIComponent(
    `${config.address.street} ${config.address.number} Stella Maris Salvador`
  )}`;

  return (
    <section id="localizacao" className="py-14 sm:py-20 bg-[#FFF8E7] border-t border-[#FDE68A]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-12">
          <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-yellow-400 border border-orange-300 text-orange-950 font-black text-xs uppercase tracking-wider shadow-xs">
            <MapPin className="w-4 h-4 text-red-600 fill-red-600" />
            <span>Como Chegar & Horários</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#4A2C2A] font-['Outfit'] tracking-tight">
            Venha nos Visitar em <span className="text-orange-600">Stella Maris</span>
          </h2>
          <p className="text-[#4A2C2A]/80 text-base sm:text-lg font-medium">
            Estamos localizados no charmoso complexo gastronômico Empório Greco, com fácil acesso, estacionamento e ambiente perfeito para toda a família.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Map Column */}
          <div className="lg:col-span-7 space-y-4">
            <div className="relative rounded-3xl overflow-hidden shadow-xl border-4 border-white bg-stone-100 aspect-4/3 sm:aspect-16/10">
              {/* Google Maps Embed with accurate coordinates for Alameda Dilson Jatahy Fonseca 1248, Stella Maris */}
              <iframe
                title="Localização Dendê e Brasa - Stella Maris"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                loading="lazy"
                allowFullScreen
                referrerPolicy="no-referrer-when-downgrade"
                src={`https://maps.google.com/maps?q=${encodeURIComponent(
                  'Alameda Dilson Jatahy Fonseca, 1248, Stella Maris, Salvador, BA'
                )}&t=&z=16&ie=UTF8&iwloc=&output=embed`}
                className="w-full h-full"
              />

              {/* Floating Overlay Badge */}
              <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-md px-3.5 py-2.5 rounded-2xl shadow-lg border-2 border-[#FDE68A] flex items-center gap-2 max-w-xs">
                <div className="w-8 h-8 rounded-xl bg-orange-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                  <MapPin className="w-4 h-4" />
                </div>
                <div className="text-left">
                  <p className="font-black text-xs text-[#4A2C2A]">Empório Greco</p>
                  <p className="text-[11px] text-[#4A2C2A]/70 font-medium truncate">Alameda Dilson Jatahy Fonseca, 1248</p>
                </div>
              </div>
            </div>

            {/* Quick Route GPS Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <a
                href={googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-[#4A2C2A] hover:bg-stone-950 text-white font-black text-xs sm:text-sm shadow-[4px_4px_0px_0px_rgba(251,146,60,1)] hover:shadow-lg transition-all cursor-pointer"
              >
                <Navigation className="w-4 h-4 text-yellow-300" />
                <span>Traçar Rota no Google Maps</span>
                <ExternalLink className="w-3.5 h-3.5 opacity-70" />
              </a>

              <a
                href={wazeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-cyan-600 hover:bg-cyan-700 text-white font-black text-xs sm:text-sm shadow-md transition-all cursor-pointer"
              >
                <Car className="w-4 h-4 text-white" />
                <span>Navegar pelo Waze</span>
                <ExternalLink className="w-3.5 h-3.5 opacity-70" />
              </a>
            </div>

            {/* Venue Amenities */}
            <div className="bg-yellow-100/60 rounded-2xl p-4 border border-[#FDE68A] grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
              <div className="flex flex-col items-center gap-1">
                <Car className="w-5 h-5 text-orange-800" />
                <span className="text-[11px] font-black text-[#4A2C2A]">Estacionamento</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <Baby className="w-5 h-5 text-orange-800" />
                <span className="text-[11px] font-black text-[#4A2C2A]">Área Kids</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <Dog className="w-5 h-5 text-orange-800" />
                <span className="text-[11px] font-black text-[#4A2C2A]">Pet Friendly</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <Music className="w-5 h-5 text-orange-800" />
                <span className="text-[11px] font-black text-[#4A2C2A]">Música ao Vivo</span>
              </div>
            </div>
          </div>

          {/* Opening Hours & Contact Details Column */}
          <div className="lg:col-span-5 space-y-6">
            {/* Status Card */}
            <div className="bg-white rounded-3xl p-6 border-2 border-[#FDE68A] shadow-md space-y-5">
              <div className="flex items-center justify-between pb-4 border-b border-[#FDE68A]">
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-orange-600" />
                  <h3 className="text-lg font-black text-[#4A2C2A] font-['Outfit']">
                    Horários de Atendimento
                  </h3>
                </div>

                <span
                  className={`px-3 py-1 rounded-full text-xs font-black border ${openStatus.colorClass}`}
                >
                  {openStatus.statusText}
                </span>
              </div>

              {/* Weekly Schedule Table */}
              <div className="space-y-2 text-xs sm:text-sm">
                {config.hours.map((h) => {
                  const isToday = h.dayCode === currentDayCode;

                  return (
                    <div
                      key={h.day}
                      className={`flex items-center justify-between py-2 px-3 rounded-xl transition-colors ${
                        isToday
                          ? 'bg-yellow-400 text-orange-950 font-black border border-orange-300'
                          : 'text-[#4A2C2A]/80 hover:bg-yellow-50 font-medium'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        {isToday && <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />}
                        <span>{h.day}</span>
                        {isToday && (
                          <span className="text-[10px] bg-red-600 text-white font-black px-1.5 py-0.2 rounded-md uppercase">
                            Hoje
                          </span>
                        )}
                      </div>

                      <div className="font-bold">
                        {h.isClosed ? (
                          <span className="text-stone-400">Fechado</span>
                        ) : (
                          <span>
                            {h.open} às {h.close}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="pt-2 text-[11px] text-[#4A2C2A]/60 text-center font-medium">
                * Em feriados os horários podem ter pequenas alterações especiais.
              </div>
            </div>

            {/* Address & Quick Contacts Card */}
            <div className="bg-white rounded-3xl p-6 border-2 border-[#FDE68A] shadow-md space-y-4">
              <h4 className="font-black text-base text-[#4A2C2A] font-['Outfit'] flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-red-600 fill-red-600" />
                <span>Endereço & Contatos Diretos</span>
              </h4>

              <div className="space-y-3 text-xs sm:text-sm text-[#4A2C2A]">
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-[#4A2C2A] block font-black">
                      {config.address.street}, {config.address.number} - {config.address.complement}
                    </strong>
                    <span className="text-[#4A2C2A]/80 font-medium">
                      {config.address.neighborhood}, {config.address.city} - {config.address.state} • CEP {config.address.cep}
                    </span>
                    <p className="text-[11px] text-[#4A2C2A]/60 mt-0.5 italic">
                      Referência: {config.address.reference}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 pt-2 border-t border-[#FDE68A]">
                  <Phone className="w-4 h-4 text-green-600 shrink-0" />
                  <div>
                    <span className="text-[#4A2C2A]/60 text-[11px] block font-medium">WhatsApp / Pedidos</span>
                    <a
                      href={`https://wa.me/${config.whatsappNumber}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-black text-[#4A2C2A] hover:text-green-600 transition-colors"
                    >
                      {config.phoneDisplay}
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-3 pt-2 border-t border-[#FDE68A]">
                  <Instagram className="w-4 h-4 text-pink-600 shrink-0" />
                  <div>
                    <span className="text-[#4A2C2A]/60 text-[11px] block font-medium">Instagram Oficial</span>
                    <a
                      href={config.instagramUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-black text-[#4A2C2A] hover:text-pink-600 transition-colors"
                    >
                      {config.instagramHandle}
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
