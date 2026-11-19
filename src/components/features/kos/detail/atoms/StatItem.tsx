import React from 'react';

export interface StatItemProps {
  label: string;
  value: string | number;
}

export const StatItem: React.FC<StatItemProps> = ({ label, value }) => (
  <div className="flex items-center justify-between text-xs sm:text-sm">
    <span className="text-[var(--ink-secondary)]">{label}</span>
    <span className="font-mono-tabular font-semibold text-[var(--ink-primary)]">
      {value}
    </span>
  </div>
);
