import React, { useState } from 'react';
import { STORE_CONFIG } from '../../config'; 
import { 
  MapPin,  
  User, 
  Mail, 
  Phone, 
  AlertTriangle, 
  ArrowRight, 
  MessageCircle,
  Loader2,
  FileText,
  Info,
  ChevronDown
} from 'lucide-react';
import type { useCheckout } from '../../hooks/useCheckout';

interface Props {
  checkout: ReturnType<typeof useCheckout>;
}

export const AddressStep: React.FC<Props> = ({ checkout }) => {
  const {
    customerData,
    updateCustomerData,
    updateBillingAddressField,
    handlePostalCodeChange,
    handleColoniaSelect,
    colonias,
    isLoadingColonias,
    isShippingAvailable,
    setStep,
    handleWhatsAppQuote,
  } = checkout;

  const [errors, setErrors] = useState<string[]>([]);

  // Variables para pintar el texto según el tema
  const colors = STORE_CONFIG.theme.colors;
  const textColorStyle = { color: colors.accent };
  const inputTextColorStyle = { color: colors.text };

  // Determinar si pedimos dirección (si es producto físico)
  const isPhysical = STORE_CONFIG.businessType === 'physical';

  const validateAndContinue = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: string[] = [];

    // 1. Validaciones de Contacto
    if (!customerData.name.trim()) newErrors.push("El nombre es requerido");
    if (!customerData.email.trim() || !customerData.email.includes('@')) newErrors.push("Email inválido");
    if (!customerData.phone.trim() || customerData.phone.length < 10) newErrors.push("Teléfono a 10 dígitos requerido");

    // 2. Validaciones de Dirección (Solo si es físico)
    if (isPhysical) {
      if (!customerData.billing_address.postal_code) newErrors.push("El código postal es requerido");
      if (!customerData.billing_address.neighborhood) newErrors.push("La colonia es requerida");
      if (!customerData.billing_address.street) newErrors.push("La calle es requerida");
      if (!customerData.billing_address.number_ext) newErrors.push("El número exterior es requerido");
      
      // Validación de Cobertura (ZipCode Lock)
      if (!isShippingAvailable) {
        newErrors.push("Tu código postal requiere cotización manual.");
      }
    }

    setErrors(newErrors);

    if (newErrors.length === 0) {
      setStep('payment');
    }
  };

return (
    <form onSubmit={validateAndContinue} className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 text-left">
      
      {/* SECCIÓN 1: DATOS DE CONTACTO */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b">
          <User style={{ color: colors.accent }} size={20} />
          <h3 className="font-black text-lg uppercase tracking-tight" style={textColorStyle}>Datos de Contacto</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase" style={textColorStyle}>Nombre Completo</label>
            <input
              type="text"
              value={customerData.name}
              onChange={(e) => updateCustomerData('name', e.target.value)}
              className="w-full !p-3 !bg-gray-50 !border-none !rounded-xl focus:!ring-2 focus:!ring-black !transition !font-medium !text-black"
              style={inputTextColorStyle}
              placeholder="Ej. Juan Pérez"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase" style={textColorStyle}>Teléfono (WhatsApp)</label>
            <div className="relative group">
              {/* Icono centrado con flex */}
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Phone className="text-gray-400 group-focus-within:!text-black transition-colors" size={16} />
              </div>
              <input
                type="tel"
                value={customerData.phone}
                onChange={(e) => updateCustomerData('phone', e.target.value.replace(/\D/g, '').slice(0, 10))}
                className="w-full !pl-10 !pr-3 !py-3 !bg-gray-50 !border-none !rounded-xl focus:!ring-2 focus:!ring-black !transition !font-medium !text-black"
                style={inputTextColorStyle}
                placeholder="10 dígitos"
              />
            </div>
          </div>

          <div className="space-y-1 md:col-span-2">
            <label className="text-[10px] font-black uppercase" style={textColorStyle}>Correo Electrónico</label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="text-gray-400 group-focus-within:!text-black transition-colors" size={16} />
              </div>
              <input
                type="email"
                value={customerData.email}
                onChange={(e) => updateCustomerData('email', e.target.value)}
                className="w-full !pl-10 !pr-3 !py-3 !bg-gray-50 !border-none !rounded-xl focus:!ring-2 focus:!ring-black !transition !font-medium !text-black"
                style={inputTextColorStyle}
                placeholder="ejemplo@correo.com"
              />
            </div>
          </div>
        </div>
      </section>

      {/* SECCIÓN 2: DIRECCIÓN DE ENTREGA */}
      {isPhysical && (
        <section className="space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b mt-8">
            <MapPin style={{ color: colors.accent }} size={20} />
            <h3 className="font-black text-lg uppercase tracking-tight" style={textColorStyle}>
              Dirección de Entrega
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Código Postal */}
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase" style={textColorStyle}>Código Postal</label>
              <div className="relative">
                <input
                  type="text"
                  value={customerData.billing_address.postal_code}
                  onChange={(e) => handlePostalCodeChange(e.target.value)}
                  className={`w-full !p-3 !bg-gray-50 !border-2 !rounded-xl focus:!ring-0 !transition !font-mono !font-bold !tracking-widest !text-black ${
                    !isShippingAvailable && customerData.billing_address.postal_code.length >= 4 
                      ? "!border-red-500 !text-red-600 !bg-red-50" 
                      : "!border-transparent focus:!border-black"
                  }`}
                  style={!isShippingAvailable && customerData.billing_address.postal_code.length >= 4 ? {} : inputTextColorStyle}
                  placeholder="C.P."
                  maxLength={10} 
                />
                {isLoadingColonias && (
                  <div className="absolute right-3 inset-y-0 flex items-center">
                    <Loader2 className="animate-spin text-gray-400" size={18} />
                  </div>
                )}
              </div>
            </div>

            {/* Estado */}
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase" style={textColorStyle}>Estado / Provincia</label>
              <input
                type="text"
                value={customerData.billing_address.state}
                onChange={(e) => updateBillingAddressField('state', e.target.value)}
                className="w-full !p-3 !bg-gray-50 !border-none !rounded-xl focus:!ring-2 focus:!ring-black !transition !font-medium !text-black"
                style={inputTextColorStyle}
                placeholder="Estado"
              />
            </div>

            {/* Colonia (Select con blindaje) */}
            <div className="space-y-1 md:col-span-2">
              <label className="text-[10px] font-black uppercase" style={textColorStyle}>Colonia / Asentamiento</label>
              <div className="relative group" style={{ isolation: 'isolate' }}>
                {colonias.length > 0 ? (
                  <>
                    <select
                      value={customerData.billing_address.neighborhood}
                      onChange={(e) => {
                        const selected = colonias.find(c => c.placeName === e.target.value);
                        if (selected) handleColoniaSelect(selected);
                      }}
                      className="w-full !p-3 !bg-gray-50 !border-none !rounded-xl focus:!ring-2 focus:!ring-black !transition !appearance-none !font-medium !text-black !pr-10"
                      style={{ ...inputTextColorStyle, backgroundImage: 'none' }}
                    >
                      <option value="">Selecciona tu colonia...</option>
                      {colonias.map((c, idx) => (
                        <option key={idx} value={c.placeName}>{c.placeName}</option>
                      ))}
                    </select>
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none z-10">
                      <ChevronDown size={16} className="text-gray-400" />
                    </div>
                  </>
                ) : (
                  <input
                    type="text"
                    value={customerData.billing_address.neighborhood}
                    onChange={(e) => updateBillingAddressField('neighborhood', e.target.value)}
                    className="w-full !p-3 !bg-gray-50 !border-none !rounded-xl focus:!ring-2 focus:!ring-black !transition !font-medium !text-black"
                    style={inputTextColorStyle}
                    placeholder="Escribe tu colonia..."
                  />
                )}
              </div>
            </div>

            {/* Calle y Números */}
         <div className="space-y-1 md:col-span-2">
          <label className="text-[10px] font-black uppercase" style={textColorStyle}>
            Calle y Número
          </label>

          <div className="flex flex-wrap gap-2">
            <input
              type="text"
              placeholder="Calle"
              value={customerData.billing_address.street}
              onChange={(e) => updateBillingAddressField('street', e.target.value)}
              className="w-full md:flex-[3] md:w-auto !p-3 !bg-gray-50 !border-none !rounded-xl focus:!ring-2 focus:!ring-black !transition !font-medium !text-black"
              style={inputTextColorStyle}
            />

            <input
              type="text"
              placeholder="No. Ext"
              value={customerData.billing_address.number_ext}
              onChange={(e) => updateBillingAddressField('number_ext', e.target.value)}
              className="w-[calc(50%-4px)] md:flex-1 md:w-auto !p-3 !bg-gray-50 !border-none !rounded-xl focus:!ring-2 focus:!ring-black !transition !font-medium !text-black"
              style={inputTextColorStyle}
            />

            <input
              type="text"
              placeholder="Int (Opcional)"
              value={customerData.billing_address.number_int}
              onChange={(e) => updateBillingAddressField('number_int', e.target.value)}
              className="w-[calc(50%-4px)] md:flex-1 md:w-auto !p-3 !bg-gray-50 !border-none !rounded-xl focus:!ring-2 focus:!ring-black !transition !font-medium !text-black"
              style={inputTextColorStyle}
            />
          </div>
        </div>

            {/* RFC / Tax ID */}
            <div className="space-y-1 md:col-span-2 mt-2 pt-4 border-t border-dashed">
              <label className="text-[10px] font-black uppercase flex items-center gap-1" style={textColorStyle}>
                <FileText size={12} style={{ color: colors.accent }}/> RFC / Tax ID (Opcional)
              </label>
              <input
                type="text"
                value={customerData.tax_id || ''}
                onChange={(e) => updateCustomerData('tax_id', e.target.value.toUpperCase())}
                className="w-full !p-3 !bg-gray-50 !border-none !rounded-xl focus:!ring-2 focus:!ring-black !transition !font-mono !uppercase !text-black"
                style={inputTextColorStyle}
                placeholder="XAXX010101000"
              />
            </div>
          </div>
        </section>
      )}

      {/* --- NOTAS Y ERRORES --- */}
      <div className="bg-gray-100 !p-4 !rounded-2xl flex gap-3 border border-gray-200">
        <Info className="text-gray-400 shrink-0" size={20} />
        <div className="space-y-1">
          <h4 className="text-xs font-black uppercase" style={textColorStyle}>Nota sobre Facturación</h4>
          <p className="text-[10px] leading-relaxed font-medium" style={inputTextColorStyle}>
            No emitimos facturas ni retenemos impuestos directamente. 
            <strong> Solicítala por WhatsApp al finalizar tu compra.</strong>
          </p>
        </div>
      </div>

      {errors.length > 0 && (
        <div className="bg-red-50 !p-4 !rounded-xl border border-red-100">
          <div className="flex items-center gap-2 mb-2 font-bold text-sm text-red-600">
            <AlertTriangle size={16} />
            <span>Faltan datos:</span>
          </div>
          <ul className="list-disc list-inside text-xs space-y-1 font-medium text-red-500">
            {errors.map((err, i) => <li key={i}>{err}</li>)}
          </ul>
        </div>
      )}

      {/* BOTÓN CONTINUAR */}
      <button
        type="submit"
        disabled={isPhysical && !isShippingAvailable}
        className={`w-full !py-4 !rounded-2xl !font-black flex items-center justify-center gap-3 transition shadow-xl ${
          (isPhysical && !isShippingAvailable)
            ? '!bg-gray-300 !cursor-not-allowed !text-gray-500'
            : '!bg-black hover:!bg-gray-800 hover:scale-[1.01] active:scale-95 !text-white'
        }`}
      >
        Continuar al Pago
        <ArrowRight size={20} />
      </button>
    </form>
  );
};