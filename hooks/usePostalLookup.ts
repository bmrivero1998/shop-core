// src/shop/hooks/usePostalLookup.ts
import { useState, useCallback, useRef } from 'react';
import { searchPostalCode } from '../services/postalServices';

export const usePostalLookup = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [suggestion, setSuggestion] = useState<any>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const lookup = useCallback(async (postalCode: string, countryCode: string) => {
    // Cancelar petición anterior
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    abortControllerRef.current = new AbortController();

    if (!postalCode || postalCode.trim().length < 3) {
      setSuggestion(null);
      setError(null);
      return null;
    }

    setIsLoading(true);
    setError(null);
    setSuggestion(null);

    try {
      const result = await searchPostalCode(countryCode, postalCode);
      
      setSuggestion(result);
      return result;
      
    } catch (err: any) {
      if (err.name === 'AbortError') {
        return null;
      }
      
      setError(err.message || 'No se pudo encontrar la dirección');
      console.error('Error:', err);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clear = useCallback(() => {
    setSuggestion(null);
    setError(null);
    setIsLoading(false);
    
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
  }, []);

  return {
    isLoading,
    error,
    suggestion,
    lookup,
    clear,
    hasSuggestion: !!suggestion
  };
};

export default usePostalLookup;