import { useState, useEffect, useRef } from 'react';
import { useCart } from '../CartContext';
import { STORE_CONFIG } from '../config';

// --- TIPOS ---
export interface AddressData {
  street: string;
  number_ext: string;
  number_int?: string;
  neighborhood: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  references?: string;
}

export interface CustomerData {
  name: string;
  email: string;
  phone: string;
  tax_id?: string;
  billing_address: AddressData;
  shipping_address?: AddressData;
  company_name?: string;
  business_type?: 'individual' | 'company';
}

export const useCheckout = () => {
  const { cart, cartTotal, cartCurrency } = useCart();
  const [loading, setLoading] = useState(false);
  
  // Control de Pasos: 'address' (Datos) -> 'payment' (Stripe)
  // El paso 'country' se omite porque la tienda tiene un país fijo en la config
  
  const [step, setStep] = useState<'country' | 'address' | 'payment'>('country');
  
  const [isShippingAvailable, setIsShippingAvailable] = useState<boolean>(true);
  const [shippingSameAsBilling, setShippingSameAsBilling] = useState(true);
  
  // 2. PAÍS SELECCIONADO
  const [selectedCountry, setSelectedCountry] = useState<string>('');
  
  // Autocompletado de Colonias (API)
  const [colonias, setColonias] = useState<Array<{placeName: string, state: string}>>([]);
  const [isLoadingColonias, setIsLoadingColonias] = useState(false);
  
  // Debounce para API de CP
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Inicialización de Datos del Cliente
  const [customerData, setCustomerData] = useState<CustomerData>({
    name: '',
    email: '',
    phone: '',
    tax_id: '',
    billing_address: {
      street: '',
      number_ext: '',
      number_int: '',
      neighborhood: '',
      city: '',
      state: '',
      postal_code: '',
      country: '', // Fijo desde config
      references: ''
    },
    company_name: '',
    business_type: 'individual'
  });

  // --- LÓGICA DE VALIDACIÓN GEOGRÁFICA ---
  
  const checkShippingAvailability = (postalCode?: string): boolean => {
    const { allowedZipCodes } = STORE_CONFIG.location;

    // 1. Si no hay restricciones, vendemos a todo el país
    if (!allowedZipCodes || allowedZipCodes.length === 0) return true;

    // 2. Si hay restricciones y no hay CP, esperamos
    if (!postalCode || postalCode.length < 4) return false;

    // 3. Validar contra lista blanca
    return allowedZipCodes.includes(postalCode);
  };

  // --- COTIZACIÓN POR WHATSAPP (FALLBACK) ---
  
  const handleWhatsAppQuote = () => {
    const cp = customerData.billing_address.postal_code || 'N/A';
    const itemsList = cart.map(i => `- ${i.name} (x${i.quantity})`).join('\n');
    const totalFmt = (cartTotal / 100).toFixed(2);
    
    const mensaje = `Hola, quiero cotizar un pedido especial:\n\n` +
                    `📍 CP Destino: ${cp}\n` +
                    `💰 Total Carrito: $${totalFmt} ${cartCurrency.toUpperCase()}\n\n` +
                    `📦 Productos:\n${itemsList}\n\n` +
                    `Quedo pendiente del costo de envío.`;

    window.open(`https://wa.me/${STORE_CONFIG.fullWhatsApp}?text=${encodeURIComponent(mensaje)}`, '_blank');
  };

  // --- API DE CÓDIGOS POSTALES (ZIPPOPOTAM) ---

  const buscarColonias = async (postalCode: string) => {
    if (!postalCode || postalCode.length < 4) {
      setColonias([]);
      return;
    }

    setIsLoadingColonias(true);
    try {
      // Usamos el país configurado en la tienda (ej: 'mx')
      const countryCode = selectedCountry.toLowerCase();
      const url = `https://api.zippopotam.us/${countryCode}/${postalCode}`;
      
      const response = await fetch(url);
      if (!response.ok) throw new Error('CP no encontrado');

      const data = await response.json();
      const coloniasList = data.places?.map((place: any) => ({
        placeName: place['place name'],
        state: place.state
      })) || [];
      
      setColonias(coloniasList);
      
      // Autocompletar con la primera opción si existe
      if (coloniasList.length > 0) {
        const first = coloniasList[0];
        setCustomerData(prev => ({
          ...prev,
          billing_address: {
            ...prev.billing_address,
            neighborhood: first.placeName,
            city: first.placeName.split(',')[0], 
            state: first.state,
            postal_code: postalCode,
            country:selectedCountry
          }
        }));
      }

      // Validar si servimos a este CP
      setIsShippingAvailable(checkShippingAvailability(postalCode));
      
    } catch (error) {
      console.warn('API CP falló o no encontró datos', error);
      setColonias([]);
      // Aún si falla la API, permitimos escribir manual PERO validamos zona
      setIsShippingAvailable(checkShippingAvailability(postalCode));
    } finally {
      setIsLoadingColonias(false);
    }
  };

  // --- MANEJADORES DE INPUTS ---

  const handlePostalCodeChange = (postalCode: string) => {
    const cleanPostal = postalCode.replace(/[^0-9a-zA-Z]/g, '');
    
    setCustomerData(prev => ({
      ...prev,
      billing_address: { ...prev.billing_address, postal_code: cleanPostal, country: selectedCountry }
    }));
    
    // Debounce de 800ms para no saturar la API
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      buscarColonias(cleanPostal);
    }, 800);
  };

  const handleColoniaSelect = (colonia: {placeName: string, state: string}) => {
    setCustomerData(prev => ({
      ...prev,
      billing_address: {
        ...prev.billing_address,
        neighborhood: colonia.placeName,
        city: colonia.placeName.split(',')[0],
        state: colonia.state,
        country: selectedCountry
      }
    }));
  };

  const updateBillingAddressField = (field: string, value: string) => {
    setCustomerData(prev => ({
      ...prev,
      billing_address: { ...prev.billing_address, [field]: value }
    }));
  };

  const updateCustomerData = (field: string, value: string) => {
    setCustomerData(prev => ({ ...prev, [field]: value }));
  };

  const handleShippingSameAsBillingChange = (checked: boolean) => {
    setShippingSameAsBilling(checked);
    if (checked) {
      setCustomerData(prev => {
        const { shipping_address, ...rest } = prev;
        return rest;
      });
    } else {
      setCustomerData(prev => ({
        ...prev,
        shipping_address: { ...prev.billing_address, country:selectedCountry }
      }));
    }
  };

  // Cleanup del debounce al desmontar
  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  return {
    // Estado
    cart,
    cartTotal,
    cartCurrency,
    loading,
    setLoading,
    step, 
    setStep,
    selectedCountry,
    setSelectedCountry,
    isShippingAvailable,
    customerData,
    shippingSameAsBilling,
    colonias,
    isLoadingColonias,

    
    // Acciones
    handleWhatsAppQuote,
    handlePostalCodeChange,
    handleColoniaSelect,
    updateBillingAddressField,
    updateCustomerData,
    handleShippingSameAsBillingChange,
  };
};