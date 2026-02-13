import React from 'react';
import { STORE_CONFIG } from '../../config';
import { Package, ShoppingBag, Truck } from 'lucide-react';

interface OrderSummaryProps {
  cart: any[];
  total: number;
  currency: string;
  dbConfig?: any; // Configuración que viene de la base de datos
  selectedCountry?: string; // País que eligió el usuario en el paso 1
}

export const OrderSummary: React.FC<OrderSummaryProps> = ({ 
  cart, 
  total, 
  currency,
  dbConfig,
  selectedCountry
}) => {
  // LÓGICA DE ENVÍO DINÁMICA
  const calculateShipping = () => {
    // Si es un servicio (Digital/Presencial) según config.ts, el envío es 0
    if (STORE_CONFIG.businessType !== 'physical') return 0;
    if (!dbConfig) return 0;

    // Verificar si aplica Envío Gratis (si el umbral es > 0 y el total lo supera)
    if (dbConfig.free_shipping_threshold > 0 && total >= dbConfig.free_shipping_threshold) {
      return 0;
    }

    // Determinar si es local o internacional comparando con origin_country de BD
    const isInternational = selectedCountry && selectedCountry !== dbConfig.origin_country;
    
    return isInternational 
      ? (dbConfig.shipping_intl_cost || 0) 
      : (dbConfig.shipping_local_cost || 0);
  };

  const shippingCost = calculateShipping();
  const finalTotal = total + shippingCost;
  const isFreeShipping = STORE_CONFIG.businessType === 'physical' && dbConfig && shippingCost === 0 && total > 0;

  return (
    <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm mb-6 text-left">
      <div className="flex items-center gap-2 mb-6 border-b pb-4">
        <Package className="text-gray-400" size={20} />
        <h3 className="text-lg font-black uppercase tracking-tighter">Resumen del pedido</h3>
      </div>

      <div className="space-y-4 max-h-[35vh] overflow-y-auto pr-2 scrollbar-hide">
        {cart.map((item: any) => (
          <div key={item.uuid + JSON.stringify(item.selectedVariants)} className="flex justify-between items-start">
            <div className="flex gap-3">
              <div className="w-12 h-12 bg-gray-50 rounded-xl overflow-hidden border flex-shrink-0">
                <img 
                  src={item.image || 'https://via.placeholder.com/100'} 
                  alt={item.name} 
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <p className="font-bold text-sm text-gray-900 line-clamp-1">{item.name}</p>
                <div className="flex flex-col gap-0.5">
                    <p className="text-[9px] font-black text-gray-400 uppercase">Cantidad: {item.quantity}</p>
                    {item.selectedVariants && Object.entries(item.selectedVariants).map(([key, val]) => (
                        <p key={key} className="text-[9px] font-bold text-blue-500 uppercase">{key}: {String(val)}</p>
                    ))}
                </div>
              </div>
            </div>
            <p className="font-bold text-sm text-gray-900">
              ${((item.price * item.quantity) / 100).toFixed(2)}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-6 pt-6 border-t border-dashed border-gray-200 space-y-3">
        {/* Subtotal */}
        <div className="flex justify-between items-center">
          <span className="text-gray-400 text-sm font-bold">Subtotal</span>
          <span className="font-bold text-gray-900">${(total / 100).toFixed(2)}</span>
        </div>
        
        {/* Envío Dinámico (Solo se muestra si es producto físico) */}
        {STORE_CONFIG.businessType === 'physical' && (
          <div className="flex justify-between items-center">
            <span className="text-gray-400 text-sm font-bold flex items-center gap-1">
              <Truck size={14} /> Envío
            </span>
            <span className={`font-bold ${isFreeShipping ? 'text-green-600' : 'text-gray-900'}`}>
              {isFreeShipping ? 'GRATIS' : `$${(shippingCost / 100).toFixed(2)}`}
            </span>
          </div>
        )}
        
        {/* Total Final */}
        <div className="flex justify-between items-center pt-2">
          <span className="text-gray-900 text-xl font-black italic tracking-tighter">TOTAL</span>
          <div className="text-right">
            <span className="text-2xl font-black text-black">
              ${(finalTotal / 100).toFixed(2)}
            </span>
            <span className="text-xs font-black text-gray-400 ml-1 uppercase">
              {currency}
            </span>
          </div>
        </div>
      </div>

      {/* Nota de pie dinámica */}
      <div className="mt-6 p-4 bg-gray-50 rounded-2xl flex gap-3">
        {STORE_CONFIG.businessType === 'physical' ? <Truck className="text-gray-400 shrink-0" size={18} /> : <ShoppingBag className="text-gray-400 shrink-0" size={18} />}
        <p className="text-[10px] text-gray-500 leading-relaxed font-medium">
          {STORE_CONFIG.businessType === 'physical' 
            ? (STORE_CONFIG.text.shippingNote || "Los tiempos de entrega pueden variar según tu ubicación.")
            : "Este es un servicio digital/presencial. No se requiere envío físico."}
        </p>
      </div>
    </div>
  );
};