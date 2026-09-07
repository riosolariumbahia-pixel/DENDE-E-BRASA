import React, { useState } from 'react';
import {
  X,
  Plus,
  Minus,
  Trash2,
  ShoppingBag,
  MessageCircle,
  MapPin,
  Utensils,
  CreditCard,
  DollarSign,
  QrCode,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { CartItem, RestaurantConfig } from '../types';
import { formatCurrency, generateWhatsAppOrderMessage, CustomerOrderInfo } from '../lib/utils';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (index: number, newQty: number) => void;
  onUpdateNotes: (index: number, notes: string) => void;
  onRemoveItem: (index: number) => void;
  onClearCart: () => void;
  config: RestaurantConfig;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onUpdateNotes,
  onRemoveItem,
  onClearCart,
  config
}) => {
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [orderType, setOrderType] = useState<'delivery' | 'retirada' | 'mesa'>('delivery');
  const [address, setAddress] = useState('');
  const [tableNumber, setTableNumber] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'pix' | 'cartao_credito' | 'cartao_debito' | 'dinheiro'>('pix');
  const [changeFor, setChangeFor] = useState('');
  const [generalNotes, setGeneralNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const subtotal = items.reduce((acc, ci) => acc + ci.item.price * ci.quantity, 0);

  const handleSendWhatsApp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim()) {
      alert('Por favor, informe seu nome para identificar o pedido.');
      return;
    }

    if (orderType === 'delivery' && !address.trim()) {
      alert('Por favor, informe o endereço de entrega em Salvador/Stella Maris.');
      return;
    }

    setIsSubmitting(true);

    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch {
      // ignore
    }

    const orderInfo: CustomerOrderInfo = {
      name: customerName,
      phone: customerPhone,
      orderType,
      address,
      tableNumber,
      paymentMethod,
      changeFor,
      generalNotes
    };

    const encodedMessage = generateWhatsAppOrderMessage(items, config, orderInfo);
    const whatsappUrl = `https://wa.me/${config.whatsappNumber}?text=${encodedMessage}`;

    setTimeout(() => {
      window.open(whatsappUrl, '_blank');
      setIsSubmitting(false);
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-stone-950/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md sm:max-w-lg bg-[#FFF8E7] shadow-2xl flex flex-col border-l border-[#FDE68A]">
          {/* Header */}
          <div className="p-5 sm:p-6 bg-orange-600 text-white flex items-center justify-between shadow-xs">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                <ShoppingBag className="w-5 h-5 text-yellow-300" />
              </div>
              <div>
                <h3 className="font-black text-xl font-['Outfit']">Sua Sacola de Pedido</h3>
                <p className="text-xs text-yellow-100 font-medium">
                  {items.length} {items.length === 1 ? 'item selecionado' : 'itens selecionados'}
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-white/80 hover:text-white hover:bg-white/20 transition-colors cursor-pointer"
              aria-label="Fechar sacola"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Content Area */}
          <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-16 space-y-4">
                <div className="w-20 h-20 rounded-3xl bg-yellow-100 flex items-center justify-center text-orange-600">
                  <ShoppingBag className="w-10 h-10" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-black text-lg text-[#4A2C2A]">Sua sacola está vazia</h4>
                  <p className="text-xs sm:text-sm text-[#4A2C2A]/70 max-w-xs font-medium">
                    Explore nosso cardápio com acarajés, abarás, cortes de parrilla e bebidas para montar seu pedido.
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="px-6 py-3 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-black text-xs sm:text-sm shadow-md transition-all cursor-pointer"
                >
                  Ver Cardápio Agora
                </button>
              </div>
            ) : (
              <>
                {/* List of Cart Items */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-[#FDE68A] text-xs font-black text-orange-950 uppercase tracking-wider">
                    <span>Pratos Selecionados</span>
                    <button
                      onClick={onClearCart}
                      className="text-red-600 hover:text-red-700 font-bold cursor-pointer"
                    >
                      Limpar tudo
                    </button>
                  </div>

                  {items.map((ci, idx) => (
                    <div
                      key={`${ci.item.id}-${idx}`}
                      className="bg-white rounded-2xl p-3.5 border border-[#FDE68A] shadow-xs space-y-2.5"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <h4 className="font-black text-sm text-[#4A2C2A] truncate">
                            {ci.item.name}
                          </h4>
                          <span className="text-xs font-black text-red-600">
                            {formatCurrency(ci.item.price * ci.quantity)}
                          </span>
                          <span className="text-[11px] text-[#4A2C2A]/60 ml-2">
                            ({formatCurrency(ci.item.price)} un.)
                          </span>
                        </div>

                        {/* Quantity Stepper */}
                        <div className="flex items-center gap-1.5 bg-yellow-100/80 rounded-xl p-1 shrink-0 border border-orange-200">
                          <button
                            type="button"
                            onClick={() => onUpdateQuantity(idx, ci.quantity - 1)}
                            className="w-7 h-7 rounded-lg bg-white hover:bg-yellow-200/50 flex items-center justify-center text-orange-950 transition-colors cursor-pointer font-bold"
                            aria-label="Diminuir quantidade"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-6 text-center text-xs font-black text-orange-950">
                            {ci.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => onUpdateQuantity(idx, ci.quantity + 1)}
                            className="w-7 h-7 rounded-lg bg-white hover:bg-yellow-200/50 flex items-center justify-center text-orange-950 transition-colors cursor-pointer font-bold"
                            aria-label="Aumentar quantidade"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        {/* Remove */}
                        <button
                          type="button"
                          onClick={() => onRemoveItem(idx)}
                          className="text-stone-400 hover:text-red-600 p-1 cursor-pointer"
                          aria-label="Remover item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Item note / observações */}
                      <div>
                        <input
                          type="text"
                          value={ci.notes || ''}
                          onChange={(e) => onUpdateNotes(idx, e.target.value)}
                          placeholder="Ex: sem pimenta, carne ao ponto, bem passado..."
                          className="w-full text-xs px-3 py-1.5 rounded-lg bg-white border border-orange-200 text-[#4A2C2A] placeholder:text-[#4A2C2A]/40 focus:outline-hidden focus:border-orange-500 font-medium"
                        />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Customer and Delivery details form */}
                <form id="orderForm" onSubmit={handleSendWhatsApp} className="space-y-4 pt-4 border-t border-[#FDE68A]">
                  <h4 className="font-black text-sm text-[#4A2C2A] flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-red-600 fill-red-600" />
                    <span>Detalhes do Seu Pedido</span>
                  </h4>

                  {/* Name and Phone */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-black text-[#4A2C2A] mb-1">
                        Seu Nome <span className="text-red-600">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        placeholder="Ex: Maria Santos"
                        className="w-full text-xs sm:text-sm px-3 py-2 rounded-xl bg-white border border-orange-200 text-[#4A2C2A] focus:outline-hidden focus:border-orange-500 font-medium"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-black text-[#4A2C2A] mb-1">
                        WhatsApp / Celular
                      </label>
                      <input
                        type="tel"
                        value={customerPhone}
                        onChange={(e) => setCustomerPhone(e.target.value)}
                        placeholder="(71) 99999-9999"
                        className="w-full text-xs sm:text-sm px-3 py-2 rounded-xl bg-white border border-orange-200 text-[#4A2C2A] focus:outline-hidden focus:border-orange-500 font-medium"
                      />
                    </div>
                  </div>

                  {/* Order Type Toggle */}
                  <div>
                    <label className="block text-xs font-black text-[#4A2C2A] mb-1.5">
                      Como deseja receber?
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      <button
                        type="button"
                        onClick={() => setOrderType('delivery')}
                        className={`py-2 px-2 rounded-xl text-xs font-black flex flex-col items-center gap-1 border transition-all cursor-pointer ${
                          orderType === 'delivery'
                            ? 'bg-yellow-400 text-orange-950 border-orange-300 shadow-xs'
                            : 'bg-white text-[#4A2C2A] border-[#FDE68A] hover:bg-yellow-50'
                        }`}
                      >
                        <MapPin className="w-3.5 h-3.5" />
                        <span>Delivery</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setOrderType('retirada')}
                        className={`py-2 px-2 rounded-xl text-xs font-black flex flex-col items-center gap-1 border transition-all cursor-pointer ${
                          orderType === 'retirada'
                            ? 'bg-yellow-400 text-orange-950 border-orange-300 shadow-xs'
                            : 'bg-white text-[#4A2C2A] border-[#FDE68A] hover:bg-yellow-50'
                        }`}
                      >
                        <ShoppingBag className="w-3.5 h-3.5" />
                        <span>Retirada</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setOrderType('mesa')}
                        className={`py-2 px-2 rounded-xl text-xs font-black flex flex-col items-center gap-1 border transition-all cursor-pointer ${
                          orderType === 'mesa'
                            ? 'bg-yellow-400 text-orange-950 border-orange-300 shadow-xs'
                            : 'bg-white text-[#4A2C2A] border-[#FDE68A] hover:bg-yellow-50'
                        }`}
                      >
                        <Utensils className="w-3.5 h-3.5" />
                        <span>Na Mesa</span>
                      </button>
                    </div>
                  </div>

                  {/* Conditional address or table number */}
                  {orderType === 'delivery' && (
                    <div>
                      <label className="block text-xs font-black text-[#4A2C2A] mb-1">
                        Endereço de Entrega <span className="text-red-600">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder="Rua, número, complemento, bairro (Stella Maris, etc.)"
                        className="w-full text-xs sm:text-sm px-3 py-2 rounded-xl bg-white border border-orange-200 text-[#4A2C2A] focus:outline-hidden focus:border-orange-500 font-medium"
                      />
                    </div>
                  )}

                  {orderType === 'mesa' && (
                    <div>
                      <label className="block text-xs font-black text-[#4A2C2A] mb-1">
                        Número da sua Mesa
                      </label>
                      <input
                        type="text"
                        value={tableNumber}
                        onChange={(e) => setTableNumber(e.target.value)}
                        placeholder="Ex: Mesa 07"
                        className="w-full text-xs sm:text-sm px-3 py-2 rounded-xl bg-white border border-orange-200 text-[#4A2C2A] focus:outline-hidden focus:border-orange-500 font-medium"
                      />
                    </div>
                  )}

                  {/* Payment Method */}
                  <div>
                    <label className="block text-xs font-black text-[#4A2C2A] mb-1.5">
                      Forma de Pagamento
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setPaymentMethod('pix')}
                        className={`p-2.5 rounded-xl text-xs font-black flex items-center gap-2 border transition-all cursor-pointer ${
                          paymentMethod === 'pix'
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-500 shadow-xs'
                            : 'bg-white text-[#4A2C2A] border-[#FDE68A] hover:bg-yellow-50'
                        }`}
                      >
                        <QrCode className="w-4 h-4 text-emerald-600" />
                        <span>PIX</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setPaymentMethod('cartao_credito')}
                        className={`p-2.5 rounded-xl text-xs font-black flex items-center gap-2 border transition-all cursor-pointer ${
                          paymentMethod === 'cartao_credito'
                            ? 'bg-blue-50 text-blue-800 border-blue-500 shadow-xs'
                            : 'bg-white text-[#4A2C2A] border-[#FDE68A] hover:bg-yellow-50'
                        }`}
                      >
                        <CreditCard className="w-4 h-4 text-blue-600" />
                        <span>Crédito</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setPaymentMethod('cartao_debito')}
                        className={`p-2.5 rounded-xl text-xs font-black flex items-center gap-2 border transition-all cursor-pointer ${
                          paymentMethod === 'cartao_debito'
                            ? 'bg-blue-50 text-blue-800 border-blue-500 shadow-xs'
                            : 'bg-white text-[#4A2C2A] border-[#FDE68A] hover:bg-yellow-50'
                        }`}
                      >
                        <CreditCard className="w-4 h-4 text-cyan-600" />
                        <span>Débito</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setPaymentMethod('dinheiro')}
                        className={`p-2.5 rounded-xl text-xs font-black flex items-center gap-2 border transition-all cursor-pointer ${
                          paymentMethod === 'dinheiro'
                            ? 'bg-amber-100 text-amber-950 border-amber-500 shadow-xs'
                            : 'bg-white text-[#4A2C2A] border-[#FDE68A] hover:bg-yellow-50'
                        }`}
                      >
                        <DollarSign className="w-4 h-4 text-orange-600" />
                        <span>Dinheiro</span>
                      </button>
                    </div>

                    {paymentMethod === 'dinheiro' && (
                      <div className="mt-2">
                        <input
                          type="text"
                          value={changeFor}
                          onChange={(e) => setChangeFor(e.target.value)}
                          placeholder="Precisa de troco para quanto? (Ex: R$ 100,00)"
                          className="w-full text-xs px-3 py-2 rounded-xl bg-white border border-orange-200 text-[#4A2C2A] focus:outline-hidden focus:border-orange-500 font-medium"
                        />
                      </div>
                    )}
                  </div>

                  {/* General observations */}
                  <div>
                    <label className="block text-xs font-black text-[#4A2C2A] mb-1">
                      Observações Gerais (opcional)
                    </label>
                    <textarea
                      rows={2}
                      value={generalNotes}
                      onChange={(e) => setGeneralNotes(e.target.value)}
                      placeholder="Ex: Interfone 203, talheres descartáveis, caprichar no vinagrete..."
                      className="w-full text-xs sm:text-sm px-3 py-2 rounded-xl bg-white border border-orange-200 text-[#4A2C2A] focus:outline-hidden focus:border-orange-500 resize-none font-medium"
                    />
                  </div>
                </form>
              </>
            )}
          </div>

          {/* Footer with Total and WhatsApp Order Button */}
          {items.length > 0 && (
            <div className="p-5 sm:p-6 bg-white border-t border-[#FDE68A] space-y-4 shadow-lg">
              <div className="flex items-center justify-between text-[#4A2C2A]">
                <span className="font-black text-sm text-[#4A2C2A]/70">Subtotal dos itens:</span>
                <span className="font-black text-2xl font-['Outfit'] text-[#4A2C2A]">
                  {formatCurrency(subtotal)}
                </span>
              </div>

              <button
                type="submit"
                form="orderForm"
                disabled={isSubmitting}
                className="w-full py-4 px-6 rounded-2xl bg-green-500 hover:bg-green-600 text-white font-black text-base flex items-center justify-center gap-3 shadow-[4px_4px_0px_0px_rgba(74,44,42,1)] hover:shadow-xl active:scale-98 transition-all cursor-pointer"
              >
                <MessageCircle className="w-5 h-5 fill-white text-green-500" />
                <span>{isSubmitting ? 'Gerando Pedido...' : 'Enviar Pedido via WhatsApp'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <p className="text-[11px] text-center text-[#4A2C2A]/60 font-medium">
                O pedido será enviado formatado com todos os itens diretamente para o WhatsApp oficial do Dendê e Brasa.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
