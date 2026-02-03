// src/shop/services/postalServices.ts

/**
 * Servicio simplificado para Zippopotam
 * URL: https://api.zippopotam.us/{countryCode}/{postalCode}
 * Formato: Mismo para todos los países
 */
export class PostalService {
  private static cache = new Map<string, { data: any; timestamp: number }>();
  private static CACHE_DURATION = 5 * 60 * 1000; // 5 minutos

  /**
   * Busca dirección usando Zippopotam
   */
  static async searchPostalCode(countryCode: string, postalCode: string) {
    if (!postalCode || postalCode.trim().length < 3) {
      throw new Error('Ingresa al menos 3 dígitos');
    }

    // Limpiar código postal (solo números para la mayoría)
    const cleanPostalCode = postalCode.replace(/\D/g, '');
    
    // Validar formato básico
    if (!/^\d{3,10}$/.test(cleanPostalCode)) {
      throw new Error('Formato de código postal inválido');
    }

    // Verificar cache
    const cacheKey = `${countryCode.toLowerCase()}:${cleanPostalCode}`;
    const cached = this.cache.get(cacheKey);
    
    if (cached && Date.now() - cached.timestamp < this.CACHE_DURATION) {
      return cached.data;
    }

    // Hacer la llamada a Zippopotam
    const url = `https://api.zippopotam.us/${countryCode.toLowerCase()}/${cleanPostalCode}`;
   
    try {
      const response = await fetch(url, {
        signal: AbortSignal.timeout(10000) // 10 segundos timeout
      });

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error(`Código postal "${cleanPostalCode}" no encontrado`);
        }
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
  
      // Formatear respuesta (formato estándar de Zippopotam)
      const place = data.places?.[0];
      const formatted = {
        neighborhood: place?.['place name'] || '',
        city: place?.['place name']?.split(',')[0] || '',
        state: place?.state || '',
        postal_code: data['post code'] || ''
      };

      // Validar que tengamos datos
      if (!formatted.state) {
        throw new Error('Información insuficiente en la respuesta');
      }

      // Guardar en cache
      this.cache.set(cacheKey, {
        data: formatted,
        timestamp: Date.now()
      });

      // Limpiar cache antiguo
      this.cleanOldCache();

      return formatted;

    } catch (error: any) {
      console.error('❌ Error Zippopotam:', error);
      
      if (error.name === 'AbortError') {
        throw new Error('La búsqueda tardó demasiado. Intenta nuevamente.');
      }
      
      if (error.message.includes('Failed to fetch')) {
        throw new Error('No se pudo conectar con el servicio. Verifica tu conexión.');
      }
      
      throw error;
    }
  }

  /**
   * Limpiar cache antiguo
   */
  private static cleanOldCache() {
    const now = Date.now();
    for (const [key, value] of this.cache.entries()) {
      if (now - value.timestamp > this.CACHE_DURATION) {
        this.cache.delete(key);
      }
    }
  }

  /**
   * Obtener ejemplos de códigos postales por país
   */
  static getPostalCodeExamples(countryCode: string): string[] {
    const examples: Record<string, string[]> = {
      MX: ['01000', '44100', '64000'],
      US: ['90210', '10001', '33101'],
      ES: ['28001', '08001', '41001'],
      CA: ['M5V2T6', 'V6B4Y8', 'H3B4W7'],
      UK: ['SW1A1AA', 'EC1A1BB', 'W1A0AX'],
      DE: ['10115', '80331', '50667'],
      FR: ['75001', '13001', '69001'],
      BR: ['01001000', '20040007', '30130010'],
      AR: ['C1002', 'B1636', 'S2000'],
      CO: ['110111', '050001', '760001']
    };
    
    return examples[countryCode] || ['00000'];
  }

  /**
   * Validar formato básico (solo para mostrar ejemplos)
   */
  static validateFormat(postalCode: string, countryCode: string): boolean {
    // Para Zippopotam, aceptamos cualquier cosa que tenga números
    return /\d/.test(postalCode);
  }
}

// Exportar solo lo necesario
export const searchPostalCode = PostalService.searchPostalCode;
export const getPostalCodeExamples = PostalService.getPostalCodeExamples;