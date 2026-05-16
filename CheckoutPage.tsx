import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { useCart } from './CartContext';
import { STORE_CONFIG } from './config';
import { useCheckout } from './hooks/useCheckout';

import { EmptyCart } from './components/Checkout/EmptyCart';
import { CheckoutProgress } from './components/Checkout/CheckoutProgress';
import { OrderSummary } from './components/Checkout/OrderSummary';
import { CountryStep } from './components/Checkout/CountryStep';
import { AddressStep } from './components/Checkout/AddressStep';
import { PaymentStep } from './components/Checkout/PaymentStep';

import { Loader2, AlertCircle } from 'lucide-react';

// --- CONSTANTES DE TEMA ---
const colors = STORE_CONFIG.theme.colors;
const ui = {
  borderRadius: '12px',
  fontFamily: "'Inter', sans-serif",
};

export interface ProjectConfig {
  project_uuid: string;
  base_currency: string;
  shipping_local_cost: number;
  shipping_intl_cost: number;
  free_shipping_threshold: number;
  support_email: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  origin_country: string;
}

export const CheckoutPage = () => {
  const { cart, cartCurrency } = useCart();
  const checkout = useCheckout();
  const { step, customerData, setLoading, selectedCountry } = checkout;

  const [dbConfig, setDbConfig] = useState<ProjectConfig | null>(null);
  const [configLoading, setConfigLoading] = useState(true);
  
  // Estados para manejar los datos de la pasarela dinámica
  const [paymentData, setPaymentData] = useState<any>(null);
  const [paymentProvider, setPaymentProvider] = useState<'stripe' | 'paypal' | 'mercadopago'>('stripe');
  const [apiError, setApiError] = useState('');

  const intentCreatedRef = useRef(false);

  // ✅ Hook 1: Carga de configuración del proyecto
  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const { data } = await axios.get(
          `${STORE_CONFIG.API_URL}/projects_config/${STORE_CONFIG.PROJECT_UUID}/config`
        );
        setDbConfig(data);
      } catch (error) {
        console.error('Error loading config:', error);
      } finally {
        setConfigLoading(false);
      }
    };

    fetchConfig();
  }, []);

  // ✅ Hook 2: Creación de Intención de Pago
  useEffect(() => {
    if (!dbConfig) return;
    if (step !== 'payment') return;
    if (paymentData) return;
    if (intentCreatedRef.current) return;

    const createPaymentIntent = async () => {
      setLoading(true);
      setApiError('');
      intentCreatedRef.current = true;

      try {
        const payload = {
          project_uuid: STORE_CONFIG.PROJECT_UUID,
          items: cart.map((item) => ({
            uuid: item.uuid,
            quantity: item.quantity,
            variant_uuid: item.selectedVariant?.uuid || null 
          })),
          customer_data: {
            name: customerData.name,
            email: customerData.email,
            phone: customerData.phone,
            billing_address: customerData.billing_address,
            shipping_address: STORE_CONFIG.businessType === 'physical' 
                ? (customerData.shipping_address || customerData.billing_address) 
                : customerData.billing_address 
          },
          success_url:  `${window.location.origin}/checkout/success` || "https://example.com/success",
          failure_url: `${window.location.origin}/checkout/cancel` || "https://example.com/cancel",
          locale: STORE_CONFIG.locale || 'es-MX',
        };

        const baseUrl = STORE_CONFIG.API_URL.replace(/\/v1\/?$/, '');
        const { data } = await axios.post(
          `${baseUrl}/v2/payments/${STORE_CONFIG.provider}/create-intent`,
          payload
        );

        if (data.success && data.data) {
          setPaymentData(data.data);
          
          // Detectar automáticamente el proveedor basado en la respuesta del backend
          if (data.data.clientSecret) {
            setPaymentProvider('stripe');
          } else if (data.data.ppOrderId) {
            setPaymentProvider('paypal');
          } else if (data.data.preferenceId) {
            setPaymentProvider('mercadopago');
          }
        } else {
          throw new Error(data.error || 'Error al crear la intención de pago');
        }
      } catch (error: any) {
        setApiError(error.message);
        intentCreatedRef.current = false;
      } finally {
        setLoading(false);
      }
    };

    createPaymentIntent();
  }, [
    dbConfig,
    step,
    cart,
    cartCurrency,
    customerData,
    selectedCountry,
    paymentData,
    setLoading,
  ]);

  if (configLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: colors.background }}>
        <Loader2 className="animate-spin" size={40} style={{ color: colors.accent }} />
      </div>
    );
  }

  if (!dbConfig) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: colors.background }}>
        <div className="text-center" style={{ color: colors.text }}>
          <AlertCircle size={40} className="mx-auto mb-4" style={{ color: colors.accent }} />
          <p className="font-bold">Error cargando configuración</p>
        </div>
      </div>
    );
  }

  if (cart.length === 0) {
    return <EmptyCart />;
  }

  const renderStep = () => {
    switch (step) {
      case 'country':
        return <CountryStep dbConfig={dbConfig} checkout={checkout} />;
      case 'address':
        return <AddressStep checkout={checkout} />;
      case 'payment':
        return (
          <>
            {apiError && (
              <div className="max-w-lg mx-auto mb-4 p-4 bg-red-50 border border-red-100 rounded-xl flex items-center gap-3 text-red-600">
                <AlertCircle size={20} />
                <p className="text-sm font-bold">{apiError}</p>
              </div>
            )}
            <PaymentStep
              provider={paymentProvider}
              paymentData={paymentData}
              customerData={customerData}
              dbConfig={dbConfig}
            />
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div 
      className="min-h-screen font-sans"
      style={{ 
        backgroundColor: colors.background,
        fontFamily: ui.fontFamily 
      }}
    >
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .checkout-container {
          animation: fadeIn 0.5s ease-out;
        }
      `}</style>

      {/* Header con padding top */}
      <div 
        className="border-b sticky top-0 z-40 backdrop-blur-xl"
        style={{ 
          backgroundColor: `${colors.background}E6`,
          borderColor: `${colors.text}10` 
        }}
      >
        <div className="max-w-4xl mx-auto px-4 md:px-6 py-6">
          <CheckoutProgress step={step} />
        </div>
      </div>

      {/* Contenido principal con padding top adicional */}
      <main className="max-w-4xl mx-auto px-4 md:px-6 py-8">
        <div className="checkout-container">
          {renderStep()}
        </div>
      </main>
    </div>
  );
};

export default CheckoutPage;
