/**
 * =========================================================================
 * 🛒 PLANTILLA DE CONFIGURACIÓN DE LA TIENDA (SHOP CORE)
 * =========================================================================
 * * INSTRUCCIONES:
 * 1. Copia este archivo y renómbralo a `config.ts`.
 * 2. `config.ts` está ignorado en git (.gitignore) para evitar que subas
 * credenciales o configuraciones específicas de un cliente al core.
 * 3. Llena los datos correspondientes al proyecto actual.
 */

/**
 * Diccionario de países soportados para envíos y facturación.
 * Define el nombre, la bandera (emoji) y el código de marcación telefónica principal.
 */
export const SUPPORTED_COUNTRIES = {
// MX: { name: 'México', flag: '🇲🇽', dialCode: '52' },
  CR: { name: 'Costa Rica', flag: '🇨🇷', dialCode: '506' },
//  CO: { name: 'Colombia', flag: '🇨🇴', dialCode: '57' },
//  PE: { name: 'Perú', flag: '🇵🇪', dialCode: '51' },
//  CL: { name: 'Chile', flag: '🇨🇱', dialCode: '56' },
//  ES: { name: 'España', flag: '🇪🇸', dialCode: '34' },
//  US: { name: 'Estados Unidos', flag: '🇺🇸', dialCode: '1' },
};

export const LOCALE_CURRENCY_MAP: Record<string, string> = {
  'es-MX': 'MXN',
  'es-CR': 'CRC',
  "es-AR": 'ARS',
  "es-CL": 'CLP',
  "es-CO": 'COP',
  "es-VE": 'VES',
  "es-UY": 'UYU',
  "es-PE": 'PEN',
  "pt-BR": 'BRL',
  "en-US": 'USD',
  "undefined": 'undefined',
}

/**
 * Diccionario extendido de datos geográficos.
 * Útil para selectores de países en los formularios de checkout.
 */
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

/**
 * =========================================================================
 * CONFIGURACIÓN PRINCIPAL DE LA TIENDA
 * =========================================================================
 */
export const STORE_CONFIG = {
  isStoreOpen: true,

  // Project UUID
  PROJECT_UUID: '88dffc4c-3767-45ff-9af7-9f787fb063dc',
  
  // Tu API URL
  API_URL: 'https://metritrak-workers.kripto-bmrp.workers.dev/v1',
  // -------------------------------------------------------------------------
  // 1. CREDENCIALES DE PASARELAS (Públicas)
  // ¡ADVERTENCIA!: Nunca coloques llaves secretas (Secret Keys) aquí.
  // -------------------------------------------------------------------------
  STRIPE_PUBLIC_KEY: 'pk_test_51Rjrn9Q7rhLBuE2WtlgmxYdM1qYMuku9y7fNTBq5VblSsqzxOJyxeCVrByrnJkzYGbtTUFnlV3JjcaEn3657hm6000X2SBZZ4O',
  
  STRIPE_ACCOUNT_ID: 'acct_1SueuhQ7rhbnDgY2', // Solo usar si se implementa Stripe Connect (Ej. 'acct_123456')
  PAYPAL_CLIENT_ID: 'tu_client_id_publico_de_paypal_aqui',
  MERCADO_PAGO_PUBLIC_KEY: 'TEST-tu_public_key_de_mercado_pago_aqui',

  // -------------------------------------------------------------------------
  // 2. IDENTIDAD Y CONTACTO
  // -------------------------------------------------------------------------
  storeName: "Gazel Shop", 
  whatsappNumber: "50688887777", // Número COMPLETO (Código país + número) para redirección de WhatsApp
  country: 'CR' as keyof typeof SUPPORTED_COUNTRIES, // País principal de operaciones
  locale: 'es-US' as keyof typeof LOCALE_CURRENCY_MAP, // Código de localización (Afecta formato de moneda, fechas y SDKs de pago)
  provider: 'stripe' as 'stripe' | 'paypal' | 'mercadopago', // Pasarela de pago principal a usar en el checkout
  // -------------------------------------------------------------------------
  // 3. LÓGICA DE NEGOCIO (Controladores de comportamiento)
  // -------------------------------------------------------------------------
  /**
   * Determina cómo opera el frontend:
   * - 'shop': Permite agregar al carrito, ir al checkout y pagar.
   * - 'catalog': Oculta botones de pago, ideal para solo mostrar inventario.
   */
  mode: 'shop' as 'shop' | 'catalog', 

  /**
   * Determina los pasos del checkout:
   * - 'physical': Requiere recolectar dirección de envío en el checkout.
   * - 'service': Omite el paso de envío (ideal para productos digitales o servicios).
   */
  businessType: 'physical' as 'physical' | 'service', 
  
  rawWhatsApp: '88887777', // Número local (SIN el código de país), usado internamente si es necesario

  // -------------------------------------------------------------------------
  // 4. RESTRICCIONES GEOGRÁFICAS Y ENVÍOS
  // -------------------------------------------------------------------------
  location: {
    defaultCountry: 'CR', // País seleccionado por defecto en el checkout
    
    /**
     * Lista blanca de códigos postales (Zip Codes).
     * Si está vacío `[]`, permite vender a todo el país.
     * Si tiene valores (Ej. `['10101', '10102']`), restringe la venta solo a esas zonas.
     */
    allowedZipCodes: [] as string[], 
  },

  // -------------------------------------------------------------------------
  // 5. CONFIGURACIÓN VISUAL (Theming)
  // -------------------------------------------------------------------------
  theme: {
    colors: {
      primary: '#ececec', // Color primario de la marca (botones ligeros, fondos secundarios)
      accent: '#e40606',  // Color de acento (Botones principales, llamadas a la acción)
      background: '#000000', // Fondo principal de la tienda
      text: '#fdfdff'     // Color principal del texto
    },
    ui: {
      borderRadius: '8px' // Radio de borde para botones, tarjetas y campos de texto (ej. '0px', '8px', '9999px')
    }
  },

  // -------------------------------------------------------------------------
  // 6. COPY Y TEXTOS PERSONALIZABLES
  // -------------------------------------------------------------------------
  text: {
    addToCart: "Agregar al carrito",
    outOfStock: "Agotado",
    buyNow: "Comprar ahora",
    shippingNote: "Envío calculado para Costa Rica. Envíos internacionales gestionar vía WhatsApp.",
  },

  // -------------------------------------------------------------------------
  // 7. MÉTODOS Y GETTERS
  // -------------------------------------------------------------------------
  /**
   * Genera el link o número completo de WhatsApp dinámicamente
   * combinando el código de marcación del país con el número local.
   * Útil para botones de "Soporte" o "Comprar por WhatsApp".
   */
  get fullWhatsApp() {
    const info = SUPPORTED_COUNTRIES[this.country];
    return `${info.dialCode}${this.rawWhatsApp}`;
  }
};