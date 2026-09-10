import React, { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { STORE_CONFIG, SUPPORTED_COUNTRIES } from './config';
import type { ProjectConfig, StoreTheme, StoreText } from './interfaces/config.interface';

/**
 * Config "resuelta" que consumen las páginas: mezcla lo que devuelve la API
 * (metritrak_projects_config, por proyecto) con los defaults locales de
 * config.ts para los campos que un proyecto aún no tenga guardados en BD.
 * PROJECT_UUID y API_URL siguen viniendo de config.ts: identifican QUÉ
 * proyecto consultar, no son "configuración de negocio".
 */
export interface ResolvedStoreConfig {
  isStoreOpen: boolean;
  storeName: string;
  whatsappNumber: string;
  fullWhatsApp: string;
  country: string;
  locale: string;
  provider: 'stripe' | 'paypal' | 'mercadopago';
  mode: 'shop' | 'catalog';
  businessType: 'physical' | 'service';
  allowedZipCodes: string[];
  theme: Required<StoreTheme>;
  text: Required<StoreText>;
  dbConfig: ProjectConfig | null;
}

interface ProjectConfigContextType {
  config: ResolvedStoreConfig;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

const defaultTheme: Required<StoreTheme> = {
  colors: { primary: '#000000', accent: '#000000', background: '#ffffff', text: '#111111' },
  ui: { borderRadius: '8px', fontFamily: 'Inter, sans-serif' },
};

const defaultText: Required<StoreText> = {
  addToCart: 'Agregar al carrito',
  outOfStock: 'Agotado',
  buyNow: 'Comprar ahora',
  shippingNote: '',
};

function buildFallbackConfig(): ResolvedStoreConfig {
  const countryInfo = SUPPORTED_COUNTRIES[STORE_CONFIG.country as keyof typeof SUPPORTED_COUNTRIES];
  return {
    isStoreOpen: STORE_CONFIG.isStoreOpen ?? true,
    storeName: STORE_CONFIG.storeName,
    whatsappNumber: STORE_CONFIG.rawWhatsApp,
    fullWhatsApp: STORE_CONFIG.fullWhatsApp,
    country: STORE_CONFIG.country,
    locale: STORE_CONFIG.locale,
    provider: STORE_CONFIG.provider as ResolvedStoreConfig['provider'],
    mode: STORE_CONFIG.mode,
    businessType: STORE_CONFIG.businessType,
    allowedZipCodes: STORE_CONFIG.location?.allowedZipCodes ?? [],
    theme: {
      colors: { ...defaultTheme.colors, ...STORE_CONFIG.theme?.colors },
      ui: { ...defaultTheme.ui, ...STORE_CONFIG.theme?.ui },
    },
    text: { ...defaultText, ...STORE_CONFIG.text },
    dbConfig: null,
  };
}

/** Mezcla la respuesta de la API sobre los defaults locales. Un campo ausente en BD no rompe el storefront. */
function mergeWithDbConfig(dbConfig: ProjectConfig): ResolvedStoreConfig {
  const fallback = buildFallbackConfig();
  const dialCode = SUPPORTED_COUNTRIES[dbConfig.origin_country as keyof typeof SUPPORTED_COUNTRIES]?.dialCode
    ?? SUPPORTED_COUNTRIES[fallback.country as keyof typeof SUPPORTED_COUNTRIES]?.dialCode
    ?? '';

  const whatsappNumber = dbConfig.whatsapp_number || fallback.whatsappNumber;

  return {
    isStoreOpen: dbConfig.is_store_open ?? fallback.isStoreOpen,
    storeName: dbConfig.store_name || fallback.storeName,
    whatsappNumber,
    fullWhatsApp: whatsappNumber.startsWith('+') || whatsappNumber.length > 10
      ? whatsappNumber
      : `${dialCode}${whatsappNumber}`,
    country: dbConfig.origin_country || fallback.country,
    locale: dbConfig.locale || fallback.locale,
    provider: dbConfig.payment_provider || fallback.provider,
    mode: dbConfig.store_mode || fallback.mode,
    businessType: dbConfig.business_type || fallback.businessType,
    allowedZipCodes: dbConfig.allowed_zip_codes?.length ? dbConfig.allowed_zip_codes : fallback.allowedZipCodes,
    theme: {
      colors: { ...fallback.theme.colors, ...dbConfig.theme?.colors },
      ui: { ...fallback.theme.ui, ...dbConfig.theme?.ui },
    },
    text: { ...fallback.text, ...dbConfig.text },
    dbConfig,
  };
}

const ProjectConfigContext = createContext<ProjectConfigContextType | undefined>(undefined);

export const ProjectConfigProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [config, setConfig] = useState<ResolvedStoreConfig>(buildFallbackConfig);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let cancelled = false;

    const fetchConfig = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data } = await axios.get<ProjectConfig>(
          `${STORE_CONFIG.API_URL}/projects_config/${STORE_CONFIG.PROJECT_UUID}/config`
        );
        if (!cancelled) setConfig(mergeWithDbConfig(data));
      } catch (err) {
        console.error('[shop-core] Error cargando configuración del proyecto, usando defaults locales:', err);
        if (!cancelled) {
          setError('No se pudo cargar la configuración remota.');
          setConfig(buildFallbackConfig());
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchConfig();
    return () => {
      cancelled = true;
    };
  }, [reloadKey]);

  return (
    <ProjectConfigContext.Provider
      value={{ config, loading, error, refetch: () => setReloadKey((k) => k + 1) }}
    >
      {children}
    </ProjectConfigContext.Provider>
  );
};

export const useProjectConfig = (): ProjectConfigContextType => {
  const context = useContext(ProjectConfigContext);
  if (!context) throw new Error('useProjectConfig debe usarse dentro de un ProjectConfigProvider');
  return context;
};
