import React from 'react';
import { Flame, Sparkles, Tag, Plus, ShoppingBag, MessageCircle, Calendar } from 'lucide-react';
import { SpecialPromotion, CartItem } from '../types';
import { formatCurrency } from '../lib/utils';

interface PromotionsSectionProps {
  promotions: SpecialPromotion[];
  onAddToCart: (promo: SpecialPromotion) => void;
  onOpenAdmin: (tab?: 'promocoes' | 'cardapio' | 'loja' | 'supabase') => void;
  whatsappNumber: string;
  isAdmin: boolean;
}

export const PromotionsSection: React.FC<PromotionsSectionProps> = ({
  promotions,
  onAddToCart,
  onOpenAdmin,
  whatsappNumber,
  isAdmin
}) => {
  const activePromos = promotions.filter((p) => p.active);

  return (
    <section id="promocoes" className="py-14 sm:py-20 bg-gradient-to-b from-[#FFF8E7] via-yellow-100/30 to-[#FFF8E7] border-y border-[#FDE68A]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-yellow-400 border border-orange-300 text-orange-950 font-black text-xs uppercase tracking-wider shadow-xs">
              <Flame className="w-3.5 h-3.5 text-red-600 fill-red-600" />
              <span>Ofertas Especiais & Combos</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-[#4A2C2A] font-['Outfit'] tracking-tight">
              Promoções da Semana com <span className="bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">Preço Especial</span>
            </h2>
            <p className="text-[#4A2C2A]/80 text-base font-medium">
              Pratos selecionados pelo nosso chef com valores exclusivos para saborear o melhor do dendê e da brasa sem pesar no bolso.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => onOpenAdmin('promocoes')}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-orange-600 hover:bg-orange-700 text-white font-black text-sm shadow-[4px_4px_0px_0px_rgba(74,44,42,1)] hover:shadow-lg transition-all cursor-pointer"
              title="Acesse o painel para cadastrar novos pratos promocionais"
            >
              <Plus className="w-4 h-4 text-yellow-300" />
              <span>{isAdmin ? 'Gerenciar Promoções' : 'Criar Promoção (Admin)'}</span>
            </button>
          </div>
        </div>

        {/* Promotions Grid */}
        {activePromos.length === 0 ? (
          <div className="bg-white rounded-3xl p-10 text-center border-2 border-dashed border-[#FDE68A] max-w-lg mx-auto shadow-sm">
            <Tag className="w-12 h-12 text-orange-500 mx-auto mb-3" />
            <h3 className="text-lg font-black text-[#4A2C2A]">Nenhuma promoção ativa no momento</h3>
            <p className="text-[#4A2C2A]/70 text-sm mt-1 mb-4">
              Clique no botão abaixo para discriminar um novo prato e definir seu preço especial promocional.
            </p>
            <button
              onClick={() => onOpenAdmin('promocoes')}
              className="px-5 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-black text-sm cursor-pointer shadow-md"
            >
              Cadastrar Promoção Agora
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {activePromos.map((promo) => {
              const discount = promo.originalPrice - promo.promotionalPrice;
              const discountPercent = Math.round((discount / promo.originalPrice) * 100);

              const whatsappText = encodeURIComponent(
                `Olá! Gostaria de pedir a promoção especial *${promo.dishName}* por ${formatCurrency(
                  promo.promotionalPrice
                )}!`
              );

              return (
                <div
                  key={promo.id}
                  className={`group relative bg-white rounded-3xl overflow-hidden border-2 transition-all duration-300 flex flex-col ${
                    promo.highlighted
                      ? 'border-orange-400 shadow-[6px_6px_0px_0px_rgba(251,146,60,0.6)] hover:shadow-2xl hover:border-orange-500'
                      : 'border-[#FDE68A] shadow-[4px_4px_0px_0px_rgba(251,146,60,0.3)] hover:shadow-xl hover:border-orange-400'
                  }`}
                >
                  {/* Photo Container */}
                  <div className="relative h-56 overflow-hidden bg-stone-100">
                    <img
                      src={promo.image || 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80'}
                      alt={promo.dishName}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-black/20" />

                    {/* Badge */}
                    <div className="absolute top-3 left-3">
                      <span className="inline-flex items-center gap-1 bg-yellow-400 text-orange-950 text-xs font-black px-3.5 py-1.5 rounded-full shadow-md uppercase tracking-wider border border-orange-300">
                        <Sparkles className="w-3.5 h-3.5 text-red-600 fill-red-600" />
                        {promo.badgeText || `ECONOMIZE ${formatCurrency(discount)}`}
                      </span>
                    </div>

                    {/* Percentage Pill */}
                    <div className="absolute top-3 right-3 bg-red-600 text-white font-black text-xs px-2.5 py-1 rounded-full shadow-md">
                      -{discountPercent}% OFF
                    </div>

                    {/* Dish Name on bottom of image */}
                    <div className="absolute bottom-3 left-4 right-4 text-white">
                      <h3 className="text-xl font-black font-['Outfit'] leading-tight drop-shadow-sm">
                        {promo.dishName}
                      </h3>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-2">
                      <p className="text-sm text-[#4A2C2A]/80 leading-relaxed font-medium">
                        {promo.description}
                      </p>

                      {promo.validDays && (
                        <div className="flex items-center gap-1.5 text-xs text-orange-950 font-bold bg-yellow-100/80 px-2.5 py-1 rounded-xl w-fit border border-orange-200">
                          <Calendar className="w-3.5 h-3.5 text-orange-700" />
                          <span>Válido: {promo.validDays}</span>
                        </div>
                      )}
                    </div>

                    {/* Price Discrimination & Actions */}
                    <div className="pt-3 border-t border-[#FDE68A] space-y-3">
                      <div className="flex items-baseline justify-between">
                        <div>
                          <span className="text-xs text-[#4A2C2A]/50 line-through block font-medium">
                            De {formatCurrency(promo.originalPrice)}
                          </span>
                          <div className="flex items-baseline gap-1">
                            <span className="text-xs font-black text-orange-600 uppercase">Por</span>
                            <span className="text-2xl sm:text-3xl font-black text-red-600 tracking-tight">
                              {formatCurrency(promo.promotionalPrice)}
                            </span>
                          </div>
                        </div>

                        <div className="text-right">
                          <span className="text-[11px] font-black text-emerald-800 bg-emerald-100/90 border border-emerald-300 px-2.5 py-0.5 rounded-lg inline-block shadow-xs">
                            Economia de {formatCurrency(discount)}
                          </span>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="grid grid-cols-2 gap-2 pt-1">
                        <button
                          onClick={() => onAddToCart(promo)}
                          className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-[#4A2C2A] hover:bg-stone-950 text-white font-black text-xs shadow-xs transition-all active:scale-95 cursor-pointer"
                        >
                          <ShoppingBag className="w-4 h-4 text-yellow-300" />
                          <span>No Carrinho</span>
                        </button>

                        <a
                          href={`https://wa.me/${whatsappNumber}?text=${whatsappText}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-green-500 hover:bg-green-600 text-white font-black text-xs shadow-xs transition-all active:scale-95 cursor-pointer"
                        >
                          <MessageCircle className="w-4 h-4" />
                          <span>WhatsApp</span>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};
