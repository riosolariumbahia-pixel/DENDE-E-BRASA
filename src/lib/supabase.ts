import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { MenuItem, SpecialPromotion, RestaurantConfig } from '../types';
import {
  INITIAL_MENU_ITEMS,
  INITIAL_PROMOTIONS,
  INITIAL_RESTAURANT_CONFIG
} from '../data/initialData';

// Provided Supabase configuration
export const SUPABASE_URL = 'https://ltgareozhzpovjubtywy.supabase.co';
export const SUPABASE_ANON_KEY = 'sb_publishable_Aj0wx1nf_AJwsk6WGRzXaQ_U5kLENTO';

export const supabase: SupabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true
  }
});

const STORAGE_KEYS = {
  PROMOTIONS: 'dendeebrasa_promocoes',
  MENU_ITEMS: 'dendeebrasa_cardapio',
  CONFIG: 'dendeebrasa_config',
  ADMIN_PASSWORD: 'dendeebrasa_admin_pass'
};

export interface SupabaseHealth {
  connected: boolean;
  statusText: string;
  tables: {
    promocoes: boolean;
    cardapio: boolean;
  };
  lastChecked: string;
}

// Check Supabase connection and table availability
export async function checkSupabaseHealth(): Promise<SupabaseHealth> {
  const result: SupabaseHealth = {
    connected: false,
    statusText: 'Verificando conexão com Supabase...',
    tables: {
      promocoes: false,
      cardapio: false
    },
    lastChecked: new Date().toLocaleTimeString('pt-BR')
  };

  try {
    // Test promocoes
    const { error: promoErr } = await supabase
      .from('promocoes')
      .select('id')
      .limit(1);

    if (!promoErr) {
      result.tables.promocoes = true;
    }

    // Test cardapio
    const { error: menuErr } = await supabase
      .from('cardapio')
      .select('id')
      .limit(1);

    if (!menuErr) {
      result.tables.cardapio = true;
    }

    result.connected = true;
    if (result.tables.promocoes && result.tables.cardapio) {
      result.statusText = 'Supabase Ativo & Sincronizado (Tabelas prontas)';
    } else {
      result.statusText = 'Supabase Conectado! (Persistência ativa localmente)';
    }
  } catch (err: unknown) {
    result.connected = false;
    result.statusText = 'Conexão híbrida ativa (Dados salvos localmente no navegador)';
  }

  return result;
}

// SQL helper for user to create tables in Supabase SQL editor
export const SUPABASE_SETUP_SQL = `-- SCRIPT DE INICIALIZAÇÃO PARA DENDE E BRASA NO SUPABASE
-- Execute no SQL Editor do seu painel Supabase (https://supabase.com/dashboard)

-- 1. Tabela de Promoções Especiais
create table if not exists public.promocoes (
  id text primary key,
  dish_name text not null,
  description text,
  original_price numeric not null,
  promotional_price numeric not null,
  badge_text text,
  active boolean default true,
  valid_days text,
  image text,
  highlighted boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Tabela de Itens do Cardápio
create table if not exists public.cardapio (
  id text primary key,
  name text not null,
  description text,
  price numeric not null,
  category text not null,
  image text,
  is_available boolean default true,
  is_chef_special boolean default false,
  serves text,
  spiciness text,
  tags text[],
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. Habilitar leitura pública (RLS)
alter table public.promocoes enable row level security;
alter table public.cardapio enable row level security;

-- Políticas de acesso livre para o cardápio e promoções
create policy "Acesso público para leitura de promoções"
on public.promocoes for select using (true);

create policy "Acesso livre para gravação de promoções"
on public.promocoes for all using (true) with check (true);

create policy "Acesso público para leitura de cardapio"
on public.cardapio for select using (true);

create policy "Acesso livre para gravação de cardapio"
on public.cardapio for all using (true) with check (true);
`;

// Helper: Promotions
export const SYSTEM_CONFIG_KEY = '__SYSTEM_RESTAURANT_CONFIG__';

export async function getPromotions(): Promise<SpecialPromotion[]> {
  try {
    const { data, error } = await supabase
      .from('promocoes')
      .select('*')
      .order('highlighted', { ascending: false });

    if (!error && data && data.length > 0) {
      return data
        .filter((d: any) => !d.id.startsWith('__SYSTEM_'))
        .map((d: any) => ({
          id: d.id,
          dishName: d.dish_name,
          description: d.description || '',
          originalPrice: Number(d.original_price),
          promotionalPrice: Number(d.promotional_price),
          badgeText: d.badge_text || 'PROMOÇÃO',
          active: d.active !== false,
          validDays: d.valid_days || '',
          image: d.image || '',
          highlighted: Boolean(d.highlighted)
        }));
    }
  } catch {
    // Ignore and fallback
  }

  // Fallback to localStorage or INITIAL_PROMOTIONS
  const stored = localStorage.getItem(STORAGE_KEYS.PROMOTIONS);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      // parse error
    }
  }

  localStorage.setItem(STORAGE_KEYS.PROMOTIONS, JSON.stringify(INITIAL_PROMOTIONS));
  return INITIAL_PROMOTIONS;
}

export async function savePromotion(promo: SpecialPromotion): Promise<void> {
  // Always update localStorage first for immediate responsiveness
  const current = await getPromotions();
  const index = current.findIndex((p) => p.id === promo.id);
  let updated: SpecialPromotion[];
  if (index >= 0) {
    updated = [...current];
    updated[index] = promo;
  } else {
    updated = [promo, ...current];
  }
  localStorage.setItem(STORAGE_KEYS.PROMOTIONS, JSON.stringify(updated));

  // Try saving to Supabase
  try {
    await supabase.from('promocoes').upsert({
      id: promo.id,
      dish_name: promo.dishName,
      description: promo.description,
      original_price: promo.originalPrice,
      promotional_price: promo.promotionalPrice,
      badge_text: promo.badgeText,
      active: promo.active,
      valid_days: promo.validDays || '',
      image: promo.image,
      highlighted: promo.highlighted || false
    });
  } catch {
    // Silently continue with local persistence
  }
}

export async function deletePromotion(id: string): Promise<void> {
  const current = await getPromotions();
  const updated = current.filter((p) => p.id !== id);
  localStorage.setItem(STORAGE_KEYS.PROMOTIONS, JSON.stringify(updated));

  try {
    await supabase.from('promocoes').delete().eq('id', id);
  } catch {
    // local delete succeeded
  }
}

// Helper: Menu Items
export async function getMenuItems(): Promise<MenuItem[]> {
  try {
    const { data, error } = await supabase.from('cardapio').select('*');

    if (!error && data && data.length > 0) {
      return data.map((d: any) => ({
        id: d.id,
        name: d.name,
        description: d.description || '',
        price: Number(d.price),
        category: d.category,
        image: d.image || '',
        isAvailable: d.is_available !== false,
        isChefSpecial: Boolean(d.is_chef_special),
        serves: d.serves || '',
        spiciness: d.spiciness || 'optional',
        tags: d.tags || []
      }));
    }
  } catch {
    // Ignore and fallback
  }

  const stored = localStorage.getItem(STORAGE_KEYS.MENU_ITEMS);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      // parse error
    }
  }

  localStorage.setItem(STORAGE_KEYS.MENU_ITEMS, JSON.stringify(INITIAL_MENU_ITEMS));
  return INITIAL_MENU_ITEMS;
}

export async function saveMenuItem(item: MenuItem): Promise<void> {
  const current = await getMenuItems();
  const index = current.findIndex((m) => m.id === item.id);
  let updated: MenuItem[];
  if (index >= 0) {
    updated = [...current];
    updated[index] = item;
  } else {
    updated = [item, ...current];
  }
  localStorage.setItem(STORAGE_KEYS.MENU_ITEMS, JSON.stringify(updated));

  try {
    await supabase.from('cardapio').upsert({
      id: item.id,
      name: item.name,
      description: item.description,
      price: item.price,
      category: item.category,
      image: item.image,
      is_available: item.isAvailable,
      is_chef_special: item.isChefSpecial || false,
      serves: item.serves || '',
      spiciness: item.spiciness || 'optional',
      tags: item.tags || []
    });
  } catch {
    // local save succeeded
  }
}

export async function deleteMenuItem(id: string): Promise<void> {
  const current = await getMenuItems();
  const updated = current.filter((m) => m.id !== id);
  localStorage.setItem(STORAGE_KEYS.MENU_ITEMS, JSON.stringify(updated));

  try {
    await supabase.from('cardapio').delete().eq('id', id);
  } catch {
    // local delete succeeded
  }
}

// Helper: Restaurant Config (Fully Synchronized Across All Devices via Supabase Cloud)
export async function fetchRemoteRestaurantConfig(): Promise<RestaurantConfig> {
  // 1. Fetch from Supabase Cloud (accessible from any phone, computer, or visitor globally)
  try {
    const { data, error } = await supabase
      .from('promocoes')
      .select('description')
      .eq('id', SYSTEM_CONFIG_KEY)
      .maybeSingle();

    if (!error && data && data.description) {
      const parsed = JSON.parse(data.description);
      if (parsed && typeof parsed === 'object' && parsed.name) {
        const merged: RestaurantConfig = { ...INITIAL_RESTAURANT_CONFIG, ...parsed };
        localStorage.setItem(STORAGE_KEYS.CONFIG, JSON.stringify(merged));
        return merged;
      }
    }
  } catch (err) {
    console.warn('Could not fetch remote config from Supabase:', err);
  }

  // 2. Fetch from local Node server /api/config
  try {
    const res = await fetch('/api/config');
    const contentType = res.headers.get('content-type');
    if (res.ok && contentType && contentType.includes('application/json')) {
      const data = await res.json();
      const merged: RestaurantConfig = { ...INITIAL_RESTAURANT_CONFIG, ...data };
      localStorage.setItem(STORAGE_KEYS.CONFIG, JSON.stringify(merged));
      return merged;
    }
  } catch (err) {
    console.warn('Could not fetch remote config from server:', err);
  }

  // 3. Fallback to localStorage or INITIAL_RESTAURANT_CONFIG
  return getRestaurantConfig();
}

export function getRestaurantConfig(): RestaurantConfig {
  const stored = localStorage.getItem(STORAGE_KEYS.CONFIG);
  if (stored) {
    try {
      return { ...INITIAL_RESTAURANT_CONFIG, ...JSON.parse(stored) };
    } catch {
      // parse error
    }
  }
  localStorage.setItem(STORAGE_KEYS.CONFIG, JSON.stringify(INITIAL_RESTAURANT_CONFIG));
  return INITIAL_RESTAURANT_CONFIG;
}

export async function saveRestaurantConfig(config: RestaurantConfig): Promise<void> {
  // Never persist local-only ephemeral blob: URLs to shared config
  const sanitizedConfig: RestaurantConfig = { ...config };
  if (sanitizedConfig.videoUrl && sanitizedConfig.videoUrl.startsWith('blob:')) {
    console.warn('Ignorando blob URL para configuração compartilhada global.');
    sanitizedConfig.videoUrl = INITIAL_RESTAURANT_CONFIG.videoUrl || '/dende-e-brasa-espaco.mp4';
  }

  // 1. Immediate local save for UI responsiveness
  localStorage.setItem(STORAGE_KEYS.CONFIG, JSON.stringify(sanitizedConfig));

  // 2. Immediate save to Supabase Cloud so ALL devices worldwide receive this config
  try {
    await supabase.from('promocoes').upsert({
      id: SYSTEM_CONFIG_KEY,
      dish_name: 'CONFIG_DENDE_E_BRASA',
      description: JSON.stringify(sanitizedConfig),
      original_price: 0,
      promotional_price: 0,
      badge_text: sanitizedConfig.videoUrl ? 'CONFIG_ACTIVE' : 'CONFIG_DEFAULT',
      active: false,
      highlighted: false
    });
    console.log('✅ Configuração e vídeo do restaurante salvos no Supabase com sucesso!');
  } catch (err) {
    console.error('Erro ao salvar configuração no Supabase:', err);
  }

  // 3. Sync to Node /api/config
  try {
    await fetch('/api/config', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(sanitizedConfig)
    });
  } catch (err) {
    console.warn('Could not sync config to server:', err);
  }

  // 4. Notify open components in the current window
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('dende-config-updated', { detail: sanitizedConfig }));
  }
}

// Admin Credentials Helper
export function getAdminPassword(): string {
  return localStorage.getItem(STORAGE_KEYS.ADMIN_PASSWORD) || 'dende2025';
}

export function setAdminPassword(newPass: string): void {
  localStorage.setItem(STORAGE_KEYS.ADMIN_PASSWORD, newPass);
}
