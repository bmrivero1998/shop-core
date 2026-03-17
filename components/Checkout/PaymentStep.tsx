import React, { useState } from 'react';
import { ShieldCheck, Loader2, ShoppingBag, MapPin, User, ChevronDown, ChevronUp, Package } from 'lucide-react';
import { useCart } from '../../CartContext';
import type { ProjectConfig } from '../../interfaces/config.interface';

// --- IMPORTACIÓN DE PASARELAS MODULARIZADAS ---
import { MercadoPagoForm } from './MercadoPagoForm';
import { PayPalPaymentForm } from './PaypalForm';
import { StripeForm } from './StripeForm';

interface PaymentStepProps {
  provider: 'stripe' | 'paypal' | 'mercadopago';
  paymentData: any;
  customerData: any;
  dbConfig: ProjectConfig;
}

export const PaymentStep: React.FC<PaymentStepProps> = ({ provider, paymentData, customerData, dbConfig }) => {
  const { cart, cartCurrency } = useCart();
  const [showProducts, setShowProducts] = useState(false);

  if (!paymentData) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-gray-400">
        <Loader2 className="animate-spin mb-2" size={32} />
        <span className="text-xs font-bold uppercase">Iniciando terminal segura...</span>
      </div>
    );
  }

  // --- Lógica original de cálculo ---
  const originCountry = dbConfig.origin_country || 'MX';
  const destCountry = customerData.billing_address?.country || 'MX';
  const isInternational = originCountry !== destCountry;
  
  const shippingCost = isInternational 
    ? Number(dbConfig.shipping_intl_cost || 0)
    : Number(dbConfig.shipping_local_cost || 0);

  const productsSubtotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const finalTotal = productsSubtotal + shippingCost;

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: currency,
    }).format(amount / 100);
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 w-full max-w-lg mx-auto">
      
      {/* --- RESUMEN DEL PEDIDO (Tu diseño original) --- */}
      <div className="bg-gray-50 p-5 rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div 
          className="flex items-center justify-between mb-4 text-gray-500 border-b border-gray-200 pb-2 cursor-pointer hover:text-gray-700 transition"
          onClick={() => setShowProducts(!showProducts)}
        >
          <div className="flex items-center gap-2">
            <ShoppingBag size={16} />
            <span className="text-[10px] font-black uppercase tracking-widest">Resumen del Pedido</span>
          </div>
          {showProducts ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </div>

        {/* Lista de Productos Desplegable */}
        {showProducts && (
          <div className="mb-4 space-y-3 animate-in slide-in-from-top-2 duration-300">
            {cart.map((item) => (
              <div key={item.uuid} className="flex gap-3 text-sm border-b border-gray-100 pb-2 last:border-0">
                <div className="w-12 h-12 bg-white rounded-lg border border-gray-200 flex items-center justify-center shrink-0 overflow-hidden">
                   {item?.image ? (
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                   ) : (
                      <Package size={20} className="text-gray-300" />
                   )}
                </div>
                <div className="flex-1">
                  <p className="font-bold text-gray-800 line-clamp-1">{item.name}</p>
                  {item.selectedVariant && (
                    <p className="text-xs text-gray-500">Var: {item.selectedVariant.variant_name}</p>
                  )}
                  <p className="text-xs text-gray-500">Cant: {item.quantity}</p>
                </div>
                <div className="font-medium text-gray-900">
                  {formatCurrency(item.price * item.quantity, cartCurrency)}
                </div>
              </div>
            ))}
          </div>
        )}
        
        {/* Desglose de Costos */}
        <div className="space-y-1 mb-3 pt-2">
           <div className="flex justify-between items-center text-xs text-gray-500">
             <span>Subtotal</span>
             <span>{formatCurrency(productsSubtotal, cartCurrency)}</span>
           </div>
           <div className="flex justify-between items-center text-xs text-gray-500">
             <span>Envío ({isInternational ? 'Internacional' : 'Nacional'})</span>
             <span>{shippingCost > 0 ? formatCurrency(shippingCost, cartCurrency) : 'Gratis'}</span>
           </div>
        </div>

        <div className="flex justify-between items-end mb-1 pt-2 border-t border-gray-200">
          <span className="text-gray-600 text-sm font-medium">Total a Pagar</span>
          <span className="text-2xl font-black text-gray-900 tracking-tight">
            {formatCurrency(finalTotal, cartCurrency)}
          </span>
        </div>
      </div>

      {/* --- CONFIRMACIÓN DE DATOS (Tu diseño original) --- */}
      <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm space-y-3">
         <div className="flex items-center gap-2 mb-2 text-gray-400 border-b border-gray-200 pb-2">
          <ShieldCheck size={16} />
          <span className="text-[10px] font-black uppercase tracking-widest">Datos de Facturación</span>
        </div>

        <div className="flex items-start gap-3">
            <User size={16} className="text-gray-400 mt-0.5 shrink-0"/>
            <div>
                <p className="text-sm font-bold text-gray-900">{customerData.name}</p>
                <p className="text-xs text-gray-500">{customerData.email}</p>
                <p className="text-xs text-gray-500">{customerData.phone}</p>
            </div>
        </div>

        <div className="flex items-start gap-3">
            <MapPin size={16} className="text-gray-400 mt-0.5 shrink-0"/>
            <div>
                <p className="text-xs text-gray-600 font-medium">
                    {customerData.billing_address.street} {customerData.billing_address.number_ext}
                    {customerData.billing_address.number_int ? ` Int ${customerData.billing_address.number_int}` : ''}
                </p>
                <p className="text-xs text-gray-500">
                    {customerData.billing_address.neighborhood}, {customerData.billing_address.postal_code}
                </p>
                <p className="text-xs text-gray-500">
                    {customerData.billing_address.city}, {customerData.billing_address.state}, {customerData.billing_address.country}
                </p>
            </div>
        </div>
      </div>

      {/* --- FORMULARIOS DE PASARELA (Switch dinámico) --- */}
      {provider === 'stripe' && paymentData?.clientSecret && (
        <StripeForm 
          clientSecret={paymentData.clientSecret} 
          customerData={customerData} 
          finalTotal={finalTotal} 
          cartCurrency={cartCurrency} 
        />
      )}

      {provider === 'paypal' && paymentData?.ppOrderId && (
        <PayPalPaymentForm 
          ppOrderId={paymentData.ppOrderId} 
          currency={dbConfig.base_currency} 
        />
      )}

      {provider === 'mercadopago' && paymentData?.preferenceId && (
        <MercadoPagoForm 
          preferenceId={paymentData.preferenceId} 
        />
      )}
    </div>
  );
};