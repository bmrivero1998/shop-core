import React, { useState, useEffect, useRef } from 'react';
import { Search, MapPin, Loader2, XCircle } from 'lucide-react';

interface PostalCodeInputProps {
  value: string;
  countryCode: string;
  onChange: (postalCode: string) => void;
  onAddressSelect?: (address: {
    neighborhood: string;
    city: string;
    state: string;
    postal_code: string;
  }) => void;
  disabled?: boolean;
  className?: string;
}

export const PostalCodeInput: React.FC<PostalCodeInputProps> = ({
  value,
  countryCode,
  onChange,
  onAddressSelect,
  disabled = false,
  className = ''
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Cerrar al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // LIMPIEZA: Si cambian el país, borramos el CP actual para evitar errores de API
  useEffect(() => {
    if (value) {
      onChange('');
      setSuggestions([]);
      setError(null);
    }
  }, [countryCode]);

  const searchPostalCode = async (postalCode: string) => {
    if (!postalCode || postalCode.trim().length < 3) return;

    setIsLoading(true);
    setError(null);

    try {
      const url = `https://api.zippopotam.us/${countryCode.toLowerCase()}/${postalCode}`;
      const response = await fetch(url);
      
      if (!response.ok) throw new Error(`CP no encontrado en ${countryCode.toUpperCase()}`);

      const data = await response.json();
      
      // Mapear TODOS los lugares que devuelva el CP
      const results = data.places.map((place: any) => ({
        neighborhood: place['place name'],
        city: place['place name'].split(',')[0],
        state: place['state'],
        postal_code: data['post code']
      }));

      setSuggestions(results);
      setShowSuggestions(true);
    } catch (err: any) {
      setError("Código postal no válido para este país");
      setSuggestions([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Debounce mejorado
  useEffect(() => {
    const timer = setTimeout(() => {
      if (value.length >= 3) searchPostalCode(value);
    }, 800);
    return () => clearTimeout(timer);
  }, [value]);

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <div className="relative group">
        <MapPin 
          className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${error ? 'text-red-400' : 'text-gray-400 group-focus-within:text-black'}`} 
          size={18} 
        />
        
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value.replace(/[^0-9a-zA-Z]/g, '').toUpperCase())}
          disabled={disabled}
          className={`w-full pl-12 pr-12 py-4 bg-gray-50 border-2 rounded-2xl font-bold transition-all outline-none
            ${error ? 'border-red-200 bg-red-50 text-red-600' : 'border-transparent focus:bg-white focus:border-black text-gray-900'}
            ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
          placeholder="Código Postal"
        />
        
        <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center">
          {isLoading ? (
            <Loader2 className="animate-spin text-black" size={18} />
          ) : error ? (
            <XCircle className="text-red-400" size={18} />
          ) : (
            <Search className="text-gray-300" size={18} />
          )}
        </div>
      </div>

      {/* DROPDOWN DE SUGERENCIAS ESTILO METRITRAK */}
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute z-[60] mt-2 w-full bg-white border border-gray-100 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2">
          <div className="p-2 bg-gray-50 border-b text-[10px] font-black uppercase tracking-widest text-gray-400">
            Resultados encontrados
          </div>
          <div className="max-h-60 overflow-y-auto">
            {suggestions.map((s, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  onAddressSelect?.(s);
                  setShowSuggestions(false);
                }}
                className="w-full text-left p-4 hover:bg-black hover:text-white transition-all group border-b last:border-b-0"
              >
                <p className="font-black text-sm uppercase leading-tight">{s.neighborhood}</p>
                <p className="text-[10px] font-bold opacity-60 group-hover:opacity-100 uppercase mt-1">
                  {s.city}, {s.state}
                </p>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};