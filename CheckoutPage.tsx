import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { useCart } from './CartContext';
import { STORE_CONFIG } from './config';
import { useCheckout } from './hooks/useCheckout';

// Componentes
import { EmptyCart } from './components/Checkout/EmptyCart';
import { CheckoutProgress } from './components/Checkout/CheckoutProgress';
import { OrderSummary } from './components/Checkout/OrderSummary';
import { CountryStep } from './components/Checkout/CountryStep';
import { AddressStep } from './components/Checkout/AddressStep';
import { PaymentStep } from './components/Checkout/PaymentStep';
import { Loader2, AlertCircle } from 'lucide-react';

export const CheckoutPage = () => {
  const { cart, cartTotal, cartCurrency, clearCart } = useCart();
  const checkout = useCheckout(); // Hook maestro
  const { step, setStep, customerData, setLoading, loading } = checkout;

  const [clientSecret, setClientSecret] = useState('');
  const [apiError, setApiError] = useState('');
  
  // Ref para evitar doble llamada al API en modo estricto de React
  const intentCreatedRef = useRef(false);

  // 1. GUARDIÁN DE CARRITO VACÍO
  if (cart.length === 0) {
    return <EmptyCart />;
  }

  // 2. ORQUESTADOR DE CREACIÓN DE PAGO
  // Este efecto vigila cuando el usuario pasa al paso 'payment'.
  // Si entra a 'payment' y no tiene un clientSecret, lo genera.
  useEffect(() => {
    const createPaymentIntent = async () => {
      if (step !== 'payment') return;
      if (clientSecret) return; // Ya tenemos uno, no recrear
      if (intentCreatedRef.current) return; // Evitar doble disparo

      setLoading(true);
      setApiError('');
      intentCreatedRef.current = true;

      try {
        
        const payload = {
          project_uuid: STORE_CONFIG.PROJECT_UUID,
          currency: cartCurrency, // La moneda la dicta el carrito
          items: cart.map(item => ({
            product_uuid: item.uuid,
            quantity: item.quantity,
            price: item.price, // El backend debería re-validar esto idealmente
            name: item.name
          })),
          customer_info: {
            name: customerData.name,
            email: customerData.email,
            phone: customerData.phone,
            address: customerData.billing_address
          },
          metadata: {
            source: 'web_checkout',
            store_mode: STORE_CONFIG.mode
          }
        };

        const { data } = await axios.post(`${STORE_CONFIG.API_URL}/payments/create-intent`, payload);

        if (data.success && data.data.clientSecret) {
          setClientSecret(data.data.clientSecret);
        } else {
          throw new Error(data.error || "No se pudo iniciar la pasarela de pago.");
        }

      } catch (error: any) {
        console.error("❌ Error creando PaymentIntent:", error);
        setApiError(error.response?.data?.error || error.message || "Error de conexión con el servidor.");
        setStep('address'); // Regresar al usuario para que no vea una pantalla vacía
        intentCreatedRef.current = false; // Permitir reintentar
      } finally {
        setLoading(false);
      }
    };

    createPaymentIntent();
  }, [step, cart, cartCurrency, customerData, setStep, setLoading, clientSecret]);


  // 3. RENDERIZADO DEL PASO ACTUAL
  const renderStep = () => {
    switch (step) {
      case 'country':
        return <CountryStep checkout={checkout} />;
      
      case 'address':
        return <AddressStep checkout={checkout} />;
      
      case 'payment':
        return (
          <PaymentStep 
            clientSecret={clientSecret} 
            customerData={customerData}
          />
        );
        
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] pb-20 font-sans text-gray-900">
      
      {/* Header Simple */}
      <div className="bg-white border-b py-4 px-6 sticky top-0 z-30 shadow-sm">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <h1 className="font-black text-xl tracking-tighter uppercase italic">
            {STORE_CONFIG.storeName} Checkout
          </h1>
          <div className="text-xs font-bold text-gray-400 flex items-center gap-2">
             <span className="hidden md:inline">Transacción Segura</span> 🔒
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 md:px-6 py-8">
        
        {/* Barra de Progreso */}
        <CheckoutProgress step={step} />

        {/* Mensajes de Error Globales */}
        {apiError && (
          <div className="mb-6 bg-red-50 border border-red-200 p-4 rounded-2xl flex items-center gap-3 text-red-700 animate-in slide-in-from-top-2">
            <AlertCircle size={20} />
            <p className="text-sm font-bold">{apiError}</p>
            <button 
              onClick={() => setApiError('')} 
              className="ml-auto text-xs underline hover:text-red-900"
            >
              Cerrar
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* COLUMNA IZQUIERDA: FORMULARIOS (8 columnas) */}
          <div className="lg:col-span-7 xl:col-span-8 order-2 lg:order-1">
            <div className="bg-white p-6 md:p-8 rounded-[2rem] shadow-sm border border-gray-100 min-h-[400px] relative">
              
              {/* Overlay de Carga Global */}
              {loading && (
                <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-50 flex flex-col items-center justify-center rounded-[2rem]">
                  <Loader2 className="animate-spin text-black mb-4" size={40} />
                  <p className="font-black text-sm uppercase tracking-widest animate-pulse">Procesando...</p>
                </div>
              )}

              {renderStep()}
            </div>

            {/* Botón de regreso (Solo si no estamos en country) */}
            {step !== 'country' && !loading && (
               <button 
                 onClick={() => setStep(step === 'payment' ? 'address' : 'country')}
                 className="mt-6 text-gray-400 text-sm font-bold hover:text-black flex items-center gap-2 transition-colors px-4"
               >
                 ← Volver al paso anterior
               </button>
            )}
          </div>

          {/* COLUMNA DERECHA: RESUMEN (4 columnas) */}
          <div className="lg:col-span-5 xl:col-span-4 order-1 lg:order-2 lg:sticky lg:top-24">
            <OrderSummary 
              cart={cart} 
              total={cartTotal} 
              currency={cartCurrency}
            />
            
            {/* Sellos de Confianza */}
            <div className="mt-6 flex justify-center gap-4 grayscale opacity-40">
               <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" className="h-6" alt="Visa" />
               <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" className="h-6" alt="Mastercard" />
               <img src="https://upload.wikimedia.org/wikipedia/commons/b/ba/Stripe_Logo%2C_revised_2016.svg" className="h-6" alt="Stripe" />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};