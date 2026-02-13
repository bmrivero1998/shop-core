import React, { createContext, useContext, useState, useEffect } from 'react';
import { CheckCircle2, AlertCircle, X } from 'lucide-react';

// --- TIPOS ---
export interface CartItem {
  uuid: string;
  name: string;
  price: number; // En centavos
  currency: string; // 'mxn', 'usd', etc.
  image: string;
  quantity: number;
  sku?: string;
  category_id?: string;
  selectedVariant?: {
  uuid: string;
  variant_name: string;
};
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: {
  uuid: string;
  name: string;
  price: number;
  currency: string;
  images?: string;
  image?: string;
  quantity?: number;
  sku?: string;
  category_id?: string;
  selectedVariant?: {
    uuid: string;
    variant_name: string;
    price_override?: number;
  };
}) => void;

removeFromCart: (uuid: string, variantUuid?: string) => void;

updateQuantity: (uuid: string, delta: number, variantUuid?: string) => void;

  clearCart: () => void;
  cartTotal: number;
  cartCurrency: string;
  totalItems: number; 
  isOpen: boolean;
  setIsOpen: (v: boolean) => void;
}

// --- ESTADO DEL TOAST ---
type ToastState = { show: boolean; message: string; type: 'success' | 'error' };

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartCurrency, setCartCurrency] = useState<string>('mxn');
  const [isOpen, setIsOpen] = useState(false);
  const [toast, setToast] = useState<ToastState>({ show: false, message: '', type: 'success' });

  // 1. Cargar carrito de localStorage al iniciar
  useEffect(() => {
    const savedCart = localStorage.getItem('metritrak_cart');
    if (savedCart) {
      try {
        const parsed = JSON.parse(savedCart);
        if (Array.isArray(parsed)) {
          setCart(parsed);
          if (parsed.length > 0) setCartCurrency(parsed[0].currency);
        }
      } catch (e) {
        console.error("Error al recuperar el carrito:", e);
      }
    }
  }, []);

  // 2. Guardar en localStorage ante cambios
  useEffect(() => {
    localStorage.setItem('metritrak_cart', JSON.stringify(cart));
    if (cart.length > 0) {
      setCartCurrency(cart[0].currency);
    }
  }, [cart]);

  // Helper para notificaciones tipo Toast
  const showNotification = (message: string, type: 'success' | 'error') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast(prev => ({ ...prev, show: false })), 3000);
  };

  // --- LÓGICA DE AGREGAR (EL GUARDIÁN) ---
const addToCart = (product: any) => {
  const newCurrency = (product.currency || 'mxn').toLowerCase();
  const qtyToAdd = product.quantity || 1;
  const variant = product.selectedVariant;

  setCart(prev => {
    const existingIndex = prev.findIndex(item => {
      const sameId = item.uuid === product.uuid;
      const sameVariant =
        (item.selectedVariant?.uuid || null) ===
        (variant?.uuid || null);

      return sameId && sameVariant;
    });

    if (existingIndex !== -1) {
      const newCart = [...prev];
      newCart[existingIndex] = {
        ...newCart[existingIndex],
        quantity: newCart[existingIndex].quantity + qtyToAdd
      };
      return newCart;
    }

    return [
      ...prev,
      {
        uuid: product.uuid,
        name: product.name,
        price: product.price,
        currency: newCurrency,
        image: product.images
          ? product.images.split(',')[0]
          : product.image || '',
        quantity: qtyToAdd,
        sku: product.sku,
        category_id: product.category_id,
        selectedVariant: variant
          ? {
              uuid: variant.uuid,
              variant_name: variant.variant_name
            }
          : undefined
      }
    ];
  });

  showNotification('Agregado al carrito', 'success');
};


 const removeFromCart = (uuid: string, variantUuid?: string) => {
  setCart(prev =>
    prev.filter(item =>
      !(
        item.uuid === uuid &&
        (item.selectedVariant?.uuid || null) === (variantUuid || null)
      )
    )
  );
};


const updateQuantity = (uuid: string, delta: number, variantUuid?: string) => {
  setCart(prev =>
    prev.map(item => {
      const sameProduct = item.uuid === uuid;
      const sameVariant =
        (item.selectedVariant?.uuid || null) === (variantUuid || null);

      if (sameProduct && sameVariant) {
        const newQty = item.quantity + delta;
        return newQty > 0 ? { ...item, quantity: newQty } : item;
      }

      return item;
    })
  );
};


  const clearCart = () => {
    setCart([]);
    localStorage.removeItem('metritrak_cart');
  };

  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider value={{
      cart,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      cartTotal,
      cartCurrency,
      totalItems,
      isOpen,
      setIsOpen
    }}>
      {children}

      {/* RENDER DEL TOAST */}
      <div 
        className={`fixed bottom-8 left-1/2 -translate-x-1/2 z-[100] transition-all duration-500 transform ${
          toast.show ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0 pointer-events-none'
        }`}
      >
        <div className={`flex items-center gap-3 px-6 py-3 rounded-2xl shadow-2xl border ${
          toast.type === 'error' 
            ? 'bg-red-50 border-red-200 text-red-700' 
            : 'bg-zinc-900 border-zinc-800 text-white'
        }`}>
          {toast.type === 'error' ? <AlertCircle size={20} /> : <CheckCircle2 size={20} className="text-emerald-400" />}
          <span className="font-bold text-sm tracking-tight">{toast.message}</span>
          <button onClick={() => setToast(prev => ({ ...prev, show: false }))} className="ml-2 opacity-50 hover:opacity-100">
            <X size={16} />
          </button>
        </div>
      </div>
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart debe usarse dentro de un CartProvider');
  return context;
};