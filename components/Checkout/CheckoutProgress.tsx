// src/shop/components/Checkout/CheckoutProgress.tsx
import React from 'react';
import { Globe, MapPin, CreditCard, Check } from 'lucide-react';

interface CheckoutProgressProps {
  step: 'country' | 'address' | 'payment';
}

export const CheckoutProgress: React.FC<CheckoutProgressProps> = ({ step }) => {
  const steps = [
    { key: 'country', label: 'País', icon: Globe },
    { key: 'address', label: 'Envío', icon: MapPin },
    { key: 'payment', label: 'Pago', icon: CreditCard }
  ];

  // Índices para lógica de completado
  const stepIndex = { country: 0, address: 1, payment: 2 };
  const currentIdx = stepIndex[step];

  return (
    <div className="w-full py-8">
      <div className="flex items-center justify-center">
        {steps.map((s, idx) => {
          const isCompleted = idx < currentIdx;
          const isActive = idx === currentIdx;
          const Icon = s.icon;

          return (
            <React.Fragment key={s.key}>
              {/* Círculo del Step */}
              <div className="flex flex-col items-center gap-2 relative z-10">
                <div 
                  className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-500 border-2 ${
                    isCompleted 
                      ? 'bg-black border-black text-white' 
                      : isActive 
                        ? 'bg-white border-black text-black shadow-xl shadow-gray-200 scale-110' 
                        : 'bg-gray-50 border-gray-200 text-gray-300'
                  }`}
                >
                  {isCompleted ? (
                    <Check size={20} strokeWidth={3} className="animate-in zoom-in duration-300" />
                  ) : (
                    <Icon size={20} />
                  )}
                </div>
                
                <span className={`text-[10px] font-black uppercase tracking-widest transition-colors duration-300 ${
                  isActive ? 'text-black' : 'text-gray-400'
                }`}>
                  {s.label}
                </span>
              </div>

              {/* Conector (Línea) */}
              {idx < steps.length - 1 && (
                <div className="w-16 md:w-24 h-1 bg-gray-100 mx-2 rounded-full overflow-hidden relative">
                  <div 
                    className={`absolute inset-0 bg-black transition-all duration-700 ease-out ${
                      idx < currentIdx ? 'w-full' : 'w-0'
                    }`} 
                  />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};