// src/components/atoms/Input.tsx
'use client';
import React from 'react';
import clsx from 'clsx';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  className,
  id,
  ...props
}) => {
  const inputId = id || props.name || undefined;
  return (
    <div className="space-y-1.5">
      {label && (
        <label
          htmlFor={inputId}
          className="block text-sm font-medium text-[var(--ink-primary)]"
        >
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={clsx(
          'w-full rounded-[10px] border border-[var(--border-stone)] bg-[var(--bg-canvas)] px-3.5 py-2.5 text-sm text-[var(--ink-primary)] placeholder:text-[var(--ink-secondary)]/75 transition-colors focus:bg-[var(--bg-surface)] focus:border-[var(--accent-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)]/20 disabled:opacity-50',
          error &&
            'border-[var(--accent-danger)] focus:border-[var(--accent-danger)] focus:ring-[var(--accent-danger)]/20',
          className
        )}
        {...props}
      />
      {error && <p className="text-xs text-[var(--accent-danger)]">{error}</p>}
    </div>
  );
};
