
export interface StoreTheme {
  colors?: {
    primary?: string;
    accent?: string;
    background?: string;
    text?: string;
  };
  ui?: {
    borderRadius?: string;
    fontFamily?: string;
  };
}

export interface StoreText {
  addToCart?: string;
  outOfStock?: string;
  buyNow?: string;
  shippingNote?: string;
}

export interface StorePaymentPublicKeys {
  stripe_public_key?: string;
  stripe_account_id?: string;
  paypal_client_id?: string;
  mercadopago_public_key?: string;
}

/**
 * Configuración de la tienda tal como la sirve metritrak-workers
 * (GET /v1/projects_config/:projectUuid/config). Reemplaza los valores
 * antes hardcodeados en shop-core/config.ts (STORE_CONFIG).
 */
export interface ProjectConfig {
  project_uuid?: string;
  base_currency: string;
  shipping_local_cost: number;
  shipping_intl_cost: number;
  free_shipping_threshold: number;
  support_email: string;
  origin_country: string;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;

  store_name?: string;
  whatsapp_number?: string;
  locale?: string;
  store_mode?: 'shop' | 'catalog';
  business_type?: 'physical' | 'service';
  payment_provider?: 'stripe' | 'paypal' | 'mercadopago';
  is_store_open?: boolean;
  theme?: StoreTheme;
  text?: StoreText;
  allowed_zip_codes?: string[];
  payment_public_keys?: StorePaymentPublicKeys;
}

export interface CheckoutContext {
  selectedCountry: string | null;
  setSelectedCountry: (value: string) => void;
  setStep: React.Dispatch<React.SetStateAction<CheckoutStep>>;
  handleWhatsAppQuote: () => void;
  updateBillingAddressField: (field: string, value: string) => void;
}


export type CheckoutStep = 'country' | 'address' | 'payment';