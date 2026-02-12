'use client';

import type { SectionProps } from './types';

/**
 * Budget section with min/max inputs
 */
export const BudgetSection = ({ formData, onChange }: SectionProps) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Budget</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Budget Minimum (Rp)</label>
          <input
            type="number"
            value={formData.budgetMin ?? ''}
            onChange={(e) =>
              onChange({ budgetMin: e.target.value ? Number(e.target.value) : null })
            }
            placeholder="Contoh: 500000"
            className="w-full text-gray-600 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Budget Maximum (Rp)</label>
          <input
            type="number"
            value={formData.budgetMax ?? ''}
            onChange={(e) =>
              onChange({ budgetMax: e.target.value ? Number(e.target.value) : null })
            }
            placeholder="Contoh: 2000000"
            className="w-full text-gray-600 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>
    </div>
  );
};
