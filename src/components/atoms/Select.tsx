// src/components/atoms/Select.tsx
'use client';
import React from 'react';
import clsx from 'clsx';

export interface SelectOption<TValue extends string | number = string> {
  label: string;
  value: TValue;
}

export interface SelectProps<TValue extends string | number = string>
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: SelectOption<TValue>[];
}

export const Select = <TValue extends string | number = string>({
  label,
  error,
  className,
  options,
  id,
  ...props
}: SelectProps<TValue>) => {
  const selectId = id || props.name || undefined;
  return (
    <div className="space-y-1.5">
      {label && (
        <label
          htmlFor={selectId}
          className="block text-sm font-medium text-[var(--ink-primary)]"
        >
          {label}
        </label>
      )}
      <select
        id={selectId}
        className={clsx(
          'w-full rounded-[10px] border border-[var(--border-stone)] bg-[var(--bg-canvas)] px-3.5 py-2.5 text-sm text-[var(--ink-primary)] transition-colors focus:bg-[var(--bg-surface)] focus:border-[var(--accent-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)]/20 disabled:opacity-50 cursor-pointer',
          error &&
            'border-[var(--accent-danger)] focus:border-[var(--accent-danger)] focus:ring-[var(--accent-danger)]/20',
          className
        )}
        {...props}
      >
        {options.map((opt) => (
          <option key={String(opt.value)} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && <p className="text-xs text-[var(--accent-danger)]">{error}</p>}
    </div>
  );
};
