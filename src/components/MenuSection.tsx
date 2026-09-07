import React, { useState, useMemo } from 'react';
import {
  Flame,
  Beef,
  Soup,
  UtensilsCrossed,
  Wine,
  IceCream,
  Search,
  Plus,
  Check,
  ShoppingBag,
  MessageCircle,
  Users,
  Sparkles,
  SlidersHorizontal
} from 'lucide-react';
import { MenuItem, Category, CategoryId } from '../types';
import { formatCurrency } from '../lib/utils';

interface MenuSectionProps {
  categories: Category[];
  items: MenuItem[];
  onAddToCart: (item: MenuItem, quantity?: number, notes?: string) => void;
  whatsappNumber: string;
}

export const MenuSection: React.FC<MenuSectionProps> = ({
  categories,
  items,
  onAddToCart,
  whatsappNumber
}) => {
  const [selectedCategory, setSelectedCategory] = useState<CategoryId | 'todos'>('todos');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [justAddedId, setJustAddedId] = useState<string | null>(null);

  // Quick category icons map
  const getCategoryIcon = (id: CategoryId) => {
    switch (id) {
      case 'acaraje-abara':
        return <Flame className="w-4 h-4" />;
      case 'parrilla':
        return <Beef className="w-4 h-4" />;
      case 'moquecas':
        return <Soup className="w-4 h-4" />;
      case 'petiscos':
        return <UtensilsCrossed className="w-4 h-4" />;
      case 'bebidas':
        return <Wine className="w-4 h-4" />;
      case 'sobremesas':
        return <IceCream className="w-4 h-4" />;
      default:
        return <Sparkles className="w-4 h-4" />;
    }
  };

  // Collect all unique tags
  const allTags = useMemo(() => {
    const tagsSet = new Set<string>();
    items.forEach((item) => {
      item.tags?.forEach((t) => tagsSet.add(t));
    });
    return Array.from(tagsSet);
  }, [items]);

  // Filter items
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchesCategory =
        selectedCategory === 'todos' || item.category === selectedCategory;

      const matchesSearch =
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesTag = !selectedTag || (item.tags && item.tags.includes(selectedTag));

      return matchesCategory && matchesSearch && matchesTag;
    });
  }, [items, selectedCategory, searchQuery, selectedTag]);

  const handleAdd = (item: MenuItem) => {
    onAddToCart(item);
    setJustAddedId(item.id);
    setTimeout(() => {
      setJustAddedId((curr) => (curr === item.id ? null : curr));
    }, 1200);
  };

  return (
    <section id="cardapio" className="py-14 sm:py-20 bg-[#FFF8E7]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Title */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-10">
          <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-yellow-400 border border-orange-300 text-orange-950 font-black text-xs uppercase tracking-wider shadow-xs">
            <Flame className="w-4 h-4 text-red-600 fill-red-600" />
            <span>Cardápio Completo Dendê e Brasa</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#4A2C2A] font-['Outfit'] tracking-tight">
            Sabores da Bahia & do Fogo
          </h2>
          <p className="text-[#4A2C2A]/80 text-base sm:text-lg font-medium">
            Escolha seus itens favoritos, monte seu pedido e envie direto para o nosso WhatsApp com um clique!
          </p>
        </div>

        {/* Search and Filters Bar */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col sm:flex-row items-center gap-3">
            {/* Search Input */}
            <div className="relative w-full sm:flex-1">
              <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-orange-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar acarajé, picanha, moqueca, chopp..."
                className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-white border-2 border-orange-200 text-[#4A2C2A] placeholder:text-[#4A2C2A]/40 focus:outline-hidden focus:border-orange-500 focus:ring-2 focus:ring-orange-300/30 text-sm shadow-xs transition-all font-medium"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-orange-600 hover:text-orange-800 p-1"
                >
                  Limpar
                </button>
              )}
            </div>

            {/* Quick Reset Filter */}
            {selectedTag && (
              <button
                onClick={() => setSelectedTag(null)}
                className="px-3 py-2 text-xs font-black text-orange-950 bg-yellow-400 rounded-xl border border-orange-300 hover:bg-yellow-300 cursor-pointer shadow-xs"
              >
                Filtro: {selectedTag} ✕
              </button>
            )}
          </div>

          {/* Categories Pill Navigation */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            <button
              onClick={() => {
                setSelectedCategory('todos');
                setSelectedTag(null);
              }}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-black whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === 'todos'
                  ? 'bg-orange-600 text-white shadow-[4px_4px_0px_0px_rgba(74,44,42,1)]'
                  : 'bg-white hover:bg-yellow-50 text-[#4A2C2A] border border-[#FDE68A]'
              }`}
            >
              <Sparkles className="w-4 h-4 text-yellow-300" />
              <span>Todos os Pratos ({items.length})</span>
            </button>

            {categories.map((cat) => {
              const count = items.filter((i) => i.category === cat.id).length;
              const isSelected = selectedCategory === cat.id;

              return (
                <button
                  key={cat.id}
                  onClick={() => {
                    setSelectedCategory(cat.id);
                    setSelectedTag(null);
                  }}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-black whitespace-nowrap transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-orange-600 text-white shadow-[4px_4px_0px_0px_rgba(74,44,42,1)]'
                      : 'bg-white hover:bg-yellow-50 text-[#4A2C2A] border border-[#FDE68A]'
                  }`}
                >
                  <span className={isSelected ? 'text-white' : 'text-orange-600'}>
                    {getCategoryIcon(cat.id)}
                  </span>
                  <span>{cat.name}</span>
                  <span
                    className={`text-[11px] px-1.5 py-0.2 rounded-full font-black ${
                      isSelected ? 'bg-white/25 text-white' : 'bg-yellow-100 text-orange-950'
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Subtags pills if available */}
          {allTags.length > 0 && (
            <div className="flex items-center gap-1.5 overflow-x-auto pt-1 pb-1">
              <span className="text-xs text-[#4A2C2A]/60 font-black flex items-center gap-1 pr-1">
                <SlidersHorizontal className="w-3 h-3" /> Tags:
              </span>
              {allTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
                  className={`px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                    selectedTag === tag
                      ? 'bg-yellow-400 text-orange-950 font-black shadow-xs border border-orange-300'
                      : 'bg-white text-[#4A2C2A] border border-orange-200/80 hover:bg-yellow-50'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Menu Items Grid */}
        {filteredItems.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border-2 border-dashed border-[#FDE68A]">
            <UtensilsCrossed className="w-12 h-12 text-orange-400 mx-auto mb-3" />
            <h3 className="text-lg font-black text-[#4A2C2A]">Nenhum prato encontrado</h3>
            <p className="text-[#4A2C2A]/70 text-sm mt-1 mb-4">
              Tente pesquisar com outro termo ou alterne as categorias acima.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('todos');
                setSelectedTag(null);
              }}
              className="px-5 py-2.5 bg-[#4A2C2A] text-white rounded-xl text-xs font-black shadow-md"
            >
              Ver Cardápio Completo
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredItems.map((item) => {
              const isAdded = justAddedId === item.id;
              const directWhatsappText = encodeURIComponent(
                `Olá Dendê e Brasa! Gostaria de pedir: *1x ${item.name}* (${formatCurrency(item.price)}).`
              );

              return (
                <div
                  key={item.id}
                  className="bg-white rounded-3xl overflow-hidden border border-[#FDE68A] hover:border-orange-400 shadow-[4px_4px_0px_0px_rgba(251,146,60,0.25)] hover:shadow-xl transition-all duration-300 flex flex-col group"
                >
                  {/* Image Container */}
                  <div className="relative h-48 sm:h-52 overflow-hidden bg-stone-100">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/10" />

                    {/* Top tags */}
                    <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                      {item.isChefSpecial && (
                        <span className="inline-flex items-center gap-1 bg-yellow-400 text-orange-950 text-[11px] font-black px-2.5 py-1 rounded-full shadow-md uppercase tracking-wider border border-orange-300">
                          <Flame className="w-3 h-3 text-red-600 fill-red-600" /> Especial do Chef
                        </span>
                      )}
                      {item.tags?.map((t, idx) => (
                        <span
                          key={idx}
                          className="bg-stone-900/80 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-0.5 rounded-full"
                        >
                          {t}
                        </span>
                      ))}
                    </div>

                    {/* Serves info */}
                    {item.serves && (
                      <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-xs text-yellow-300 text-[11px] font-bold px-2.5 py-1 rounded-lg flex items-center gap-1">
                        <Users className="w-3.5 h-3.5" />
                        <span>{item.serves}</span>
                      </div>
                    )}
                  </div>

                  {/* Card Content */}
                  <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="font-black text-lg text-[#4A2C2A] font-['Outfit'] group-hover:text-orange-600 transition-colors leading-snug">
                          {item.name}
                        </h3>
                      </div>
                      <p className="text-[#4A2C2A]/75 text-xs sm:text-sm line-clamp-3 leading-relaxed font-medium">
                        {item.description}
                      </p>
                    </div>

                    {/* Footer / Price & Order */}
                    <div className="pt-3 border-t border-[#FDE68A] flex items-center justify-between gap-3">
                      <div>
                        <span className="text-[10px] font-black text-orange-800/60 uppercase tracking-wider block">
                          Preço
                        </span>
                        <span className="text-xl sm:text-2xl font-black text-[#4A2C2A] font-['Outfit']">
                          {formatCurrency(item.price)}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        {/* Quick WhatsApp single item button */}
                        <a
                          href={`https://wa.me/${whatsappNumber}?text=${directWhatsappText}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2.5 rounded-xl border-2 border-green-500 text-green-600 hover:bg-green-50 transition-colors"
                          title="Pedir este prato diretamente no WhatsApp"
                          aria-label="Pedir no WhatsApp"
                        >
                          <MessageCircle className="w-4 h-4" />
                        </a>

                        {/* Add to order cart button */}
                        <button
                          onClick={() => handleAdd(item)}
                          className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl font-black text-xs sm:text-sm transition-all active:scale-95 shadow-xs cursor-pointer ${
                            isAdded
                              ? 'bg-green-600 text-white'
                              : 'bg-orange-600 hover:bg-orange-700 text-white'
                          }`}
                        >
                          {isAdded ? (
                            <>
                              <Check className="w-4 h-4" />
                              <span>Adicionado!</span>
                            </>
                          ) : (
                            <>
                              <Plus className="w-4 h-4" />
                              <span>Pedir</span>
                            </>
                          )}
                        </button>
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
