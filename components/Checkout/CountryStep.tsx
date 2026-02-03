import React from 'react';
import { STORE_CONFIG, SUPPORTED_COUNTRIES } from '../../config';
import { Globe, ArrowRight, MessageCircle, AlertCircle } from 'lucide-react';
import type { useCheckout } from '../../hooks/useCheckout';

interface Props {
  checkout: ReturnType<typeof useCheckout>;
}

export const CountryStep: React.FC<Props> = ({ checkout }) => {
  const { selectedCountry, setSelectedCountry, setStep, handleWhatsAppQuote } = checkout;

  const isInternational = selectedCountry !== STORE_CONFIG.country;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="text-center space-y-2">
        <h3 className="font-black text-2xl uppercase tracking-tighter">¿A dónde enviamos?</h3>
        <p className="text-gray-500 text-sm">Selecciona tu país para calcular opciones de entrega.</p>
      </div>

      <div className="space-y-4">
        <div className="relative">
          <Globe className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <select
            value={selectedCountry}
            onChange={(e) => setSelectedCountry(e.target.value)}
            className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-transparent focus:border-black rounded-2xl appearance-none font-bold transition"
          >
            {Object.entries(SUPPORTED_COUNTRIES).map(([code, info]) => (
              <option key={code} value={code}>
                {info.flag} {info.name}
              </option>
            ))}
          </select>
        </div>

        {isInternational ? (
          /* ESCENARIO INTERNACIONAL */
          <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-r-2xl space-y-4">
            <div className="flex gap-3">
              <AlertCircle className="text-blue-600 shrink-0" size={20} />
              <div>
                <h4 className="font-black text-blue-900 text-sm uppercase">Envío Internacional</h4>
                <p className="text-xs text-blue-800 leading-relaxed mt-1">
                  Actualmente el pago automático solo está disponible para <strong>{SUPPORTED_COUNTRIES[STORE_CONFIG.country].name}</strong>. 
                  Para otros países, coordinamos el envío y el pago directamente por WhatsApp.
                </p>
              </div>
            </div>
            
            <button
              type="button"
              onClick={handleWhatsAppQuote}
              className="w-full py-4 bg-[#25D366] text-white font-black rounded-xl hover:shadow-lg transition flex items-center justify-center gap-2"
            >
              <MessageCircle size={20} />
              Cotizar por WhatsApp
            </button>
          </div>
        ) : (
          /* ESCENARIO LOCAL */
          <button
            onClick={() => setStep('address')}
            className="w-full py-4 bg-black text-white font-black rounded-2xl hover:bg-gray-800 transition flex items-center justify-center gap-2 shadow-xl shadow-gray-200"
          >
            Continuar con la dirección
            <ArrowRight size={20} />
          </button>
        )}
      </div>
    </div>
  );
};