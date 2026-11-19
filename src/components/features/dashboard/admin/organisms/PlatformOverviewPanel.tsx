import React from 'react';
import { UserCompositionChart } from '@/components/features/dashboard/UserCompositionChart';

export interface PlatformOverviewPanelProps {
  totalViews: number | undefined;
  averageRating: number | undefined;
}

export const PlatformOverviewPanel: React.FC<PlatformOverviewPanelProps> = ({
  totalViews,
  averageRating,
}) => (
  <section className="bg-[var(--bg-surface)] border border-[var(--border-stone)] rounded-[16px] p-6 space-y-5">
    <h2 className="text-base font-bold text-[var(--ink-primary)]">Ringkasan Platform</h2>
    <div className="grid grid-cols-2 gap-4">
      <div className="bg-[var(--bg-canvas)] border border-[var(--border-stone)] p-4 rounded-[12px] text-center">
        <div className="font-mono-tabular text-2xl font-bold text-[var(--ink-primary)]">
          {totalViews?.toLocaleString('id-ID') || '0'}
        </div>
        <div className="text-xs font-medium text-[var(--ink-secondary)] mt-1">Total Views</div>
      </div>
      <div className="bg-[var(--bg-canvas)] border border-[var(--border-stone)] p-4 rounded-[12px] text-center">
        <div className="inline-flex items-center justify-center gap-1.5 font-mono-tabular text-2xl font-bold text-[var(--accent-primary)]">
          <span>{averageRating ? averageRating.toFixed(1) : '0.0'}</span>
          <svg
            className="w-4 h-4 text-[var(--accent-spark)]"
            viewBox="0 0 24 24"
            fill="currentColor"
            aria-hidden="true"
          >
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
        </div>
        <div className="text-xs font-medium text-[var(--ink-secondary)] mt-1">
          Rata-rata Rating
        </div>
      </div>
    </div>
    <div className="pt-2">
      <UserCompositionChart />
    </div>
  </section>
);
