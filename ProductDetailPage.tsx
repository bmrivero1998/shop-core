import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useCart } from './CartContext';
import { STORE_CONFIG } from './config';
import { 
  ShoppingCart, 
  ChevronLeft, 
  ChevronRight, 
  Minus, 
  Plus, 
  CreditCard,
  Loader2,
  AlertCircle 
} from 'lucide-react';
import { ALL_CATEGORIES } from './data/category';

const colors = STORE_CONFIG.theme.colors;

export const ProductDetailPage = () => {
  const { uuid } = useParams<{ uuid: string }>();
  const navigate = useNavigate();
  const { addToCart, setIsOpen } = useCart();
  
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [qty, setQty] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState<any>(null);
  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        // Asumiendo que tu API tiene un endpoint para producto individual
        const { data } = await axios.get(`${STORE_CONFIG.API_URL}/products/${uuid}`);
        setProduct(data);
      } catch (err) {
        console.error("Error fetching product:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    if (uuid) fetchProduct();
  }, [uuid]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <Loader2 className="animate-spin" size={40} style={{ color: colors.accent }} />
    </div>
  );

  if (error || !product) return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center">
      <AlertCircle size={48} className="mb-4 text-red-500" />
      <h2 className="text-xl font-bold">Producto no encontrado</h2>
      <button onClick={() => navigate('/')} className="mt-4 text-accent underline">Volver a la tienda</button>
    </div>
  );

  const images = product.images?.split(",").filter(Boolean) || [];
  const finalPrice = selectedVariant?.price_override > 0 ? selectedVariant.price_override : product.price;

  const handleAction = (goToCheckout: boolean) => {
    addToCart({
      ...product,
      quantity: qty,
      selectedVariant: selectedVariant || undefined,
      price: finalPrice
    });

    if (goToCheckout) {
      navigate('/checkout');
    } else {
      setIsOpen(true); // Abre el modal lateral del carrito
    }
  };

  return (
    <div className="min-h-screen bg-white pb-20 md:py-10">
      <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Galería de Imágenes */}
        <div className="relative aspect-square bg-gray-50 rounded-2xl overflow-hidden">
          <img 
            src={images[currentImage] || "https://via.placeholder.com/600"} 
            className="w-full h-full object-contain"
            alt={product.name}
          />
          {images.length > 1 && (
            <div className="absolute inset-x-0 bottom-4 flex justify-center gap-2">
              {images.map((_, i) => (
                <button 
                  key={i} 
                  onClick={() => setCurrentImage(i)}
                  className={`w-2 h-2 rounded-full ${i === currentImage ? 'bg-black' : 'bg-gray-300'}`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Info del Producto */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold" style={{ color: colors.text }}>{product.name}</h1>
            <p className="text-2xl font-black mt-2" style={{ color: colors.accent }}>
              ${(finalPrice / 100).toFixed(2)} {product.currency.toUpperCase()}
            </p>
          </div>

          <p className="text-gray-600 leading-relaxed">{product.description}</p>

          {/* Variantes (si existen) */}
          {product.variants?.length > 0 && (
            <div className="space-y-3">
              <span className="font-bold text-sm">Selecciona una opción:</span>
              <div className="flex flex-wrap gap-2">
                {product.variants.map((v: any) => (
                  <button
                    key={v.uuid}
                    onClick={() => setSelectedVariant(v)}
                    className={`px-4 py-2 rounded-lg border transition-all ${
                      selectedVariant?.uuid === v.uuid 
                        ? 'border-black bg-black text-white' 
                        : 'border-gray-200'
                    }`}
                  >
                    {v.variant_name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Selector de Cantidad */}
          <div className="flex items-center gap-4 py-4 border-y border-gray-100">
            <span className="font-bold">Cantidad:</span>
            <div className="flex items-center border rounded-xl p-1">
              <button onClick={() => setQty(q => Math.max(1, q-1))} className="p-2"><Minus size={16}/></button>
              <span className="w-8 text-center font-bold">{qty}</span>
              <button onClick={() => setQty(q => q+1)} className="p-2"><Plus size={16}/></button>
            </div>
          </div>

          {/* Botones de Acción */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button
              onClick={() => handleAction(false)}
              className="flex items-center justify-center gap-2 py-4 rounded-xl font-bold border-2 transition-all"
              style={{ borderColor: colors.accent, color: colors.accent }}
            >
              <ShoppingCart size={20} />
              Agregar al Carrito
            </button>
            
            <button
              onClick={() => handleAction(true)}
              className="flex items-center justify-center gap-2 py-4 rounded-xl font-bold text-white transition-all shadow-lg"
              style={{ backgroundColor: colors.accent }}
            >
              <CreditCard size={20} />
              Comprar Ahora
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};