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
  Info
} from 'lucide-react';
import { ALL_CATEGORIES, type Category } from './data/category';

// --- TIPOS ---
type Product = {
  uuid: string;
  name: string;
  sku?: string;
  price: number;
  currency: string;
  images?: string;
  is_active: boolean;
  category_id?: string;
  created_at?: string;
};

// --- MODAL DE DETALLE DE PRODUCTO ---
const ProductModal = ({ product, isOpen, onClose }: { product: Product | null, isOpen: boolean, onClose: () => void }) => {
  const { addToCart, cart, cartCurrency } = useCart();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [qty, setQty] = useState(1);

  if (!isOpen || !product) return null;

  const images = product.images ? product.images.split(',').filter(Boolean) : [];
  const mainImage = images[currentImageIndex] || 'https://via.placeholder.com/600x600?text=Sin+Imagen';
  
  const category = ALL_CATEGORIES.find(c => c.id === product.category_id);
  const isFashion = category?.group === 'Moda y Accesorios';
  const currencyMismatch = cart.length > 0 && cartCurrency.toLowerCase() !== product.currency.toLowerCase();

  const handleAddToCart = () => {
    addToCart({ ...product, quantity: qty });
    setQty(1);
    onClose();
  };

  const handleWhatsAppInquiry = () => {
    const msg = `¡Hola! Me interesa este producto de tu catálogo:\n\n*${product.name}*\nID: ${product.uuid}\nPrecio: $${(product.price/100).toFixed(2)} ${product.currency.toUpperCase()}`;
    window.open(`https://wa.me/${STORE_CONFIG.fullWhatsApp}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
      <div className="bg-white rounded-3xl w-full max-w-5xl overflow-hidden shadow-2xl flex flex-col md:flex-row max-h-[95vh] relative">
        <button onClick={onClose} className="absolute top-4 right-4 z-20 bg-white/80 p-2 rounded-full hover:bg-white transition shadow-md">
          <X size={24} />
        </button>

        {/* COLUMNA IZQUIERDA: GALERÍA */}
        <div className="w-full md:w-3/5 bg-gray-50 flex flex-col">
          <div className="relative flex-1 flex items-center justify-center p-6">
            <img src={mainImage} alt={product.name} className="max-w-full max-h-[500px] object-contain mix-blend-multiply" />
            
            {images.length > 1 && (
              <>
                <button onClick={() => setCurrentImageIndex(i => i === 0 ? images.length - 1 : i - 1)} className="absolute left-4 bg-white p-3 rounded-full shadow-lg border">
                  <ChevronLeft size={24}/>
                </button>
                <button onClick={() => setCurrentImageIndex(i => i === images.length - 1 ? 0 : i + 1)} className="absolute right-4 bg-white p-3 rounded-full shadow-lg border">
                  <ChevronRight size={24}/>
                </button>
              </>
            )}
          </div>
          
          <div className="flex gap-3 justify-center p-6 bg-gray-100/50">
            {images.map((img, idx) => (
              <button key={idx} onClick={() => setCurrentImageIndex(idx)} className={`w-20 h-20 rounded-xl overflow-hidden border-4 transition ${idx === currentImageIndex ? 'border-black' : 'border-transparent opacity-60'}`}>
                <img src={img} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* COLUMNA DERECHA: INFO */}
        <div className="w-full md:w-2/5 p-8 flex flex-col bg-white overflow-y-auto">
          <div className="mb-6">
            <span className="bg-gray-100 text-gray-500 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest">{category?.name || 'Varios'}</span>
            <h2 className="text-4xl font-black text-gray-900 mt-4 leading-tight">{product.name}</h2>
            {product.sku && <p className="text-gray-400 font-mono text-sm mt-2">REF: {product.sku}</p>}
          </div>

          <div className="flex items-baseline gap-2 mb-8">
            <span className="text-4xl font-black text-gray-900">${(product.price / 100).toFixed(2)}</span>
            <span className="text-lg font-bold text-gray-400 uppercase">{product.currency}</span>
          </div>

          {isFashion && (
            <div className="bg-amber-50 border-l-4 border-amber-400 p-4 rounded-r-xl mb-8 flex gap-3">
              <Info className="text-amber-500 flex-shrink-0" />
              <p className="text-xs text-amber-800 leading-relaxed">
                <strong>Nota de Tallas:</strong> El stock varía rápidamente. Al finalizar tu pago, contáctanos por WhatsApp para confirmar tu talla ideal.
              </p>
            </div>
          )}

          <div className="mt-auto space-y-4">
            {STORE_CONFIG.mode === 'catalog' ? (
              <button onClick={handleWhatsAppInquiry} className="w-full py-5 bg-green-600 text-white font-black rounded-2xl hover:bg-green-700 transition flex items-center justify-center gap-3 shadow-xl shadow-green-200">
                Consultar Disponibilidad
              </button>
            ) : (
              <>
                <div className="flex items-center gap-6 mb-6">
                  <label className="font-bold text-gray-700">Cantidad:</label>
                  <div className="flex items-center bg-gray-100 rounded-2xl p-1">
                    <button onClick={() => setQty(Math.max(1, qty - 1))} className="p-3 hover:bg-white rounded-xl transition"><Minus size={18}/></button>
                    <span className="w-12 text-center font-black text-xl">{qty}</span>
                    <button onClick={() => setQty(qty + 1)} className="p-3 hover:bg-white rounded-xl transition"><Plus size={18}/></button>
                  </div>
                </div>

                <button 
                  disabled={currencyMismatch}
                  onClick={handleAddToCart}
                  className={`w-full py-5 rounded-2xl font-black transition flex items-center justify-center gap-3 shadow-xl ${
                    currencyMismatch 
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
                    : 'bg-black text-white hover:bg-gray-800 active:scale-95 shadow-gray-200'
                  }`}
                >
                  <ShoppingBag size={22}/>
                  {STORE_CONFIG.text.addToCart}
                </button>
                {currencyMismatch && (
                  <p className="text-center text-red-500 text-[10px] font-bold">Tu carrito tiene otra moneda. Vacíalo para agregar este producto.</p>
                )}
              </>
            )}
            <p className="text-center text-[11px] text-gray-400">{STORE_CONFIG.text.shippingNote}</p>
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
    <div onClick={() => onOpen(product)} className="group bg-white rounded-3xl border border-gray-100 overflow-hidden hover:shadow-2xl transition-all duration-500 cursor-pointer flex flex-col h-full">
      <div className="relative aspect-square overflow-hidden bg-gray-50">
        <img src={mainImg} alt={product.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
        <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>
      <div className="p-5 flex flex-col flex-1">
        <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest mb-2">
          {ALL_CATEGORIES.find((c: Category) => c.id === product.category_id)?.name || 'General'}
        </span>
        <h3 className="font-bold text-gray-900 text-lg leading-tight mb-4 line-clamp-2">{product.name}</h3>
        <div className="mt-auto flex items-center justify-between">
          <p className="text-2xl font-black text-gray-900">${(product.price/100).toFixed(2)}</p>
          <span className="text-[10px] font-bold bg-gray-100 px-2 py-1 rounded text-gray-400 uppercase">{product.currency}</span>
        </div>
      </div>
    </div>
  );
};

// --- COMPONENTE PRINCIPAL ---
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
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* NAVEGACIÓN */}
      <nav className="bg-white/80 backdrop-blur-lg border-b sticky top-0 z-40 px-6 h-20 flex items-center justify-between">
        <h1 className="font-black text-2xl tracking-tighter italic uppercase text-black">{STORE_CONFIG.storeName}</h1>
        <button onClick={() => setIsOpen(true)} className="relative p-4 bg-black text-white rounded-2xl hover:scale-105 transition shadow-lg shadow-gray-200">
          <ShoppingCart size={22} />
          {totalItems > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-600 text-[10px] font-black w-6 h-6 flex items-center justify-center rounded-full border-2 border-white">
              {totalItems}
            </span>
          )}
        </button>
      </nav>

      {/* FILTROS Y BÚSQUEDA */}
      <div className="bg-white border-b px-6 py-4">
        <div className="max-w-7xl mx-auto flex flex-col gap-4">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-black transition" size={20} />
            <input 
              type="text" 
              placeholder="Busca en nuestro catálogo..." 
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-12 pr-6 py-4 bg-gray-100 border-none rounded-2xl focus:ring-2 focus:ring-black transition outline-none"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            <button 
              onClick={() => setSelectedCat('all')}
              className={`px-6 py-2 rounded-xl text-sm font-black whitespace-nowrap transition ${selectedCat === 'all' ? 'bg-black text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
            >
              TODO
            </button>
            {ALL_CATEGORIES.map((c: Category) => (
              <button 
                key={c.id} 
                onClick={() => setSelectedCat(c.id)}
                className={`px-6 py-2 rounded-xl text-sm font-black whitespace-nowrap transition ${selectedCat === c.id ? 'bg-black text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
              >
                {c.name.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* LISTA DE PRODUCTOS */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[1,2,3,4].map(i => <div key={i} className="aspect-square bg-gray-200 rounded-3xl animate-pulse"/>)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <ShoppingBag className="mx-auto text-gray-200 mb-6" size={80} />
            <h3 className="text-2xl font-black text-gray-400">Sin resultados disponibles</h3>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {filtered.map(p => <ProductCard key={p.uuid} product={p} onOpen={handleOpen} />)}
          </div>
        )}
      </main>

      <ProductModal 
        product={selectedProd} 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
      
      <CartModal />
    </div>
  );
};