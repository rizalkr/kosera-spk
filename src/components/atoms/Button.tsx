// src/components/atoms/Button.tsx
'use client';
import React from 'react';
import clsx from 'clsx';

export type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'outline' | 'ghost';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    'bg-[var(--accent-primary)] text-white hover:bg-[var(--accent-primary-hover)] focus-visible:ring-[var(--accent-primary)]',
  secondary:
    'bg-[var(--bg-muted)] text-[var(--ink-primary)] hover:bg-[var(--border-stone)] focus-visible:ring-[var(--ink-secondary)]',
  danger:
    'bg-[var(--accent-danger)] text-white hover:bg-[#9C3022] focus-visible:ring-[var(--accent-danger)]',
  outline:
    'border border-[var(--border-stone)] bg-[var(--bg-surface)] text-[var(--ink-primary)] hover:border-[var(--ink-secondary)] focus-visible:ring-[var(--accent-primary)]',
  ghost:
    'text-[var(--ink-primary)] hover:bg-[var(--bg-muted)] focus-visible:ring-[var(--ink-secondary)]',
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'h-8 px-3 text-xs',
  md: 'h-10 px-4 text-sm',
  lg: 'h-12 px-6 text-base',
};

export const Button: React.FC<ButtonProps> = ({
  className,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled,
  leftIcon,
  rightIcon,
  children,
  ...props
}) => {
  return (
    <button
      className={clsx(
        'inline-flex items-center justify-center rounded-[10px] font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none gap-2 cursor-pointer',
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && (
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-current/40 border-t-transparent" />
      )}
      {!isLoading && leftIcon}
      <span>{children}</span>
      {!isLoading && rightIcon}
    </button>
  );
};
