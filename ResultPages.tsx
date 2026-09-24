import { useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useCart } from './CartContext';

export const SuccessPage = () => {
  const { clearCart } = useCart();
  const [params] = useSearchParams();
  // Stripe regresa aquí también cuando falla un pago con redirección (3DS, etc.)
  const failed = params.get('redirect_status') === 'failed';

  // El pago ya se completó: vaciamos el carrito (estado + localStorage 'metritrak_cart')
  useEffect(() => {
    if (!failed) clearCart();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [failed]);

  if (failed) return <ErrorPage />;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center p-4">
      <div className="text-6xl mb-4">🎉</div>
      <h1 className="text-4xl font-bold mb-2">¡Pago Exitoso!</h1>
      <p className="text-gray-600 mb-8">Gracias por tu compra. Te hemos enviado un correo.</p>
      <Link to="/store" className="bg-black text-white px-6 py-3 rounded font-bold">Volver a la Tienda</Link>
    </div>
  );
};

export const ErrorPage = () => (
  <div className="min-h-screen flex flex-col items-center justify-center text-center p-4">
    <div className="text-6xl mb-4">💔</div>
    <h1 className="text-4xl font-bold mb-2">Algo salió mal</h1>
    <p className="text-gray-600 mb-8">El pago no pudo procesarse. Intenta de nuevo.</p>
    <Link to="/checkout" className="bg-red-600 text-white px-6 py-3 rounded font-bold">Intentar de nuevo</Link>
  </div>
);
