// src/shop/components/Checkout/PaymentStep.tsx
import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { STORE_CONFIG } from '../../config';
import { ShieldCheck, Loader2, AlertTriangle, CreditCard } from 'lucide-react';

// Inicializar Stripe fuera para evitar re-instanciaciones
const stripePromise = loadStripe(STORE_CONFIG.STRIPE_PUBLIC_KEY);

const StripePaymentForm = ({ 
  customerAddress,
  customerName,
  customerEmail,
  customerPhone 
}: { 
  customerAddress: any;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const [message, setMessage] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setIsProcessing(true);
    setMessage('');

    const billingDetails = {
      name: customerName,
      email: customerEmail,
      phone: customerPhone,
      address: {
        line1: `${customerAddress.street} ${customerAddress.number_ext}`.trim(),
        line2: customerAddress.number_int || undefined,
        city: customerAddress.city,
        state: customerAddress.state,
        postal_code: customerAddress.postal_code,
        country: customerAddress.country || STORE_CONFIG.country,
      }
    };

    try {
      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          payment_method_data: {
            billing_details: billingDetails
          },
          return_url: `${window.location.origin}/success`,
        },
        redirect: 'if_required',
      });

      if (error) {
        if (error.type === "card_error" || error.type === "validation_error") {
          setMessage(error.message || "Error en los datos de la tarjeta.");
        } else {
          setMessage("Ocurrió un error inesperado al procesar el pago.");
        }
      } else {
        // Redirección manual al éxito
        window.location.href = `${window.location.origin}/success`;
      }
    } catch (e: any) {
      setMessage("Error crítico de conexión.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 animate-in fade-in duration-500">
      
      {/* Resumen Compacto de Envío */}
      <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
        <div className="flex items-center gap-2 mb-3 text-gray-400">
          <ShieldCheck size={16} />
          <span className="text-[10px] font-black uppercase tracking-widest">Resumen de entrega</span>
        </div>
        <div className="text-sm font-bold text-gray-900 leading-relaxed">
          <p>{customerName}</p>
          <p className="text-gray-500 font-medium">
            {customerAddress.street} {customerAddress.number_ext}, {customerAddress.neighborhood}
          </p>
          <p className="text-gray-500 font-medium">{customerAddress.postal_code} - {customerAddress.city}</p>
        </div>
      </div>

      {/* Interfaz de Stripe */}
      <div className="bg-white p-2">
        <div className="flex items-center gap-2 mb-4">
          <CreditCard size={18} className="text-black" />
          <h3 className="font-black text-sm uppercase tracking-tight">Información de Pago</h3>
        </div>
        <PaymentElement options={{ layout: 'tabs' }} />
      </div>

      {message && (
        <div className="bg-red-50 border border-red-100 p-4 rounded-xl flex gap-3 text-red-600 animate-shake">
          <AlertTriangle size={18} className="shrink-0" />
          <p className="text-xs font-bold leading-tight">{message}</p>
        </div>
      )}

      <button 
        disabled={isProcessing || !stripe || !elements}
        className="w-full bg-black text-white py-5 rounded-2xl font-black hover:bg-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-xl shadow-gray-200 flex items-center justify-center gap-3"
      >
        {isProcessing ? (
          <>
            <Loader2 className="animate-spin" size={20} />
            Validando pago...
          </>
        ) : (
          `Pagar ahora`
        )}
      </button>

      <div className="flex items-center justify-center gap-2 opacity-30 grayscale pt-2">
        <img src="https://upload.wikimedia.org/wikipedia/commons/b/ba/Stripe_Logo%2C_revised_2016.svg" alt="Stripe" className="h-4" />
        <span className="text-[8px] font-black uppercase tracking-widest">Secure Payment</span>
      </div>
    </form>
  );
};

interface PaymentStepProps {
  clientSecret: string;
  customerData: any;
}

export const PaymentStep: React.FC<PaymentStepProps> = ({
  clientSecret,
  customerData,
}) => {
  return (
    <div className="w-full max-w-xl mx-auto">
      {clientSecret ? (
        <div className="bg-white p-2 md:p-4 rounded-3xl">
          <Elements 
            stripe={stripePromise} 
            options={{ 
              clientSecret,
              appearance: {
                theme: 'stripe',
                variables: { 
                  colorPrimary: '#000000', 
                  borderRadius: '12px',
                  fontFamily: 'Inter, system-ui, sans-serif'
                }
              }
            }}
          >
            <StripePaymentForm 
              customerAddress={customerData.billing_address}
              customerName={customerData.name}
              customerEmail={customerData.email}
              customerPhone={customerData.phone}
            />
          </Elements>
        </div>
      ) : (
        <div className="text-center py-20 bg-white rounded-3xl border border-dashed flex flex-col items-center">
          <Loader2 className="animate-spin text-gray-200 mb-4" size={48} />
          <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Iniciando pasarela segura...</p>
        </div>
      )}
    </div>
  );
};