import { useCart } from './CartContext';
import { STORE_CONFIG } from './config';
import { 
  X, 
  Minus, 
  Plus, 
  Trash2, 
  ShoppingBag, 
  ArrowRight 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

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

  const navigate = useNavigate(); 

  if (!isOpen) return null;

  const handleCheckout = () => {
    setIsOpen(false);
    navigate('/checkout');
  };

  return (
    <div className="fixed inset-0 z-[200] overflow-hidden">
      
      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={() => setIsOpen(false)}
      />

      <div className="absolute inset-y-0 right-0 max-w-full flex">
        <div className={`w-screen max-w-md transform transition-transform duration-500 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
          
          <div className="h-full flex flex-col bg-white shadow-2xl">
            
            {/* HEADER */}
            <div className="px-6 py-6 border-b flex items-center justify-between bg-white sticky top-0 z-10">
              <div className="flex items-center gap-3">
                <ShoppingBag size={24} className="text-black" />
                <h2 className="text-xl font-black uppercase tracking-tighter text-black">
                  Tu Carrito
                </h2>
                <span className="bg-gray-100 text-gray-500 text-[10px] font-black px-2 py-1 rounded-full">
                  {totalItems} {totalItems === 1 ? 'ITEM' : 'ITEMS'}
                </span>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition text-black"
              >
                <X size={24} />
              </button>
            </div>

            {/* LISTA */}
            <div className="flex-1 overflow-y-auto px-6 py-4 bg-white">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-40">
                  <ShoppingBag size={80} strokeWidth={1} className="text-black" />
                  <p className="font-bold text-lg text-black uppercase tracking-tighter">
                    Tu carrito está vacío
                  </p>
                  <button 
                    onClick={() => setIsOpen(false)}
                    className="text-xs underline font-black uppercase tracking-widest text-black"
                  >
                    Volver a la tienda
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  {cart.map((item) => (
                    <div
                      key={`${item.uuid}-${item.selectedVariant?.uuid ?? 'base'}`}
                      className="flex gap-4 border-b border-gray-50 pb-6"
                    >
                      {/* Imagen */}
                      <div className="w-20 h-20 bg-gray-50 rounded-2xl overflow-hidden flex-shrink-0 border border-gray-100">
                        <img 
                          src={item.image} 
                          alt={item.name} 
                          className="w-full h-full object-cover mix-blend-multiply" 
                        />
                      </div>

                      {/* Info */}
                      <div className="flex-1 flex flex-col justify-between">
                        
                        <div className="flex justify-between items-start">
                          <div className="text-left">
                            <h3 className="font-bold text-sm text-gray-900 line-clamp-1 leading-tight">
                              {item.name}
                            </h3>

                            {/* Variante */}
                            {item.selectedVariant && (
                              <div className="mt-1">
                                <span className="text-[9px] font-black bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded uppercase">
                                  {item.selectedVariant.variant_name}
                                </span>
                              </div>
                            )}

                            <p className="text-[10px] font-black text-gray-400 uppercase mt-1">
                              {item.currency}
                            </p>
                          </div>

                          <button 
                            onClick={() =>
                              removeFromCart(
                                item.uuid,
                                item.selectedVariant?.uuid
                              )
                            }
                            className="text-gray-300 hover:text-red-500 transition p-1"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>

                        {/* Cantidad y precio */}
                        <div className="flex justify-between items-end mt-2">
                          <div className="flex items-center bg-gray-50 rounded-xl border border-gray-100 p-1">
                            <button 
                              onClick={() =>
                                updateQuantity(
                                  item.uuid,
                                  -1,
                                  item.selectedVariant?.uuid
                                )
                              }
                              className="p-1.5 hover:bg-white rounded-lg transition text-black"
                            >
                              <Minus size={12} />
                            </button>

                            <span className="w-8 text-center text-xs font-black text-black">
                              {item.quantity}
                            </span>

                            <button 
                              onClick={() =>
                                updateQuantity(
                                  item.uuid,
                                  1,
                                  item.selectedVariant?.uuid
                                )
                              }
                              className="p-1.5 hover:bg-white rounded-lg transition text-black"
                            >
                              <Plus size={12} />
                            </button>
                          </div>

                          <p className="font-black text-sm text-black">
                            ${((item.price * item.quantity) / 100).toFixed(2)}
                          </p>
                        </div>

                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* FOOTER */}
            <div className="border-t px-6 py-8 bg-gray-50 space-y-6">
              <div className="space-y-3">
                
                <div className="flex justify-between text-gray-400 text-xs font-black uppercase tracking-widest">
                  <span>Subtotal</span>
                  <span>
                    ${(cartTotal / 100).toFixed(2)} {cartCurrency.toUpperCase()}
                  </span>
                </div>

                <div className="flex justify-between text-black text-3xl font-black italic tracking-tighter">
                  <span>TOTAL</span>
                  <span>
                    ${(cartTotal / 100).toFixed(2)} {cartCurrency.toUpperCase()}
                  </span>
                </div>

                <div className="bg-white/50 p-3 rounded-xl border border-dashed border-gray-200">
                  <p className="text-[10px] text-gray-500 font-bold uppercase leading-tight text-center">
                    {STORE_CONFIG.text.shippingNote}
                  </p>
                </div>
              </div>

              <button
                disabled={cart.length === 0}
                onClick={handleCheckout}
                className={`w-full py-5 rounded-2xl font-black flex items-center justify-center gap-3 transition shadow-xl ${
                  cart.length === 0 
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed shadow-none' 
                    : 'text-white active:scale-95 shadow-red-200'
                }`}
                style={{ 
                  backgroundColor: cart.length === 0 
                    ? '' 
                    : STORE_CONFIG.theme.colors.accent 
                }}
              >
                PAGAR PEDIDO
                <ArrowRight size={20} />
              </button>

            </div>

          </div>
        </div>
      </div>
    </div>
  );
};
