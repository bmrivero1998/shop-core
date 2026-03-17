import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { STORE_CONFIG } from '../../config';
import { AlertTriangle, CreditCard, Loader2, Lock } from 'lucide-react';

const stripePromise = STORE_CONFIG.STRIPE_ACCOUNT_ID 
  ? loadStripe(STORE_CONFIG.STRIPE_PUBLIC_KEY, { stripeAccount: STORE_CONFIG.STRIPE_ACCOUNT_ID })
  : loadStripe(STORE_CONFIG.STRIPE_PUBLIC_KEY);

interface StripeFormInnerProps {
  customerData: any;
  finalTotal: number;
  cartCurrency: string;
}

const StripeFormInner = ({ customerData, finalTotal, cartCurrency }: StripeFormInnerProps) => {
  const stripe = useStripe();
  const elements = useElements();
  const [message, setMessage] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setIsProcessing(true);
    setMessage('');

    try {
      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/checkout/success`, 
          payment_method_data: {
            billing_details: {
              name: customerData.name,
              email: customerData.email,
              phone: customerData.phone,
              address: {
                line1: `${customerData.billing_address.street} ${customerData.billing_address.number_ext}`,
                city: customerData.billing_address.city,
                state: customerData.billing_address.state,
                postal_code: customerData.billing_address.postal_code,
                country: customerData.billing_address.country, 
              },
            },
          },
        },
      });

      if (error) {
        if (error.type === "card_error" || error.type === "validation_error") {
          setMessage(error.message || "Error en los datos de la tarjeta.");
        } else {
          setMessage("Ocurrió un error inesperado al procesar el pago.");
        }
      }
    } catch (e: any) {
        console.error("Error Stripe:", e);
        setMessage("Error de conexión con la pasarela de pagos.");
    } finally {
      setIsProcessing(false);
    }
  };

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: currency,
    }).format(amount / 100);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="flex items-center gap-2 px-1">
        <CreditCard size={16} />
        <h3 className="font-black text-sm uppercase tracking-tight">Tarjeta de Crédito / Débito</h3>
      </div>
      <div className="border p-4 rounded-xl bg-white shadow-sm hover:shadow-md transition-shadow">
        <PaymentElement id="payment-element" options={{ layout: 'tabs' }} />
      </div>

      {message && (
        <div className="bg-red-50 border border-red-100 p-4 rounded-xl flex gap-3 text-red-600 animate-in fade-in">
          <AlertTriangle size={18} className="shrink-0 mt-0.5" />
          <p className="text-xs font-bold leading-relaxed">{message}</p>
        </div>
      )}

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

// --- INTERFAZ CORRECTA PARA LOS PROPS ---
interface StripeFormProps {
  clientSecret: string;
  customerData: any;
  finalTotal: number;
  cartCurrency: string;
}

export const StripeForm = ({ clientSecret, customerData, finalTotal, cartCurrency }: StripeFormProps) => {
  return (
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
      <StripeFormInner 
        customerData={customerData} 
        finalTotal={finalTotal} 
        cartCurrency={cartCurrency} 
      />
    </Elements>
  );
};