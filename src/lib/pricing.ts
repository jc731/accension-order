/**
 * Pricing rules for Ascension Convention 2026 shirts.
 * Base price: $25.00. 2XL/3XL add $2.00.
 */
export const BASE_PRICE_CENTS = 2500;
export const XXL_UPCHARGE_CENTS = 200;
export const XXL_SIZES = ['2XL', '3XL'] as const;

export type ShirtSize = 'XS' | 'S' | 'M' | 'L' | 'XL' | '2XL' | '3XL';

export function getPriceForSize(size: ShirtSize): number {
  return XXL_SIZES.includes(size as (typeof XXL_SIZES)[number])
    ? BASE_PRICE_CENTS + XXL_UPCHARGE_CENTS
    : BASE_PRICE_CENTS;
}

export function formatPrice(cents: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(cents / 100);
}
