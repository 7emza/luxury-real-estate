import { Currency } from '@/types/api';

/**
 * Format a price with the specified currency
 * @param amount - The numeric amount to format
 * @param currency - The currency object with formatting rules
 * @param showDecimals - Whether to show decimal places (default: true)
 * @returns Formatted price string
 */
export function formatPrice(amount: number, currency: Currency, showDecimals: boolean = true): string {
  const decimals = showDecimals ? currency.decimalPlaces : 0;
  const formattedAmount = amount.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });

  if (currency.symbolPosition === 'before') {
    return `${currency.symbol}${formattedAmount}`;
  } else {
    return `${formattedAmount} ${currency.symbol}`;
  }
}

/**
 * Format a price range
 * @param min - Minimum price
 * @param max - Maximum price
 * @param currency - The currency object
 * @returns Formatted price range string
 */
export function formatPriceRange(min: number, max: number, currency: Currency): string {
  return `${formatPrice(min, currency)} - ${formatPrice(max, currency)}`;
}

/**
 * Abbreviate large numbers (e.g., 1M, 2.5K)
 * @param amount - The numeric amount
 * @param currency - The currency object
 * @returns Abbreviated price string
 */
export function formatPriceAbbreviated(amount: number, currency: Currency): string {
  let abbreviatedAmount: string;
  let suffix = '';

  if (amount >= 1000000) {
    abbreviatedAmount = (amount / 1000000).toFixed(1);
    suffix = 'M';
  } else if (amount >= 1000) {
    abbreviatedAmount = (amount / 1000).toFixed(1);
    suffix = 'K';
  } else {
    abbreviatedAmount = amount.toFixed(0);
  }

  // Remove .0 if present
  abbreviatedAmount = abbreviatedAmount.replace(/\.0$/, '');

  if (currency.symbolPosition === 'before') {
    return `${currency.symbol}${abbreviatedAmount}${suffix}`;
  } else {
    return `${abbreviatedAmount}${suffix} ${currency.symbol}`;
  }
}

/**
 * Convert price from one currency to another (placeholder for future implementation)
 * @param amount - Amount in source currency
 * @param fromCurrency - Source currency code
 * @param toCurrency - Target currency code
 * @returns Converted amount (currently returns same amount as placeholder)
 */
export function convertCurrency(amount: number, fromCurrency: string, toCurrency: string): number {
  // TODO: Implement actual currency conversion using an API like exchangerate-api.com
  // For now, just return the same amount
  console.warn('Currency conversion not yet implemented. Returning original amount.');
  return amount;
}
