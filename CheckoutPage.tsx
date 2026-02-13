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
  const { step, customerData, setLoading, selectedCountry } =
    checkout;

  const [dbConfig, setDbConfig] = useState<ProjectConfig | null>(null);
  const [configLoading, setConfigLoading] = useState(true);
  const [clientSecret, setClientSecret] = useState('');
  const [apiError, setApiError] = useState('');

  const intentCreatedRef = useRef(false);

  // ✅ Hook 1
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

  // ✅ Hook 2 (SIEMPRE se declara, aunque no haga nada aún)
  useEffect(() => {
    if (!dbConfig) return;
    if (step !== 'payment') return;
    if (clientSecret) return;
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
  }
};

        const { data } = await axios.post(
          `${STORE_CONFIG.API_URL}/payments/create-intent`,
          payload
        );

        if (data.success && data.data.clientSecret) {
          setClientSecret(data.data.clientSecret);
        } else {
          throw new Error(data.error);
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
    clientSecret,
    setLoading,
  ]);

  // 🔥 AHORA sí podemos hacer returns condicionales

  if (configLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin" size={40} />
      </div>
    );
  }

  if (!dbConfig) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Error cargando configuración
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
          <PaymentStep
            clientSecret={clientSecret}
            customerData={customerData}
            dbConfig={dbConfig}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div>
      <CheckoutProgress step={step} />
      {renderStep()}
    </div>
  );
};

