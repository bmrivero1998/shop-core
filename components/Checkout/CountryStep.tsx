import { SUPPORTED_COUNTRIES } from '../../config';
import { Globe, ArrowRight, MessageCircle, AlertCircle } from 'lucide-react';
import type { CheckoutContext, ProjectConfig } from '../../interfaces/config.interface';

interface CountryStepProps {
  checkout: CheckoutContext;
  dbConfig: ProjectConfig;
}

export const CountryStep = ({ checkout, dbConfig }: CountryStepProps) => {
  const {
    selectedCountry,
    setSelectedCountry,
    setStep,
    handleWhatsAppQuote,
    updateBillingAddressField 
  } = checkout;

  const originCountryCode = dbConfig.origin_country;
  const hasSelectedCountry = !!selectedCountry;
  const isInternational = hasSelectedCountry && selectedCountry !== originCountryCode;
  const hasIntlRate = Number(dbConfig.shipping_intl_cost) > 0;

  const canProceed = hasSelectedCountry && (!isInternational || (isInternational && hasIntlRate));

  const getCountryName = (code: string) =>
    SUPPORTED_COUNTRIES[code as keyof typeof SUPPORTED_COUNTRIES]?.name || 'Desconocido';

  // --- 2. FUNCIÓN DEDICADA (Limpia y Clara) ---
  const handleContinue = () => {
    if (!selectedCountry) return;
    updateBillingAddressField('country', selectedCountry);
    setStep('address');
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 text-left">
      <div className="text-center space-y-2">
        <h3 className="font-black text-2xl uppercase tracking-tighter">
          ¿A dónde enviamos?
        </h3>
        <p className="text-gray-500 text-sm">
          Selecciona tu país para calcular opciones de entrega.
        </p>
      </div>

      <div className="space-y-4">
        <div className="relative">
          <Globe className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />

          <select
            value={selectedCountry || ''}
            onChange={(e) => setSelectedCountry(e.target.value)}
            className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-transparent focus:border-black rounded-2xl appearance-none font-bold transition outline-none"
          >
            <option value="" disabled>
              🌍 Selecciona tu país
            </option>

            {Object.entries(SUPPORTED_COUNTRIES).map(([code, info]) => (
              <option key={code} value={code}>
                {info.flag} {info.name}
              </option>
            ))}
          </select>
        </div>

        {!hasSelectedCountry && (
          <div className="bg-gray-100 p-4 rounded-2xl text-xs font-bold text-gray-500">
            Debes seleccionar un país para continuar.
          </div>
        )}

        {hasSelectedCountry && !canProceed ? (
          <div className="bg-amber-50 border-l-4 border-amber-500 p-6 rounded-r-2xl space-y-4">
            <div className="flex gap-3">
              <AlertCircle className="text-amber-600 shrink-0" size={20} />
              <div>
                <h4 className="font-black text-amber-900 text-sm uppercase">
                  Cotización requerida
                </h4>
                <p className="text-xs text-amber-800 leading-relaxed mt-1">
                  Enviamos a <strong>{getCountryName(selectedCountry!)}</strong>,
                  pero necesitamos calcular el costo de envío manualmente.
                </p>
              </div>
            </div>

            <button
              onClick={handleWhatsAppQuote}
              className="w-full py-4 bg-[#25D366] text-white font-black rounded-xl hover:shadow-lg transition flex items-center justify-center gap-2"
            >
              <MessageCircle size={20} /> Cotizar por WhatsApp
            </button>
          </div>
        ) : (
          hasSelectedCountry && canProceed && (
            <div className="space-y-4">
              {isInternational && (
                <div className="bg-blue-50 p-4 rounded-2xl flex gap-3 border border-blue-100">
                  <AlertCircle className="text-blue-500 shrink-0" size={18} />
                  <p className="text-[11px] text-blue-700 font-bold leading-tight">
                    Se aplicará la tarifa de envío internacional.
                  </p>
                </div>
              )}

              {/* --- 3. USAMOS LA FUNCIÓN AQUÍ --- */}
              <button
                onClick={handleContinue}
                className="w-full py-4 bg-black text-white font-black rounded-2xl hover:bg-gray-800 transition flex items-center justify-center gap-2 shadow-xl"
              >
                Continuar con la dirección <ArrowRight size={20} />
              </button>
            </div>
          )
        )}
      </div>
    </div>
  );
};