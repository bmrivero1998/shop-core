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
  Loader2,
  AlertCircle
} from 'lucide-react';
import { ALL_CATEGORIES, type Category } from './data/category';
import { createPortal } from 'react-dom';
import { Link } from 'react-router-dom';

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
  const [isImageZoomed, setIsImageZoomed] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setQty(1);
      setCurrentImageIndex(0);
      setSelectedVariant(null);
      setIsImageZoomed(false);
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

  const isAllSelected = !hasVariants || selectedVariant !== null;

  const currencyMismatch =
    cart.length > 0 &&
    cartCurrency.toLowerCase() !== product.currency.toLowerCase();

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

  const handleImageNavigation = (direction: 'prev' | 'next') => {
    if (direction === 'prev') {
      setCurrentImageIndex((i) => (i === 0 ? images.length - 1 : i - 1));
    } else {
      setCurrentImageIndex((i) => (i === images.length - 1 ? 0 : i + 1));
    }
  };

  return createPortal(
    <div
      onClick={onClose}
      className="fixed inset-0 z-[9999] flex items-end md:items-center justify-center bg-black/70 backdrop-blur-sm animate-[shop-fade-in_0.2s_ease]"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full h-[85vh] md:h-auto md:max-h-[90vh] md:max-w-5xl flex flex-col md:flex-row overflow-hidden relative bg-(--shop-bg) rounded-t-[clamp(16px,4vw,24px)] animate-[shop-slide-up_0.3s_ease] md:animate-[shop-slide-down-in_0.3s_ease]"
      >
        {/* CLOSE Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 md:top-4 md:right-4 z-20 p-2 rounded-full text-white bg-black/20 hover:bg-black/50 md:bg-transparent md:hover:bg-black/50 backdrop-blur-sm md:backdrop-blur-none transition-all duration-200"
        >
          <X size={20} strokeWidth={2.5} />
        </button>

        {/* IMAGE Section */}
        <div className="w-full md:w-1/2 relative flex items-center justify-center bg-black/5">
          <div 
            className="relative w-full h-full flex items-center justify-center"
            onClick={() => setIsImageZoomed(!isImageZoomed)}
          >
            <img
              src={mainImage}
              alt={product.name}
              className={`w-full h-full md:max-h-[400px] object-contain transition-transform duration-300 cursor-zoom-in ${
                isImageZoomed ? 'scale-150' : 'scale-100'
              }`}
            />

            {/* Image Navigation */}
            {images.length > 1 && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleImageNavigation('prev');
                  }}
                  className="absolute left-2 md:left-3 p-2 md:p-2.5 rounded-full bg-black/30 backdrop-blur-sm text-white hover:bg-black/50  transition-all shadow-[0_4px_12px_rgba(0,0,0,0.2)]"
                >
                  <ChevronLeft size={18} strokeWidth={2.5} />
                </button>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleImageNavigation('next');
                  }}
                  className="absolute right-2 md:right-3 p-2 md:p-2.5 rounded-full bg-black/30 backdrop-blur-sm text-white hover:bg-black/50  transition-all shadow-[0_4px_12px_rgba(0,0,0,0.2)]"
                >
                  <ChevronRight size={18} strokeWidth={2.5} />
                </button>

                {/* Image Indicators */}
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                  {images.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={(e) => {
                        e.stopPropagation();
                        setCurrentImageIndex(idx);
                      }}
                      className={`w-1.5 h-1.5 md:w-2 md:h-2 rounded-full transition-all ${
                        idx === currentImageIndex ? 'bg-(--shop-accent) scale-130' : 'bg-white/60 scale-100'
                      }`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        {/* INFO Section - Scrollable en móvil */}
        <div className="w-full md:w-1/2 flex flex-col overflow-y-auto max-h-full">
          <div className="p-4 md:p-6 space-y-3 md:space-y-4">
            
            {/* HEADER */}
            <div>
              <span className="text-[10px] md:text-xs uppercase tracking-[0.15em] font-black text-(--shop-accent)">
                {category?.name || "Producto"}
              </span>

              <h2 className="font-bold mt-1 !font-(family-name:--shop-font) !text-(--shop-text) text-[clamp(1.25rem,5vw,1.5rem)] leading-7 md:leading-8">
                {product.name}
              </h2>

              <div className="text-lg md:text-xl font-bold mt-2 text-(--shop-accent)">
                ${(finalPrice / 100).toFixed(2)} {product.currency}
              </div>
            </div>

            {/* Botón Agregar - ANTES de variantes (mobile-first) */}
            <button
              disabled={currencyMismatch || !isAllSelected}
              onClick={handleAddToCart}
              className="w-full py-3 md:py-3.5 font-bold rounded-xl transition-all duration-200 bg-(--shop-accent) text-white text-[clamp(0.875rem,3.5vw,1rem)] leading-5 md:leading-6 shadow-[0_4px_12px_rgba(0,0,0,0.15)] enabled:hover:scale-[1.02] disabled:opacity-50"
            >
              <span className="flex items-center justify-center gap-2">
                <ShoppingCart size={18} />
                {hasVariants && !selectedVariant
                  ? "Elige variante"
                  : "Agregar al carrito"}
              </span>
            </button>

            {/* VARIANTS */}
            {hasVariants && (
              <div>
                <p className="text-xs md:text-sm mb-2 font-medium text-(--shop-text)">
                  Selecciona una opción
                </p>
                <div className="flex flex-wrap gap-2">
                  {availableVariants.map((variant) => (
                    <button
                      key={variant.uuid}
                      onClick={() => setSelectedVariant(variant)}
                      className={`px-3 md:px-4 py-1.5 md:py-2 text-xs md:text-sm rounded-lg transition-all duration-200 ${
                        selectedVariant?.uuid === variant.uuid
                          ? 'bg-(--shop-accent) text-white border-0'
                          : 'bg-(--shop-text)/6 hover:bg-(--shop-text)/12 text-(--shop-text) border border-(--shop-text)/12'
                      }`}
                    >
                      {variant.variant_name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity Selector */}
            <div className="flex justify-between items-center py-2 border-t border-b border-(--shop-text)/6">
              <span className="text-sm md:text-base font-medium text-(--shop-text)">
                Cantidad
              </span>

              <div className="flex items-center p-0.5 md:p-1 gap-0.5 md:gap-1 rounded-xl bg-(--shop-text)/3 border border-(--shop-text)/6">
                <button
                  onClick={() => setQty((prev) => Math.max(1, prev - 1))}
                  disabled={qty === 1}
                  className="w-8 h-8 md:w-9 md:h-9 flex items-center justify-center rounded-lg disabled:opacity-30 transition-colors text-(--shop-text) enabled:hover:bg-(--shop-text)/6"
                >
                  <Minus size={14} strokeWidth={2.5} />
                </button>

                <span className="w-8 md:w-10 text-center font-black text-sm md:text-base tabular-nums text-(--shop-text)">
                  {qty}
                </span>

                <button
                  onClick={() => setQty((prev) => prev + 1)}
                  className="w-8 h-8 md:w-9 md:h-9 flex items-center justify-center rounded-lg transition-colors text-(--shop-text) hover:bg-(--shop-text)/6"
                >
                  <Plus size={14} strokeWidth={2.5} />
                </button>
              </div>
            </div>

            {/* DESCRIPTION */}
            <div>
              <p className="text-xs md:text-sm uppercase mb-1 md:mb-2 font-bold text-(--shop-text)">
                Descripción
              </p>

              <div className="text-xs md:text-sm max-h-24 md:max-h-28 overflow-y-auto leading-relaxed text-(--shop-text)/80">
                {product.description || "Sin descripción disponible."}
              </div>
            </div>

            {isFashion && (
              <div className="text-[10px] md:text-xs p-2 md:p-3 rounded-lg flex items-start gap-2 bg-(--shop-accent)/8 text-(--shop-text) border border-(--shop-accent)/19">
                <Info size={14} className="flex-shrink-0 mt-0.5 text-(--shop-accent)" />
                <span>La talla se confirmará vía WhatsApp después de tu compra.</span>
              </div>
            )}

            {/* Currency mismatch warning */}
            {currencyMismatch && (
              <div className="text-[10px] md:text-xs p-2 md:p-3 rounded-lg flex items-start gap-2 bg-[#ff444415] text-(--shop-text) border border-[#ff444430]">
                <AlertCircle size={14} className="flex-shrink-0 mt-0.5 text-[#ff4444]" />
                <span>Tu carrito tiene productos en {cartCurrency}. Vacíalo para agregar este.</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};


// --- TARJETA DE PRODUCTO ---
const ProductCard = ({ product, onOpen }: { product: Product, onOpen: (p: Product) => void }) => {
  // ✅ Manejo correcto de imagen (igual que el bueno)
  let imageUrl = "";
  if (product.images) {
    try {
      const parsed = JSON.parse(product.images);
      imageUrl = Array.isArray(parsed) && parsed.length > 0 ? parsed[0] : product.images;
    } catch {
      imageUrl = product.images;
    }
  }

  const category = ALL_CATEGORIES.find(c => c.id === product.category_id);

  return (
    <div
      onClick={() => onOpen(product)}
      className="group cursor-pointer flex flex-col h-full overflow-hidden rounded-2xl transition-all duration-300 bg-(--shop-bg) shadow-[0_4px_12px_color-mix(in_oklab,var(--shop-text)_7%,transparent)]"
    >
      {/* Imagen */}
      <div className="relative aspect-[4/5] overflow-hidden">
        
        {/* Categoría */}
        <span
          className="absolute top-3 left-3 z-10 text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-md bg-(--shop-bg)/90 text-(--shop-text) backdrop-blur-[6px]"
        >
          {category?.name || 'General'}
        </span>

        {imageUrl ? (
          <img
            src={imageUrl}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-xs opacity-50">
            SIN IMAGEN
          </div>
        )}

        {/* Overlay */}
        <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Botón */}
        <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 hidden md:block">
          <button
            onClick={(e) => {
              e.stopPropagation(); // 🔥 importante
              onOpen(product);
            }}
            className="w-full py-2 rounded-lg font-bold text-xs uppercase tracking-widest transition-all bg-(--shop-bg) text-(--shop-text)"
          >
            Ver detalles
          </button>
        </div>
      </div>

      {/* Info */}
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="font-bold text-sm leading-snug line-clamp-2 mb-2 transition-colors !text-(--shop-text)">
          {product.name}
        </h3>

        {product.description && (
          <p className="text-xs mb-3 line-clamp-3 text-(--shop-text)/60">
            {product.description}
          </p>
        )}

        {/* Footer */}
        <div className="mt-auto pt-3 border-t flex items-center justify-between border-(--shop-text)/10">
          <span className="font-bold text-lg text-(--shop-accent)">
            ${(product.price / 100).toFixed(2)}
          </span>

          {/* 🔥 lógica original respetada */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onOpen(product);
            }}
            className="text-[10px] font-bold px-3 py-1 rounded-md uppercase tracking-wide transition-all bg-(--shop-accent)/12 text-(--shop-accent)"
          >
            Comprar
          </button>
        </div>
      </div>
    </div>
  );
};

// --- SKELETON CARD ---
const SkeletonCard = () => (
  <div className="bg-white overflow-hidden flex flex-col h-full rounded-[1.25rem]">
    <div className="aspect-[4/5] bg-gradient-to-br from-gray-100 to-gray-200 animate-pulse relative overflow-hidden">
      <div className="absolute inset-0 -translate-x-full animate-[shop-shimmer_1.8s_infinite] bg-linear-to-r from-transparent via-white/60 to-transparent" />
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
    // Agregamos pt-[70px] para que todo baje sin chocar con el Navbar principal
    <div className="min-h-screen bg-[#F7F7F8] font-sans pb-24 relative pt-[70px]">
      {/* 1. TOP HEADER PREMIUM */}
      <nav
        className="bg-white/85 backdrop-blur-xl border-b border-black/7 sticky top-[70px] z-40 px-4 md:px-8 h-16 flex items-center justify-between"
      >
        <div className="flex items-center gap-4">
          {/* Botón de regreso minimalista y pro */}
          <Link
            to="/"
            className="flex items-center justify-center w-9 h-9 rounded-full bg-gray-100 hover:bg-black hover:text-white transition-all duration-300 text-gray-400"
            title="Volver al inicio"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="m12 19-7-7 7-7"/>
              <path d="M19 12H5"/>
            </svg>
          </Link>
          
          <div className="flex flex-col justify-center">
            <span className="text-[9px] text-gray-400 font-black tracking-[0.3em] uppercase mb-[2px]">
              Oficial
            </span>
            <h1 className="font-black text-xl tracking-tighter uppercase text-black leading-none m-0 !font-(family-name:--shop-font)">
              {STORE_CONFIG.storeName}
            </h1>
          </div>
        </div>

        {/* Product count badge */}
        {!loading && (
          <span className="text-[11px] font-bold text-gray-400 tabular-nums hidden md:block border border-gray-200 px-3 py-1 rounded-full">
            {filtered.length} producto{filtered.length !== 1 ? 's' : ''}
          </span>
        )}
      </nav>

      {/* 2. BARRA DE HERRAMIENTAS STICKY */}
      <div
        className="bg-white/95 backdrop-blur-md border-b border-black/6 shadow-[0_4px_20px_rgba(0,0,0,0.04)] sticky top-[134px] z-[30] px-4 py-3"
      >
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-3 items-center justify-between">

          {/* Input Búsqueda */}
          <div className="relative w-full md:max-w-md group">
            {/* Contenedor relativo para aislar el posicionamiento */}
<div className="relative w-full group isolate">
  
  {/* El Icono: z-10 para que quede por encima del input */}
  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none z-10">
    <Search
      className="text-gray-400 group-focus-within:!text-black transition-colors duration-200"
      size={15}
      strokeWidth={2.5}
    />
  </div>

  {/* El Input */}
  <input
    type="text"
    placeholder="Buscar producto..."
    value={search}
    onChange={e => setSearch(e.target.value)}
    className="w-full !m-0 !bg-gray-50 hover:!bg-gray-100/80 focus:!bg-white !border !border-gray-100 focus:!border-gray-300 !rounded-xl !pl-10 !pr-4 !py-2.5 !text-sm !font-medium !leading-normal !transition-all !duration-200 !outline-none !text-black !ring-0 !shadow-none"
  />
</div>
        
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
          <div className="relative w-full md:w-64 shrink-0 group">
  {/* Icono Filtro Izquierda */}
  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
    <Filter size={14} strokeWidth={2} className="text-gray-400 group-focus-within:!text-black transition-colors" />
  </div>

  <select
    value={selectedCat}
    onChange={(e) => setSelectedCat(e.target.value)}
    className="w-full !appearance-none !bg-none bg-white !border !border-gray-200 hover:!border-gray-300 focus:!border-gray-400 !rounded-xl !pl-9 !pr-10 !py-2.5 !text-[11px] !font-bold !uppercase !tracking-wide !leading-normal cursor-pointer !outline-none !text-black !transition-all !duration-200 !ring-0 !shadow-[0_1px_2px_rgba(0,0,0,0.04)]"
  >
    <option value="all">Todas las Categorías</option>
    {ALL_CATEGORIES.map((c) => (
      <option key={c.id} value={c.id}>
        {c.name}
      </option>
    ))}
  </select>

  {/* Icono Flecha Derecha */}
  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none z-10">
    <ChevronDown size={14} strokeWidth={2.5} className="text-gray-400 group-focus-within:!text-black" />
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
            <div className="w-20 h-20 rounded-3xl flex items-center justify-center mb-6 bg-(--shop-accent)/6">
              <ShoppingBag className="text-(--shop-accent)" size={36} strokeWidth={1.5} />
            </div>
            <h3 className="text-lg font-black uppercase tracking-widest text-gray-800 mb-2">Sin resultados</h3>
            <p className="text-sm text-gray-400 mb-6">Intenta ajustar tu búsqueda o categoría.</p>
            <button
              onClick={() => { setSearch(''); setSelectedCat('all'); }}
              className="text-xs font-black uppercase tracking-widest px-5 py-2.5 rounded-xl text-white transition-all hover:scale-105 active:scale-95 bg-(--shop-accent) shadow-[0_4px_16px_color-mix(in_oklab,var(--shop-accent)_25%,transparent)]"
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
        className="fixed bottom-8 right-8 z-[30] text-white w-16 h-16 flex items-center justify-center border-[3px] border-white group rounded-[20px] bg-(--shop-accent) shadow-[0_8px_32px_color-mix(in_oklab,var(--shop-accent)_33%,transparent),0_2px_8px_rgba(0,0,0,0.15)] transition-[transform,box-shadow] duration-200 ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:scale-110 active:scale-[0.94]"
      >
        <ShoppingCart size={24} strokeWidth={2} />
        {totalItems > 0 && (
          <span
            className="absolute -top-2.5 -right-2.5 text-white text-[10px] font-black w-6 h-6 flex items-center justify-center rounded-full border-2 border-white tabular-nums bg-[#111] shadow-[0_2px_8px_rgba(0,0,0,0.3)]"
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