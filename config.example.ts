/**
 * CONFIGURATION TEMPLATE - SHOP CORE
 * * Instrucciones:
 * 1. Copia este archivo y renómbralo a 'config.ts'
 * 2. Llena los campos con la información de tu cliente.
 * 3. El archivo 'config.ts' está ignorado por GIT para proteger los datos.
 */

export const SUPPORTED_COUNTRIES = {
  MX: { name: 'México', flag: '🇲🇽', dialCode: '521' },
  CR: { name: 'Costa Rica', flag: '🇨🇷', dialCode: '506' },
  CO: { name: 'Colombia', flag: '🇨🇴', dialCode: '57' },
  PE: { name: 'Perú', flag: '🇵🇪', dialCode: '51' },
  CL: { name: 'Chile', flag: '🇨🇱', dialCode: '56' },
  ES: { name: 'España', flag: '🇪🇸', dialCode: '34' },
  US: { name: 'Estados Unidos', flag: '🇺🇸', dialCode: '1' },
};

export const STORE_CONFIG = {
  isStoreOpen: true,

  // 🔑 Credenciales (Obtenidas de MetriTrak / Stripe)
  PROJECT_UUID: '', // <-- Insertar UUID del proyecto aquí
  API_URL: 'https://metritrak-workers.kripto-bmrp.workers.dev/v1',
  STRIPE_PUBLIC_KEY: '', // <-- Insertar pk_test o pk_live de Stripe aquí
  
  // 🏷️ 1. Identidad y Contacto
  storeName: "Nombre de tu Tienda", 
  whatsappNumber: "", // Número con formato internacional (ej: 50688887777)
  country: 'MX' as keyof typeof SUPPORTED_COUNTRIES, 
  
  // ⚙️ 2. Lógica de Negocio
  mode: 'shop' as 'shop' | 'catalog', 
  businessType: 'physical' as 'physical' | 'service', 
  rawWhatsApp: '', // Número local sin código de país

  // 📍 3. Restricciones Geográficas
  location: {
    defaultCountry: 'MX', 
    allowedZipCodes: [] as string[], // Dejar vacío para permitir todos los CPs del país
  },

  // 🎨 4. Configuración Visual (Tema)
  theme: {
    colors: {
      primary: '#000000',
      accent: '#e40606',
      background: '#ffffff',
      text: '#000000'
    },
    ui: {
      borderRadius: '8px', 
      fontFamily: "'Inter', sans-serif"
    }
  },

  // ✍️ 5. Textos Personalizables
  text: {
    addToCart: "Agregar al carrito",
    outOfStock: "Agotado",
    buyNow: "Comprar ahora",
    shippingNote: "Envío calculado según zona. Consultas vía WhatsApp.",
  },

  /**
   * Genera el link de WhatsApp dinámicamente según el país seleccionado
   */
  get fullWhatsApp() {
    const info = SUPPORTED_COUNTRIES[this.country];
    return `${info.dialCode}${this.rawWhatsApp}`;
  }
};