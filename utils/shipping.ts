import type { ProjectConfig } from '../interfaces/config.interface';

/**
 * Espejo de calculateShipping() del backend (metritrak-workers,
 * cart-pricing.helper.ts). Lo que aquí se muestra debe ser exactamente
 * lo que Stripe va a cobrar, así que cualquier cambio en la regla del
 * backend tiene que replicarse aquí.
 */
export const calculateShipping = (
  subtotal: number,
  dbConfig: Pick<ProjectConfig, 'free_shipping_threshold' | 'shipping_local_cost' | 'shipping_intl_cost' | 'origin_country'>,
  destinationCountry: string,
): { shippingCost: number; isInternational: boolean; isFree: boolean } => {
  const originCountry = dbConfig.origin_country || 'MX';
  const isInternational = destinationCountry !== originCountry;
  const threshold = Number(dbConfig.free_shipping_threshold || 0);

  if (threshold > 0 && subtotal >= threshold) {
    return { shippingCost: 0, isInternational, isFree: true };
  }

  const shippingCost = isInternational
    ? Number(dbConfig.shipping_intl_cost || 0)
    : Number(dbConfig.shipping_local_cost || 0);

  return { shippingCost, isInternational, isFree: shippingCost === 0 };
};
