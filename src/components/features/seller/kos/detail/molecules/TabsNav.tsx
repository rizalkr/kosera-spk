import React from 'react';
import { SellerKosTab } from '@/hooks/seller/kos/useSellerKosDetailView';

export interface TabsNavProps {
  activeTab: SellerKosTab;
  onChange: (t: SellerKosTab) => void;
}

const tabs: { id: SellerKosTab; label: string }[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'bookings', label: 'Booking' },
  { id: 'analytics', label: 'Analitik' },
  { id: 'settings', label: 'Pengaturan' },
];

export const TabsNav: React.FC<TabsNavProps> = ({ activeTab, onChange }) => (
  <div className="border-b border-[var(--border-stone)] bg-[var(--bg-surface)]">
    <nav className="flex overflow-x-auto gap-6 px-6 sm:px-8" aria-label="Tab detail kos">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          type="button"
          onClick={() => onChange(tab.id)}
          className={`py-4 px-1 border-b-2 text-xs sm:text-sm font-semibold whitespace-nowrap transition-colors cursor-pointer ${
            activeTab === tab.id
              ? 'border-[var(--accent-primary)] text-[var(--accent-primary)]'
              : 'border-transparent text-[var(--ink-secondary)] hover:text-[var(--ink-primary)]'
          }`}
        >
          {tab.label}
        </button>
      ))}
    </nav>
  </div>
);
