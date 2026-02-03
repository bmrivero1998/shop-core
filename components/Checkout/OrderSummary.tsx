// src/shop/components/Checkout/OrderSummary.tsx
import React from 'react';
import { STORE_CONFIG } from '../../config';
import { Package, ShoppingBag } from 'lucide-react';

interface OrderSummaryProps {
  cart: any[];
  total: number;
  currency: string;
}

export const OrderSummary: React.FC<OrderSummaryProps> = ({ 
  cart, 
  total, 
  currency 
}) => {
  return (
    <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm mb-6">
      <div className="flex items-center gap-2 mb-6 border-b pb-4">
        <Package className="text-gray-400" size={20} />
        <h3 className="text-lg font-black uppercase tracking-tighter">Resumen del pedido</h3>
      </div>

      <div className="space-y-4 max-h-[40vh] overflow-y-auto pr-2 scrollbar-hide">
        {cart.map((item: any) => (
          <div key={item.uuid} className="flex justify-between items-start">
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
                <p className="text-[10px] font-black text-gray-400 uppercase">Cantidad: {item.quantity}</p>
              </div>
            </div>
            <p className="font-bold text-sm text-gray-900">
              ${((item.price * item.quantity) / 100).toFixed(2)}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-6 pt-6 border-t border-dashed border-gray-200 space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-gray-400 text-sm font-bold">Subtotal</span>
          <span className="font-bold text-gray-900">${(total / 100).toFixed(2)}</span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-gray-900 text-xl font-black italic">TOTAL</span>
          <div className="text-right">
            <span className="text-2xl font-black text-black">
              ${(total / 100).toFixed(2)}
            </span>
            <span className="text-xs font-black text-gray-400 ml-1 uppercase">
              {currency}
            </span>
          </div>
        </div>
      </div>

      {/* Disclaimer de impuestos/envío */}
      <div className="mt-6 p-4 bg-gray-50 rounded-2xl flex gap-3">
        <ShoppingBag className="text-gray-400 shrink-0" size={18} />
        <p className="text-[10px] text-gray-500 leading-relaxed font-medium">
          {STORE_CONFIG.text.shippingNote || "El costo de envío y detalles adicionales se coordinan directamente."}
        </p>
      </div>
    </div>
  );
};