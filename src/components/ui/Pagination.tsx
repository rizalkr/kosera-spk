// src/components/ui/Pagination.tsx
'use client';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-5 py-3.5 mt-6 bg-[var(--bg-surface)] border border-[var(--border-stone)] rounded-[16px]">
      <div className="text-xs sm:text-sm text-[var(--ink-secondary)]">
        Halaman{' '}
        <span className="font-mono-tabular font-semibold text-[var(--ink-primary)]">
          {currentPage}
        </span>{' '}
        dari{' '}
        <span className="font-mono-tabular font-semibold text-[var(--ink-primary)]">
          {totalPages}
        </span>
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-[var(--ink-primary)] bg-[var(--bg-canvas)] border border-[var(--border-stone)] rounded-[10px] hover:border-[var(--ink-secondary)] disabled:opacity-45 disabled:cursor-not-allowed transition-colors cursor-pointer"
        >
          <svg
            className="w-3.5 h-3.5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.75}
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="m15 18-6-6 6-6" />
          </svg>
          <span>Sebelumnya</span>
        </button>

        <button
          type="button"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-[var(--ink-primary)] bg-[var(--bg-canvas)] border border-[var(--border-stone)] rounded-[10px] hover:border-[var(--ink-secondary)] disabled:opacity-45 disabled:cursor-not-allowed transition-colors cursor-pointer"
        >
          <span>Selanjutnya</span>
          <svg
            className="w-3.5 h-3.5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.75}
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="m9 18 6-6-6-6" />
          </svg>
        </button>
      </div>
    </div>
  );
}
