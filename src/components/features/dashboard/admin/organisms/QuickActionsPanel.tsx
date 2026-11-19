import React from 'react';
import Link from 'next/link';

interface QuickAction {
  label: string;
  description: string;
  icon: React.ReactNode;
  href: string;
}

export interface QuickActionsPanelProps {
  actions?: QuickAction[];
}

const defaultActions: QuickAction[] = [
  {
    label: 'Kelola Users',
    description: 'Lihat, tambah, dan atur peran akun',
    href: '/admin/users',
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 00-3-3.87" />
        <path d="M16 3.13a4 4 0 010 7.75" />
      </svg>
    ),
  },
  {
    label: 'Kelola Kos',
    description: 'Moderasi listing dan status unggulan',
    href: '/admin/kos',
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
      </svg>
    ),
  },
  {
    label: 'Kelola Booking',
    description: 'Pantau seluruh status transaksi sewa',
    href: '/admin/bookings',
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
        <line x1="16" y1="2" x2="16" y2="6" />
        <line x1="8" y1="2" x2="8" y2="6" />
        <line x1="3" y1="10" x2="21" y2="10" />
      </svg>
    ),
  },
  {
    label: 'Tambah Pengguna',
    description: 'Daftarkan akun admin, seller, atau renter',
    href: '/admin/users/create',
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
        <circle cx="8.5" cy="7" r="4" />
        <line x1="20" y1="8" x2="20" y2="14" />
        <line x1="23" y1="11" x2="17" y2="11" />
      </svg>
    ),
  },
];

export const QuickActionsPanel: React.FC<QuickActionsPanelProps> = ({
  actions = defaultActions,
}) => (
  <section className="mt-8 bg-[var(--bg-surface)] border border-[var(--border-stone)] rounded-[16px] p-6">
    <h2 className="text-base font-bold text-[var(--ink-primary)] mb-4">Aksi Cepat</h2>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {actions.map((action) => (
        <Link
          key={action.href}
          href={action.href}
          className="group bg-[var(--bg-canvas)] border border-[var(--border-stone)] hover:border-[var(--accent-primary)] rounded-[14px] p-4 transition-colors space-y-2.5"
        >
          <div
            className="h-9 w-9 rounded-[10px] bg-[var(--accent-tint)] text-[var(--accent-primary)] group-hover:bg-[var(--accent-primary)] group-hover:text-white flex items-center justify-center transition-colors"
            aria-hidden="true"
          >
            {action.icon}
          </div>
          <div>
            <div className="text-sm font-bold text-[var(--ink-primary)] group-hover:text-[var(--accent-primary)] transition-colors">
              {action.label}
            </div>
            <div className="text-xs text-[var(--ink-secondary)] mt-0.5">{action.description}</div>
          </div>
        </Link>
      ))}
    </div>
  </section>
);
