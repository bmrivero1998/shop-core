// src/shop/components/Checkout/CheckoutProgress.tsx
import React from 'react';
import { Globe, MapPin, CreditCard, Check } from 'lucide-react';
import { STORE_CONFIG } from '../../config';

interface CheckoutProgressProps {
  step: 'country' | 'address' | 'payment';
}

export const CheckoutProgress: React.FC<CheckoutProgressProps> = ({ step }) => {
  const colors = STORE_CONFIG.theme.colors;
  
  const steps = [
    { key: 'country', label: 'País', icon: Globe },
    { key: 'address', label: 'Envío', icon: MapPin },
    { key: 'payment', label: 'Pago', icon: CreditCard }
  ];

  // Índices para lógica de completado
  const stepIndex = { country: 0, address: 1, payment: 2 };
  const currentIdx = stepIndex[step];

  return (
    <div className="w-full pt-8 pb-8">
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
                  className="w-12 h-12 rounded-full flex items-center justify-center transition-all duration-500 border-2"
                  style={{
                    backgroundColor: isCompleted ? colors.accent : (isActive ? 'white' : '#f9fafb'),
                    borderColor: isActive ? colors.accent : (isCompleted ? colors.accent : '#e5e7eb'),
                    color: isCompleted ? 'white' : (isActive ? colors.accent : '#d1d5db'),
                    boxShadow: isActive ? `0 20px 25px -5px ${colors.accent}20, 0 10px 10px -5px ${colors.accent}10` : 'none',
                    transform: isActive ? 'scale(1.1)' : 'scale(1)'
                  }}
                >
                  {isCompleted ? (
                    <Check size={20} strokeWidth={3} className="animate-in zoom-in duration-300" />
                  ) : (
                    <Icon size={20} />
                  )}
                </div>
                
                <span 
                  className="text-[10px] font-black uppercase tracking-widest transition-colors duration-300"
                  style={{
                    color: isActive ? colors.accent : (isCompleted ? colors.text : '#9ca3af')
                  }}
                >
                  {s.label}
                </span>
              </div>

              {/* Conector (Línea) */}
              {idx < steps.length - 1 && (
                <div 
                  className="w-16 md:w-24 h-1 mx-2 rounded-full overflow-hidden relative"
                  style={{ backgroundColor: `${colors.text}15` }}
                >
                  <div 
                    className="absolute inset-0 transition-all duration-700 ease-out"
                    style={{
                      backgroundColor: colors.accent,
                      width: idx < currentIdx ? '100%' : '0%'
                    }}
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