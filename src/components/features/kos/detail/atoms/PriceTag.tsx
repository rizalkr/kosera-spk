import React from 'react';
import { formatRupiah } from '@/lib/utils/discovery';

export interface PriceTagProps {
  price: number;
  period?: string;
}

export const PriceTag: React.FC<PriceTagProps> = ({
  price,
  period = 'bulan',
}) => (
  <div className="flex items-baseline gap-1.5">
    <span className="font-mono-tabular text-2xl sm:text-3xl font-bold text-[var(--ink-primary)]">
      {formatRupiah(price)}
    </span>
    <span className="text-sm text-[var(--ink-secondary)]">/{period}</span>
  </div>
);
