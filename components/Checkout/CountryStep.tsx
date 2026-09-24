import { SUPPORTED_COUNTRIES } from '../../config';
import { Globe, ArrowRight, MessageCircle, AlertCircle, ChevronDown } from 'lucide-react';
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

  const handleContinue = () => {
    if (!selectedCountry) return;
    updateBillingAddressField('country', selectedCountry);
    setStep('address');
  };

  return (
    <div className="space-y-8 animate-[shop-fade-in-up_0.5s_ease-out] text-left">
      <div className="text-center space-y-2">
        <h3 className="font-black text-2xl uppercase tracking-tighter !text-(--shop-accent)">
          ¿A dónde enviamos?
        </h3>
        <p className="text-sm text-(--shop-text)">
          Selecciona tu país para calcular opciones de entrega.
        </p>
      </div>

      <div className="space-y-4">
        <div className="relative group isolate">
          {/* Icono Mundo (Izquierda) */}
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
            <Globe className="text-(--shop-accent)" size={20} />
          </div>

          <select
            value={selectedCountry || ''}
            onChange={(e) => setSelectedCountry(e.target.value)}
            className="w-full !appearance-none !bg-none bg-gray-50 !border-2 !border-transparent focus:!border-black !rounded-2xl !pl-12 !pr-10 !py-4 !font-bold !leading-normal !transition focus:!outline-none focus:!ring-0 !text-black"
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

          {/* Icono Flecha (Derecha) - reemplaza la flecha nativa del select */}
          <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none z-10">
            <ChevronDown size={18} className="text-gray-400" />
          </div>
        </div>

        {/* MENSAJES DE ESTADO */}
        {!hasSelectedCountry && (
          <div className="bg-gray-100 p-4 rounded-2xl text-xs font-bold text-(--shop-text)">
            Debes seleccionar un país para continuar.
          </div>
        )}

        {hasSelectedCountry && !canProceed ? (
          <div className="bg-amber-50 border-l-4 border-amber-500 p-6 rounded-r-2xl space-y-4">
            <div className="flex gap-3">
              <AlertCircle className="shrink-0 text-(--shop-accent)" size={20} />
              <div>
                <h4 className="font-black text-sm uppercase !text-(--shop-accent)">
                  Cotización requerida
                </h4>
                <p className="text-xs leading-relaxed mt-1 text-(--shop-text)">
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
                  <AlertCircle className="shrink-0 text-(--shop-accent)" size={18} />
                  <p className="text-[11px] font-bold leading-tight text-(--shop-text)">
                    Se aplicará la tarifa de envío internacional.
                  </p>
                </div>
              )}

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