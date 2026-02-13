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
  Info
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
    <form onSubmit={validateAndContinue} className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* SECCIÓN 1: DATOS DE CONTACTO */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b">
          <User className="text-black" size={20} />
          <h3 className="font-black text-lg uppercase tracking-tight">Datos de Contacto</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-[10px] font-black text-gray-400 uppercase">Nombre Completo</label>
            <input
              type="text"
              value={customerData.name}
              onChange={(e) => updateCustomerData('name', e.target.value)}
              className="w-full p-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-black transition font-medium"
              placeholder="Ej. Juan Pérez"
            />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-black text-gray-400 uppercase">Teléfono (WhatsApp)</label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="tel"
                value={customerData.phone}
                onChange={(e) => updateCustomerData('phone', e.target.value.replace(/\D/g, '').slice(0, 10))}
                className="w-full pl-10 pr-3 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-black transition font-medium"
                placeholder="10 dígitos"
              />
            </div>
          </div>
          <div className="space-y-1 md:col-span-2">
            <label className="text-[10px] font-black text-gray-400 uppercase">Correo Electrónico</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="email"
                value={customerData.email}
                onChange={(e) => updateCustomerData('email', e.target.value)}
                className="w-full pl-10 pr-3 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-black transition font-medium"
                placeholder="ejemplo@correo.com"
              />
            </div>
          </div>
        </div>
      </section>

      {/* SECCIÓN 2: DIRECCIÓN DE ENTREGA (Solo si es Physical) */}
      {isPhysical && (
        <section className="space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b mt-8">
            <MapPin className="text-black" size={20} />
            <h3 className="font-black text-lg uppercase tracking-tight">
              Dirección de Entrega
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Código Postal (Trigger de Lógica) */}
            <div className="space-y-1">
              <label className="text-[10px] font-black text-gray-400 uppercase">Código Postal</label>
              <div className="relative">
                <input
                  type="text"
                  value={customerData.billing_address.postal_code}
                  onChange={(e) => handlePostalCodeChange(e.target.value)}
                  className={`w-full p-3 bg-gray-50 border-2 rounded-xl focus:ring-0 transition font-mono font-bold tracking-widest ${
                    !isShippingAvailable && customerData.billing_address.postal_code.length >= 4 
                      ? 'border-red-500 text-red-600 bg-red-50' 
                      : 'border-transparent focus:border-black'
                  }`}
                  placeholder="C.P."
                  maxLength={10} 
                />
                {isLoadingColonias && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    <Loader2 className="animate-spin text-gray-400" size={18} />
                  </div>
                )}
              </div>
            </div>

            {/* Estado (Editable) */}
            <div className="space-y-1">
              <label className="text-[10px] font-black text-gray-400 uppercase">Estado / Provincia</label>
              <input
                type="text"
                value={customerData.billing_address.state}
                onChange={(e) => updateBillingAddressField('state', e.target.value)}
                className="w-full p-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-black transition font-medium"
                placeholder="Estado"
              />
            </div>

            {/* Colonia (Select Automático) */}
            <div className="space-y-1 md:col-span-2">
              <label className="text-[10px] font-black text-gray-400 uppercase">Colonia / Asentamiento</label>
              {colonias.length > 0 ? (
                <select
                  value={customerData.billing_address.neighborhood}
                  onChange={(e) => {
                    const selected = colonias.find(c => c.placeName === e.target.value);
                    if (selected) handleColoniaSelect(selected);
                  }}
                  className="w-full p-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-black transition appearance-none font-medium"
                >
                  <option value="">Selecciona tu colonia...</option>
                  {colonias.map((c, idx) => (
                    <option key={idx} value={c.placeName}>{c.placeName}</option>
                  ))}
                </select>
              ) : (
                <input
                  type="text"
                  value={customerData.billing_address.neighborhood}
                  onChange={(e) => updateBillingAddressField('neighborhood', e.target.value)}
                  className="w-full p-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-black transition font-medium"
                  placeholder="Escribe tu colonia..."
                />
              )}
            </div>

            {/* Calle y Números */}
            <div className="space-y-1 md:col-span-2">
              <label className="text-[10px] font-black text-gray-400 uppercase">Calle y Número</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Calle"
                  value={customerData.billing_address.street}
                  onChange={(e) => updateBillingAddressField('street', e.target.value)}
                  className="flex-[3] p-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-black transition font-medium"
                />
                <input
                  type="text"
                  placeholder="No. Ext"
                  value={customerData.billing_address.number_ext}
                  onChange={(e) => updateBillingAddressField('number_ext', e.target.value)}
                  className="flex-1 p-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-black transition font-medium"
                />
                <input
                  type="text"
                  placeholder="Int (Op)"
                  value={customerData.billing_address.number_int}
                  onChange={(e) => updateBillingAddressField('number_int', e.target.value)}
                  className="flex-1 p-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-black transition font-medium"
                />
              </div>
            </div>

            {/* Referencias */}
            <div className="space-y-1 md:col-span-2">
              <label className="text-[10px] font-black text-gray-400 uppercase">Referencias de entrega</label>
              <input
                type="text"
                value={customerData.billing_address.references}
                onChange={(e) => updateBillingAddressField('references', e.target.value)}
                className="w-full p-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-black transition font-medium"
                placeholder="Entre calles, color de fachada, portón, etc."
              />
            </div>

            {/* RFC / Tax ID (Opcional) */}
            <div className="space-y-1 md:col-span-2 mt-2 pt-4 border-t border-dashed">
              <label className="text-[10px] font-black text-gray-400 uppercase flex items-center gap-1">
                <FileText size={12}/> RFC / Tax ID (Opcional)
              </label>
              <input
                type="text"
                value={customerData.tax_id || ''}
                onChange={(e) => updateCustomerData('tax_id', e.target.value.toUpperCase())}
                className="w-full p-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-black transition font-mono uppercase"
                placeholder="XAXX010101000"
              />
            </div>

          </div>

          {/* ALERTA DE COBERTURA */}
          {!isShippingAvailable && customerData.billing_address.postal_code.length >= 4 && (
            <div className="bg-amber-50 border-l-4 border-amber-400 p-4 rounded-r-xl flex gap-3 mt-4 animate-in fade-in slide-in-from-top-2">
              <AlertTriangle className="text-amber-500 flex-shrink-0" />
              <div className="space-y-2">
                <p className="text-sm font-bold text-amber-800">
                  Zona fuera de cobertura automática
                </p>
                <p className="text-xs text-amber-700">
                  Podemos enviarte el pedido pero necesitamos cotizar el envío manualmente por WhatsApp.
                </p>
                <button
                  type="button"
                  onClick={handleWhatsAppQuote}
                  className="bg-white text-amber-800 text-xs font-black px-4 py-2 rounded-lg border border-amber-200 shadow-sm hover:bg-amber-100 transition flex items-center gap-2"
                >
                  <MessageCircle size={14} />
                  Cotizar Envío
                </button>
              </div>
            </div>
          )}
        </section>
      )}

      {/* --- DISCLAIMER FISCAL (PROTECCIÓN LEGAL) --- */}
      <div className="bg-gray-100 p-4 rounded-2xl flex gap-3 border border-gray-200">
        <Info className="text-gray-400 flex-shrink-0" size={20} />
        <div className="space-y-1">
          <h4 className="text-xs font-black uppercase text-gray-600">Nota Importante sobre Facturación</h4>
          <p className="text-[10px] text-gray-500 leading-relaxed font-medium">
            Esta plataforma funciona únicamente como intermediario tecnológico para facilitar la venta en línea. 
            <strong> No emitimos facturas ni retenemos impuestos directamente.</strong> Si requieres factura fiscal, 
            por favor solicítala directamente al proveedor a través de WhatsApp una vez finalizada tu compra.
          </p>
        </div>
      </div>

      {/* ERRORES */}
      {errors.length > 0 && (
        <div className="bg-red-50 p-4 rounded-xl border border-red-100 animate-pulse">
          <div className="flex items-center gap-2 mb-2 text-red-600 font-bold text-sm">
            <AlertTriangle size={16} />
            <span>Faltan datos por completar:</span>
          </div>
          <ul className="list-disc list-inside text-xs text-red-500 space-y-1 font-medium">
            {errors.map((err, i) => <li key={i}>{err}</li>)}
          </ul>
        </div>
      )}

      {/* BOTÓN CONTINUAR */}
      <button
        type="submit"
        disabled={isPhysical && !isShippingAvailable}
        className={`w-full py-4 rounded-2xl font-black text-white flex items-center justify-center gap-3 transition shadow-xl ${
          (isPhysical && !isShippingAvailable)
            ? 'bg-gray-300 cursor-not-allowed shadow-none'
            : 'bg-black hover:bg-gray-800 hover:scale-[1.01] active:scale-95 shadow-gray-200'
        }`}
      >
        Continuar al Pago
        <ArrowRight size={20} />
      </button>

    </form>
  );
};