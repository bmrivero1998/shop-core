import React, { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import { useCart } from './CartContext';
import { CartModal } from './CartModal';
import { STORE_CONFIG } from './config';
import { 
  Search, 
  ShoppingCart, 
  X, 
  ChevronLeft, 
  ChevronRight, 
  Minus, 
  Plus,
  ShoppingBag,
  Info,
  Filter,
  ChevronDown,
  Loader2
} from 'lucide-react';
import { ALL_CATEGORIES, type Category } from './data/category';

// --- CONSTANTES DE TEMA ---
const { colors, ui } = STORE_CONFIG.theme;

// --- TIPOS ---
export interface Variants {
    uuid:           string;
    product_uuid:   string;
    variant_name:   string;
    price_override: number;
    is_available:   boolean;
    created_at:     Date;
    updated_at:     Date;
    is_deleted:     number;
}

type Product = {
  uuid: string;
  name: string;
  sku?: string;
  price: number;
  currency: string;
  images?: string;
  is_active: boolean;
  category_id?: string;
  description?: string;
  variants?: Variants[];
};

// --- MODAL DE DETALLE ---
// --- MODAL DE DETALLE ---
const ProductModal = ({
  product,
  isOpen,
  onClose
}: {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}) => {
  const { addToCart, cart, cartCurrency } = useCart();

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [qty, setQty] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState<Variants | null>(null);

  useEffect(() => {
    if (isOpen) {
      setQty(1);
      setCurrentImageIndex(0);
      setSelectedVariant(null);
    }
  }, [isOpen, product]);

  if (!isOpen || !product) return null;

  const images = product.images
    ? product.images.split(',').filter(Boolean)
    : [];

  const mainImage =
    images[currentImageIndex] ||
    'https://via.placeholder.com/600x600?text=Sin+Imagen';

  const category = ALL_CATEGORIES.find(
    (c) => c.id === product.category_id
  );

  const isFashion = category?.group === 'Moda y Accesorios';

  // 🔥 Variantes reales del backend
  const availableVariants: Variants[] =
    product.variants?.filter(
      (v) => v.is_available && !v.is_deleted
    ) || [];

  const hasVariants = availableVariants.length > 0;

  const isAllSelected =
    !hasVariants || selectedVariant !== null;

  const currencyMismatch =
    cart.length > 0 &&
    cartCurrency.toLowerCase() !==
      product.currency.toLowerCase();

  // 🔥 Precio dinámico con override
  const finalPrice =
    selectedVariant &&
    selectedVariant.price_override > 0
      ? selectedVariant.price_override
      : product.price;

  const handleAddToCart = () => {
    addToCart({
      ...product,
      quantity: qty,
      selectedVariant: selectedVariant || undefined,
      price: finalPrice
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-end md:items-center justify-center sm:p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="bg-white w-full h-[90vh] md:h-auto md:max-h-[85vh] md:rounded-[2rem] rounded-t-[2rem] md:max-w-5xl shadow-2xl flex flex-col md:flex-row relative overflow-hidden"
        style={{ borderRadius: ui.borderRadius }}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 bg-white/80 hover:bg-white text-black p-2 rounded-full transition-all shadow-sm backdrop-blur-sm"
        >
          <X size={20} />
        </button>

        {/* IMAGEN */}
        <div className="w-full h-[35vh] md:w-1/2 md:h-auto bg-gray-50 flex items-center justify-center p-6 relative shrink-0">
          <div className="relative w-full h-full max-h-[400px] flex items-center justify-center">
            <img
              src={mainImage}
              alt={product.name}
              className="max-w-full max-h-full object-contain drop-shadow-xl mix-blend-multiply"
            />

            {images.length > 1 && (
              <>
                <button
                  onClick={() =>
                    setCurrentImageIndex((i) =>
                      i === 0 ? images.length - 1 : i - 1
                    )
                  }
                  className="absolute left-0 bg-white/90 p-2 rounded-full shadow-lg hover:scale-110 transition"
                >
                  <ChevronLeft size={20} />
                </button>

                <button
                  onClick={() =>
                    setCurrentImageIndex((i) =>
                      i === images.length - 1 ? 0 : i + 1
                    )
                  }
                  className="absolute right-0 bg-white/90 p-2 rounded-full shadow-lg hover:scale-110 transition"
                >
                  <ChevronRight size={20} />
                </button>
              </>
            )}
          </div>
        </div>

        {/* INFO */}
        <div className="w-full h-full md:w-1/2 flex flex-col bg-white overflow-hidden">
          <div className="flex-1 overflow-y-auto p-6 md:p-10">
            <span className="text-xs font-black text-gray-400 uppercase tracking-[0.2em]">
              {category?.name || 'General'}
            </span>

            <h2
              className="text-3xl font-black uppercase italic tracking-tighter mb-4 mt-2 leading-none"
              style={{ fontFamily: ui.fontFamily }}
            >
              {product.name}
            </h2>

            <div className="flex items-baseline gap-2 mb-6 pb-6 border-b border-gray-100">
              <span
                className="text-4xl font-black"
                style={{ color: colors.accent }}
              >
                ${(finalPrice / 100).toFixed(2)}
              </span>
              <span className="text-xs font-bold text-gray-400 uppercase">
                {product.currency}
              </span>
            </div>

            {/* 🔥 VARIANTES SIMPLES */}
            {hasVariants && (
              <div className="space-y-5 mb-6">
                <p className="text-[10px] font-black uppercase text-gray-400 mb-2 tracking-widest">
                  Variante
                </p>

                <div className="flex flex-wrap gap-2">
                  {availableVariants.map((variant) => (
                    <button
                      key={variant.uuid}
                      onClick={() =>
                        setSelectedVariant(variant)
                      }
                      className={`px-4 py-2 text-xs font-bold border-2 rounded-xl transition ${
                        selectedVariant?.uuid ===
                        variant.uuid
                          ? 'text-white border-black bg-black'
                          : 'bg-white text-gray-600 border-gray-100 hover:border-gray-300'
                      }`}
                    >
                      {variant.variant_name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {isFashion && (
              <div className="bg-amber-50 border-l-4 border-amber-400 p-4 rounded-r-xl mb-6 flex gap-3">
                <Info className="text-amber-500 w-5 h-5 flex-shrink-0" />
                <p className="text-xs text-amber-900 font-bold leading-relaxed">
                  Importante: Confirmaremos tu talla exacta por WhatsApp al finalizar el pedido.
                </p>
              </div>
            )}

            {product.description && (
              <div className="prose prose-sm text-gray-500 text-sm leading-relaxed">
                <p>{product.description}</p>
              </div>
            )}
          </div>

          {/* CONTROLES */}
          <div className="p-6 border-t bg-white z-10 space-y-4 shadow-[0_-5px_20px_rgba(0,0,0,0.05)]">
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs uppercase text-gray-400 tracking-widest">
                Cantidad
              </span>

              <div className="flex items-center bg-gray-100 rounded-xl p-1">
                <button
                  onClick={() =>
                    setQty(Math.max(1, qty - 1))
                  }
                  className="p-2.5 hover:bg-white rounded-lg transition shadow-sm"
                >
                  <Minus size={14} />
                </button>

                <span className="w-10 text-center font-black text-sm">
                  {qty}
                </span>

                <button
                  onClick={() =>
                    setQty(qty + 1)
                  }
                  className="p-2.5 hover:bg-white rounded-lg transition shadow-sm"
                >
                  <Plus size={14} />
                </button>
              </div>
            </div>

            <button
              disabled={
                currencyMismatch || !isAllSelected
              }
              onClick={handleAddToCart}
              className={`w-full py-4 rounded-2xl font-black text-sm uppercase tracking-widest transition flex items-center justify-center gap-3 shadow-xl hover:scale-[1.02] active:scale-[0.98] ${
                currencyMismatch || !isAllSelected
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed shadow-none'
                  : 'text-white'
              }`}
              style={{
                backgroundColor:
                  currencyMismatch || !isAllSelected
                    ? undefined
                    : colors.accent
              }}
            >
              <ShoppingBag size={18} />
              {hasVariants && !selectedVariant
                ? 'Selecciona una variante'
                : STORE_CONFIG.text.addToCart}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};


// --- TARJETA DE PRODUCTO ---
const ProductCard = ({ product, onOpen }: { product: Product, onOpen: (p: Product) => void }) => {
  const mainImg = product.images?.split(',')[0] || 'https://via.placeholder.com/400';
  
  return (
    <div 
        onClick={() => onOpen(product)} 
        className="group bg-white overflow-hidden cursor-pointer border border-transparent hover:border-gray-200 hover:shadow-2xl hover:shadow-black/5 transition-all duration-300 flex flex-col h-full relative"
        style={{ borderRadius: ui.borderRadius }}
    >
      <div className="relative aspect-[4/5] overflow-hidden bg-gray-100">
        <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2 py-1 text-[9px] font-black uppercase tracking-widest z-10 rounded-md shadow-sm">
            {ALL_CATEGORIES.find(c => c.id === product.category_id)?.name || 'General'}
        </span>
        <img src={mainImg} alt={product.name} className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700" />
        
        {/* Quick Add Overlay (Desktop) */}
        <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 hidden md:block">
            <button className="w-full bg-black text-white py-3 rounded-xl font-bold text-xs uppercase tracking-widest shadow-lg">
                Ver Detalles
            </button>
        </div>
      </div>

      <div className="p-4 flex flex-col flex-grow">
        <h3 className="font-bold text-sm uppercase tracking-tight leading-snug line-clamp-2 mb-3 group-hover:text-gray-600 transition-colors">
            {product.name}
        </h3>
        <div className="mt-auto flex items-center justify-between border-t border-gray-50 pt-3">
          <span className="font-black text-lg" style={{ color: colors.accent }}>${(product.price/100).toFixed(2)}</span>
          <span className="text-[10px] font-bold bg-gray-100 px-2 py-1 rounded text-gray-500 uppercase">{product.currency}</span>
        </div>
      </div>
    </div>
  );
};

// --- PÁGINA PRINCIPAL ---
export const StorePage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCat, setSelectedCat] = useState('all');
  const [search, setSearch] = useState('');
  const [selectedProd, setSelectedProd] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { setIsOpen, totalItems } = useCart();

  useEffect(() => {
    setLoading(true);
    axios.get(`${STORE_CONFIG.API_URL}/products/${STORE_CONFIG.PROJECT_UUID}`)
      .then(res => setProducts(Array.isArray(res.data) ? res.data : (res.data.data || [])))
      .catch(err => console.error("Error API", err))
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    return products.filter(p => {
      const matchCat = selectedCat === 'all' || p.category_id === selectedCat;
      const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
      return matchCat && matchSearch && p.is_active;
    });
  }, [products, selectedCat, search]);

  const handleOpen = (p: Product) => {
    setSelectedProd(p);
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] font-sans pb-24 relative"> 
      
      {/* 1. TOP HEADER (Nombre Tienda) */}
      <nav 
        className="bg-white/80 backdrop-blur-xl border-b sticky top-0 px-4 md:px-8 h-16 flex items-center justify-between"
        style={{ borderColor: 'rgba(0,0,0,0.05)' }}
      >
        <h1 className="font-black text-xl tracking-tighter italic uppercase text-black">
          {STORE_CONFIG.storeName}
        </h1>
      </nav>

      {/* 2. BARRA DE HERRAMIENTAS STICKY (Search + Filtros) */}
      <div className="bg-white/95 backdrop-blur-md border-b sticky top-16 z-[30] px-4 py-3 shadow-sm transition-all">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-3 items-center justify-between">
          
          {/* Input Búsqueda */}
          <div className="relative w-full md:max-w-md group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-black transition-colors" size={16} />
            <input 
              type="text" 
              placeholder="Buscar producto..." 
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full bg-gray-100 hover:bg-gray-50 focus:bg-white border-transparent focus:border-black border rounded-xl pl-10 pr-4 py-2.5 text-sm font-medium transition-all outline-none"
            />
          </div>

          {/* Selector de Categorías (Estilo Custom) */}
          <div className="relative w-full md:w-64 shrink-0">
             <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none">
                <Filter size={14} />
             </div>
             <select
                value={selectedCat}
                onChange={(e) => setSelectedCat(e.target.value)}
                className="w-full appearance-none bg-white border border-gray-200 hover:border-gray-300 rounded-xl pl-9 pr-10 py-2.5 text-xs font-bold uppercase tracking-wide cursor-pointer focus:ring-2 focus:ring-black/5 focus:border-black transition-all outline-none text-black shadow-sm"
             >
                <option value="all">Todas las Categorías</option>
                {ALL_CATEGORIES.map((c: Category) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
             </select>
             <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                <ChevronDown size={14} />
             </div>
          </div>

        </div>
      </div>

      {/* 3. GRID DE PRODUCTOS */}
      <main className="max-w-7xl mx-auto px-4 md:px-6 py-8">
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {[1,2,3,4,5,6,7,8].map(i => (
                <div key={i} className="aspect-[4/5] bg-gray-200 rounded-2xl animate-pulse"/>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 opacity-40">
            <ShoppingBag className="text-gray-400 mb-4" size={64} strokeWidth={1} />
            <h3 className="text-lg font-black uppercase tracking-widest text-gray-500">Sin resultados</h3>
            <p className="text-sm text-gray-400 mt-2">Intenta ajustar tu búsqueda o categoría.</p>
            <button onClick={() => { setSearch(''); setSelectedCat('all'); }} className="mt-6 text-xs font-bold underline">Limpiar filtros</button>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8">
            {filtered.map(p => <ProductCard key={p.uuid} product={p} onOpen={handleOpen} />)}
          </div>
        )}
      </main>

      {/* 4. BOTÓN FLOTANTE DEL CARRITO */}
      <button 
        onClick={() => setIsOpen(true)} 
        className="fixed bottom-8 right-8 z-[30] text-white w-16 h-16 rounded-[20px] shadow-2xl shadow-black/20 hover:scale-110 active:scale-95 transition-all flex items-center justify-center border-4 border-white group"
        style={{ backgroundColor: colors.accent }}
      >
        <ShoppingCart size={26} className="group-hover:rotate-12 transition-transform" />
        {totalItems > 0 && (
          <span className="absolute -top-2 -right-2 bg-black text-white text-[10px] font-black w-6 h-6 flex items-center justify-center rounded-full border-2 border-white shadow-sm">
            {totalItems}
          </span>
        )}
      </button>

      {/* MODALES */}
      <ProductModal 
        product={selectedProd} 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
      
      <CartModal />
    </div>
  );
};

export default StorePage;