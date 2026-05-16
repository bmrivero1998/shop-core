/*import React, { useState } from 'react';
import {
  PayPalScriptProvider,
  PayPalButtons,
  type PayPalButtonsComponentProps
} from '@paypal/react-paypal-js';
import { Loader2, Lock } from 'lucide-react';
import { STORE_CONFIG } from '../../config';

interface PayPalPaymentFormProps {
  ppOrderId: string;
  currency: string;
  onSuccess?: (id: string) => void;
}

export const PayPalPaymentForm: React.FC<PayPalPaymentFormProps> = ({
  ppOrderId,
  currency,
  onSuccess
}) => {
  const [isProcessing, setIsProcessing] = useState(false);

  const handleApprove: PayPalButtonsComponentProps['onApprove'] = async (data) => {
    if (!data.orderID) return;

    setIsProcessing(true);

    try {
      // Removemos el /v1 del API_URL en caso de que lo traiga
      const baseUrl = STORE_CONFIG.API_URL.replace(/\/v1\/?$/, '');
      
      // Ajustado a la ruta exacta de la API: /v2/payments/paypal/capture
      const response = await fetch(`${baseUrl}/v2/payments/paypal/capture`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          ppOrderId: data.orderID,
          project_uuid: STORE_CONFIG.PROJECT_UUID 
        })
      });

      const result = await response.json();
      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Error capturando el pago');
      }

      const orderUuid = result.data.orderUuid;

      onSuccess?.(orderUuid);

      window.location.href = `/checkout/success?order=${orderUuid}`;
    } catch (error: any) {
      console.error('Error al capturar el pago:', error);
      alert(error.message || 'No se pudo confirmar el pago.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCreateOrder: PayPalButtonsComponentProps['createOrder'] = async () => {
    return ppOrderId;
  };

  return (
    <div className="space-y-4">
     <PayPalScriptProvider
        options={{
          clientId: STORE_CONFIG.PAYPAL_CLIENT_ID,
          currency: (currency || 'MXN').toUpperCase(),
          intent: 'capture'
        }}
      >
        {isProcessing && (
          <div className="flex justify-center my-4 text-gray-400">
            <Loader2 className="animate-spin" size={24} />
          </div>
        )}

        <PayPalButtons
          style={{
            layout: 'vertical',
            color: 'black',
            shape: 'rect',
            label: 'pay'
          }}
          createOrder={handleCreateOrder}
          onApprove={handleApprove}
          onError={(err) => {
            console.error('PayPal error:', err);
          }}
          onCancel={() => {
            console.warn('Pago cancelado por el usuario');
          }}
          disabled={isProcessing}
        />
      </PayPalScriptProvider>

      <div className="flex items-center justify-center gap-2 text-gray-400 mt-4">
        <Lock size={12} />
        <span className="text-[10px] font-black uppercase tracking-widest">
          Protección al comprador de PayPal
        </span>
      </div>
    </div>
  );
};
*/