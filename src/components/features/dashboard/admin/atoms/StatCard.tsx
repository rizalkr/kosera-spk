import React from 'react';

export interface StatCardProps {
  label: string;
  value: number | string | undefined;
  icon: React.ReactNode;
  colorClass?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  icon,
  colorClass = 'text-[var(--ink-primary)]',
}) => (
  <div className="bg-[var(--bg-surface)] border border-[var(--border-stone)] rounded-[16px] p-5">
    <div className="flex items-start justify-between gap-3">
      <div className="min-w-0">
        <p className="text-xs font-medium text-[var(--ink-secondary)]">{label}</p>
        <p className={`font-mono-tabular text-2xl font-bold mt-1.5 ${colorClass}`}>
          {(typeof value === 'number' ? value.toLocaleString('id-ID') : value) || '0'}
        </p>
      </div>
      <div
        className="h-10 w-10 rounded-[12px] bg-[var(--accent-tint)] border border-[#BBDCD0] text-[var(--accent-primary)] flex items-center justify-center shrink-0"
        aria-hidden="true"
      >
        {icon}
      </div>
    </div>
  </div>
);
