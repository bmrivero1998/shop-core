export const SUPPORTED_COUNTRIES = {
  MX: { name: 'México', flag: '🇲🇽', dialCode: '521' },
};

export const GEOGRAPHIC_DATA: Record<string, { name: string; flag: string; dialCode: string }> = {
  // Norteamérica
  MX: { name: 'México', flag: '🇲🇽', dialCode: '52' },
  US: { name: 'Estados Unidos', flag: '🇺🇸', dialCode: '1' },
  CA: { name: 'Canadá', flag: '🇨🇦', dialCode: '1' },

  // Centroamérica
  CR: { name: 'Costa Rica', flag: '🇨🇷', dialCode: '506' },
  GT: { name: 'Guatemala', flag: '🇬🇹', dialCode: '502' },
  HN: { name: 'Honduras', flag: '🇭🇳', dialCode: '504' },
  SV: { name: 'El Salvador', flag: '🇸🇻', dialCode: '503' },
  NI: { name: 'Nicaragua', flag: '🇳🇮', dialCode: '505' },
  PA: { name: 'Panamá', flag: '🇵🇦', dialCode: '507' },
  BZ: { name: 'Belice', flag: '🇧🇿', dialCode: '501' },

  // Caribe
  CU: { name: 'Cuba', flag: '🇨🇺', dialCode: '53' },
  DO: { name: 'República Dominicana', flag: '🇩🇴', dialCode: '1' },
  PR: { name: 'Puerto Rico', flag: '🇵🇷', dialCode: '1' },
  HT: { name: 'Haití', flag: '🇭🇹', dialCode: '509' },
  JM: { name: 'Jamaica', flag: '🇯🇲', dialCode: '1' },

  // Sudamérica
  AR: { name: 'Argentina', flag: '🇦🇷', dialCode: '54' },
  BO: { name: 'Bolivia', flag: '🇧🇴', dialCode: '591' },
  BR: { name: 'Brasil', flag: '🇧🇷', dialCode: '55' },
  CL: { name: 'Chile', flag: '🇨🇱', dialCode: '56' },
  CO: { name: 'Colombia', flag: '🇨🇴', dialCode: '57' },
  EC: { name: 'Ecuador', flag: '🇪🇨', dialCode: '593' },
  PY: { name: 'Paraguay', flag: '🇵🇾', dialCode: '595' },
  PE: { name: 'Perú', flag: '🇵🇪', dialCode: '51' },
  UY: { name: 'Uruguay', flag: '🇺🇾', dialCode: '598' },
  VE: { name: 'Venezuela', flag: '🇻🇪', dialCode: '58' },
  GY: { name: 'Guyana', flag: '🇬🇾', dialCode: '592' },
  SR: { name: 'Surinam', flag: '🇸🇷', dialCode: '597' },

  // Europa (Solo España)
  ES: { name: 'España', flag: '🇪🇸', dialCode: '34' },
};

export const STORE_CONFIG = {
  isStoreOpen: true,

  // Project UUID
  PROJECT_UUID: '174d380b-86a6-4d1f-999b-2bafc81a51e0',
  
  // Tu API URL
  API_URL: 'https://metritrak-workers.kripto-bmrp.workers.dev/v1',
  
  // Llave Pública de Stripe
  STRIPE_PUBLIC_KEY: 'pk_test_51Rjrn9Q7rhLBuE2WtlgmxYdM1qYMuku9y7fNTBq5VblSsqzxOJyxeCVrByrnJkzYGbtTUFnlV3JjcaEn3657hm6000X2SBZZ4O',
  STRIPE_ACCOUNT_ID: 'acct_1SueuhQ7rhbnDgY2', // Solo si usas Connect
  // 1. Identidad y Contacto
  storeName: "Martin Riper Shop", 
  whatsappNumber: "525656398738", // Número de soporte completo
  country: 'MX' as keyof typeof SUPPORTED_COUNTRIES, // Seteado a Costa Rica
  
  // 2. Lógica de Negocio
  mode: 'shop' as 'shop' | 'catalog', 
  businessType: 'physical' as 'physical' | 'service', 
  rawWhatsApp: '5656398738', // Número local de CR (sin el 506)

  // 3. Restricciones Geográficas (Local-First)
  location: {
    defaultCountry: 'MX', // País base
    allowedZipCodes: [] as string[], // Vacío permite todo el pais (CPs de 5 dígitos)
  },

  // 4. Configuración Visual (Tema)
  theme: {
    colors: {
      primary: '#ececec',
      accent: '#e40606',
      background: '#ffffff',
      text: '#000000'
    },
    ui: {
      borderRadius: '12px', // Un poco más redondeado para look moderno
      fontFamily: "'Inter', sans-serif"
    }
  },

  // 5. Textos Personalizables
  text: {
    addToCart: "Agregar al carrito",
    outOfStock: "Agotado",
    buyNow: "Comprar ahora",
    shippingNote: "Envío calculado para Costa Rica. Internacional vía WhatsApp.",
  },

  /**
   * Genera el link de WhatsApp con el dialCode de Costa Rica (506)
   */
  get fullWhatsApp() {
    const info = SUPPORTED_COUNTRIES[this.country];
    return `${info.dialCode}${this.rawWhatsApp}`;
  }
};