import { CartItem, RestaurantConfig } from '../types';

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
}

export interface CustomerOrderInfo {
  name: string;
  phone: string;
  orderType: 'delivery' | 'retirada' | 'mesa';
  address?: string;
  tableNumber?: string;
  paymentMethod: 'pix' | 'cartao_credito' | 'cartao_debito' | 'dinheiro';
  changeFor?: string;
  generalNotes?: string;
}

export function generateWhatsAppOrderMessage(
  items: CartItem[],
  config: RestaurantConfig,
  info: CustomerOrderInfo
): string {
  const subtotal = items.reduce((acc, item) => acc + item.item.price * item.quantity, 0);
  const now = new Date();
  const dateStr = now.toLocaleDateString('pt-BR');
  const timeStr = now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

  let message = `🌴 *PEDIDO - DENDÊ E BRASA* 🥩\n`;
  message += `_Acarajé & Parrilla em Stella Maris_\n`;
  message += `Data: ${dateStr} às ${timeStr}\n\n`;

  message += `👤 *Cliente:* ${info.name}\n`;
  if (info.phone) {
    message += `📱 *Telefone:* ${info.phone}\n`;
  }

  if (info.orderType === 'delivery') {
    message += `🛵 *Tipo:* Entrega (Delivery)\n`;
    message += `📍 *Endereço:* ${info.address || 'Não informado'}\n`;
  } else if (info.orderType === 'retirada') {
    message += `🛍️ *Tipo:* Retirada no Restaurante (Stella Maris)\n`;
  } else {
    message += `🍽️ *Tipo:* Consumo no Local (Mesa ${info.tableNumber || 'Aguardando'})\n`;
  }

  const paymentLabels: Record<string, string> = {
    pix: 'PIX (Chave rápida)',
    cartao_credito: 'Cartão de Crédito (Levar maquininha)',
    cartao_debito: 'Cartão de Débito (Levar maquininha)',
    dinheiro: 'Dinheiro'
  };
  message += `💳 *Pagamento:* ${paymentLabels[info.paymentMethod] || info.paymentMethod}\n`;
  if (info.paymentMethod === 'dinheiro' && info.changeFor) {
    message += `💵 *Troco para:* ${info.changeFor}\n`;
  }

  message += `\n📋 *ITENS DO PEDIDO:*\n`;
  items.forEach((ci, idx) => {
    const itemTotal = ci.item.price * ci.quantity;
    message += `${idx + 1}. *${ci.quantity}x* ${ci.item.name} - ${formatCurrency(itemTotal)}\n`;
    if (ci.notes && ci.notes.trim()) {
      message += `   ↳ _Obs: ${ci.notes.trim()}_\n`;
    }
  });

  message += `\n💰 *TOTAL DO PEDIDO:* ${formatCurrency(subtotal)}\n`;

  if (info.generalNotes && info.generalNotes.trim()) {
    message += `\n📝 *Observações Gerais:* ${info.generalNotes.trim()}\n`;
  }

  message += `\nObrigado! Aguardo a confirmação do pedido pelo restaurante. ✨`;

  return encodeURIComponent(message);
}

export function checkStoreOpenStatus(hours: RestaurantConfig['hours']): {
  isOpen: boolean;
  statusText: string;
  nextInfo: string;
  colorClass: string;
} {
  const now = new Date();
  const currentDay = now.getDay(); // 0 = Domingo, 1 = Segunda, ...
  const currentHour = now.getHours();
  const currentMinute = now.getMinutes();
  const currentTimeVal = currentHour * 60 + currentMinute;

  const todaySchedule = hours.find((h) => h.dayCode === currentDay);

  if (!todaySchedule || todaySchedule.isClosed || !todaySchedule.open || !todaySchedule.close) {
    return {
      isOpen: false,
      statusText: 'Fechado Hoje',
      nextInfo: 'Descanso da equipe. Terça-feira abrimos às 17:00',
      colorClass: 'text-amber-500 bg-amber-50 border-amber-200'
    };
  }

  const [openH, openM] = todaySchedule.open.split(':').map(Number);
  const openTimeVal = openH * 60 + openM;

  const [closeH, closeM] = todaySchedule.close.split(':').map(Number);
  // If close hour is after midnight (e.g., 00:30 or 01:00)
  let closeTimeVal = closeH * 60 + closeM;
  if (closeH < 5) {
    closeTimeVal += 24 * 60; // next day early morning
  }

  // Check if opened
  let isCurrentlyOpen = false;
  if (closeH < 5) {
    // Spans past midnight
    if (currentTimeVal >= openTimeVal || currentTimeVal < closeH * 60 + closeM) {
      isCurrentlyOpen = true;
    }
  } else {
    if (currentTimeVal >= openTimeVal && currentTimeVal <= closeTimeVal) {
      isCurrentlyOpen = true;
    }
  }

  if (isCurrentlyOpen) {
    return {
      isOpen: true,
      statusText: 'Aberto Agora',
      nextInfo: `Fecha às ${todaySchedule.close}`,
      colorClass: 'text-emerald-600 bg-emerald-50 border-emerald-200'
    };
  } else {
    return {
      isOpen: false,
      statusText: 'Fechado no Momento',
      nextInfo: `Abre às ${todaySchedule.open}`,
      colorClass: 'text-stone-600 bg-stone-100 border-stone-200'
    };
  }
}
