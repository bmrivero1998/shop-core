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
const colors = {
  primary: '#ececec',
  accent: '#e40606',
  background: '#ffffff',
  text: '#000000',
};

const ui = {
  borderRadius: '12px',
  fontFamily: "'Inter', sans-serif",
};

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
    <div className="fixed inset-0 z-[200] flex items-end md:items-center justify-center sm:p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-200">
      <style>{`
        @keyframes slideUp {
          from { transform: translateY(24px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        .modal-enter { animation: slideUp 0.32s cubic-bezier(0.22,1,0.36,1) forwards; }
        .dot-indicator { transition: all 0.25s ease; }
      `}</style>
      <div
        className="modal-enter bg-white w-full h-[92vh] md:h-auto md:max-h-[88vh] md:rounded-[2rem] rounded-t-[2.5rem] md:max-w-5xl shadow-[0_32px_80px_rgba(0,0,0,0.25)] flex flex-col md:flex-row relative overflow-hidden"
        style={{ borderRadius: ui.borderRadius }}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 bg-black/8 hover:bg-black/15 text-black p-2 rounded-full transition-all duration-200 backdrop-blur-sm border border-black/5"
        >
          <X size={18} strokeWidth={2.5} />
        </button>

        {/* IMAGEN */}
        <div className="w-full h-[38vh] md:w-1/2 md:h-auto bg-gradient-to-br from-gray-50 via-gray-100 to-gray-50 flex items-center justify-center p-6 relative shrink-0 overflow-hidden">
          {/* Decorative background circles */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-[-20%] left-[-10%] w-64 h-64 rounded-full bg-white/60 blur-3xl" />
            <div className="absolute bottom-[-10%] right-[-10%] w-48 h-48 rounded-full bg-white/40 blur-2xl" />
          </div>

          <div className="relative w-full h-full max-h-[420px] flex items-center justify-center">
            <img
              src={mainImage}
              alt={product.name}
              className="max-w-full max-h-full object-contain drop-shadow-2xl mix-blend-multiply transition-all duration-500"
              style={{ filter: 'drop-shadow(0 20px 40px rgba(0,0,0,0.18))' }}
            />

            {images.length > 1 && (
              <>
                <button
                  onClick={() =>
                    setCurrentImageIndex((i) =>
                      i === 0 ? images.length - 1 : i - 1
                    )
                  }
                  className="absolute left-2 bg-white/95 hover:bg-white p-2.5 rounded-full shadow-lg hover:scale-110 transition-all duration-200 border border-black/5"
                >
                  <ChevronLeft size={18} strokeWidth={2.5} />
                </button>

                <button
                  onClick={() =>
                    setCurrentImageIndex((i) =>
                      i === images.length - 1 ? 0 : i + 1
                    )
                  }
                  className="absolute right-2 bg-white/95 hover:bg-white p-2.5 rounded-full shadow-lg hover:scale-110 transition-all duration-200 border border-black/5"
                >
                  <ChevronRight size={18} strokeWidth={2.5} />
                </button>

                {/* Dot indicators */}
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                  {images.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentImageIndex(idx)}
                      className={`dot-indicator rounded-full ${
                        idx === currentImageIndex
                          ? 'w-5 h-1.5 bg-black'
                          : 'w-1.5 h-1.5 bg-black/20 hover:bg-black/40'
                      }`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        {/* INFO */}
        <div className="w-full h-full md:w-1/2 flex flex-col bg-white overflow-hidden">
          <div className="flex-1 overflow-y-auto p-6 md:p-10">

            {/* Category badge */}
            <span
              className="inline-flex items-center text-[10px] font-black uppercase tracking-[0.18em] px-2.5 py-1 rounded-lg mb-3"
              style={{ backgroundColor: `${colors.accent}15`, color: colors.accent }}
            >
              {category?.name || 'General'}
            </span>

            <h2
              className="text-3xl font-black uppercase italic tracking-tighter mb-4 mt-1 leading-none text-black"
              style={{ fontFamily: ui.fontFamily }}
            >
              {product.name}
            </h2>

            {/* Price block */}
            <div className="flex items-baseline gap-2 mb-6 pb-6 border-b border-gray-100">
              <span
                className="text-4xl font-black tabular-nums"
                style={{ color: colors.accent }}
              >
                ${(finalPrice / 100).toFixed(2)}
              </span>
              <span className="text-[11px] font-extrabold text-gray-400 uppercase tracking-wider">
                {product.currency}
              </span>
            </div>

            {/* VARIANTES */}
            {hasVariants && (
              <div className="space-y-3 mb-6">
                <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest">
                  Variante
                </p>
                <div className="flex flex-wrap gap-2">
                  {availableVariants.map((variant) => (
                    <button
                      key={variant.uuid}
                      onClick={() => setSelectedVariant(variant)}
                      className="relative px-4 py-2 text-xs font-bold rounded-xl transition-all duration-200 overflow-hidden"
                      style={
                        selectedVariant?.uuid === variant.uuid
                          ? { backgroundColor: colors.accent, color: '#fff', border: `2px solid ${colors.accent}` }
                          : { backgroundColor: 'white', color: '#555', border: '2px solid #e5e7eb' }
                      }
                    >
                      {variant.variant_name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Fashion notice */}
            {isFashion && (
              <div className="bg-amber-50 border border-amber-200 p-4 rounded-2xl mb-6 flex gap-3">
                <div className="w-8 h-8 rounded-xl bg-amber-100 flex items-center justify-center shrink-0">
                  <Info className="text-amber-500 w-4 h-4" />
                </div>
                <p className="text-xs text-amber-800 font-semibold leading-relaxed">
                  Confirmaremos tu talla exacta por WhatsApp al finalizar el pedido.
                </p>
              </div>
            )}

            {product.description && (
              <p className="text-sm text-gray-500 leading-relaxed">
                {product.description}
              </p>
            )}
          </div>

          {/* CONTROLES */}
          <div className="p-6 border-t border-gray-50 bg-white z-10 space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs uppercase text-gray-400 tracking-widest">
                Cantidad
              </span>

              <div className="flex items-center bg-gray-50 border border-gray-100 rounded-2xl p-1 gap-1">
                <button
                  onClick={() => setQty(Math.max(1, qty - 1))}
                  className="w-9 h-9 flex items-center justify-center hover:bg-white rounded-xl transition-all duration-200 text-gray-600 hover:text-black hover:shadow-sm"
                >
                  <Minus size={13} strokeWidth={2.5} />
                </button>
                <span className="w-10 text-center font-black text-sm tabular-nums">{qty}</span>
                <button
                  onClick={() => setQty(qty + 1)}
                  className="w-9 h-9 flex items-center justify-center hover:bg-white rounded-xl transition-all duration-200 text-gray-600 hover:text-black hover:shadow-sm"
                >
                  <Plus size={13} strokeWidth={2.5} />
                </button>
              </div>
            </div>

            <button
              disabled={currencyMismatch || !isAllSelected}
              onClick={handleAddToCart}
              className="w-full py-4 rounded-2xl font-black text-sm uppercase tracking-widest transition-all duration-200 flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-[0.97]"
              style={{
                backgroundColor:
                  currencyMismatch || !isAllSelected
                    ? '#f3f4f6'
                    : colors.accent,
                color:
                  currencyMismatch || !isAllSelected
                    ? '#9ca3af'
                    : '#fff',
                boxShadow:
                  currencyMismatch || !isAllSelected
                    ? 'none'
                    : `0 8px 32px ${colors.accent}50`,
                cursor:
                  currencyMismatch || !isAllSelected
                    ? 'not-allowed'
                    : 'pointer',
              }}
            >
              <ShoppingBag size={17} strokeWidth={2.5} />
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
  const category = ALL_CATEGORIES.find(c => c.id === product.category_id);

  return (
    <div 
      onClick={() => onOpen(product)} 
      className="group bg-white overflow-hidden cursor-pointer flex flex-col h-full relative"
      style={{
        borderRadius: ui.borderRadius,
        boxShadow: '0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)',
        transition: 'box-shadow 0.3s ease, transform 0.3s ease',
      }}
      onMouseEnter={e => {
        (e.currentTarget as HTMLDivElement).style.boxShadow = '0 20px 60px rgba(0,0,0,0.10), 0 4px 16px rgba(0,0,0,0.06)';
        (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-2px)';
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLDivElement).style.boxShadow = '0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)';
        (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)';
      }}
    >
      {/* Image area */}
      <div className="relative aspect-[4/5] overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
        
        {/* Category badge */}
        <span
          className="absolute top-3 left-3 z-10 text-[9px] font-black uppercase tracking-[0.15em] px-2 py-1 rounded-lg shadow-sm"
          style={{ backgroundColor: 'rgba(255,255,255,0.92)', color: '#555', backdropFilter: 'blur(8px)' }}
        >
          {category?.name || 'General'}
        </span>

        <img
          src={mainImg}
          alt={product.name}
          className="w-full h-full object-cover transform group-hover:scale-108 transition-transform duration-700"
          style={{ transition: 'transform 0.7s cubic-bezier(0.25,0.46,0.45,0.94)' }}
        />

        {/* Gradient overlay on hover */}
        <div
          className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100"
          style={{ transition: 'opacity 0.35s ease' }}
        />

        {/* Quick view button — desktop */}
        <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out hidden md:block">
          <button
            className="w-full bg-white text-black py-3 rounded-xl font-black text-[11px] uppercase tracking-widest shadow-xl hover:bg-black hover:text-white transition-all duration-200"
          >
            Ver Detalles
          </button>
        </div>
      </div>

      {/* Product info */}
      <div className="p-4 flex flex-col flex-grow">
        <h3
          className="font-bold text-sm uppercase tracking-tight leading-snug line-clamp-2 mb-3 text-gray-900 group-hover:text-gray-600 transition-colors duration-200"
        >
          {product.name}
        </h3>
        <div className="mt-auto flex items-center justify-between pt-3 border-t border-gray-50">
          <span
            className="font-black text-lg tabular-nums"
            style={{ color: colors.accent }}
          >
            ${(product.price / 100).toFixed(2)}
          </span>
          <span
            className="text-[10px] font-extrabold px-2 py-1 rounded-lg uppercase tracking-wide"
            style={{ backgroundColor: `${colors.accent}12`, color: colors.accent }}
          >
            {product.currency}
          </span>
        </div>
      </div>
    </div>
  );
};

// --- SKELETON CARD ---
const SkeletonCard = () => (
  <div className="bg-white overflow-hidden flex flex-col h-full" style={{ borderRadius: '1.25rem' }}>
    <div className="aspect-[4/5] bg-gradient-to-br from-gray-100 to-gray-200 animate-pulse relative overflow-hidden">
      <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.8s_infinite]"
        style={{
          background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.6) 50%, transparent 100%)',
          animation: 'shimmer 1.8s infinite',
        }}
      />
    </div>
    <div className="p-4 flex flex-col gap-3 flex-grow">
      <div className="h-3 bg-gray-100 rounded-full animate-pulse w-3/4" />
      <div className="h-3 bg-gray-100 rounded-full animate-pulse w-1/2" />
      <div className="mt-auto flex justify-between items-center pt-3 border-t border-gray-50">
        <div className="h-5 bg-gray-100 rounded-full animate-pulse w-16" />
        <div className="h-5 bg-gray-100 rounded-full animate-pulse w-10" />
      </div>
    </div>
  </div>
);

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
    <div className="min-h-screen bg-[#F7F7F8] font-sans pb-24 relative">
      <style>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }
        .cart-btn-pulse { animation: cartPulse 0.4s cubic-bezier(0.36,0.07,0.19,0.97); }
        @keyframes cartPulse {
          0%,100% { transform: scale(1); }
          50% { transform: scale(1.18); }
        }
        .search-input::placeholder { color: #bbb; }
      `}</style>

      {/* 1. TOP HEADER */}
      <nav
        className="bg-white/85 backdrop-blur-xl border-b sticky top-0 z-40 px-4 md:px-8 h-16 flex items-center justify-between"
        style={{ borderColor: 'rgba(0,0,0,0.07)' }}
      >
        <div className="flex items-center gap-3">
          {/* Decorative accent dot */}
          <span
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: colors.accent }}
          />
          <h1
            className="font-black text-xl tracking-tighter italic uppercase text-black"
            style={{ fontFamily: ui.fontFamily }}
          >
            {STORE_CONFIG.storeName}
          </h1>
        </div>

        {/* Product count badge */}
        {!loading && (
          <span className="text-[11px] font-bold text-gray-400 tabular-nums hidden md:block">
            {filtered.length} producto{filtered.length !== 1 ? 's' : ''}
          </span>
        )}
      </nav>

      {/* 2. BARRA DE HERRAMIENTAS STICKY */}
      <div
        className="bg-white/95 backdrop-blur-md border-b sticky top-16 z-[30] px-4 py-3"
        style={{ borderColor: 'rgba(0,0,0,0.06)', boxShadow: '0 4px 20px rgba(0,0,0,0.04)' }}
      >
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-3 items-center justify-between">

          {/* Input Búsqueda */}
          <div className="relative w-full md:max-w-md group">
            <Search
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-black transition-colors duration-200"
              size={15}
              strokeWidth={2.5}
            />
            <input
              type="text"
              placeholder="Buscar producto..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="search-input w-full bg-gray-50 hover:bg-gray-100/80 focus:bg-white border border-gray-100 focus:border-gray-300 rounded-xl pl-10 pr-4 py-2.5 text-sm font-medium transition-all duration-200 outline-none"
              style={{ boxShadow: 'none' }}
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black transition-colors"
              >
                <X size={14} strokeWidth={2.5} />
              </button>
            )}
          </div>

          {/* Selector de Categorías */}
          <div className="relative w-full md:w-64 shrink-0">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
              <Filter size={14} strokeWidth={2} />
            </div>
            <select
              value={selectedCat}
              onChange={(e) => setSelectedCat(e.target.value)}
              className="w-full appearance-none bg-white border border-gray-200 hover:border-gray-300 focus:border-gray-400 rounded-xl pl-9 pr-10 py-2.5 text-xs font-bold uppercase tracking-wide cursor-pointer outline-none text-black transition-all duration-200"
              style={{ boxShadow: '0 1px 2px rgba(0,0,0,0.04)' }}
            >
              <option value="all">Todas las Categorías</option>
              {ALL_CATEGORIES.map((c: Category) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
              <ChevronDown size={14} strokeWidth={2.5} />
            </div>
          </div>

        </div>
      </div>

      {/* 3. GRID DE PRODUCTOS */}
      <main className="max-w-7xl mx-auto px-4 md:px-6 py-8">
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {[1,2,3,4,5,6,7,8].map(i => <SkeletonCard key={i} />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24">
            <div
              className="w-20 h-20 rounded-3xl flex items-center justify-center mb-6"
              style={{ backgroundColor: `${colors.accent}10` }}
            >
              <ShoppingBag style={{ color: colors.accent }} size={36} strokeWidth={1.5} />
            </div>
            <h3 className="text-lg font-black uppercase tracking-widest text-gray-800 mb-2">Sin resultados</h3>
            <p className="text-sm text-gray-400 mb-6">Intenta ajustar tu búsqueda o categoría.</p>
            <button
              onClick={() => { setSearch(''); setSelectedCat('all'); }}
              className="text-xs font-black uppercase tracking-widest px-5 py-2.5 rounded-xl text-white transition-all hover:scale-105 active:scale-95"
              style={{ backgroundColor: colors.accent, boxShadow: `0 4px 16px ${colors.accent}40` }}
            >
              Limpiar filtros
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {filtered.map(p => (
              <ProductCard key={p.uuid} product={p} onOpen={handleOpen} />
            ))}
          </div>
        )}
      </main>

      {/* 4. BOTÓN FLOTANTE DEL CARRITO */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-8 right-8 z-[30] text-white w-16 h-16 flex items-center justify-center border-[3px] border-white group"
        style={{
          backgroundColor: colors.accent,
          borderRadius: '20px',
          boxShadow: `0 8px 32px ${colors.accent}55, 0 2px 8px rgba(0,0,0,0.15)`,
          transition: 'transform 0.2s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.2s ease',
        }}
        onMouseEnter={e => {
          (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1.1)';
        }}
        onMouseLeave={e => {
          (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1)';
        }}
        onMouseDown={e => {
          (e.currentTarget as HTMLButtonElement).style.transform = 'scale(0.94)';
        }}
        onMouseUp={e => {
          (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1.1)';
        }}
      >
        <ShoppingCart size={24} strokeWidth={2} />
        {totalItems > 0 && (
          <span
            className="absolute -top-2.5 -right-2.5 text-white text-[10px] font-black w-6 h-6 flex items-center justify-center rounded-full border-2 border-white tabular-nums"
            style={{ backgroundColor: '#111', boxShadow: '0 2px 8px rgba(0,0,0,0.3)' }}
          >
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