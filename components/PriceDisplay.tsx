'use client';

import { useTranslation } from '@/contexts/ContentContext';
import { CurrencyPrice } from '@/types/property';

interface PriceDisplayProps {
  price?: number;
  prices?: { [currency: string]: CurrencyPrice };
  priceType?: 'price' | 'rent';
  className?: string;
  showDecimals?: boolean;
}

export function PriceDisplay({
  price,
  prices,
  priceType = 'price',
  className = '',
  showDecimals = false
}: PriceDisplayProps) {
  const { formatPrice, currency } = useTranslation();

  // Get price for current currency
  const getDisplayPrice = (): number => {
    if (prices && currency && prices[currency.code]) {
      return priceType === 'rent'
        ? (prices[currency.code].rent || 0)
        : prices[currency.code].price;
    }
    return price || 0;
  };

  const displayPrice = getDisplayPrice();

  return <span className={className}>{formatPrice(displayPrice, showDecimals)}</span>;
}

interface PriceWithLabelProps {
  price: number;
  label?: string;
  priceClassName?: string;
  labelClassName?: string;
}

export function PriceWithLabel({ price, label, priceClassName = '', labelClassName = '' }: PriceWithLabelProps) {
  const { formatPrice, t } = useTranslation();

  return (
    <div>
      <span className={priceClassName}>{formatPrice(price)}</span>
      {label && <span className={labelClassName}>{label}</span>}
    </div>
  );
}
