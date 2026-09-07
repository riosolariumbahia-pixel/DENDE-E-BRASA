import React, { useState, useEffect } from 'react';
import {
  X,
  Lock,
  Unlock,
  Plus,
  Edit2,
  Trash2,
  Save,
  Check,
  Flame,
  Tag,
  Database,
  Phone,
  Settings,
  AlertCircle,
  Copy,
  ExternalLink,
  DollarSign,
  Utensils,
  Image as ImageIcon
} from 'lucide-react';
import {
  SpecialPromotion,
  MenuItem,
  RestaurantConfig,
  CategoryId,
  Category
} from '../types';
import {
  savePromotion,
  deletePromotion,
  saveMenuItem,
  deleteMenuItem,
  saveRestaurantConfig,
  getAdminPassword,
  setAdminPassword,
  checkSupabaseHealth,
  SupabaseHealth,
  SUPABASE_SETUP_SQL,
  SUPABASE_URL
} from '../lib/supabase';
import { formatCurrency } from '../lib/utils';
import { saveVideoFile } from '../lib/videoStorage';

interface AdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  promotions: SpecialPromotion[];
  menuItems: MenuItem[];
  categories: Category[];
  config: RestaurantConfig;
  onRefreshData: () => void;
  isAdminLoggedIn: boolean;
  setIsAdminLoggedIn: (logged: boolean) => void;
  initialTab?: 'promocoes' | 'cardapio' | 'loja' | 'supabase';
}

export const AdminModal: React.FC<AdminModalProps> = ({
  isOpen,
  onClose,
  promotions,
  menuItems,
  categories,
  config,
  onRefreshData,
  isAdminLoggedIn,
  setIsAdminLoggedIn,
  initialTab = 'promocoes'
}) => {
  const [activeTab, setActiveTab] = useState<'promocoes' | 'cardapio' | 'loja' | 'supabase'>(initialTab);
  
  // Login form state
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  // Password change state
  const [newPass, setNewPass] = useState('');
  const [passChangedMsg, setPassChangedMsg] = useState('');

  // Supabase health state
  const [health, setHealth] = useState<SupabaseHealth | null>(null);
  const [copiedSql, setCopiedSql] = useState(false);

  // --- Promo Form State ---
  const [editingPromoId, setEditingPromoId] = useState<string | null>(null);
  const [promoDishName, setPromoDishName] = useState('');
  const [promoDesc, setPromoDesc] = useState('');
  const [promoOriginalPrice, setPromoOriginalPrice] = useState('');
  const [promoSpecialPrice, setPromoSpecialPrice] = useState('');
  const [promoBadge, setPromoBadge] = useState('🔥 OFERTA ESPECIAL');
  const [promoValidDays, setPromoValidDays] = useState('Terça a Domingo');
  const [promoImage, setPromoImage] = useState('');
  const [promoHighlight, setPromoHighlight] = useState(false);
  const [promoFeedback, setPromoFeedback] = useState('');

  // --- Menu Item Form State ---
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [itemName, setItemName] = useState('');
  const [itemDesc, setItemDesc] = useState('');
  const [itemPrice, setItemPrice] = useState('');
  const [itemCategory, setItemCategory] = useState<CategoryId>('acaraje-abara');
  const [itemImage, setItemImage] = useState('');
  const [itemServes, setItemServes] = useState('');
  const [itemIsSpecial, setItemIsSpecial] = useState(false);
  const [itemAvailable, setItemAvailable] = useState(true);
  const [itemFeedback, setItemFeedback] = useState('');

  // --- Store Config State ---
  const [storeWhatsapp, setStoreWhatsapp] = useState(config.whatsappNumber);
  const [storePhoneDisplay, setStorePhoneDisplay] = useState(config.phoneDisplay);
  const [storeStreet, setStoreStreet] = useState(config.address.street);
  const [storeNumber, setStoreNumber] = useState(config.address.number);
  const [storeNeighborhood, setStoreNeighborhood] = useState(config.address.neighborhood);
  const [storeVideoUrl, setStoreVideoUrl] = useState(config.videoUrl || '/dende-e-brasa-espaco.mp4');
  const [storeVideoTitle, setStoreVideoTitle] = useState(config.videoTitle || 'Conheça o Espaço Dendê e Brasa');
  const [storeVideoDesc, setStoreVideoDesc] = useState(config.videoDescription || 'Mesas ao ar livre, telão com jogos ao vivo, espetinhos e carnes na brasa viva em Stella Maris.');
  const [storeConfigFeedback, setStoreConfigFeedback] = useState('');

  useEffect(() => {
    if (isOpen && isAdminLoggedIn) {
      checkSupabaseHealth().then(setHealth);
    }
  }, [isOpen, isAdminLoggedIn]);

  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);

  if (!isOpen) return null;

  // Handle Login
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const correctPass = getAdminPassword();
    if (username.trim().toLowerCase() === 'admin' && password === correctPass) {
      setIsAdminLoggedIn(true);
      setLoginError('');
      checkSupabaseHealth().then(setHealth);
    } else {
      setLoginError('Usuário ou senha incorretos. (Dica padrão: usuário "admin", senha "dende2025")');
    }
  };

  const handleLogout = () => {
    setIsAdminLoggedIn(false);
    setPassword('');
  };

  // --- Save or Update Promotion ---
  const handleSavePromo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoDishName.trim() || !promoSpecialPrice) {
      alert('Por favor preencha o nome do prato e o preço promocional.');
      return;
    }

    const orig = parseFloat(promoOriginalPrice.replace(',', '.')) || 0;
    const spec = parseFloat(promoSpecialPrice.replace(',', '.'));

    const promoData: SpecialPromotion = {
      id: editingPromoId || `promo-${Date.now()}`,
      dishName: promoDishName.trim(),
      description: promoDesc.trim(),
      originalPrice: orig > 0 ? orig : spec * 1.2,
      promotionalPrice: spec,
      badgeText: promoBadge.trim() || 'PROMOÇÃO',
      active: true,
      validDays: promoValidDays.trim(),
      image: promoImage.trim() || 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80',
      highlighted: promoHighlight
    };

    await savePromotion(promoData);
    setPromoFeedback('Promoção salva com sucesso no sistema e Supabase!');
    setTimeout(() => setPromoFeedback(''), 3000);
    resetPromoForm();
    onRefreshData();
  };

  const resetPromoForm = () => {
    setEditingPromoId(null);
    setPromoDishName('');
    setPromoDesc('');
    setPromoOriginalPrice('');
    setPromoSpecialPrice('');
    setPromoBadge('🔥 OFERTA ESPECIAL');
    setPromoValidDays('Terça a Domingo');
    setPromoImage('');
    setPromoHighlight(false);
  };

  const handleEditPromo = (p: SpecialPromotion) => {
    setEditingPromoId(p.id);
    setPromoDishName(p.dishName);
    setPromoDesc(p.description);
    setPromoOriginalPrice(p.originalPrice.toString());
    setPromoSpecialPrice(p.promotionalPrice.toString());
    setPromoBadge(p.badgeText);
    setPromoValidDays(p.validDays || '');
    setPromoImage(p.image);
    setPromoHighlight(Boolean(p.highlighted));
  };

  const handleDeletePromo = async (id: string) => {
    if (confirm('Deseja realmente remover esta promoção especial?')) {
      await deletePromotion(id);
      onRefreshData();
    }
  };

  // --- Save or Update Menu Item ---
  const handleSaveMenuItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!itemName.trim() || !itemPrice) {
      alert('Por favor preencha o nome do prato e o preço.');
      return;
    }

    const priceNum = parseFloat(itemPrice.replace(',', '.'));

    const itemData: MenuItem = {
      id: editingItemId || `item-${Date.now()}`,
      name: itemName.trim(),
      description: itemDesc.trim(),
      price: priceNum,
      category: itemCategory,
      image: itemImage.trim() || 'https://images.unsplash.com/photo-1558030006-450675393462?auto=format&fit=crop&w=800&q=80',
      isAvailable: itemAvailable,
      isChefSpecial: itemIsSpecial,
      serves: itemServes.trim() || undefined
    };

    await saveMenuItem(itemData);
    setItemFeedback('Prato atualizado no cardápio com sucesso!');
    setTimeout(() => setItemFeedback(''), 3000);
    resetItemForm();
    onRefreshData();
  };

  const resetItemForm = () => {
    setEditingItemId(null);
    setItemName('');
    setItemDesc('');
    setItemPrice('');
    setItemCategory('acaraje-abara');
    setItemImage('');
    setItemServes('');
    setItemIsSpecial(false);
    setItemAvailable(true);
  };

  const handleEditItem = (item: MenuItem) => {
    setEditingItemId(item.id);
    setItemName(item.name);
    setItemDesc(item.description);
    setItemPrice(item.price.toString());
    setItemCategory(item.category);
    setItemImage(item.image);
    setItemServes(item.serves || '');
    setItemIsSpecial(Boolean(item.isChefSpecial));
    setItemAvailable(item.isAvailable);
  };

  const handleDeleteItem = async (id: string) => {
    if (confirm('Deseja excluir este prato do cardápio?')) {
      await deleteMenuItem(id);
      onRefreshData();
    }
  };

  // --- Save Store Config ---
  const handleSaveStoreConfig = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: RestaurantConfig = {
      ...config,
      whatsappNumber: storeWhatsapp.trim().replace(/\D/g, ''),
      phoneDisplay: storePhoneDisplay.trim(),
      videoUrl: storeVideoUrl.trim() || '/dende-e-brasa-espaco.mp4',
      videoTitle: storeVideoTitle.trim(),
      videoDescription: storeVideoDesc.trim(),
      address: {
        ...config.address,
        street: storeStreet.trim(),
        number: storeNumber.trim(),
        neighborhood: storeNeighborhood.trim()
      }
    };
    saveRestaurantConfig(updated);
    setStoreConfigFeedback('Dados do restaurante salvos com sucesso!');
    setTimeout(() => setStoreConfigFeedback(''), 3000);
    onRefreshData();
  };

  // --- Change Admin Password ---
  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPass.trim().length < 4) {
      alert('A nova senha deve ter no mínimo 4 caracteres.');
      return;
    }
    setAdminPassword(newPass.trim());
    setPassChangedMsg('Senha de administrador alterada com sucesso!');
    setNewPass('');
    setTimeout(() => setPassChangedMsg(''), 3500);
  };

  const copySqlToClipboard = () => {
    navigator.clipboard.writeText(SUPABASE_SETUP_SQL);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6">
      <div className="bg-[#FFF8E7] rounded-3xl max-w-4xl w-full overflow-hidden shadow-2xl border-2 border-[#FDE68A] flex flex-col max-h-[90vh]">
        {/* Modal Top Bar */}
        <div className="p-5 sm:p-6 bg-[#4A2C2A] text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-yellow-400 text-orange-950 flex items-center justify-center border border-orange-300 font-bold shadow-xs">
              <Flame className="w-5 h-5 fill-red-600 text-red-600" />
            </div>
            <div>
              <h3 className="font-black text-xl font-['Outfit']">Painel Administrativo</h3>
              <p className="text-xs text-yellow-100 font-medium">
                Gestão de Promoções, Preços, Cardápio e Supabase
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {isAdminLoggedIn && (
              <button
                onClick={handleLogout}
                className="text-xs font-black px-3 py-1.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white transition-colors cursor-pointer"
              >
                Sair
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-yellow-100/80 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              aria-label="Fechar modal de administração"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Content */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-8">
          {!isAdminLoggedIn ? (
            /* Login Form */
            <div className="max-w-md mx-auto py-8 space-y-6">
              <div className="text-center space-y-2">
                <div className="w-16 h-16 rounded-3xl bg-yellow-100 text-orange-600 flex items-center justify-center mx-auto shadow-xs border border-[#FDE68A]">
                  <Lock className="w-8 h-8" />
                </div>
                <h4 className="text-2xl font-black text-[#4A2C2A] font-['Outfit']">
                  Acesso Restrito do Restaurante
                </h4>
                <p className="text-xs sm:text-sm text-[#4A2C2A]/80 font-medium">
                  Informe suas credenciais para gerenciar promoções especiais com preços diferenciados, itens do cardápio e dados da loja.
                </p>
              </div>

              <form onSubmit={handleLogin} className="space-y-4 bg-white p-6 rounded-3xl border-2 border-[#FDE68A] shadow-md">
                {loginError && (
                  <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-bold flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                    <span>{loginError}</span>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-black text-[#4A2C2A] mb-1">
                    Usuário
                  </label>
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="admin"
                    className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-orange-200 focus:outline-hidden focus:border-orange-500 font-medium text-[#4A2C2A]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black text-[#4A2C2A] mb-1">
                    Senha de Acesso
                  </label>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Digite sua senha"
                    className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-orange-200 focus:outline-hidden focus:border-orange-500 font-medium text-[#4A2C2A]"
                  />
                </div>

                <div className="bg-yellow-50 rounded-xl p-3 border border-[#FDE68A] text-[11px] text-[#4A2C2A] leading-relaxed">
                  <strong>Dica de Acesso:</strong> Senha padrão inicial configurada: <code className="font-mono bg-yellow-200/60 px-1.5 py-0.5 rounded font-black text-orange-950">dende2025</code> (você poderá alterá-la a qualquer momento após entrar).
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 px-4 rounded-2xl bg-orange-600 hover:bg-orange-700 text-white font-black text-sm shadow-[4px_4px_0px_0px_rgba(74,44,42,1)] hover:shadow-lg transition-all cursor-pointer"
                >
                  Entrar no Painel
                </button>
              </form>
            </div>
          ) : (
            /* Logged in Dashboard */
            <div className="space-y-6">
              {/* Navigation Tabs */}
              <div className="flex items-center gap-2 border-b border-[#FDE68A] pb-3 overflow-x-auto">
                <button
                  onClick={() => setActiveTab('promocoes')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-xs sm:text-sm font-black transition-all cursor-pointer whitespace-nowrap ${
                    activeTab === 'promocoes'
                      ? 'bg-orange-600 text-white shadow-xs'
                      : 'bg-yellow-100/60 text-[#4A2C2A] hover:bg-yellow-100'
                  }`}
                >
                  <Tag className="w-4 h-4" />
                  <span>Promoções Especiais ({promotions.length})</span>
                </button>

                <button
                  onClick={() => setActiveTab('cardapio')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-xs sm:text-sm font-black transition-all cursor-pointer whitespace-nowrap ${
                    activeTab === 'cardapio'
                      ? 'bg-orange-600 text-white shadow-xs'
                      : 'bg-yellow-100/60 text-[#4A2C2A] hover:bg-yellow-100'
                  }`}
                >
                  <Utensils className="w-4 h-4" />
                  <span>Cardápio & Preços ({menuItems.length})</span>
                </button>

                <button
                  onClick={() => setActiveTab('loja')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-xs sm:text-sm font-black transition-all cursor-pointer whitespace-nowrap ${
                    activeTab === 'loja'
                      ? 'bg-orange-600 text-white shadow-xs'
                      : 'bg-yellow-100/60 text-[#4A2C2A] hover:bg-yellow-100'
                  }`}
                >
                  <Phone className="w-4 h-4" />
                  <span>WhatsApp & Restaurante</span>
                </button>

                <button
                  onClick={() => setActiveTab('supabase')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-xs sm:text-sm font-black transition-all cursor-pointer whitespace-nowrap ${
                    activeTab === 'supabase'
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'bg-yellow-100/60 text-[#4A2C2A] hover:bg-yellow-100'
                  }`}
                >
                  <Database className="w-4 h-4" />
                  <span>Supabase & Banco</span>
                </button>
              </div>

              {/* TAB 1: PROMOTIONS */}
              {activeTab === 'promocoes' && (
                <div className="space-y-8">
                  {/* Promotion Form */}
                  <div className="bg-white p-6 rounded-3xl border-2 border-[#FDE68A] shadow-sm space-y-4">
                    <div className="flex items-center justify-between pb-3 border-b border-[#FDE68A]">
                      <div className="flex items-center gap-2">
                        <Tag className="w-5 h-5 text-red-600 fill-red-600" />
                        <h4 className="font-black text-lg text-[#4A2C2A] font-['Outfit']">
                          {editingPromoId ? 'Editar Promoção' : 'Criar Nova Promoção Especial'}
                        </h4>
                      </div>
                      {editingPromoId && (
                        <button
                          type="button"
                          onClick={resetPromoForm}
                          className="text-xs text-orange-700 hover:text-orange-950 font-bold underline"
                        >
                          Cancelar Edição
                        </button>
                      )}
                    </div>

                    {promoFeedback && (
                      <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
                        <Check className="w-4 h-4" />
                        <span>{promoFeedback}</span>
                      </div>
                    )}

                    <form onSubmit={handleSavePromo} className="space-y-4">
                      {/* Campo para discriminar prato */}
                      <div>
                        <label className="block text-xs font-black text-[#4A2C2A] mb-1">
                          Nome do Prato em Promoção <span className="text-red-600">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={promoDishName}
                          onChange={(e) => setPromoDishName(e.target.value)}
                          placeholder="Ex: Combo Picanha na Brasa + Acarajé Completo"
                          className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-orange-200 focus:outline-hidden focus:border-orange-500 font-medium text-[#4A2C2A]"
                        />
                      </div>

                      {/* Descrição do prato */}
                      <div>
                        <label className="block text-xs font-black text-[#4A2C2A] mb-1">
                          Discriminação detalhada do prato (o que acompanha)
                        </label>
                        <textarea
                          rows={2}
                          value={promoDesc}
                          onChange={(e) => setPromoDesc(e.target.value)}
                          placeholder="Discrimine aqui os acompanhamentos: farofa de dendê, queijo coalho, vinagrete, aipim..."
                          className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-orange-200 focus:outline-hidden focus:border-orange-500 resize-none font-medium text-[#4A2C2A]"
                        />
                      </div>

                      {/* Preço Normal e Preço Promocional Especial */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-black text-[#4A2C2A] mb-1">
                            Preço Normal Original (R$)
                          </label>
                          <div className="relative">
                            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-stone-400">
                              R$
                            </span>
                            <input
                              type="number"
                              step="0.10"
                              value={promoOriginalPrice}
                              onChange={(e) => setPromoOriginalPrice(e.target.value)}
                              placeholder="68.90"
                              className="w-full text-sm pl-10 pr-3.5 py-2.5 rounded-xl border border-orange-200 focus:outline-hidden focus:border-orange-500 font-medium text-[#4A2C2A]"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-black text-red-600 mb-1">
                            Preço Especial Promocional (R$) <span className="text-red-600">*</span>
                          </label>
                          <div className="relative">
                            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-black text-red-600">
                              R$
                            </span>
                            <input
                              type="number"
                              step="0.10"
                              required
                              value={promoSpecialPrice}
                              onChange={(e) => setPromoSpecialPrice(e.target.value)}
                              placeholder="49.90"
                              className="w-full text-sm pl-10 pr-3.5 py-2.5 rounded-xl border-2 border-red-500 bg-red-50/50 text-[#4A2C2A] font-black focus:outline-hidden focus:border-red-600"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Selo e Dias Válidos */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-black text-[#4A2C2A] mb-1">
                            Texto do Selo / Destaque
                          </label>
                          <input
                            type="text"
                            value={promoBadge}
                            onChange={(e) => setPromoBadge(e.target.value)}
                            placeholder="Ex: 🔥 OFERTA DA BRASA - 25% OFF"
                            className="w-full text-sm px-3.5 py-2 rounded-xl border border-orange-200 font-medium text-[#4A2C2A]"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-black text-[#4A2C2A] mb-1">
                            Dias Válidos
                          </label>
                          <input
                            type="text"
                            value={promoValidDays}
                            onChange={(e) => setPromoValidDays(e.target.value)}
                            placeholder="Ex: Terça a Sexta-feira"
                            className="w-full text-sm px-3.5 py-2 rounded-xl border border-orange-200 font-medium text-[#4A2C2A]"
                          />
                        </div>
                      </div>

                      {/* Image URL */}
                      <div>
                        <label className="block text-xs font-black text-[#4A2C2A] mb-1">
                          URL da Imagem do Prato
                        </label>
                        <input
                          type="url"
                          value={promoImage}
                          onChange={(e) => setPromoImage(e.target.value)}
                          placeholder="https://images.unsplash.com/..."
                          className="w-full text-sm px-3.5 py-2 rounded-xl border border-orange-200 font-medium text-[#4A2C2A]"
                        />
                      </div>

                      {/* Highlight toggle */}
                      <div className="flex items-center gap-2 pt-1">
                        <input
                          type="checkbox"
                          id="promoHighlight"
                          checked={promoHighlight}
                          onChange={(e) => setPromoHighlight(e.target.checked)}
                          className="w-4 h-4 text-orange-600 rounded"
                        />
                        <label htmlFor="promoHighlight" className="text-xs font-black text-[#4A2C2A] cursor-pointer">
                          Destacar esta promoção com selo chamativo no topo do site
                        </label>
                      </div>

                      <div className="pt-2 flex items-center justify-end gap-3">
                        {editingPromoId && (
                          <button
                            type="button"
                            onClick={resetPromoForm}
                            className="px-4 py-2.5 rounded-xl border border-orange-200 text-[#4A2C2A] text-xs font-bold hover:bg-yellow-50"
                          >
                            Cancelar
                          </button>
                        )}
                        <button
                          type="submit"
                          className="px-6 py-2.5 rounded-2xl bg-orange-600 hover:bg-orange-700 text-white font-black text-sm shadow-[3px_3px_0px_0px_rgba(74,44,42,1)] transition-all flex items-center gap-2 cursor-pointer"
                        >
                          <Save className="w-4 h-4" />
                          <span>{editingPromoId ? 'Salvar Alterações' : 'Cadastrar Promoção'}</span>
                        </button>
                      </div>
                    </form>
                  </div>

                  {/* List of current promotions */}
                  <div className="space-y-3">
                    <h5 className="font-black text-sm text-orange-950 uppercase tracking-wider">
                      Promoções Cadastradas ({promotions.length})
                    </h5>

                    <div className="grid grid-cols-1 gap-3">
                      {promotions.map((p) => (
                        <div
                          key={p.id}
                          className="bg-white p-4 rounded-2xl border border-[#FDE68A] flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs"
                        >
                          <div className="flex items-start gap-3">
                            <img
                              src={p.image}
                              alt={p.dishName}
                              className="w-16 h-16 rounded-xl object-cover shrink-0 border border-orange-100"
                            />
                            <div>
                              <div className="flex items-center gap-2">
                                <h6 className="font-black text-[#4A2C2A] text-sm">{p.dishName}</h6>
                                {p.highlighted && (
                                  <span className="text-[10px] bg-yellow-400 text-orange-950 font-black px-1.5 py-0.2 rounded border border-orange-300">
                                    Destaque
                                  </span>
                                )}
                              </div>
                              <p className="text-xs text-[#4A2C2A]/70 line-clamp-1 font-medium">{p.description}</p>
                              <div className="flex items-center gap-2 mt-1">
                                <span className="text-xs text-stone-400 line-through font-medium">
                                  {formatCurrency(p.originalPrice)}
                                </span>
                                <span className="text-sm font-black text-red-600">
                                  {formatCurrency(p.promotionalPrice)}
                                </span>
                                <span className="text-[11px] text-[#4A2C2A]/60 font-medium">• {p.validDays}</span>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            <button
                              onClick={() => handleEditPromo(p)}
                              className="p-2 rounded-xl bg-yellow-100 hover:bg-yellow-200 text-orange-950 text-xs font-black flex items-center gap-1 cursor-pointer"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                              <span>Editar</span>
                            </button>
                            <button
                              onClick={() => handleDeletePromo(p.id)}
                              className="p-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 text-xs font-black flex items-center gap-1 cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span>Excluir</span>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: MENU & PRICES */}
              {activeTab === 'cardapio' && (
                <div className="space-y-8">
                  {/* Item Form */}
                  <div className="bg-white p-6 rounded-3xl border-2 border-[#FDE68A] shadow-sm space-y-4">
                    <div className="flex items-center justify-between pb-3 border-b border-[#FDE68A]">
                      <div className="flex items-center gap-2">
                        <Utensils className="w-5 h-5 text-orange-600" />
                        <h4 className="font-black text-lg text-[#4A2C2A] font-['Outfit']">
                          {editingItemId ? 'Editar Prato do Cardápio' : 'Adicionar Novo Prato ao Cardápio'}
                        </h4>
                      </div>
                      {editingItemId && (
                        <button
                          type="button"
                          onClick={resetItemForm}
                          className="text-xs text-orange-700 hover:text-orange-950 font-bold underline"
                        >
                          Cancelar Edição
                        </button>
                      )}
                    </div>

                    {itemFeedback && (
                      <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
                        <Check className="w-4 h-4" />
                        <span>{itemFeedback}</span>
                      </div>
                    )}

                    <form onSubmit={handleSaveMenuItem} className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="sm:col-span-2">
                          <label className="block text-xs font-black text-[#4A2C2A] mb-1">
                            Nome do Prato <span className="text-red-600">*</span>
                          </label>
                          <input
                            type="text"
                            required
                            value={itemName}
                            onChange={(e) => setItemName(e.target.value)}
                            placeholder="Ex: Acarajé Especial de Stella Maris"
                            className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-orange-200 focus:outline-hidden focus:border-orange-500 font-medium text-[#4A2C2A]"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-black text-[#4A2C2A] mb-1">
                            Categoria <span className="text-red-600">*</span>
                          </label>
                          <select
                            value={itemCategory}
                            onChange={(e) => setItemCategory(e.target.value as CategoryId)}
                            className="w-full text-sm px-3 py-2.5 rounded-xl border border-orange-200 bg-white font-medium text-[#4A2C2A]"
                          >
                            {categories.map((c) => (
                              <option key={c.id} value={c.id}>
                                {c.name}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-black text-[#4A2C2A] mb-1">
                          Descrição / Ingredientes
                        </label>
                        <textarea
                          rows={2}
                          value={itemDesc}
                          onChange={(e) => setItemDesc(e.target.value)}
                          placeholder="Ingredientes, acompanhamentos e preparo..."
                          className="w-full text-sm px-3.5 py-2 rounded-xl border border-orange-200 resize-none font-medium text-[#4A2C2A]"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-xs font-black text-[#4A2C2A] mb-1">
                            Preço de Venda (R$) <span className="text-red-600">*</span>
                          </label>
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-stone-400">
                              R$
                            </span>
                            <input
                              type="number"
                              step="0.10"
                              required
                              value={itemPrice}
                              onChange={(e) => setItemPrice(e.target.value)}
                              placeholder="29.90"
                              className="w-full text-sm pl-9 pr-3 py-2 rounded-xl border border-orange-200 font-black text-[#4A2C2A]"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-black text-[#4A2C2A] mb-1">
                            Porção / Serve quantas pessoas
                          </label>
                          <input
                            type="text"
                            value={itemServes}
                            onChange={(e) => setItemServes(e.target.value)}
                            placeholder="Ex: 2 pessoas"
                            className="w-full text-sm px-3 py-2 rounded-xl border border-orange-200 font-medium text-[#4A2C2A]"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-black text-[#4A2C2A] mb-1">
                            Foto (URL)
                          </label>
                          <input
                            type="url"
                            value={itemImage}
                            onChange={(e) => setItemImage(e.target.value)}
                            placeholder="https://..."
                            className="w-full text-sm px-3 py-2 rounded-xl border border-orange-200 font-medium text-[#4A2C2A]"
                          />
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-6 pt-1">
                        <label className="flex items-center gap-2 text-xs font-black text-[#4A2C2A] cursor-pointer">
                          <input
                            type="checkbox"
                            checked={itemAvailable}
                            onChange={(e) => setItemAvailable(e.target.checked)}
                            className="w-4 h-4 text-orange-600 rounded"
                          />
                          <span>Prato Disponível para Pedidos</span>
                        </label>

                        <label className="flex items-center gap-2 text-xs font-black text-[#4A2C2A] cursor-pointer">
                          <input
                            type="checkbox"
                            checked={itemIsSpecial}
                            onChange={(e) => setItemIsSpecial(e.target.checked)}
                            className="w-4 h-4 text-yellow-500 rounded"
                          />
                          <span>Marcar como Destaque da Casa</span>
                        </label>
                      </div>

                      <div className="pt-2 flex items-center justify-end gap-3">
                        {editingItemId && (
                          <button
                            type="button"
                            onClick={resetItemForm}
                            className="px-4 py-2 rounded-xl border border-orange-200 text-[#4A2C2A] text-xs font-bold"
                          >
                            Cancelar
                          </button>
                        )}
                        <button
                          type="submit"
                          className="px-6 py-2.5 rounded-2xl bg-orange-600 hover:bg-orange-700 text-white font-black text-sm shadow-[3px_3px_0px_0px_rgba(74,44,42,1)] transition-all flex items-center gap-2 cursor-pointer"
                        >
                          <Save className="w-4 h-4" />
                          <span>{editingItemId ? 'Salvar Alterações' : 'Cadastrar Prato'}</span>
                        </button>
                      </div>
                    </form>
                  </div>

                  {/* List of items */}
                  <div className="space-y-3">
                    <h5 className="font-black text-sm text-orange-950 uppercase tracking-wider">
                      Itens Atuais do Cardápio ({menuItems.length})
                    </h5>

                    <div className="max-h-96 overflow-y-auto space-y-2 pr-1">
                      {menuItems.map((item) => (
                        <div
                          key={item.id}
                          className="bg-white p-3.5 rounded-2xl border border-[#FDE68A] flex items-center justify-between gap-3 text-xs shadow-xs"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-12 h-12 rounded-xl object-cover shrink-0 border border-orange-100"
                            />
                            <div className="min-w-0">
                              <h6 className="font-black text-[#4A2C2A] text-sm truncate">
                                {item.name}
                              </h6>
                              <span className="text-[#4A2C2A]/70 font-medium">
                                {formatCurrency(item.price)} • Categoria: {item.category}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-1.5 shrink-0">
                            <button
                              onClick={() => handleEditItem(item)}
                              className="p-2 rounded-xl bg-yellow-100 hover:bg-yellow-200 text-orange-950 font-bold cursor-pointer"
                              title="Editar este prato"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteItem(item.id)}
                              className="p-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 font-bold cursor-pointer"
                              title="Excluir este prato"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: RESTAURANT CONFIG & WHATSAPP */}
              {activeTab === 'loja' && (
                <div className="space-y-6">
                  <div className="bg-white p-6 rounded-3xl border-2 border-[#FDE68A] shadow-sm space-y-4">
                    <h4 className="font-black text-lg text-[#4A2C2A] font-['Outfit'] flex items-center gap-2">
                      <Phone className="w-5 h-5 text-green-600" />
                      <span>WhatsApp de Pedidos e Endereço da Loja</span>
                    </h4>

                    {storeConfigFeedback && (
                      <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
                        <Check className="w-4 h-4" />
                        <span>{storeConfigFeedback}</span>
                      </div>
                    )}

                    <form onSubmit={handleSaveStoreConfig} className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-black text-[#4A2C2A] mb-1">
                            Número do WhatsApp para Receber Pedidos (com DDD)
                          </label>
                          <input
                            type="text"
                            required
                            value={storeWhatsapp}
                            onChange={(e) => setStoreWhatsapp(e.target.value)}
                            placeholder="5571999992025"
                            className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-orange-200 font-medium text-[#4A2C2A]"
                          />
                          <p className="text-[11px] text-[#4A2C2A]/60 mt-1 font-medium">
                            Formato com código do país e DDD (ex: 5571999992025)
                          </p>
                        </div>

                        <div>
                          <label className="block text-xs font-black text-[#4A2C2A] mb-1">
                            Telefone Exibido na Tela
                          </label>
                          <input
                            type="text"
                            value={storePhoneDisplay}
                            onChange={(e) => setStorePhoneDisplay(e.target.value)}
                            placeholder="(71) 99999-2025"
                            className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-orange-200 font-medium text-[#4A2C2A]"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-xs font-black text-[#4A2C2A] mb-1">
                            Logradouro
                          </label>
                          <input
                            type="text"
                            value={storeStreet}
                            onChange={(e) => setStoreStreet(e.target.value)}
                            className="w-full text-sm px-3.5 py-2 rounded-xl border border-orange-200 font-medium text-[#4A2C2A]"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-black text-[#4A2C2A] mb-1">
                            Número
                          </label>
                          <input
                            type="text"
                            value={storeNumber}
                            onChange={(e) => setStoreNumber(e.target.value)}
                            className="w-full text-sm px-3.5 py-2 rounded-xl border border-orange-200 font-medium text-[#4A2C2A]"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-black text-[#4A2C2A] mb-1">
                            Bairro
                          </label>
                          <input
                            type="text"
                            value={storeNeighborhood}
                            onChange={(e) => setStoreNeighborhood(e.target.value)}
                            className="w-full text-sm px-3.5 py-2 rounded-xl border border-orange-200 font-medium text-[#4A2C2A]"
                          />
                        </div>
                      </div>

                      {/* Video do Espaço Section */}
                      <div className="pt-4 border-t border-orange-200/80 space-y-4">
                        <div className="flex items-center justify-between">
                          <label className="text-sm font-black text-[#4A2C2A] flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
                            <span>Vídeo de Apresentação do Espaço (Ponto Principal)</span>
                          </label>
                          <span className="text-xs text-orange-600 font-bold">Arquivo local ou link online</span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-black text-[#4A2C2A] mb-1">
                              URL do Vídeo (.mp4 ou link direto)
                            </label>
                            <input
                              type="text"
                              value={storeVideoUrl}
                              onChange={(e) => setStoreVideoUrl(e.target.value)}
                              placeholder="/dende-e-brasa-espaco.mp4"
                              className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-orange-200 font-medium text-[#4A2C2A]"
                            />
                            <p className="text-[11px] text-[#4A2C2A]/60 mt-1 font-medium">
                              Padrão: <code>/dende-e-brasa-espaco.mp4</code> ou URL externa
                            </p>
                          </div>

                          <div>
                            <label className="block text-xs font-black text-[#4A2C2A] mb-1">
                              Carregar Arquivo de Vídeo Direto
                            </label>
                            <input
                              type="file"
                              accept="video/*"
                              onChange={async (e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  try {
                                    const savedUrl = await saveVideoFile(file);
                                    setStoreVideoUrl(savedUrl);
                                  } catch {
                                    const localUrl = URL.createObjectURL(file);
                                    setStoreVideoUrl(localUrl);
                                  }
                                }
                              }}
                              className="w-full text-xs px-3 py-2 rounded-xl border border-orange-200 font-medium text-[#4A2C2A] bg-stone-50 file:mr-2 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-orange-600 file:text-white cursor-pointer"
                            />
                            <p className="text-[11px] text-[#4A2C2A]/60 mt-1 font-medium">
                              Permite carregar seu arquivo de vídeo original do celular ou PC
                            </p>
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-black text-[#4A2C2A] mb-1">
                            Título do Vídeo
                          </label>
                          <input
                            type="text"
                            value={storeVideoTitle}
                            onChange={(e) => setStoreVideoTitle(e.target.value)}
                            placeholder="Conheça o Espaço Dendê e Brasa"
                            className="w-full text-sm px-3.5 py-2 rounded-xl border border-orange-200 font-medium text-[#4A2C2A]"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-black text-[#4A2C2A] mb-1">
                            Descrição do Vídeo
                          </label>
                          <textarea
                            rows={2}
                            value={storeVideoDesc}
                            onChange={(e) => setStoreVideoDesc(e.target.value)}
                            placeholder="Mesas ao ar livre, telão com jogos ao vivo, espetinhos e carnes na brasa viva em Stella Maris."
                            className="w-full text-sm px-3.5 py-2 rounded-xl border border-orange-200 font-medium text-[#4A2C2A]"
                          />
                        </div>
                      </div>

                      <div className="pt-2 flex justify-end">
                        <button
                          type="submit"
                          className="px-6 py-2.5 rounded-2xl bg-green-600 hover:bg-green-700 text-white font-black text-sm shadow-[3px_3px_0px_0px_rgba(74,44,42,1)] transition-all cursor-pointer"
                        >
                          Salvar Dados & Vídeo do Restaurante
                        </button>
                      </div>
                    </form>
                  </div>

                  {/* Change Password Card */}
                  <div className="bg-white p-6 rounded-3xl border-2 border-[#FDE68A] shadow-sm space-y-4">
                    <h4 className="font-black text-base text-[#4A2C2A] flex items-center gap-2">
                      <Lock className="w-4 h-4 text-orange-600" />
                      <span>Alterar Senha do Administrador</span>
                    </h4>

                    {passChangedMsg && (
                      <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold">
                        {passChangedMsg}
                      </div>
                    )}

                    <form onSubmit={handleChangePassword} className="flex flex-col sm:flex-row gap-3">
                      <input
                        type="password"
                        required
                        value={newPass}
                        onChange={(e) => setNewPass(e.target.value)}
                        placeholder="Digite a nova senha desejada"
                        className="flex-1 text-sm px-3.5 py-2.5 rounded-xl border border-orange-200 font-medium text-[#4A2C2A]"
                      />
                      <button
                        type="submit"
                        className="px-5 py-2.5 rounded-2xl bg-[#4A2C2A] hover:bg-stone-950 text-white font-black text-xs sm:text-sm cursor-pointer shadow-xs"
                      >
                        Atualizar Senha
                      </button>
                    </form>
                  </div>
                </div>
              )}

              {/* TAB 4: SUPABASE STATUS & SCRIPT */}
              {activeTab === 'supabase' && (
                <div className="space-y-6">
                  {/* Supabase connection info */}
                  <div className="bg-white p-6 rounded-3xl border-2 border-[#FDE68A] shadow-sm space-y-4">
                    <div className="flex items-center justify-between pb-3 border-b border-[#FDE68A]">
                      <div className="flex items-center gap-2">
                        <Database className="w-5 h-5 text-emerald-600" />
                        <h4 className="font-black text-lg text-[#4A2C2A] font-['Outfit']">
                          Status do Supabase
                        </h4>
                      </div>

                      <button
                        onClick={() => {
                          setHealth(null);
                          checkSupabaseHealth().then(setHealth);
                        }}
                        className="text-xs font-black text-emerald-800 bg-emerald-100 px-3.5 py-2 rounded-xl border border-emerald-300 hover:bg-emerald-200 cursor-pointer"
                      >
                        Testar Conexão Novamente
                      </button>
                    </div>

                    <div className="space-y-3 text-xs text-[#4A2C2A]">
                      <div className="flex items-center justify-between p-3 rounded-xl bg-yellow-50/60 border border-[#FDE68A]">
                        <span className="font-black">Endpoint Supabase:</span>
                        <code className="font-mono text-xs text-orange-950 bg-white px-2 py-0.5 rounded border border-orange-200">
                          {SUPABASE_URL}
                        </code>
                      </div>

                      {health ? (
                        <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-2">
                          <div className="flex items-center gap-2 font-black text-emerald-900">
                            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                            <span>{health.statusText}</span>
                          </div>
                          <div className="text-[11px] text-emerald-800 font-medium">
                            Última verificação: {health.lastChecked}
                          </div>
                        </div>
                      ) : (
                        <div className="p-3 text-xs text-[#4A2C2A]/60 font-medium">
                          Carregando status da conexão...
                        </div>
                      )}
                    </div>
                  </div>

                  {/* SQL Setup Helper */}
                  <div className="bg-white p-6 rounded-3xl border-2 border-[#FDE68A] shadow-sm space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="font-black text-base text-[#4A2C2A]">
                        Script SQL para Criação das Tabelas no Supabase
                      </h4>
                      <button
                        onClick={copySqlToClipboard}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#4A2C2A] hover:bg-stone-950 text-white font-black text-xs cursor-pointer shadow-xs"
                      >
                        {copiedSql ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedSql ? 'Copiado!' : 'Copiar Script SQL'}</span>
                      </button>
                    </div>

                    <p className="text-xs text-[#4A2C2A]/80 font-medium">
                      Caso deseje sincronizar suas alterações diretamente na nuvem do Supabase, basta abrir o{' '}
                      <a
                        href="https://supabase.com/dashboard"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-emerald-700 font-black underline inline-flex items-center gap-0.5"
                      >
                        SQL Editor do Supabase <ExternalLink className="w-3 h-3" />
                      </a>{' '}
                      e colar o script abaixo:
                    </p>

                    <pre className="bg-[#4A2C2A] text-yellow-100 p-4 rounded-2xl text-xs font-mono overflow-x-auto max-h-56 leading-relaxed border border-orange-300/30">
                      {SUPABASE_SETUP_SQL}
                    </pre>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
