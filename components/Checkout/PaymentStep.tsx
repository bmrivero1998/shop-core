import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { STORE_CONFIG } from '../../config';
import { ShieldCheck, Loader2, AlertTriangle, CreditCard, Lock, ShoppingBag, MapPin, Mail, User, ChevronDown, ChevronUp, Package } from 'lucide-react';
import { useCart } from '../../CartContext'; // Importamos el contexto del carrito para el resumen
import type { ProjectConfig } from '../../interfaces/config.interface';

// Carga de Stripe
const stripePromise = loadStripe(STORE_CONFIG.STRIPE_PUBLIC_KEY);

interface PaymentStepProps {
  customerData:any;
  dbConfig: ProjectConfig;
}


// --- 1. FORMULARIO INTERNO ---
const StripePaymentForm = ({ customerData , dbConfig }: PaymentStepProps) => {
  const stripe = useStripe();
  const elements = useElements();
  const [message, setMessage] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const { cart, cartTotal, cartCurrency } = useCart(); // Obtenemos el carrito y el total
  const [showProducts, setShowProducts] = useState(false);

  
  const originCountry = dbConfig.origin_country || 'MX';
  const destCountry = customerData.billing_address.country || 'MX';
  const isInternational = originCountry !== destCountry;
  
  const shippingCost = isInternational 
    ? Number(dbConfig.shipping_intl_cost || 0)
    : Number(dbConfig.shipping_local_cost || 0);

  const productsSubtotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  
  const finalTotal = productsSubtotal + shippingCost;


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);
    setMessage('');

    try {
      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          // Asegúrate de que esta URL exista en tu router
          return_url: `${window.location.origin}/success`, 
          payment_method_data: {
            billing_details: {
              name: customerData.name,
              email: customerData.email,
              phone: customerData.phone,
              address: {
                line1: `${customerData.billing_address.street} ${customerData.billing_address.number_ext}`,
                // line2: customerData.billing_address.number_int || undefined, // Opcional si lo tienes
                city: customerData.billing_address.city,
                state: customerData.billing_address.state,
                postal_code: customerData.billing_address.postal_code,
                country: customerData.billing_address.country, 
              },
            },
          },
        },
      });

      // Si hay error inmediato (ej: tarjeta rechazada), cae aquí.
      if (error) {
        if (error.type === "card_error" || error.type === "validation_error") {
          setMessage(error.message || "Error en los datos de la tarjeta.");
        } else {
          setMessage("Ocurrió un error inesperado al procesar el pago.");
        }
      }
      
      // NOTA: Si NO hay error, Stripe redirige automáticamente a return_url.

    } catch (e: any) {
        console.error("Error Stripe:", e);
        setMessage("Error de conexión con la pasarela de pagos.");
    } finally {
      setIsProcessing(false);
    }
  };

  // Formateador de moneda
  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: currency,
    }).format(amount / 100);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* --- RESUMEN DEL PEDIDO --- */}
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

      {/* --- CONFIRMACIÓN DE DATOS --- */}
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

      {/* --- ELEMENTO DE TARJETA (STRIPE) --- */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 px-1">
          <CreditCard size={16} />
          <h3 className="font-black text-sm uppercase tracking-tight">Tarjeta de Crédito / Débito</h3>
        </div>
        <div className="border p-4 rounded-xl bg-white shadow-sm hover:shadow-md transition-shadow">
           {/* El PaymentElement maneja número, fecha, cvc y zip si es necesario */}
           <PaymentElement id="payment-element" options={{ layout: 'tabs' }} />
        </div>
      </div>

      {/* --- MENSAJES DE ERROR --- */}
      {message && (
        <div className="bg-red-50 border border-red-100 p-4 rounded-xl flex gap-3 text-red-600 animate-in fade-in">
          <AlertTriangle size={18} className="shrink-0 mt-0.5" />
          <p className="text-xs font-bold leading-relaxed">{message}</p>
        </div>
      )}

      {/* --- BOTÓN DE PAGAR --- */}
      <button 
        disabled={isProcessing || !stripe || !elements}
        className="w-full bg-black text-white py-4 rounded-xl font-black hover:bg-gray-800 disabled:opacity-70 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-3 active:scale-[0.98]"
      >
        {isProcessing ? (
          <>
            <Loader2 className="animate-spin" size={20} />
            PROCESANDO PAGO...
          </>
        ) : (
          <>
            <Lock size={18} />
            PAGAR {formatCurrency(finalTotal, cartCurrency)}
          </>
        )}
      </button>

      <div className="text-center mt-4">
        <div className="flex items-center justify-center gap-2 text-gray-300">
            <Lock size={10} />
            <span className="text-[9px] font-black uppercase tracking-widest">
            Pagos procesados de forma segura por Stripe
            </span>
        </div>
      </div>
    </form>
  );
};

// --- 2. COMPONENTE CONTENEDOR ---
interface Props {
  clientSecret: string;
  customerData: any;
  dbConfig: ProjectConfig
}

export const PaymentStep: React.FC<Props> = ({ clientSecret, customerData, dbConfig }) => {
  
  // Si no hay clientSecret, mostramos carga (esto lo maneja el padre, pero por seguridad)
  if (!clientSecret) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-gray-400">
        <Loader2 className="animate-spin mb-2" size={32} />
        <span className="text-xs font-bold uppercase">Iniciando terminal segura...</span>
      </div>
    );
  }

  return (
    <div className="w-full max-w-lg mx-auto">
      <Elements 
        stripe={stripePromise} 
        options={{ 
          clientSecret,
          appearance: {
            theme: 'stripe',
            variables: { 
              colorPrimary: '#000000', 
              borderRadius: '12px',
              fontFamily: 'Inter, system-ui, sans-serif',
              fontSizeBase: '14px'
            }
          }
        }}
      >
        <StripePaymentForm customerData={customerData} dbConfig={dbConfig} />
      </Elements>
    </div>
  );
};