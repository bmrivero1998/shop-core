/*import React, { useEffect, useRef } from 'react';
import { initMercadoPago, Wallet } from '@mercadopago/sdk-react';
import type { ComponentProps } from 'react';
import { Lock } from 'lucide-react';
import { STORE_CONFIG } from '../../config';

interface MercadoPagoFormProps {
  preferenceId: string;
}

type WalletComponentProps = ComponentProps<typeof Wallet>;

export const MercadoPagoForm: React.FC<MercadoPagoFormProps> = ({ preferenceId }) => {
  const initialized = useRef(false);

  useEffect(() => {
    // Evitamos doble inicialización en modo estricto de React
    if (initialized.current) return;

    const publicKey = STORE_CONFIG.MERCADO_PAGO_PUBLIC_KEY;

    if (!publicKey) {
      console.error('Falta MERCADO_PAGO_PUBLIC_KEY en STORE_CONFIG.');
      return;
    }

    // Inicializamos con el locale basado en el país de la tienda o fallback
    initMercadoPago(publicKey, {
      locale: 'es-MX' // O puedes derivarlo de STORE_CONFIG.country
    });

    initialized.current = true;
  }, []);

  if (!preferenceId) return null;

  const initialization: WalletComponentProps['initialization'] = {
    preferenceId,
    redirectMode: 'self' // Abre la pasarela en la misma pestaña
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-500">
      <Wallet
        initialization={initialization}
        onReady={() => {
          console.log('Mercado Pago Wallet Brick listo');
        }}
        onError={(error: unknown) => {
          console.error('Error en Mercado Pago Brick:', error);
        }}
      />

      <div className="flex items-center justify-center gap-2 text-gray-400 mt-2">
        <Lock size={12} />
        <span className="text-[10px] font-black uppercase tracking-widest">
          Pagos 100% seguros por Mercado Pago
        </span>
      </div>
    </div>
  );
};
*/