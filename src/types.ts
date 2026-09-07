export type CategoryId =
  | 'acaraje-abara'
  | 'parrilla'
  | 'moquecas'
  | 'petiscos'
  | 'bebidas'
  | 'sobremesas';

export interface Category {
  id: CategoryId;
  name: string;
  icon: string;
  badge: string;
  description: string;
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: CategoryId;
  image: string;
  isAvailable: boolean;
  isChefSpecial?: boolean;
  serves?: string;
  spiciness?: 'mild' | 'medium' | 'hot' | 'optional';
  tags?: string[];
}

export interface SpecialPromotion {
  id: string;
  dishName: string;
  description: string;
  originalPrice: number;
  promotionalPrice: number;
  badgeText: string;
  active: boolean;
  validDays?: string;
  image: string;
  highlighted?: boolean;
}

export interface CartItem {
  item: MenuItem | {
    id: string;
    name: string;
    description: string;
    price: number;
    category: CategoryId | 'promocao';
    image: string;
  };
  quantity: number;
  notes?: string;
}

export interface RestaurantConfig {
  name: string;
  tagline: string;
  description: string;
  whatsappNumber: string; // e.g. "5571999999999"
  phoneDisplay: string; // e.g. "(71) 99999-9999"
  instagramHandle: string;
  instagramUrl: string;
  cardapioUrl: string;
  address: {
    street: string;
    number: string;
    complement: string;
    neighborhood: string;
    city: string;
    state: string;
    cep: string;
    reference: string;
  };
  hours: {
    day: string;
    dayCode: number; // 0=domingo, 1=segunda, ...
    open: string;
    close: string;
    isClosed?: boolean;
  }[];
  features: string[];
  videoUrl?: string;
  videoTitle?: string;
  videoDescription?: string;
}
