import React, { useState, useEffect, useRef } from 'react';
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
  Image as ImageIcon,
  Film,
  Smartphone,
  Upload,
  Globe,
  RotateCcw,
  Play,
  Pause,
  Volume2,
  VolumeX,
  CheckCircle2,
  Sparkles,
  RefreshCw,
  Video
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
import {
  saveVideoFile,
  uploadVideoToServer,
  resetVideoOnServer
} from '../lib/videoStorage';

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
  initialTab?: 'promocoes' | 'cardapio' | 'video' | 'loja' | 'supabase';
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
  const [activeTab, setActiveTab] = useState<'promocoes' | 'cardapio' | 'video' | 'loja' | 'supabase'>(initialTab);
  
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

  // --- Dedicated Video Upload & Management State ---
  const [selectedVideoFile, setSelectedVideoFile] = useState<File | null>(null);
  const [selectedVideoPreview, setSelectedVideoPreview] = useState<string | null>(null);
  const [isUploadingVideo, setIsUploadingVideo] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [videoUploadSuccess, setVideoUploadSuccess] = useState<string | null>(null);
  const [videoUploadError, setVideoUploadError] = useState<string | null>(null);
  const [isDraggingVideo, setIsDraggingVideo] = useState(false);
  const [activeVideoPlaying, setActiveVideoPlaying] = useState(false);
  const [activeVideoMuted, setActiveVideoMuted] = useState(true);

  const videoFileInputRef = useRef<HTMLInputElement>(null);
  const mobileCameraVideoInputRef = useRef<HTMLInputElement>(null);
  const activeVideoRef = useRef<HTMLVideoElement>(null);

  // Sync state when config updates
  useEffect(() => {
    setStoreWhatsapp(config.whatsappNumber);
    setStorePhoneDisplay(config.phoneDisplay);
    setStoreStreet(config.address.street);
    setStoreNumber(config.address.number);
    setStoreNeighborhood(config.address.neighborhood);
    setStoreVideoUrl(config.videoUrl || '/dende-e-brasa-espaco.mp4');
    setStoreVideoTitle(config.videoTitle || 'Conheça o Espaço Dendê e Brasa');
    setStoreVideoDesc(config.videoDescription || 'Mesas ao ar livre, telão com jogos ao vivo, espetinhos e carnes na brasa viva em Stella Maris.');
  }, [config]);

  useEffect(() => {
    if (isOpen && isAdminLoggedIn) {
      checkSupabaseHealth().then(setHealth);
    }
  }, [isOpen, isAdminLoggedIn]);

  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab, isOpen]);

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
  const handleSaveStoreConfig = async (e: React.FormEvent) => {
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
    await saveRestaurantConfig(updated);
    setStoreConfigFeedback('Dados do restaurante salvos com sucesso!');
    setTimeout(() => setStoreConfigFeedback(''), 3000);
    onRefreshData();
  };

  // --- Dedicated Video Upload & Management Handlers ---
  const handleSelectVideoFile = (file: File) => {
    if (!file.type.startsWith('video/') && !/\.(mp4|mov|m4v|webm|avi|mkv|3gp)$/i.test(file.name)) {
      setVideoUploadError('Por favor selecione um arquivo de vídeo válido (MP4, MOV, WEBM, etc).');
      return;
    }
    setSelectedVideoFile(file);
    setVideoUploadError(null);
    setVideoUploadSuccess(null);
    try {
      const previewUrl = URL.createObjectURL(file);
      setSelectedVideoPreview(previewUrl);
    } catch {
      setSelectedVideoPreview(null);
    }
  };

  const handleDeployVideoToAll = async () => {
    if (!selectedVideoFile) {
      alert('Selecione primeiro o arquivo de vídeo do seu celular ou computador.');
      return;
    }

    setIsUploadingVideo(true);
    setUploadProgress(0);
    setVideoUploadError(null);
    setVideoUploadSuccess(null);

    try {
      const res = await uploadVideoToServer(selectedVideoFile, (percent) => {
        setUploadProgress(percent);
      });

      setStoreVideoUrl(res.videoUrl);
      setVideoUploadSuccess(
        `Vídeo "${selectedVideoFile.name}" (${res.sizeMB} MB) implantado e ativo com sucesso! Agora TODOS os clientes que acessarem o site em qualquer celular ou computador verão este novo vídeo do restaurante.`
      );
      setSelectedVideoFile(null);
      setSelectedVideoPreview(null);
      setUploadProgress(100);
      onRefreshData();
    } catch (err: any) {
      console.error('Video deploy error:', err);
      setVideoUploadError(err.message || 'Erro ao implantar o vídeo no servidor.');
    } finally {
      setIsUploadingVideo(false);
    }
  };

  const handleResetVideo = async () => {
    if (!confirm('Deseja restaurar o vídeo original de apresentação do Dendê e Brasa para todos os acessos do site?')) {
      return;
    }

    setIsUploadingVideo(true);
    setVideoUploadError(null);
    setVideoUploadSuccess(null);

    try {
      const defaultUrl = await resetVideoOnServer();
      setStoreVideoUrl(defaultUrl);
      setSelectedVideoFile(null);
      setSelectedVideoPreview(null);
      setVideoUploadSuccess('Vídeo original restaurado com sucesso para todos os clientes!');
      onRefreshData();
    } catch (err: any) {
      setVideoUploadError('Erro ao restaurar vídeo: ' + err.message);
    } finally {
      setIsUploadingVideo(false);
    }
  };

  const handleSaveVideoMeta = async (e: React.FormEvent) => {
    e.preventDefault();
    const updated: RestaurantConfig = {
      ...config,
      videoUrl: storeVideoUrl.trim() || '/dende-e-brasa-espaco.mp4',
      videoTitle: storeVideoTitle.trim(),
      videoDescription: storeVideoDesc.trim()
    };
    await saveRestaurantConfig(updated);
    setVideoUploadSuccess('Título e descrição do vídeo salvos com sucesso!');
    setTimeout(() => setVideoUploadSuccess(null), 4000);
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
                  onClick={() => setActiveTab('video')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-xs sm:text-sm font-black transition-all cursor-pointer whitespace-nowrap ${
                    activeTab === 'video'
                      ? 'bg-red-600 text-white shadow-xs'
                      : 'bg-yellow-100/60 text-[#4A2C2A] hover:bg-yellow-100'
                  }`}
                >
                  <Film className="w-4 h-4 text-amber-300 fill-amber-300" />
                  <span>Vídeo do Restaurante</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse ml-0.5" />
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
                          <button
                            type="button"
                            onClick={() => setActiveTab('video')}
                            className="text-xs text-orange-700 hover:text-orange-950 font-black underline cursor-pointer flex items-center gap-1"
                          >
                            <Smartphone className="w-3.5 h-3.5" />
                            <span>Abrir Painel Completo de Vídeo</span>
                          </button>
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
                              Padrão: <code>/dende-e-brasa-espaco.mp4</code> ou URL do servidor
                            </p>
                          </div>

                          <div>
                            <label className="block text-xs font-black text-[#4A2C2A] mb-1">
                              Carregar Vídeo para Todos os Clientes
                            </label>
                            <input
                              type="file"
                              accept="video/*"
                              onChange={async (e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  try {
                                    setStoreConfigFeedback('Enviando vídeo para o servidor para todos os acessos...');
                                    const result = await uploadVideoToServer(file);
                                    setStoreVideoUrl(result.videoUrl);
                                    setStoreConfigFeedback(`Vídeo "${file.name}" implantado para todos os acessos!`);
                                    setTimeout(() => setStoreConfigFeedback(''), 4000);
                                  } catch (err: any) {
                                    const localUrl = URL.createObjectURL(file);
                                    setStoreVideoUrl(localUrl);
                                    setStoreConfigFeedback('Vídeo carregado localmente.');
                                  }
                                }
                              }}
                              className="w-full text-xs px-3 py-2 rounded-xl border border-orange-200 font-medium text-[#4A2C2A] bg-stone-50 file:mr-2 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-orange-600 file:text-white cursor-pointer"
                            />
                            <p className="text-[11px] text-[#4A2C2A]/60 mt-1 font-medium">
                              Salva e atualiza o vídeo para todos os visitantes do site
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

              {/* TAB: DEDICATED RESTAURANT VIDEO MANAGEMENT (MOBILE & ALL CLIENTS) */}
              {activeTab === 'video' && (
                <div className="space-y-6">
                  {/* Top Announcement Banner */}
                  <div className="bg-gradient-to-r from-red-600 via-orange-600 to-amber-600 p-5 rounded-3xl text-white shadow-md relative overflow-hidden">
                    <div className="relative z-10 space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="p-1.5 rounded-xl bg-white/20 backdrop-blur-xs">
                          <Globe className="w-5 h-5 text-yellow-200" />
                        </span>
                        <span className="text-xs font-black uppercase tracking-wider bg-white/20 px-2.5 py-0.5 rounded-full">
                          Implantador Global de Vídeo
                        </span>
                      </div>
                      <h3 className="text-xl sm:text-2xl font-black font-['Outfit'] leading-tight">
                        Vídeo do Restaurante em TODOS os Acessos do Site
                      </h3>
                      <p className="text-xs sm:text-sm text-yellow-100/90 leading-relaxed max-w-2xl">
                        O vídeo carregado através desta tela é salvo diretamente no servidor e{' '}
                        <strong>implantado para 100% dos clientes e visitantes</strong> que acessarem o site em qualquer
                        celular, computador ou tablet. Perfeito para mostrar o ambiente acolhedor, mesas ao ar livre, telão e as carnes na brasa!
                      </p>
                    </div>
                  </div>

                  {/* Feedback Alerts */}
                  {videoUploadSuccess && (
                    <div className="p-4 rounded-2xl bg-emerald-50 border-2 border-emerald-300 text-emerald-900 text-sm font-bold flex items-start gap-3 shadow-xs animate-fadeIn">
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                      <div className="flex-1 leading-snug">
                        {videoUploadSuccess}
                      </div>
                      <button
                        onClick={() => setVideoUploadSuccess(null)}
                        className="text-emerald-700 hover:text-emerald-900 cursor-pointer text-xs"
                      >
                        ✕
                      </button>
                    </div>
                  )}

                  {videoUploadError && (
                    <div className="p-4 rounded-2xl bg-red-50 border-2 border-red-300 text-red-900 text-sm font-bold flex items-start gap-3 shadow-xs animate-fadeIn">
                      <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                      <div className="flex-1 leading-snug">
                        {videoUploadError}
                      </div>
                      <button
                        onClick={() => setVideoUploadError(null)}
                        className="text-red-700 hover:text-red-900 cursor-pointer text-xs"
                      >
                        ✕
                      </button>
                    </div>
                  )}

                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    {/* Left Column: Upload from Mobile & File selection */}
                    <div className="lg:col-span-7 space-y-6">
                      <div className="bg-white p-6 rounded-3xl border-2 border-[#FDE68A] shadow-sm space-y-5">
                        <div className="flex items-center justify-between pb-3 border-b border-[#FDE68A]">
                          <div className="flex items-center gap-2">
                            <Smartphone className="w-5 h-5 text-orange-600" />
                            <h4 className="font-black text-lg text-[#4A2C2A] font-['Outfit']">
                              Carregar Vídeo do Celular
                            </h4>
                          </div>
                          <span className="text-xs font-bold text-orange-600 bg-orange-50 px-2.5 py-1 rounded-full border border-orange-200">
                            MP4, MOV, WEBM
                          </span>
                        </div>

                        {/* Hidden file inputs for mobile gallery & direct camera */}
                        <input
                          ref={videoFileInputRef}
                          type="file"
                          accept="video/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleSelectVideoFile(file);
                          }}
                        />
                        <input
                          ref={mobileCameraVideoInputRef}
                          type="file"
                          accept="video/*"
                          capture="environment"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleSelectVideoFile(file);
                          }}
                        />

                        {/* Quick Mobile Action Buttons */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <button
                            type="button"
                            onClick={() => videoFileInputRef.current?.click()}
                            className="flex flex-col items-center justify-center p-4 rounded-2xl bg-gradient-to-b from-orange-50 to-orange-100 hover:from-orange-100 hover:to-orange-200 border-2 border-dashed border-orange-300 text-[#4A2C2A] cursor-pointer transition-all hover:scale-[1.02] active:scale-[0.98] shadow-xs group"
                          >
                            <Smartphone className="w-7 h-7 text-orange-600 mb-2 group-hover:scale-110 transition-transform" />
                            <span className="font-black text-sm text-center">
                              Escolher da Galeria do Celular
                            </span>
                            <span className="text-[11px] text-[#4A2C2A]/70 text-center mt-0.5">
                              Selecione um vídeo já gravado
                            </span>
                          </button>

                          <button
                            type="button"
                            onClick={() => mobileCameraVideoInputRef.current?.click()}
                            className="flex flex-col items-center justify-center p-4 rounded-2xl bg-gradient-to-b from-red-50 to-red-100 hover:from-red-100 hover:to-red-200 border-2 border-dashed border-red-300 text-[#4A2C2A] cursor-pointer transition-all hover:scale-[1.02] active:scale-[0.98] shadow-xs group"
                          >
                            <Video className="w-7 h-7 text-red-600 mb-2 group-hover:scale-110 transition-transform" />
                            <span className="font-black text-sm text-center">
                              Gravar Vídeo Agora com a Câmera
                            </span>
                            <span className="text-[11px] text-[#4A2C2A]/70 text-center mt-0.5">
                              Abre a câmera para filmar o restaurante
                            </span>
                          </button>
                        </div>

                        {/* Drag and Drop Zone for PC */}
                        <div
                          onDragOver={(e) => {
                            e.preventDefault();
                            setIsDraggingVideo(true);
                          }}
                          onDragLeave={() => setIsDraggingVideo(false)}
                          onDrop={(e) => {
                            e.preventDefault();
                            setIsDraggingVideo(false);
                            const file = e.dataTransfer.files?.[0];
                            if (file) handleSelectVideoFile(file);
                          }}
                          onClick={() => videoFileInputRef.current?.click()}
                          className={`p-6 rounded-2xl border-2 border-dashed transition-all cursor-pointer text-center ${
                            isDraggingVideo
                              ? 'border-orange-600 bg-orange-100/70 scale-[1.01]'
                              : 'border-stone-300 bg-stone-50/60 hover:bg-stone-100/70 hover:border-orange-400'
                          }`}
                        >
                          <Upload className="w-8 h-8 text-stone-400 mx-auto mb-2" />
                          <p className="text-xs sm:text-sm font-black text-[#4A2C2A]">
                            Ou arraste o arquivo de vídeo do seu computador aqui
                          </p>
                          <p className="text-[11px] text-stone-500 mt-1 font-medium">
                            Suporta formatos padrão (.mp4, .mov do iPhone, .webm). Até 300MB.
                          </p>
                        </div>

                        {/* Selected Video Preview & Deploy Action */}
                        {selectedVideoFile && (
                          <div className="p-4 rounded-2xl bg-orange-50 border-2 border-orange-300 space-y-4 animate-fadeIn">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <Film className="w-5 h-5 text-orange-600 shrink-0" />
                                <div>
                                  <p className="font-black text-xs sm:text-sm text-[#4A2C2A] truncate max-w-[200px] sm:max-w-[320px]">
                                    {selectedVideoFile.name}
                                  </p>
                                  <p className="text-[11px] text-stone-600 font-medium">
                                    {(selectedVideoFile.size / (1024 * 1024)).toFixed(2)} MB • {selectedVideoFile.type || 'video'}
                                  </p>
                                </div>
                              </div>
                              <button
                                type="button"
                                disabled={isUploadingVideo}
                                onClick={() => {
                                  setSelectedVideoFile(null);
                                  setSelectedVideoPreview(null);
                                }}
                                className="text-xs text-red-600 hover:text-red-800 font-black cursor-pointer px-2 py-1"
                              >
                                Cancelar
                              </button>
                            </div>

                            {/* Local Preview */}
                            {selectedVideoPreview && (
                              <div className="rounded-xl overflow-hidden bg-black max-h-56 relative flex items-center justify-center">
                                <video
                                  src={selectedVideoPreview}
                                  controls
                                  className="max-h-56 w-auto mx-auto"
                                />
                              </div>
                            )}

                            {/* Upload Progress */}
                            {isUploadingVideo && (
                              <div className="space-y-1.5">
                                <div className="flex justify-between text-xs font-black text-[#4A2C2A]">
                                  <span>Enviando para o servidor...</span>
                                  <span>{uploadProgress}%</span>
                                </div>
                                <div className="w-full h-3 bg-stone-200 rounded-full overflow-hidden">
                                  <div
                                    className="h-full bg-gradient-to-r from-orange-500 to-red-600 transition-all duration-200"
                                    style={{ width: `${uploadProgress}%` }}
                                  />
                                </div>
                              </div>
                            )}

                            {/* Deploy Button */}
                            <button
                              type="button"
                              disabled={isUploadingVideo}
                              onClick={handleDeployVideoToAll}
                              className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white font-black text-sm shadow-[4px_4px_0px_0px_rgba(74,44,42,1)] hover:shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              {isUploadingVideo ? (
                                <>
                                  <RefreshCw className="w-4 h-4 animate-spin" />
                                  <span>Implantando para Todos ({uploadProgress}%)...</span>
                                </>
                              ) : (
                                <>
                                  <Globe className="w-4 h-4 text-yellow-300" />
                                  <span>🚀 Publicar Vídeo para TODOS os Clientes do Site</span>
                                </>
                              )}
                            </button>
                          </div>
                        )}
                      </div>

                      {/* Video Title and Description Form */}
                      <form onSubmit={handleSaveVideoMeta} className="bg-white p-6 rounded-3xl border-2 border-[#FDE68A] shadow-sm space-y-4">
                        <h4 className="font-black text-base text-[#4A2C2A] flex items-center gap-2">
                          <Edit2 className="w-4 h-4 text-orange-600" />
                          <span>Texto de Apresentação do Vídeo</span>
                        </h4>

                        <div>
                          <label className="block text-xs font-black text-[#4A2C2A] mb-1">
                            Título Exibido no Vídeo
                          </label>
                          <input
                            type="text"
                            value={storeVideoTitle}
                            onChange={(e) => setStoreVideoTitle(e.target.value)}
                            placeholder="Conheça o Espaço Dendê e Brasa"
                            className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-orange-200 font-medium text-[#4A2C2A]"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-black text-[#4A2C2A] mb-1">
                            Descrição do Espaço
                          </label>
                          <textarea
                            rows={2}
                            value={storeVideoDesc}
                            onChange={(e) => setStoreVideoDesc(e.target.value)}
                            placeholder="Mesas ao ar livre, telão com jogos ao vivo, espetinhos e carnes na brasa viva em Stella Maris."
                            className="w-full text-sm px-3.5 py-2 rounded-xl border border-orange-200 font-medium text-[#4A2C2A]"
                          />
                        </div>

                        <div className="flex justify-end">
                          <button
                            type="submit"
                            className="px-5 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-black text-xs shadow-xs transition-all cursor-pointer"
                          >
                            Salvar Título e Descrição
                          </button>
                        </div>
                      </form>
                    </div>

                    {/* Right Column: Currently Active Video on the Site */}
                    <div className="lg:col-span-5 space-y-6">
                      <div className="bg-white p-6 rounded-3xl border-2 border-[#FDE68A] shadow-sm space-y-4">
                        <div className="flex items-center justify-between pb-3 border-b border-[#FDE68A]">
                          <div className="flex items-center gap-2">
                            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                            <h4 className="font-black text-base text-[#4A2C2A] font-['Outfit']">
                              Vídeo Ativo no Site Agora
                            </h4>
                          </div>
                          <span className="text-[11px] font-black uppercase text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                            Ao Vivo
                          </span>
                        </div>

                        {/* Embedded Active Video Player */}
                        <div className="relative rounded-2xl overflow-hidden bg-black aspect-video flex items-center justify-center border-2 border-stone-800 shadow-inner group">
                          <video
                            ref={activeVideoRef}
                            src={storeVideoUrl || '/dende-e-brasa-espaco.mp4'}
                            playsInline
                            muted={activeVideoMuted}
                            loop
                            className="w-full h-full object-cover"
                            onPlay={() => setActiveVideoPlaying(true)}
                            onPause={() => setActiveVideoPlaying(false)}
                          />

                          {/* Control Overlay Buttons */}
                          <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                            <button
                              type="button"
                              onClick={() => {
                                if (activeVideoRef.current) {
                                  if (activeVideoPlaying) {
                                    activeVideoRef.current.pause();
                                  } else {
                                    activeVideoRef.current.play();
                                  }
                                }
                              }}
                              className="p-3 rounded-full bg-white/90 text-[#4A2C2A] hover:bg-white shadow-lg cursor-pointer transition-transform hover:scale-110"
                            >
                              {activeVideoPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                if (activeVideoRef.current) {
                                  activeVideoRef.current.muted = !activeVideoMuted;
                                  setActiveVideoMuted(!activeVideoMuted);
                                }
                              }}
                              className="p-3 rounded-full bg-white/90 text-[#4A2C2A] hover:bg-white shadow-lg cursor-pointer transition-transform hover:scale-110"
                            >
                              {activeVideoMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                            </button>
                          </div>

                          <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between text-[10px] text-white/90 bg-black/60 px-2.5 py-1 rounded-lg backdrop-blur-xs">
                            <span className="truncate">URL: {storeVideoUrl}</span>
                            <span className="font-mono shrink-0 ml-2">
                              {activeVideoMuted ? 'Mudo' : 'Som Ativo'}
                            </span>
                          </div>
                        </div>

                        {/* File Details */}
                        <div className="p-3.5 rounded-2xl bg-yellow-50/70 border border-[#FDE68A] space-y-2 text-xs text-[#4A2C2A]">
                          <div className="flex justify-between font-bold">
                            <span>Status de Distribuição:</span>
                            <span className="text-emerald-700 font-black">Visível para Todos os Clientes</span>
                          </div>
                          {config.lastVideoUpdate && (
                            <div className="space-y-1 text-[11px] text-[#4A2C2A]/80 border-t border-yellow-200/80 pt-2">
                              <div><strong>Arquivo:</strong> {config.lastVideoUpdate.originalName}</div>
                              <div><strong>Tamanho:</strong> {config.lastVideoUpdate.sizeMB} MB</div>
                              <div><strong>Enviado em:</strong> {config.lastVideoUpdate.uploadedAt}</div>
                            </div>
                          )}
                        </div>

                        {/* Restore Default Button */}
                        <div className="pt-2">
                          <button
                            type="button"
                            disabled={isUploadingVideo}
                            onClick={handleResetVideo}
                            className="w-full py-2.5 px-3 rounded-xl border border-stone-300 hover:border-red-400 bg-stone-50 hover:bg-red-50 text-stone-700 hover:text-red-700 font-black text-xs transition-colors cursor-pointer flex items-center justify-center gap-2"
                          >
                            <RotateCcw className="w-3.5 h-3.5" />
                            <span>Restaurar Vídeo Original do Dendê e Brasa</span>
                          </button>
                        </div>
                      </div>
                    </div>
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
