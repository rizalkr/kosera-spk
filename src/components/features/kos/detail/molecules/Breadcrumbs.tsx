import Link from 'next/link';
import React from 'react';

export interface BreadcrumbsProps {
  kosName: string;
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ kosName }) => (
  <nav className="mb-5" aria-label="Breadcrumb">
    <ol className="flex flex-wrap items-center gap-1.5 text-xs sm:text-sm text-[var(--ink-secondary)]">
      <li>
        <Link
          href="/"
          className="hover:text-[var(--accent-primary)] transition-colors"
        >
          Beranda
        </Link>
      </li>
      <li aria-hidden="true">
        <svg
          className="w-3.5 h-3.5 text-[var(--ink-secondary)]/70"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.75}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="m9 18 6-6-6-6" />
        </svg>
      </li>
      <li>
        <Link
          href="/list"
          className="hover:text-[var(--accent-primary)] transition-colors"
        >
          Daftar Kos
        </Link>
      </li>
      <li aria-hidden="true">
        <svg
          className="w-3.5 h-3.5 text-[var(--ink-secondary)]/70"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.75}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="m9 18 6-6-6-6" />
        </svg>
      </li>
      <li
        className="font-semibold text-[var(--ink-primary)] truncate max-w-[260px] sm:max-w-md"
        aria-current="page"
      >
        {kosName}
      </li>
    </ol>
  </nav>
);
