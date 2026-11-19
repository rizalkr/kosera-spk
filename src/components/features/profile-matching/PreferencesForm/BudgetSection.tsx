'use client';

import type { SectionProps } from './types';

/**
 * Budget section with min/max numeric inputs
 */
export const BudgetSection = ({ formData, onChange }: SectionProps) => {
  const inputClass =
    'w-full font-mono-tabular text-sm bg-[var(--bg-canvas)] text-[var(--ink-primary)] placeholder:text-[var(--ink-secondary)]/70 px-3.5 py-2.5 border border-[var(--border-stone)] rounded-[10px] focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)]/20 focus:border-[var(--accent-primary)] transition-colors';

  return (
    <section className="bg-[var(--bg-surface)] border border-[var(--border-stone)] rounded-[16px] p-5 sm:p-6">
      <div className="mb-4">
        <h3 className="text-base font-bold text-[var(--ink-primary)]">Rentang Budget Bulanan</h3>
        <p className="text-xs text-[var(--ink-secondary)] mt-0.5">
          Kosera mencocokkan harga sewa bulanan dengan batas yang Anda tentukan.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="pref-budget-min"
            className="block text-xs font-semibold text-[var(--ink-primary)] mb-1.5"
          >
            Budget Minimum (Rp)
          </label>
          <input
            id="pref-budget-min"
            type="number"
            min={0}
            step={50000}
            value={formData.budgetMin ?? ''}
            onChange={(e) =>
              onChange({ budgetMin: e.target.value ? Number(e.target.value) : null })
            }
            placeholder="Contoh: 500000"
            className={inputClass}
          />
        </div>
        <div>
          <label
            htmlFor="pref-budget-max"
            className="block text-xs font-semibold text-[var(--ink-primary)] mb-1.5"
          >
            Budget Maksimum (Rp)
          </label>
          <input
            id="pref-budget-max"
            type="number"
            min={0}
            step={50000}
            value={formData.budgetMax ?? ''}
            onChange={(e) =>
              onChange({ budgetMax: e.target.value ? Number(e.target.value) : null })
            }
            placeholder="Contoh: 2000000"
            className={inputClass}
          />
        </div>
      </div>
    </section>
  );
};
