import React, { useState } from 'react';
import {
  Flame,
  ShoppingBag,
  Clock,
  Menu as MenuIcon,
  X,
  Lock,
  Phone,
  Instagram
} from 'lucide-react';
import { RestaurantConfig } from '../types';
import { checkStoreOpenStatus } from '../lib/utils';

interface NavbarProps {
  config: RestaurantConfig;
  cartCount: number;
  onOpenCart: () => void;
  onOpenAdmin: () => void;
  isAdminLoggedIn: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  config,
  cartCount,
  onOpenCart,
  onOpenAdmin,
  isAdminLoggedIn
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const openStatus = checkStoreOpenStatus(config.hours);

  const navLinks = [
    { label: 'Cardápio', href: '#cardapio' },
    { label: 'Promoções do Chef', href: '#promocoes' },
    { label: 'O Restaurante', href: '#sobre' },
    { label: 'Localização & Horários', href: '#localizacao' }
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#FFF8E7]/95 backdrop-blur-md border-b border-[#FDE68A] transition-all shadow-xs">
      {/* Top micro-announcement bar */}
      <div className="bg-gradient-to-r from-orange-600 via-red-600 to-orange-700 text-white text-xs font-semibold py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 bg-yellow-400 text-orange-950 px-2 py-0.5 rounded-full text-[11px] font-black uppercase tracking-wider shadow-xs">
              <Flame className="w-3 h-3 text-red-600 fill-red-600" /> Acarajé & Parrilla
            </span>
            <span className="hidden sm:inline text-amber-100 font-medium">Empório Greco • Alameda Dilson Jatahy Fonseca, 1248 - Stella Maris, Salvador</span>
          </div>
          <div className="flex items-center gap-4 text-xs font-bold">
            <a
              href={config.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-amber-100 hover:text-yellow-300 transition-colors"
            >
              <Instagram className="w-3.5 h-3.5" />
              <span>{config.instagramHandle}</span>
            </a>
            <a
              href={`https://wa.me/${config.whatsappNumber}?text=${encodeURIComponent('Olá Dendê e Brasa! Gostaria de tirar uma dúvida.')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-amber-100 hover:text-yellow-300 transition-colors"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>{config.phoneDisplay}</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Brand Logo */}
          <a href="#" className="flex items-center gap-3 group">
            <div className="w-12 h-12 bg-orange-500 rounded-2xl flex items-center justify-center text-white font-black text-2xl shadow-lg group-hover:scale-105 transition-transform duration-200">
              <Flame className="w-7 h-7 text-yellow-300 fill-yellow-300 drop-shadow-[0_2px_8px_rgba(254,240,138,0.8)]" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-black text-2xl tracking-tight bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent font-['Outfit']">
                  Dendê <span className="text-[#4A2C2A]">&</span> Brasa
                </span>
              </div>
              <p className="text-[11px] font-extrabold tracking-wider uppercase text-orange-900/80">
                Acarajé & Parrilla • Stella Maris
              </p>
            </div>
          </a>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-7 text-xs font-extrabold uppercase tracking-widest text-[#4A2C2A]">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="transition-colors py-1 relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[2px] after:bg-orange-600 hover:after:w-full after:transition-all flex items-center gap-1.5 hover:text-orange-600"
              >
                <span>{link.label}</span>
              </a>
            ))}
          </nav>

          {/* Status & Actions */}
          <div className="flex items-center gap-3">
            {/* Live Store Status */}
            <div
              className={`hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-bold ${openStatus.colorClass}`}
              title={openStatus.nextInfo}
            >
              <span className={`w-2 h-2 rounded-full ${openStatus.isOpen ? 'bg-emerald-500 animate-pulse' : 'bg-stone-400'}`} />
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                {openStatus.statusText}
              </span>
              <span className="text-[11px] opacity-75 hidden xl:inline">({openStatus.nextInfo})</span>
            </div>

            {/* Cart Button */}
            <button
              onClick={onOpenCart}
              className="relative flex items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white px-4 py-2.5 rounded-full font-black text-sm shadow-md hover:shadow-lg transition-all active:scale-95 cursor-pointer"
              aria-label="Ver sacola de pedidos"
            >
              <ShoppingBag className="w-4 h-4 text-yellow-300" />
              <span className="hidden sm:inline">Sacola</span>
              {cartCount > 0 && (
                <span className="bg-yellow-400 text-orange-950 text-xs px-2 py-0.5 rounded-full font-black min-w-[20px] text-center shadow-xs">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Admin Management Button */}
            <button
              onClick={onOpenAdmin}
              className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
                isAdminLoggedIn
                  ? 'bg-orange-500 text-white border-orange-600 shadow-sm'
                  : 'text-[#4A2C2A] hover:text-orange-600 bg-white hover:bg-yellow-50 border-[#FDE68A]'
              }`}
              title={isAdminLoggedIn ? 'Painel Administrativo Ativo' : 'Acesso do Administrador (Editar Cardápio/Promoções)'}
              aria-label="Admin do Restaurante"
            >
              <Lock className="w-4 h-4" />
            </button>

            {/* Mobile Menu Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-[#4A2C2A] hover:bg-yellow-100/50 cursor-pointer"
              aria-label="Abrir menu mobile"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-[#FDE68A] py-4 space-y-2 bg-[#FFF8E7] animate-fadeIn">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-sm font-bold text-[#4A2C2A] hover:bg-yellow-100 hover:text-orange-600"
              >
                {link.label}
              </a>
            ))}
            <div className="pt-2 border-t border-[#FDE68A] flex items-center justify-between px-3 text-xs text-[#4A2C2A]">
              <span className="flex items-center gap-1.5 font-medium">
                <span className={`w-2 h-2 rounded-full ${openStatus.isOpen ? 'bg-emerald-500' : 'bg-stone-400'}`} />
                {openStatus.statusText} • {openStatus.nextInfo}
              </span>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenAdmin();
                }}
                className="text-orange-600 font-extrabold underline"
              >
                Admin Cardápio
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
