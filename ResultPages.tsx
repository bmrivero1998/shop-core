import React, { useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useCart } from './CartContext';
import { STORE_CONFIG } from './config';
import { 
  CheckCircle2, 
  XCircle, 
  ArrowLeft, 
  MessageCircle, 
  Package, 
  Mail 
} from 'lucide-react';

/**
 * PÁGINA DE ÉXITO (PAGO COMPLETADO)
 */
export const SuccessPage = () => {
  const [searchParams] = useSearchParams();
  const { clearCart } = useCart();
  
  // Obtenemos el ID de la sesión de Stripe o el folio de nuestra orden de la URL
  const orderID = searchParams.get('order_id') || 'ORD-' + Math.random().toString(36).substr(2, 9).toUpperCase();

  // Limpiar el carrito al llegar aquí porque la compra ya se hizo
  useEffect(() => {
    clearCart();
  }, []);

  const handleWhatsAppConfirm = () => {
    const message = `¡Hola! Acabo de realizar un pago en la tienda ${STORE_CONFIG.storeName}.\n\nMi número de pedido es: *${orderID}*\n\nQuedo a la espera de la confirmación de envío. ¡Gracias!`;
    window.open(`https://wa.me/${STORE_CONFIG.fullWhatsApp}?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-6">
      <div className="max-w-md w-full text-center space-y-8">
        {/* Icono Animado */}
        <div className="flex justify-center">
          <div className="relative">
            <div className="absolute inset-0 bg-green-100 rounded-full animate-ping opacity-25"></div>
            <CheckCircle2 size={100} className="text-green-500 relative z-10" strokeWidth={1.5} />
          </div>
        </div>

        <div className="space-y-3">
          <h1 className="text-4xl font-black text-gray-900 tracking-tighter">¡PAGO EXITOSO!</h1>
          <p className="text-gray-500 font-medium">Hemos recibido tu pedido y estamos trabajando en él.</p>
        </div>

        {/* Tarjeta de Folio */}
        <div className="bg-gray-50 border border-gray-100 rounded-3xl p-6 space-y-4">
          <div>
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Número de Folio</span>
            <p className="text-xl font-mono font-bold text-gray-900">{orderID}</p>
          </div>
          <div className="flex items-center justify-center gap-6 pt-4 border-t border-gray-200/50">
            <div className="flex flex-col items-center">
              <Mail size={18} className="text-gray-400 mb-1" />
              <span className="text-[10px] font-bold text-gray-500">Recibo enviado</span>
            </div>
            <div className="flex flex-col items-center">
              <Package size={18} className="text-gray-400 mb-1" />
              <span className="text-[10px] font-bold text-gray-500">En preparación</span>
            </div>
          </div>
        </div>

        {/* Acciones Críticas */}
        <div className="flex flex-col gap-3">
          <button
            onClick={handleWhatsAppConfirm}
            className="w-full py-4 bg-[#25D366] text-white font-black rounded-2xl hover:shadow-lg hover:shadow-green-100 transition flex items-center justify-center gap-3"
          >
            <MessageCircle size={22} />
            Confirmar por WhatsApp
          </button>
          
          <Link
            to="/"
            className="w-full py-4 bg-black text-white font-black rounded-2xl hover:bg-gray-800 transition flex items-center justify-center gap-2"
          >
            <ArrowLeft size={18} />
            Volver a la tienda
          </Link>
        </div>

        <p className="text-[10px] text-gray-400 font-medium">
          Se ha enviado un correo de confirmación a la dirección proporcionada durante el pago.
        </p>
      </div>
    </div>
  );
};

/**
 * PÁGINA DE ERROR (PAGO CANCELADO O FALLIDO)
 */
export const CancelPage = () => {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-6">
      <div className="max-w-md w-full text-center space-y-8">
        <div className="flex justify-center">
          <XCircle size={100} className="text-red-500 opacity-90" strokeWidth={1.5} />
        </div>

        <div className="space-y-3">
          <h1 className="text-4xl font-black text-gray-900 tracking-tighter">PAGO CANCELADO</h1>
          <p className="text-gray-500 font-medium">
            No se realizó ningún cargo. Tu carrito sigue guardado por si quieres intentarlo de nuevo.
          </p>
        </div>

        <div className="bg-red-50 border border-red-100 rounded-3xl p-6">
          <p className="text-sm text-red-700 font-medium leading-relaxed">
            ¿Tuviste problemas con el pago? Puedes intentar con otra tarjeta o contactarnos directamente para ayudarte con tu compra.
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <Link
            to="/"
            className="w-full py-4 bg-black text-white font-black rounded-2xl hover:bg-gray-800 transition flex items-center justify-center gap-2"
          >
            <ArrowLeft size={18} />
            Regresar al carrito
          </Link>
          
          <button
            onClick={() => window.open(`https://wa.me/${STORE_CONFIG.fullWhatsApp}`, '_blank')}
            className="w-full py-4 border-2 border-gray-100 text-gray-900 font-black rounded-2xl hover:bg-gray-50 transition flex items-center justify-center gap-3"
          >
            <MessageCircle size={20} className="text-[#25D366]" />
            Hablar con soporte
          </button>
        </div>
      </div>
    </div>
  );
};