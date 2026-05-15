import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useCart } from './CartContext';
import { STORE_CONFIG } from './config';
import { 
  ShoppingCart, 
  Minus, 
  Plus, 
  CreditCard,
  Loader2,
  AlertCircle,
  ChevronLeft,
  Share2
} from 'lucide-react';

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
        // Usamos el nuevo endpoint de resolución inteligente
        const { data: response } = await axios.get(
          `${STORE_CONFIG.API_URL}/products/resolve/${uuid}/${STORE_CONFIG.PROJECT_UUID}`
        );
        
        const fetchedProduct = response.data;
        setProduct(fetchedProduct);

        // Lógica de pre-selección: si el uuid de la URL es una variante, la marcamos
        if (fetchedProduct.uuid !== uuid && fetchedProduct.variants) {
          const match = fetchedProduct.variants.find((v: any) => v.uuid === uuid);
          if (match) setSelectedVariant(match);
        } else if (fetchedProduct.variants?.length > 0) {
          setSelectedVariant(fetchedProduct.variants[0]);
        }

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
    <div className="min-h-screen flex items-center justify-center bg-white">
      <Loader2 className="animate-spin" size={40} style={{ color: colors.accent }} />
    </div>
  );

  if (error || !product) return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center bg-white">
      <AlertCircle size={64} className="mb-4 text-red-500 opacity-20" />
      <h2 className="text-2xl font-bold text-gray-900">Producto no disponible</h2>
      <p className="text-gray-500 mt-2">Parece que el enlace ha expirado o el producto ya no existe.</p>
      <button 
        onClick={() => navigate('/')} 
        className="mt-8 px-8 py-3 rounded-full font-bold text-white transition-transform active:scale-95"
        style={{ backgroundColor: colors.accent }}
      >
        Volver a la tienda
      </button>
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
      setIsOpen(true);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header móvil minimalista */}
      <div className="md:hidden sticky top-0 z-50 bg-white/80 backdrop-blur-md flex justify-between items-center px-4 py-3">
        <button onClick={() => navigate(-1)} className="p-2 bg-gray-100 rounded-full">
          <ChevronLeft size={20} />
        </button>
        <button className="p-2 bg-gray-100 rounded-full">
          <Share2 size={20} />
        </button>
      </div>

      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:gap-12 md:p-8">
        
        {/* Lado Izquierdo: Galería (Full width en móvil, fixed ratio en desktop) */}
        <div className="w-full md:w-1/2 lg:w-3/5">
          <div className="relative aspect-square md:rounded-3xl overflow-hidden bg-gray-50">
            <img 
              src={images[currentImage] || "https://via.placeholder.com/800"} 
              className="w-full h-full object-contain mix-blend-multiply"
              alt={product.name}
            />
            
            {images.length > 1 && (
              <div className="absolute bottom-6 inset-x-0 flex justify-center gap-2">
                {images.map((_: any, i: number) => (
                  <button 
                    key={i} 
                    onClick={() => setCurrentImage(i)}
                    className={`h-1.5 transition-all rounded-full ${
                      i === currentImage ? 'w-8 bg-black' : 'w-2 bg-black/20'
                    }`}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Lado Derecho: Detalles */}
        <div className="flex-1 px-5 py-8 md:py-0 space-y-8">
          <div className="space-y-2">
            <h1 className="text-3xl md:text-4xl font-black tracking-tight" style={{ color: colors.text }}>
              {product.name}
            </h1>
            <div className="flex items-center gap-4">
              <span className="text-3xl font-black" style={{ color: colors.accent }}>
                ${(finalPrice / 100).toFixed(2)}
              </span>
              <span className="text-sm font-bold text-gray-400 bg-gray-100 px-2 py-1 rounded">
                {product.currency?.toUpperCase() || 'MXN'}
              </span>
            </div>
          </div>

          <p className="text-gray-500 leading-relaxed text-lg">
            {product.description}
          </p>

          {/* Selector de Variantes */}
          {product.variants?.length > 0 && (
            <div className="space-y-4">
              <label className="text-sm font-black uppercase tracking-widest text-gray-400">
                Opciones disponibles
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {product.variants.map((v: any) => (
                  <button
                    key={v.uuid}
                    onClick={() => setSelectedVariant(v)}
                    className={`py-3 px-4 rounded-2xl border-2 text-sm font-bold transition-all ${
                      selectedVariant?.uuid === v.uuid 
                        ? 'border-black bg-black text-white shadow-lg' 
                        : 'border-gray-100 bg-white text-gray-600 hover:border-gray-300'
                    }`}
                  >
                    {v.variant_name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Cantidad */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
            <span className="font-bold text-gray-900">Cantidad</span>
            <div className="flex items-center bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
              <button onClick={() => setQty(q => Math.max(1, q-1))} className="p-3 hover:bg-gray-50 text-gray-400"><Minus size={18}/></button>
              <span className="w-10 text-center font-black">{qty}</span>
              <button onClick={() => setQty(q => q+1)} className="p-3 hover:bg-gray-50 text-gray-400"><Plus size={18}/></button>
            </div>
          </div>

          {/* Acciones Desktop (Ocultas en móvil) */}
          <div className="hidden md:grid grid-cols-2 gap-4 pt-4">
            <button
              onClick={() => handleAction(false)}
              className="flex items-center justify-center gap-3 py-5 rounded-2xl font-black border-2 transition-all hover:bg-gray-50 active:scale-95"
              style={{ borderColor: colors.accent, color: colors.accent }}
            >
              <ShoppingCart size={22} />
              Añadir
            </button>
            <button
              onClick={() => handleAction(true)}
              className="flex items-center justify-center gap-3 py-5 rounded-2xl font-black text-white transition-all shadow-xl hover:opacity-90 active:scale-95"
              style={{ backgroundColor: colors.accent }}
            >
              <CreditCard size={22} />
              Comprar ahora
            </button>
          </div>
        </div>
      </div>

      {/* Acciones Móviles: Barra fija inferior */}
      <div className="md:hidden fixed bottom-0 inset-x-0 bg-white border-t border-gray-100 p-4 pb-8 z-50 flex gap-3">
        <button
          onClick={() => handleAction(false)}
          className="flex-1 flex items-center justify-center py-4 rounded-2xl font-black border-2 active:scale-95 transition-transform"
          style={{ borderColor: colors.accent, color: colors.accent }}
        >
          <ShoppingCart size={20} />
        </button>
        <button
          onClick={() => handleAction(true)}
          className="flex-[3] flex items-center justify-center gap-3 py-4 rounded-2xl font-black text-white shadow-lg active:scale-95 transition-transform"
          style={{ backgroundColor: colors.accent }}
        >
          <CreditCard size={20} />
          Comprar ahora
        </button>
      </div>

      {/* Espaciador para no tapar contenido por la barra fija */}
      <div className="h-28 md:hidden"></div>
    </div>
  );
};