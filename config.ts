export const SUPPORTED_COUNTRIES = {
  MX: { name: 'México', flag: '🇲🇽', dialCode: '521' },
  CR: { name: 'Costa Rica', flag: '🇨🇷', dialCode: '506' }, // Agregado Costa Rica
  CO: { name: 'Colombia', flag: '🇨🇴', dialCode: '57' },
  PE: { name: 'Perú', flag: '🇵🇪', dialCode: '51' },
  CL: { name: 'Chile', flag: '🇨🇱', dialCode: '56' },
  ES: { name: 'España', flag: '🇪🇸', dialCode: '34' },
  US: { name: 'Estados Unidos', flag: '🇺🇸', dialCode: '1' },
};

export const STORE_CONFIG = {
  isStoreOpen: true,

  // Project UUID
  PROJECT_UUID: '88dffc4c-3767-45ff-9af7-9f787fb063dc',
  
  // Tu API URL
  API_URL: 'https://metritrak-workers.kripto-bmrp.workers.dev/v1',
  
  // Llave Pública de Stripe
  STRIPE_PUBLIC_KEY: 'pk_test_51Rjrn9Q7rhLBuE2WtlgmxYdM1qYMuku9y7fNTBq5VblSsqzxOJyxeCVrByrnJkzYGbtTUFnlV3JjcaEn3657hm6000X2SBZZ4O',
  
  // 1. Identidad y Contacto
  storeName: "Gazel Shop", 
  whatsappNumber: "50688887777", // Número de soporte completo
  country: 'CR' as keyof typeof SUPPORTED_COUNTRIES, // Seteado a Costa Rica
  
  // 2. Lógica de Negocio
  mode: 'shop' as 'shop' | 'catalog', 
  businessType: 'physical' as 'physical' | 'service', 
  rawWhatsApp: '88887777', // Número local de CR (sin el 506)

  // 3. Restricciones Geográficas (Local-First)
  location: {
    defaultCountry: 'CR', // País base
    allowedZipCodes: [] as string[], // Vacío permite todo Costa Rica (CPs de 5 dígitos)
  },

  // 4. Configuración Visual (Tema)
  theme: {
    colors: {
      primary: '#ececec',
      accent: '#e40606',
      background: '#000000',
      text: '#fdfdff'
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