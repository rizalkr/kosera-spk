import React from 'react';
import { cn } from '@/lib/utils';

export interface StatCardProps {
  value: React.ReactNode;
  label: string;
  color?: 'blue' | 'green' | 'purple' | 'yellow';
  extra?: React.ReactNode;
}

const valueColorMap: Record<string, string> = {
  blue: 'text-[var(--ink-primary)]',
  green: 'text-[var(--accent-primary)]',
  purple: 'text-[var(--accent-primary)]',
  yellow: 'text-[var(--accent-spark)]',
};

export const StatCard: React.FC<StatCardProps> = ({ value, label, color = 'blue', extra }) => (
  <div className="rounded-[14px] p-5 bg-[var(--bg-canvas)] border border-[var(--border-stone)]">
    <div className={cn('font-mono-tabular text-2xl font-bold', valueColorMap[color])}>{value}</div>
    <div className="text-xs font-medium text-[var(--ink-secondary)] mt-1">{label}</div>
    {extra && (
      <div className="font-mono-tabular text-[11px] font-semibold text-[var(--ink-secondary)] mt-1.5">
        {extra}
      </div>
    )}
  </div>
);
