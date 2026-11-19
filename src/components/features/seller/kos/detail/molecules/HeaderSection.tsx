import React from 'react';
import { SellerKosDetail } from '@/types/seller-kos';

export interface HeaderSectionProps {
  kos: SellerKosDetail;
  status: { label: string; color: string };
  formatCurrency: (n: number) => string;
  formatDate: (d: string) => string;
  onBack: () => void;
  onRefresh: () => void;
  onEdit: () => void;
  isRefreshing: boolean;
}

export const HeaderSection: React.FC<HeaderSectionProps> = ({
  kos,
  status,
  formatCurrency,
  formatDate,
  onBack,
  onRefresh,
  onEdit,
  isRefreshing,
}) => (
  <div className="bg-[var(--bg-muted)] border-b border-[var(--border-stone)] p-6 sm:p-8">
    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
      <div className="flex-1 space-y-2">
        <div className="flex flex-wrap items-center gap-3 mb-2">
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[8px] border border-[var(--border-stone)] bg-[var(--bg-surface)] text-xs font-semibold text-[var(--ink-primary)] hover:border-[var(--ink-secondary)] transition-colors cursor-pointer"
          >
            <span>Kembali</span>
          </button>
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${status.color}`}>
            {status.label}
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[var(--ink-primary)]">
          {kos.name}
        </h1>
        <p className="text-sm text-[var(--ink-secondary)]">
          {kos.address}, {kos.city}
        </p>
        {kos.createdAt && (
          <p className="font-mono-tabular text-xs text-[var(--ink-secondary)]">
            Dibuat pada {formatDate(kos.createdAt as string)}
          </p>
        )}
      </div>

      <div className="lg:text-right space-y-3">
        <div>
          <div className="font-mono-tabular text-2xl sm:text-3xl font-bold text-[var(--accent-primary)]">
            {formatCurrency(kos.price)}
          </div>
          <div className="text-xs text-[var(--ink-secondary)]">per bulan</div>
        </div>
        <div className="flex flex-wrap lg:justify-end gap-2.5">
          <button
            type="button"
            onClick={onRefresh}
            disabled={isRefreshing}
            className="px-4 py-2 rounded-[10px] text-xs font-semibold border border-[var(--border-stone)] bg-[var(--bg-surface)] text-[var(--ink-primary)] hover:border-[var(--accent-primary)] transition-colors disabled:opacity-50 cursor-pointer"
          >
            {isRefreshing ? 'Memuat...' : 'Refresh'}
          </button>
          <button
            type="button"
            onClick={onEdit}
            className="px-5 py-2 rounded-[10px] text-xs font-semibold bg-[var(--accent-primary)] text-white hover:bg-[var(--accent-primary-hover)] transition-colors cursor-pointer"
          >
            Edit Kos
          </button>
        </div>
      </div>
    </div>
  </div>
);
