export const SUPPORTED_COUNTRIES = {
  MX: { name: 'México', flag: '🇲🇽', dialCode: '521' },
};

export const GEOGRAPHIC_DATA: Record<string, { name: string; flag: string; dialCode: string }> = {
  // Norteamérica
  MX: { name: 'México', flag: '🇲🇽', dialCode: '52' },
};

export const STORE_CONFIG = {
  isStoreOpen: true,

  // Project UUID
  PROJECT_UUID: '7d6f98be-1b7f-495b-8a9f-702eecaf2345',
  
  // Tu API URL
  API_URL: 'https://metritrak-workers.kripto-bmrp.workers.dev/v1',
  
  // Llave Pública de Stripe
   STRIPE_PUBLIC_KEY: 'pk_live_51Rjrm1Llq8dRY3gU3hr6InTOsEvhoKdySXQp5Mx1duUZBRoFK9DkhTw1OGQTTIaNi0rYsvtUkhunpU4QVKypQu1v00uCU3SVUV',
  STRIPE_ACCOUNT_ID: 'acct_1TEOWZQ92gRrxpNm',  // Solo si usas Connect
  // 1. Identidad y Contacto
  storeName: "Galeria Sayde", // Nombre de la tienda
  whatsappNumber: "", // Número de soporte completo
  country: 'MX' as keyof typeof SUPPORTED_COUNTRIES, // Seteado a Costa Rica
  
  // 2. Lógica de Negocio
  mode: 'shop' as 'shop' | 'catalog', 
  businessType: 'physical' as 'physical' | 'service', 
  rawWhatsApp: '5566556655',

  // 3. Restricciones Geográficas (Local-First)
  location: {
    defaultCountry: 'MX', // País base
    allowedZipCodes: [] as string[], // Vacío permite todo el pais (CPs de 5 dígitos)
  },

  // 4. Configuración Visual (Tema)
  theme: {
    colors: {
      primary: '#F0E8D8',
      accent: '#D4909A',
      background: '#FDF6EF',
      text: '#3A3028'
    },
    ui: {
      borderRadius: '4px', // Un poco más redondeado para look moderno
      fontFamily: "'Montserrat', sans-serif"
    }
  },

  // 5. Textos Personalizables
text: {
    addToCart: "Agregar a mi colección",
    outOfStock: "Obra no disponible",
    buyNow: "Adquirir ahora",
    shippingNote: "Envío coordinado con la artista. Empaque especial de arte.",
  },

  /**
   * Genera el link de WhatsApp con el dialCode de Costa Rica (506)
   */
  get fullWhatsApp() {
    const info = SUPPORTED_COUNTRIES[this.country];
    return `${info.dialCode}${this.rawWhatsApp}`;
  }
};