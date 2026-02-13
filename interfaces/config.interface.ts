
 export interface ProjectConfig {
  base_currency: string;
  shipping_local_cost: number;
  shipping_intl_cost: number;
  free_shipping_threshold: number;
  support_email: string;
  origin_country: string;
}

export interface CheckoutContext {
  selectedCountry: string | null;
  setSelectedCountry: (value: string) => void;
  setStep: React.Dispatch<React.SetStateAction<CheckoutStep>>;
  handleWhatsAppQuote: () => void;
  updateBillingAddressField: (field: string, value: string) => void;
}


export type CheckoutStep = 'country' | 'address' | 'payment';