import React, { useState, useEffect } from 'react';
import {
  Navbar
} from './components/Navbar';
import {
  Hero
} from './components/Hero';
import {
  VideoSpotlightSection
} from './components/VideoSpotlightSection';
import {
  PromotionsSection
} from './components/PromotionsSection';
import {
  MenuSection
} from './components/MenuSection';
import {
  AboutSection
} from './components/AboutSection';
import {
  LocationAndHours
} from './components/LocationAndHours';
import {
  CartDrawer
} from './components/CartDrawer';
import {
  AdminModal
} from './components/AdminModal';
import {
  Footer
} from './components/Footer';

import {
  MenuItem,
  SpecialPromotion,
  CartItem,
  RestaurantConfig
} from './types';
import {
  INITIAL_CATEGORIES,
  INITIAL_RESTAURANT_CONFIG
} from './data/initialData';
import {
  getPromotions,
  getMenuItems,
  getRestaurantConfig,
  fetchRemoteRestaurantConfig,
  saveRestaurantConfig
} from './lib/supabase';
import { MessageCircle, ShoppingBag } from 'lucide-react';
import { formatCurrency } from './lib/utils';

export default function App() {
  const [promotions, setPromotions] = useState<SpecialPromotion[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [config, setConfig] = useState<RestaurantConfig>(INITIAL_RESTAURANT_CONFIG);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [adminInitialTab, setAdminInitialTab] = useState<'promocoes' | 'cardapio' | 'video' | 'loja' | 'supabase'>('promocoes');
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Load data on startup
  const loadData = async () => {
    try {
      const [promosData, menuData, configData] = await Promise.all([
        getPromotions(),
        getMenuItems(),
        fetchRemoteRestaurantConfig()
      ]);
      setPromotions(promosData);
      setMenuItems(menuData);
      setConfig(configData);
    } catch (err) {
      console.error('Error loading data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    // Load cart from session storage if exists
    const savedCart = sessionStorage.getItem('dendeebrasa_cart');
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch {
        // ignore
      }
    }
  }, []);

  // Save cart to sessionStorage
  useEffect(() => {
    sessionStorage.setItem('dendeebrasa_cart', JSON.stringify(cart));
  }, [cart]);

  // Cart operations
  const handleAddToCart = (
    itemOrPromo: MenuItem | SpecialPromotion,
    quantity: number = 1,
    notes?: string
  ) => {
    let cartFormattedItem: CartItem['item'];

    if ('promotionalPrice' in itemOrPromo) {
      // It is a SpecialPromotion
      cartFormattedItem = {
        id: itemOrPromo.id,
        name: `[PROMO] ${itemOrPromo.dishName}`,
        description: itemOrPromo.description,
        price: itemOrPromo.promotionalPrice,
        category: 'promocao',
        image: itemOrPromo.image
      };
    } else {
      cartFormattedItem = itemOrPromo;
    }

    setCart((prev) => {
      const existingIndex = prev.findIndex(
        (ci) => ci.item.id === cartFormattedItem.id && ci.notes === (notes || '')
      );

      if (existingIndex >= 0) {
        const updated = [...prev];
        updated[existingIndex].quantity += quantity;
        return updated;
      } else {
        return [...prev, { item: cartFormattedItem, quantity, notes }];
      }
    });

    setIsCartOpen(true);
  };

  const handleUpdateQuantity = (index: number, newQty: number) => {
    if (newQty <= 0) {
      handleRemoveItem(index);
    } else {
      setCart((prev) => {
        const updated = [...prev];
        updated[index].quantity = newQty;
        return updated;
      });
    }
  };

  const handleUpdateNotes = (index: number, notes: string) => {
    setCart((prev) => {
      const updated = [...prev];
      updated[index].notes = notes;
      return updated;
    });
  };

  const handleRemoveItem = (index: number) => {
    setCart((prev) => prev.filter((_, idx) => idx !== index));
  };

  const handleClearCart = () => {
    setCart([]);
  };

  const handleUpdateVideoUrl = async (newUrl: string) => {
    const updated = {
      ...config,
      videoUrl: newUrl
    };
    setConfig(updated);
    await saveRestaurantConfig(updated);
  };

  // Scroll helpers
  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const openAdminWithTab = (tab: 'promocoes' | 'cardapio' | 'video' | 'loja' | 'supabase' = 'promocoes') => {
    setAdminInitialTab(tab);
    setIsAdminOpen(true);
  };

  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalCartAmount = cart.reduce((sum, item) => sum + item.item.price * item.quantity, 0);

  return (
    <div className="min-h-screen bg-[#FFF8E7] text-[#4A2C2A] flex flex-col selection:bg-orange-500 selection:text-white">
      {/* Navigation */}
      <Navbar
        config={config}
        cartCount={totalCartCount}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenAdmin={() => openAdminWithTab('promocoes')}
        isAdminLoggedIn={isAdminLoggedIn}
      />

      {/* Main Content Sections */}
      <main className="flex-1">
        {/* Hero Section */}
        <Hero
          config={config}
          onScrollToMenu={() => scrollToSection('cardapio')}
          onScrollToPromos={() => scrollToSection('promocoes')}
          onScrollToVideo={() => scrollToSection('espaco-video')}
        />

        {/* Video Spotlight - Main Presentation of the Restaurant Space */}
        <VideoSpotlightSection
          config={config}
          onOpenAdmin={() => openAdminWithTab('video')}
          onScrollToMenu={() => scrollToSection('cardapio')}
          onScrollToLocation={() => scrollToSection('localizacao')}
          onUpdateVideoUrl={handleUpdateVideoUrl}
          isAdmin={isAdminLoggedIn}
        />

        {/* Promotions Section with Special Prices */}
        <PromotionsSection
          promotions={promotions}
          onAddToCart={(promo) => handleAddToCart(promo)}
          onOpenAdmin={(tab) => openAdminWithTab(tab || 'promocoes')}
          whatsappNumber={config.whatsappNumber}
          isAdmin={isAdminLoggedIn}
        />

        {/* Full Interactive Menu */}
        <MenuSection
          categories={INITIAL_CATEGORIES}
          items={menuItems}
          onAddToCart={(item, qty, notes) => handleAddToCart(item, qty, notes)}
          whatsappNumber={config.whatsappNumber}
        />

        {/* About Dendê e Brasa Heritage */}
        <AboutSection config={config} />

        {/* Location with Google Map & Real-time Opening Hours */}
        <LocationAndHours config={config} />
      </main>

      {/* Cart Drawer / Slide-over */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cart}
        onUpdateQuantity={handleUpdateQuantity}
        onUpdateNotes={handleUpdateNotes}
        onRemoveItem={handleRemoveItem}
        onClearCart={handleClearCart}
        config={config}
      />

      {/* Admin Management Modal */}
      <AdminModal
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        promotions={promotions}
        menuItems={menuItems}
        categories={INITIAL_CATEGORIES}
        config={config}
        onRefreshData={loadData}
        isAdminLoggedIn={isAdminLoggedIn}
        setIsAdminLoggedIn={setIsAdminLoggedIn}
        initialTab={adminInitialTab}
      />

      {/* Footer */}
      <Footer
        config={config}
        onOpenAdmin={() => openAdminWithTab('promocoes')}
      />

      {/* Floating Action Buttons */}
      <div className="fixed bottom-5 right-5 z-40 flex flex-col gap-3 items-end">
        {/* Floating Cart Button (when items in cart) */}
        {totalCartCount > 0 && (
          <button
            onClick={() => setIsCartOpen(true)}
            className="flex items-center gap-2.5 bg-[#4A2C2A] hover:bg-stone-950 text-white px-4 py-3 rounded-full shadow-[6px_6px_0px_0px_rgba(251,146,60,1)] border-2 border-yellow-400 hover:scale-105 transition-all duration-200 cursor-pointer"
            aria-label="Abrir sacola de compras"
          >
            <div className="relative">
              <ShoppingBag className="w-5 h-5 text-yellow-400" />
              <span className="absolute -top-2 -right-2.5 bg-red-600 text-white text-[11px] font-black w-5 h-5 rounded-full flex items-center justify-center border-2 border-[#4A2C2A]">
                {totalCartCount}
              </span>
            </div>
            <div className="text-left hidden sm:block">
              <span className="text-[10px] text-yellow-200/80 block leading-tight font-bold uppercase tracking-wider">Ver Sacola</span>
              <span className="text-xs font-black text-yellow-400 leading-tight">
                {formatCurrency(totalCartAmount)}
              </span>
            </div>
          </button>
        )}

        {/* Floating WhatsApp Button */}
        <a
          href={`https://wa.me/${config.whatsappNumber}?text=${encodeURIComponent(
            'Olá Dendê e Brasa! Gostaria de tirar uma dúvida sobre o cardápio e atendimento.'
          )}`}
          target="_blank"
          rel="noopener noreferrer"
          className="group flex items-center gap-2.5 bg-green-500 hover:bg-green-600 text-white p-3.5 sm:px-4 sm:py-3.5 rounded-full shadow-2xl hover:shadow-green-500/30 hover:scale-105 transition-all duration-200 cursor-pointer"
          title="Fale conosco no WhatsApp"
          aria-label="WhatsApp Dendê e Brasa"
        >
          <MessageCircle className="w-6 h-6 fill-white text-emerald-600" />
          <span className="hidden sm:inline font-bold text-xs">
            Pedir no WhatsApp
          </span>
        </a>
      </div>
    </div>
  );
}
