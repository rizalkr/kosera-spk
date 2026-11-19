'use client';

import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { formatRupiah } from '@/lib/utils/discovery';
import type { MapKosMarkerItem } from './RealMap';

const SEMARANG_FALLBACK_CENTER: [number, number] = [-6.9825, 110.43];

const LeafletMap = dynamic(() => import('./RealMap'), {
  ssr: false,
  loading: () => (
    <div className="h-full w-full flex items-center justify-center bg-[var(--bg-canvas)] text-xs text-[var(--ink-secondary)]">
      Memuat peta interaktif...
    </div>
  ),
});

export interface MapSectionProps {
  kosItems?: MapKosMarkerItem[];
  activeKosId?: number | null;
  topKosId?: number | null;
  onHoverKos?: (id: number | null) => void;
  onSelectKos?: (id: number) => void;
  className?: string;
  heightClassName?: string;
}

export default function MapSection({
  kosItems = [],
  activeKosId = null,
  topKosId = null,
  onHoverKos,
  onSelectKos,
  className = '',
  heightClassName = 'h-80',
}: MapSectionProps) {
  const [position, setPosition] = useState<[number, number] | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setPosition([pos.coords.latitude, pos.coords.longitude]);
        },
        () => {
          setPosition(SEMARANG_FALLBACK_CENTER);
        },
        { timeout: 4000 }
      );
    } else {
      setPosition(SEMARANG_FALLBACK_CENTER);
    }
  }, []);

  const mappedCount = kosItems.filter(
    (item) =>
      typeof item.latitude === 'number' &&
      typeof item.longitude === 'number' &&
      Number.isFinite(item.latitude) &&
      Number.isFinite(item.longitude)
  ).length;

  const activeItem =
    kosItems.find((item) => item.id === activeKosId) ||
    (kosItems.length > 0 ? kosItems[0] : null);

  return (
    <section
      aria-label="Peta lokasi kos"
      className={`bg-[var(--bg-surface)] border border-[var(--border-stone)] rounded-[20px] p-4 space-y-3 ${className}`}
    >
      <div className="flex items-center justify-between gap-2">
        <div>
          <h3 className="text-sm font-bold text-[var(--ink-primary)]">
            Peta Lokasi Kos
          </h3>
          <p className="text-xs text-[var(--ink-secondary)]">
            Koridor Semarang &amp; sekitarnya
          </p>
        </div>
        <span className="font-mono-tabular text-xs font-semibold px-2.5 py-1 rounded-full bg-[var(--accent-tint)] text-[var(--accent-primary)]">
          {mappedCount > 0 ? `${mappedCount} pin` : 'Semarang'}
        </span>
      </div>

      <div
        className={`relative ${heightClassName} rounded-[14px] overflow-hidden border border-[var(--border-stone)] bg-[var(--bg-canvas)]`}
      >
        {position ? (
          <LeafletMap
            position={position}
            kosItems={kosItems}
            activeKosId={activeKosId}
            topKosId={topKosId}
            onHoverKos={onHoverKos}
            onSelectKos={onSelectKos}
          />
        ) : (
          <div className="h-full flex items-center justify-center text-xs text-[var(--ink-secondary)]">
            Memuat lokasi...
          </div>
        )}
      </div>

      {/* Synchronized Inspector Bar */}
      {activeItem ? (
        <div className="rounded-[12px] bg-[var(--bg-canvas)] border border-[var(--border-stone)] p-3 flex items-center justify-between gap-3">
          <div className="min-w-0">
            <div className="text-xs font-bold text-[var(--ink-primary)] truncate">
              {activeItem.name}
            </div>
            <div className="font-mono-tabular text-xs font-semibold text-[var(--accent-primary)] mt-0.5">
              {formatRupiah(activeItem.price)}/bln
            </div>
          </div>
          <Link
            href={`/kos/${activeItem.id}/view`}
            className="shrink-0 px-3 py-1.5 rounded-[8px] text-xs font-semibold bg-[var(--bg-surface)] border border-[var(--border-stone)] text-[var(--ink-primary)] hover:border-[var(--accent-primary)] hover:text-[var(--accent-primary)] transition-colors"
          >
            Lihat Detail
          </Link>
        </div>
      ) : (
        <div className="rounded-[12px] bg-[var(--bg-canvas)] border border-[var(--border-stone)] p-3 text-xs text-[var(--ink-secondary)]">
          Arahkan kursor ke kartu atau pin harga untuk melihat lokasi kos.
        </div>
      )}
    </section>
  );
}
