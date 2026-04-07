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
import { createPortal } from 'react-dom';

// --- CONSTANTES DE TEMA ---
const colors = STORE_CONFIG.theme.colors;
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
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [isOpen, product]);

  if (!isOpen || !product) return null;

  const images = product.images
    ? product.images.split(",").filter(Boolean)
    : [];

  const mainImage =
    images[currentImageIndex] ||
    "https://via.placeholder.com/600x600?text=Sin+Imagen";

  const category = ALL_CATEGORIES.find(
    (c) => c.id === product.category_id
  );

  const isFashion = category?.group === "Moda y Accesorios";

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
    selectedVariant && selectedVariant.price_override > 0
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

  return createPortal(
    <div
      onClick={onClose}
      className="fixed inset-0 z-[9999] flex items-end md:items-center justify-center bg-black/70"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full md:max-w-5xl bg-white flex flex-col md:flex-row overflow-hidden"
        style={{
          borderRadius: ui.borderRadius,
          maxHeight: "90vh"
        }}
      >
        {/* CLOSE */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-full"
          style={{ backgroundColor: colors.primary }}
        >
          <X size={18} />
        </button>

        {/* IMAGE */}
        <div className="w-full md:w-1/2 bg-gray-50 flex items-center justify-center p-6 relative">
          <img
            src={mainImage}
            alt={product.name}
            className="max-w-full max-h-[400px] object-contain"
          />

          {images.length > 1 && (
            <>
              <button
                onClick={() =>
                  setCurrentImageIndex((i) =>
                    i === 0 ? images.length - 1 : i - 1
                  )
                }
                className="absolute left-2 p-2 bg-white rounded-full"
              >
                <ChevronLeft size={16} />
              </button>

              <button
                onClick={() =>
                  setCurrentImageIndex((i) =>
                    i === images.length - 1 ? 0 : i + 1
                  )
                }
                className="absolute right-2 p-2 bg-white rounded-full"
              >
                <ChevronRight size={16} />
              </button>
            </>
          )}
        </div>

        {/* INFO */}
        <div className="w-full md:w-1/2 flex flex-col p-6 gap-4">

          {/* HEADER */}
          <div>
            <span className="text-xs uppercase text-black tracking-[0.15em] font-black">
              {category?.name || "Producto"}
            </span>

            <h2
              className="text-2xl font-bold mt-1 text-black"
              style={{ fontFamily: ui.fontFamily }}
            >
              {product.name}
            </h2>

            <div
              className="text-xl font-bold mt-2"
              style={{ color: colors.accent }}
            >
              ${(finalPrice / 100).toFixed(2)} {product.currency}
            </div>
          </div>

          {/* VARIANTS */}
          {hasVariants && (
            <div>
              <p className="text-xs text-black mb-1">
                Selecciona
              </p>
              <div className="flex flex-wrap gap-2">
                {availableVariants.map((variant) => (
                  <button
                    key={variant.uuid}
                    onClick={() => setSelectedVariant(variant)}
                    className="px-3 py-1 text-xs rounded"
                    style={{
                      backgroundColor:
                        selectedVariant?.uuid === variant.uuid
                          ? colors.text
                          : colors.primary,
                      color:
                        selectedVariant?.uuid === variant.uuid
                          ? "#fff"
                          : "#000"
                    }}
                  >
                    {variant.variant_name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* DESCRIPTION */}
          <div>
            <p className="text-xs text-black uppercase mb-1">
              Descripción
            </p>

            <div className="text-sm text-black max-h-28 overflow-y-auto">
              {product.description || "Sin descripción"}
            </div>
          </div>

          {isFashion && (
            <div
              className="text-xs p-2 rounded"
              style={{ backgroundColor: colors.primary, color: colors.text }}
            >
              Talla confirmada vía WhatsApp post-compra
            </div>
          )}

          {/* FOOTER */}
          <div className="mt-auto flex flex-col gap-3">

            {/* QTY (FIXED 🔥) */}
            <div className="flex justify-between items-center">
              <span className="text-xs text-black">
                Cantidad
              </span>

              <div className="flex items-center bg-gray-50 border border-gray-100 rounded-2xl p-1 gap-1">
                <button
                  onClick={() => setQty((prev) => Math.max(1, prev - 1))}
                  disabled={qty === 1}
                  className="w-9 h-9 flex items-center justify-center rounded-xl text-gray-600 disabled:opacity-30"
                >
                  <Minus size={13} strokeWidth={2.5} />
                </button>

                <span className="w-10 text-center font-black text-black text-sm tabular-nums">
                  {qty}
                </span>

                <button
                  onClick={() => setQty((prev) => prev + 1)}
                  className="w-9 h-9 flex items-center justify-center rounded-xl text-gray-600"
                >
                  <Plus size={13} strokeWidth={2.5} />
                </button>
              </div>
            </div>

            {/* BUTTON */}
            <button
              disabled={currencyMismatch || !isAllSelected}
              onClick={handleAddToCart}
              className="w-full py-3 text-sm font-bold rounded"
              style={{
                backgroundColor: colors.accent,
                color: "#fff",
                opacity: currencyMismatch || !isAllSelected ? 0.5 : 1
              }}
            >
              {hasVariants && !selectedVariant
                ? "Elige variante"
                : "Agregar al carrito"}
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};


// --- TARJETA DE PRODUCTO ---
// --- TARJETA DE PRODUCTO ---
const ProductCard = ({ product, onOpen }: { product: Product, onOpen: (p: Product) => void }) => {
  const mainImg = product.images?.split(',')[0] || 'https://via.placeholder.com/400';
  const category = ALL_CATEGORIES.find(c => c.id === product.category_id);

  return (
    <div 
      onClick={() => onOpen(product)} 
      className="group overflow-hidden cursor-pointer flex flex-col h-full relative"
      style={{
        backgroundColor: colors.background,
        borderRadius: ui.borderRadius,
        boxShadow: `0 1px 3px ${colors.text}10, 0 1px 2px ${colors.text}08`,
        transition: 'box-shadow 0.3s ease, transform 0.3s ease',
      }}
      onMouseEnter={e => {
        (e.currentTarget as HTMLDivElement).style.boxShadow = `0 20px 60px ${colors.text}1A, 0 4px 16px ${colors.text}0F`;
        (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-2px)';
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLDivElement).style.boxShadow = `0 1px 3px ${colors.text}10, 0 1px 2px ${colors.text}08`;
        (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)';
      }}
    >
      {/* Image area */}
      <div 
        className="relative aspect-[4/5] overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${colors.background} 0%, ${colors.text}08 100%)`
        }}
      >
        
        {/* Category badge */}
        <span
          className="absolute top-3 left-3 z-10 text-[9px] font-black uppercase tracking-[0.15em] px-2 py-1 rounded-lg shadow-sm"
          style={{ 
            backgroundColor: `${colors.background}EB`, 
            color: colors.text, 
            backdropFilter: 'blur(8px)' 
          }}
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
            className="w-full py-3 rounded-xl font-black text-[11px] uppercase tracking-widest shadow-xl transition-all duration-200"
            style={{
              backgroundColor: colors.background,
              color: colors.text,
            }}
            onMouseEnter={(e) => {
              (e.target as HTMLButtonElement).style.backgroundColor = colors.text;
              (e.target as HTMLButtonElement).style.color = colors.background;
            }}
            onMouseLeave={(e) => {
              (e.target as HTMLButtonElement).style.backgroundColor = colors.background;
              (e.target as HTMLButtonElement).style.color = colors.text;
            }}
          >
            Ver Detalles
          </button>
        </div>
      </div>

      {/* Product info */}
      <div className="p-4 flex flex-col flex-grow">
        <h3
          className="font-bold text-sm uppercase tracking-tight leading-snug line-clamp-2 mb-3 transition-colors duration-200"
          style={{
            color: colors.text,
          }}
          onMouseEnter={(e) => {
            (e.target as HTMLElement).style.color = `${colors.text}99`;
          }}
          onMouseLeave={(e) => {
            (e.target as HTMLElement).style.color = colors.text;
          }}
        >
          {product.name}
        </h3>
        <div 
          className="mt-auto flex items-center justify-between pt-3 border-t"
          style={{
            borderColor: `${colors.text}0D`
          }}
        >
          <span
            className="font-black text-lg tabular-nums"
            style={{ color: colors.accent }}
          >
            ${(product.price / 100).toFixed(2)}
          </span>
          <span
            className="text-[10px] font-extrabold px-2 py-1 rounded-lg uppercase tracking-wide"
            style={{ 
              backgroundColor: `${colors.accent}12`, 
              color: colors.accent 
            }}
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