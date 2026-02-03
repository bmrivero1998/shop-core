import React from 'react';
import { useCart } from './CartContext';
import { STORE_CONFIG, SUPPORTED_COUNTRIES } from './config';
import { 
  X, 
  Minus, 
  Plus, 
  Trash2, 
  ShoppingBag, 
  ArrowRight 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom'; // O el router que uses

export const CartModal = () => {
  const { 
    cart, 
    isOpen, 
    setIsOpen, 
    removeFromCart, 
    updateQuantity, 
    cartTotal, 
    cartCurrency,
    totalItems 
  } = useCart();

  // Para navegación al checkout
  // const navigate = useNavigate(); 

  if (!isOpen) return null;

  // Obtener símbolo de moneda basado en la config
  const currencySymbol = SUPPORTED_COUNTRIES[STORE_CONFIG.country]?.flag ? 
    (cartCurrency === 'usd' ? '$' : '$') : '$'; 

  const handleCheckout = () => {
    setIsOpen(false);
    // window.location.href = '/checkout'; // O navigate('/checkout')
  };

  return (
    <div className="fixed inset-0 z-[100] overflow-hidden">
      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={() => setIsOpen(false)}
      />

      <div className="absolute inset-y-0 right-0 max-w-full flex">
        <div className="w-screen max-w-md transform transition-transform duration-500 ease-in-out">
          <div className="h-full flex flex-col bg-white shadow-2xl">
            
            {/* HEADER */}
            <div className="px-6 py-6 border-b flex items-center justify-between">
              <div className="flex items-center gap-3">
                <ShoppingBag size={24} className="text-black" />
                <h2 className="text-xl font-black uppercase tracking-tighter">Tu Carrito</h2>
                <span className="bg-gray-100 text-gray-500 text-[10px] font-bold px-2 py-1 rounded-full">
                  {totalItems} items
                </span>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition"
              >
                <X size={24} />
              </button>
            </div>

            {/* LISTA DE PRODUCTOS */}
            <div className="flex-1 overflow-y-auto px-6 py-4">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-40">
                  <ShoppingBag size={80} strokeWidth={1} />
                  <p className="font-bold text-lg">Tu carrito está vacío</p>
                  <button 
                    onClick={() => setIsOpen(false)}
                    className="text-sm underline font-bold"
                  >
                    Volver a la tienda
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  {cart.map((item) => (
                    <div key={item.uuid} className="flex gap-4">
                      {/* Imagen */}
                      <div className="w-20 h-20 bg-gray-50 rounded-2xl overflow-hidden flex-shrink-0 border">
                        <img 
                          src={item.image} 
                          alt={item.name} 
                          className="w-full h-full object-cover" 
                        />
                      </div>

                      {/* Info */}
                      <div className="flex-1 flex flex-col justify-between">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-bold text-sm text-gray-900 line-clamp-1">{item.name}</h3>
                            <p className="text-xs font-bold text-gray-400 uppercase">{item.currency}</p>
                          </div>
                          <button 
                            onClick={() => removeFromCart(item.uuid)}
                            className="text-gray-300 hover:text-red-500 transition"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>

                        <div className="flex justify-between items-end">
                          <div className="flex items-center bg-gray-50 rounded-lg border p-1">
                            <button 
                              onClick={() => updateQuantity(item.uuid, -1)}
                              className="p-1 hover:bg-white rounded transition"
                            >
                              <Minus size={12} />
                            </button>
                            <span className="w-8 text-center text-xs font-black">{item.quantity}</span>
                            <button 
                              onClick={() => updateQuantity(item.uuid, 1)}
                              className="p-1 hover:bg-white rounded transition"
                            >
                              <Plus size={12} />
                            </button>
                          </div>
                          <p className="font-black text-sm">
                            ${((item.price * item.quantity) / 100).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* FOOTER - RESUMEN */}
            <div className="border-t px-6 py-8 bg-gray-50 space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between text-gray-400 text-sm font-bold">
                  <span>Subtotal</span>
                  <span>${(cartTotal / 100).toFixed(2)} {cartCurrency.toUpperCase()}</span>
                </div>
                <div className="flex justify-between text-black text-2xl font-black">
                  <span>Total</span>
                  <span>${(cartTotal / 100).toFixed(2)} {cartCurrency.toUpperCase()}</span>
                </div>
                <p className="text-[10px] text-gray-400 font-medium">
                  {STORE_CONFIG.text.shippingNote}
                </p>
              </div>

              <button
                disabled={cart.length === 0}
                onClick={handleCheckout}
                className={`w-full py-5 rounded-2xl font-black flex items-center justify-center gap-3 transition shadow-xl ${
                  cart.length === 0 
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed shadow-none' 
                    : 'bg-black text-white hover:bg-gray-800 active:scale-95 shadow-gray-200'
                }`}
              >
                Pagar pedido
                <ArrowRight size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};