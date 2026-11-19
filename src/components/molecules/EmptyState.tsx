'use client';

import React from 'react';
import clsx from 'clsx';
import { Card } from '@/components/atoms';

export type EmptyStateVariant = 'default' | 'search' | 'error' | 'onboarding';

export interface EmptyStateProps {
  /** Primary title of the empty state */
  title: string;
  /** Supporting description text */
  description?: string;
  /** Icon or visual badge */
  icon?: React.ReactNode;
  /** Action buttons */
  actions?: React.ReactNode;
  /** Semantic surface variant */
  variant?: EmptyStateVariant;
  /** Optional extra classes */
  className?: string;
  /** Optional test id */
  'data-testid'?: string;
}

const variantClasses: Record<EmptyStateVariant, string> = {
  default: 'bg-[var(--bg-surface)] border-[var(--border-stone)]',
  search: 'bg-[var(--bg-surface)] border-[var(--border-stone)]',
  error: 'bg-[var(--accent-danger-tint)] border-[#ECC6C0]',
  onboarding: 'bg-[var(--bg-surface)] border-[var(--border-stone)]',
};

/**
 * Molecule: EmptyState
 * Reusable component for displaying empty, search, error, or onboarding states.
 */
export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  icon,
  actions,
  variant = 'default',
  className,
  'data-testid': dataTestId,
}) => {
  return (
    <Card
      className={clsx('text-center p-8 rounded-[16px] border', variantClasses[variant], className)}
      padding="none"
      bordered
      data-testid={dataTestId}
      role="status"
      aria-live="polite"
    >
      {icon && (
        <div
          className={clsx(
            'mx-auto mb-4 h-12 w-12 rounded-full flex items-center justify-center',
            variant === 'error'
              ? 'bg-[var(--bg-surface)] text-[var(--accent-danger)]'
              : 'bg-[var(--accent-tint)] text-[var(--accent-primary)]'
          )}
          aria-hidden="true"
        >
          {icon}
        </div>
      )}
      <h3 className="text-lg font-bold text-[var(--ink-primary)] mb-1.5">{title}</h3>
      {description && (
        <p className="text-[var(--ink-secondary)] text-sm max-w-md mx-auto mb-6 leading-relaxed">
          {description}
        </p>
      )}
      {actions && (
        <div className="flex items-center justify-center gap-3 flex-wrap">{actions}</div>
      )}
    </Card>
  );
};
