import { Category, MenuItem, SpecialPromotion, RestaurantConfig } from '../types';

export const INITIAL_CATEGORIES: Category[] = [
  {
    id: 'acaraje-abara',
    name: 'Acarajé & Abará',
    icon: 'Flame',
    badge: 'Dendê Puro',
    description: 'Fritos no azeite de dendê legítimo ou cozidos na folha de bananeira ao vapor'
  },
  {
    id: 'parrilla',
    name: 'Parrilla & Carnes',
    icon: 'Beef',
    badge: 'Fogo & Brasa',
    description: 'Cortes nobres selecionados, assados no ponto perfeito na brasa viva'
  },
  {
    id: 'moquecas',
    name: 'Moquecas & Frutos do Mar',
    icon: 'Soup',
    badge: 'Tradição Baiana',
    description: 'Moquecas fumegantes na panela de barro com leite de coco fresco e dendê'
  },
  {
    id: 'petiscos',
    name: 'Petiscos & Entradas',
    icon: 'UtensilsCrossed',
    badge: 'Pra Compartilhar',
    description: 'Porções generosas para curtir com os amigos e a família'
  },
  {
    id: 'bebidas',
    name: 'Bebidas & Drinks',
    icon: 'Wine',
    badge: 'Geladíssimas',
    description: 'Caipirinhas com frutas regionais da Bahia, chopp trincando e sucos'
  },
  {
    id: 'sobremesas',
    name: 'Sobremesas Típicas',
    icon: 'IceCream',
    badge: 'Doces da Bahia',
    description: 'O toque doce e inesquecível da nossa gastronomia afetiva'
  }
];

export const INITIAL_RESTAURANT_CONFIG: RestaurantConfig = {
  name: 'Dendê e Brasa',
  tagline: 'Acarajé & Parrilla em Stella Maris',
  description: 'O encontro perfeito da rica tradição baiana no azeite de dendê com o calor e suculência da legítima parrilla na brasa.',
  whatsappNumber: '5571999992025',
  phoneDisplay: '(71) 99999-2025',
  instagramHandle: '@dendeebrasaoficial',
  instagramUrl: 'https://www.instagram.com/dendeebrasaoficial?stkn=MWd4OXRlcGUyamhmNw==',
  cardapioUrl: 'https://www.dguests.com.br/cardapio/dendeebrasa',
  address: {
    street: 'Alameda Dilson Jatahy Fonseca',
    number: '1248',
    complement: 'Empório Greco',
    neighborhood: 'Stella Maris',
    city: 'Salvador',
    state: 'BA',
    cep: '41600-100',
    reference: 'Próximo à orla de Stella Maris e Alameda Praia de Guaratuba'
  },
  hours: [
    { day: 'Segunda-feira', dayCode: 1, open: '', close: '', isClosed: true },
    { day: 'Terça-feira', dayCode: 2, open: '17:00', close: '23:30' },
    { day: 'Quarta-feira', dayCode: 3, open: '17:00', close: '23:30' },
    { day: 'Quinta-feira', dayCode: 4, open: '17:00', close: '23:30' },
    { day: 'Sexta-feira', dayCode: 5, open: '17:00', close: '00:30' },
    { day: 'Sábado', dayCode: 6, open: '12:00', close: '00:30' },
    { day: 'Domingo', dayCode: 0, open: '12:00', close: '22:00' }
  ],
  features: [
    'Acarajé frito na hora no puro dendê',
    'Cortes nobres na brasa e parrilla',
    'Ambiente aconchegante e familiar',
    'Área ao ar livre & Espaço Kids no complexo',
    'Cerveja trincando e drinks artesanais',
    'Estacionamento no Empório Greco'
  ],
  videoUrl: '/uploads/restaurant-video-1788783913175.mp4?t=1788783913220',
  videoTitle: 'Espaço Real • Dendê e Brasa em Stella Maris',
  videoDescription: 'Parrilla Brava com brasas incandescentes, espetinhos e queijo coalho grelhados na hora, mesas ao ar livre com famílias e amigos, telão transmitindo futebol ao vivo e cerveja geladíssima no Empório Greco.'
};

export const INITIAL_PROMOTIONS: SpecialPromotion[] = [
  {
    id: 'promo-1',
    dishName: 'Combo Brasa & Dendê Completo',
    description: '1 Acarajé Completo gigante + 1 Mini Porção de Picanha na Brasa com aipim na manteiga de garrafa e farofa crocante.',
    originalPrice: 68.90,
    promotionalPrice: 49.90,
    badgeText: '🔥 MAIS PEDIDO - ECONOMIZE R$ 19',
    active: true,
    validDays: 'Terça a Sexta-feira',
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80',
    highlighted: true
  },
  {
    id: 'promo-2',
    dishName: 'Acarajé em Dobro no Prato',
    description: '2 Bolinhos de Acarajé crocantes fritos no dendê, acompanhados de molheiras fartas de vatapá, caruru, camarão seco e salada vinagrete.',
    originalPrice: 42.00,
    promotionalPrice: 32.90,
    badgeText: '🌶️ QUINTA DO ACARAJÉ',
    active: true,
    validDays: 'Terça e Quinta-feira',
    image: 'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?auto=format&fit=crop&w=800&q=80',
    highlighted: false
  },
  {
    id: 'promo-3',
    dishName: 'Picanha Premium na Parrilla (Serve 2)',
    description: '500g de Picanha nobre grelhada na brasa, servida com arroz branco, feijão tropeiro baiano, queijo coalho tostado e farofinha.',
    originalPrice: 129.90,
    promotionalPrice: 99.90,
    badgeText: '🥩 OFERTA ESPECIAL DO CHEF',
    active: true,
    validDays: 'Todos os dias',
    image: 'https://images.unsplash.com/photo-1558030006-450675393462?auto=format&fit=crop&w=800&q=80',
    highlighted: true
  }
];

export const INITIAL_MENU_ITEMS: MenuItem[] = [
  // Acarajé & Abará
  {
    id: 'ac-1',
    name: 'Acarajé Tradicional Completo',
    description: 'Bolinho crocante de feijão fradinho frito no puro azeite de dendê, recheado com vatapá cremoso de castanha e amendoim, caruru artesanal, camarão seco defumado, vinagrete fresco e pimenta baiana a gosto.',
    price: 22.00,
    category: 'acaraje-abara',
    image: 'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?auto=format&fit=crop&w=800&q=80',
    isAvailable: true,
    isChefSpecial: true,
    spiciness: 'optional',
    tags: ['Mais Vendido', 'Tradição Baiana']
  },
  {
    id: 'ac-2',
    name: 'Abará Completo na Folha',
    description: 'Massa delicada de feijão temperado cozido no vapor envolto na folha de bananeira. Acompanha porções generosas de vatapá, caruru, camarão seco e salada.',
    price: 22.00,
    category: 'acaraje-abara',
    image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80',
    isAvailable: true,
    spiciness: 'optional',
    tags: ['Cozido no Vapor']
  },
  {
    id: 'ac-3',
    name: 'Porção de Mini Acarajés (10 unidades)',
    description: '10 mini bolinhos de acarajé estalando de crocantes, servidos com molheiras separadas de vatapá da casa, caruru, camarão seco e vinagrete para você montar à mesa.',
    price: 49.90,
    category: 'acaraje-abara',
    image: 'https://images.unsplash.com/photo-1541544741938-0af808871cc0?auto=format&fit=crop&w=800&q=80',
    isAvailable: true,
    serves: '2 a 3 pessoas',
    tags: ['Ideal para Compartilhar']
  },
  {
    id: 'ac-4',
    name: 'Porção Mista Mini Acarajé & Abará (12 unidades)',
    description: '6 mini acarajés e 6 mini abarás com todas as guarnições tradicionais baianas servidas separadamente em molheiras.',
    price: 56.00,
    category: 'acaraje-abara',
    image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=800&q=80',
    isAvailable: true,
    serves: '3 a 4 pessoas',
    tags: ['Melhor dos Dois Mundos']
  },

  // Parrilla & Carnes
  {
    id: 'par-1',
    name: 'Picanha na Brasa com Aipim na Manteiga',
    description: 'Suculenta picanha de corte nobre selada na brasa alta, guarnecida com aipim frito na manteiga de garrafa do sertão, queijo coalho dourado e farofa crocante de dendê.',
    price: 89.90,
    category: 'parrilla',
    image: 'https://images.unsplash.com/photo-1558030006-450675393462?auto=format&fit=crop&w=800&q=80',
    isAvailable: true,
    isChefSpecial: true,
    serves: '2 pessoas',
    tags: ['Destaque da Parrilla', 'Carne Nobre']
  },
  {
    id: 'par-2',
    name: 'Brasa do Nordeste Especial',
    description: 'Nossa seleção exclusiva de carnes: Fraldinha grelhada, carne de sol artesanal fatiada, linguiça toscana defumada, queijo coalho e aipim crocante.',
    price: 94.00,
    category: 'parrilla',
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80',
    isAvailable: true,
    serves: '2 a 3 pessoas',
    tags: ['Especialidade da Casa']
  },
  {
    id: 'par-3',
    name: 'Costelinha Suína ao Barbecue Baiano',
    description: 'Costelinha macia desmanchando do osso, banhada com molho barbecue artesanal elaborado com redução de goiabada cascão e pimenta de cheiro.',
    price: 68.00,
    category: 'parrilla',
    image: 'https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?auto=format&fit=crop&w=800&q=80',
    isAvailable: true,
    serves: '2 pessoas',
    tags: ['Agridoce Baiano']
  },
  {
    id: 'par-4',
    name: 'Fraldinha Red com Chimichurri de Ervas da Terra',
    description: 'Fraldinha maturada assada na grelha argentina, servida fatiada com molho chimichurri fresco aromatizado com coentro baiano e pimenta biquinho.',
    price: 76.00,
    category: 'parrilla',
    image: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&w=800&q=80',
    isAvailable: true,
    serves: '2 pessoas',
    tags: ['Parrilla Argentina & Bahia']
  },

  // Moquecas & Frutos do Mar
  {
    id: 'moq-1',
    name: 'Moqueca Mista de Peixe & Camarão',
    description: 'Postas nobres de peixe da costa baiana e camarões selecionados cozidos lentamente com leite de coco da praia, azeite de dendê, pimentões e coentro fresco. Acompanha arroz, pirão e farofa.',
    price: 138.00,
    category: 'moquecas',
    image: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&w=800&q=80',
    isAvailable: true,
    isChefSpecial: true,
    serves: '2 pessoas fartas',
    tags: ['Na Panela de Barro']
  },
  {
    id: 'moq-2',
    name: 'Bobó de Camarão Cremoso',
    description: 'Camarões salteados no azeite de dendê envolvidos em um aveludado purê de aipim com leite de coco e especiarias. Acompanha arroz branco soltinho.',
    price: 118.00,
    category: 'moquecas',
    image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=800&q=80',
    isAvailable: true,
    serves: '2 pessoas',
    tags: ['Receita Centenária']
  },
  {
    id: 'moq-3',
    name: 'Isca de Peixe Crocante com Maionese de Dendê',
    description: 'Tiras de filé de peixe empanadas em crosta crocante com limão capeta e molho tártaro artesanal com toque de dendê.',
    price: 49.00,
    category: 'moquecas',
    image: 'https://images.unsplash.com/photo-1535400255456-984241443b29?auto=format&fit=crop&w=800&q=80',
    isAvailable: true,
    serves: '2 pessoas',
    tags: ['Petisco da Orla']
  },

  // Petiscos
  {
    id: 'pet-1',
    name: 'Dadinhos de Tapioca com Geleia de Pimenta',
    description: 'Dadinhos crocantes de queijo coalho e tapioca granulada dourados, servidos com geleia artesanal agridoce de pimenta dedo-de-moça e melaço de cana.',
    price: 36.00,
    category: 'petiscos',
    image: 'https://images.unsplash.com/photo-1541544741938-0af808871cc0?auto=format&fit=crop&w=800&q=80',
    isAvailable: true,
    tags: ['Vegetariano', 'Favorito do Bar']
  },
  {
    id: 'pet-2',
    name: 'Queijo Coalho Grelhado com Mel de Engenho',
    description: 'Espetos de queijo coalho tostados na brasa, regados com mel de engenho genuíno e toque de raspas de limão e alecrim.',
    price: 32.00,
    category: 'petiscos',
    image: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=800&q=80',
    isAvailable: true,
    tags: ['Vegetariano', 'Na Brasa']
  },
  {
    id: 'pet-3',
    name: 'Bolinho de Feijoada Baiana (6 unidades)',
    description: 'Bolinhos recheados com couve refogada no alho e bacon crocante, acompanhados de caldinho de pimenta e gomos de laranja.',
    price: 38.00,
    category: 'petiscos',
    image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=800&q=80',
    isAvailable: true,
    tags: ['Petisco de Boteco']
  },
  {
    id: 'pet-4',
    name: 'Pão de Alho Especial Recheado na Brasa',
    description: 'Pão baguete recheado com pasta de alho suave, queijo muçarela derretido e ervas finas, gratinado na brasa quente.',
    price: 22.00,
    category: 'petiscos',
    image: 'https://images.unsplash.com/photo-1619860860774-1e2e17343432?auto=format&fit=crop&w=800&q=80',
    isAvailable: true,
    tags: ['Acompanha a Parrilla']
  },

  // Bebidas
  {
    id: 'beb-1',
    name: 'Caipirinha da Bahia com Frutas Regionais',
    description: 'Preparada com cachaça artesanal da terra ou vodka, à escolha do cliente: Cajá, Umbu, Seriguela, Maracujá ou Limão com gengibre.',
    price: 24.00,
    category: 'bebidas',
    image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=800&q=80',
    isAvailable: true,
    tags: ['Frutas Típicas', 'Refrescante']
  },
  {
    id: 'beb-2',
    name: 'Chopp Artesanal Geladíssimo (Caneca Zero Grau 400ml)',
    description: 'Chopp lager artesanal leve, servido em caneca congelada trincando.',
    price: 13.90,
    category: 'bebidas',
    image: 'https://images.unsplash.com/photo-1608270191724-4f0e9f1ee361?auto=format&fit=crop&w=800&q=80',
    isAvailable: true,
    tags: ['Caneca Congelada']
  },
  {
    id: 'beb-3',
    name: 'Suco Natural da Fruta (Jarron 500ml)',
    description: 'Polpa fresca natural batida na hora: Graviola, Cajá, Mangaba, Acerola, Laranja ou Maracujá.',
    price: 12.00,
    category: 'bebidas',
    image: 'https://images.unsplash.com/photo-1613478223719-2ab802602423?auto=format&fit=crop&w=800&q=80',
    isAvailable: true,
    tags: ['Natural']
  },
  {
    id: 'beb-4',
    name: 'Água de Coco Gelada da Costa',
    description: 'Água de coco natural gelada servida no próprio coco ou em copo com gelo.',
    price: 9.00,
    category: 'bebidas',
    image: 'https://images.unsplash.com/photo-1525385133512-2f3bdd039054?auto=format&fit=crop&w=800&q=80',
    isAvailable: true,
    tags: ['Hidratação Baiana']
  },

  // Sobremesas
  {
    id: 'sob-1',
    name: 'Cocada Cremosa Queimada na Brasa com Sorvete',
    description: 'Cocada morna com raspas tostadas de coco da Bahia, servida com uma bola de sorvete artesanal de tapioca e fio de melaço.',
    price: 26.00,
    category: 'sobremesas',
    image: 'https://images.unsplash.com/photo-1587314168485-3236d6710814?auto=format&fit=crop&w=800&q=80',
    isAvailable: true,
    tags: ['Sobremesa Campeã']
  },
  {
    id: 'sob-2',
    name: 'Pudim de Leite Condensado com Fava de Baunilha',
    description: 'Pudim lisinho, sem furinhos, com calda dourada caramelizada de açúcar orgânico e toque suave de cumaru baiano.',
    price: 18.00,
    category: 'sobremesas',
    image: 'https://images.unsplash.com/photo-1517427294546-5aa121f68e8a?auto=format&fit=crop&w=800&q=80',
    isAvailable: true,
    tags: ['Tradicional']
  }
];
