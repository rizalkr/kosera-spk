'use client';

import React from 'react';
import { Card } from '@/components/atoms';
import clsx from 'clsx';

export type StatCardColor = 'blue' | 'green' | 'yellow' | 'purple' | 'red';

export interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  color?: StatCardColor;
  className?: string;
}

const iconToneClasses: Record<StatCardColor, string> = {
  blue: 'bg-[var(--accent-tint)] text-[var(--accent-primary)] border border-[#BBDCD0]',
  green: 'bg-[var(--accent-tint)] text-[var(--accent-primary)] border border-[#BBDCD0]',
  yellow: 'bg-[var(--accent-spark-tint)] text-[var(--accent-spark)] border border-[#F2CDBB]',
  purple: 'bg-[var(--bg-muted)] text-[var(--ink-primary)] border border-[var(--border-stone)]',
  red: 'bg-[var(--accent-danger-tint)] text-[var(--accent-danger)] border border-[#ECC6C0]',
};

/**
 * Molecule: StatCard
 * Reusable statistic card for dashboard metrics built on the Card atom.
 */
export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  color = 'blue',
  className,
}) => {
  return (
    <Card
      className={clsx(
        'bg-[var(--bg-surface)] border border-[var(--border-stone)] rounded-[16px] p-5',
        className
      )}
      padding="none"
      bordered
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-medium text-[var(--ink-secondary)]">{title}</p>
          <p className="font-mono-tabular text-2xl font-bold text-[var(--ink-primary)] mt-1.5 truncate">
            {value}
          </p>
          {subtitle && (
            <p className="font-mono-tabular text-xs text-[var(--ink-secondary)] mt-1">{subtitle}</p>
          )}
        </div>
        <div
          className={clsx(
            'h-10 w-10 rounded-[12px] flex items-center justify-center shrink-0',
            iconToneClasses[color]
          )}
          aria-hidden="true"
        >
          {icon}
        </div>
      </div>
    </Card>
  );
};
