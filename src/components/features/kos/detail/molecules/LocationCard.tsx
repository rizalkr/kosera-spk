'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import type { MapKosMarkerItem } from '@/components/features/maps/RealMap';

const LeafletMap = dynamic(
  () => import('@/components/features/maps/RealMap'),
  {
    ssr: false,
    loading: () => (
      <div className="h-full w-full flex items-center justify-center bg-[var(--bg-canvas)] text-xs text-[var(--ink-secondary)]">
        Memuat peta lokasi...
      </div>
    ),
  }
);

export interface LocationCardProps {
  address: string;
  city: string;
  latitude?: number;
  longitude?: number;
  kosId?: number;
  kosName?: string;
  price?: number;
}

export const LocationCard: React.FC<LocationCardProps> = ({
  address,
  city,
  latitude,
  longitude,
  kosId,
  kosName,
  price,
}) => {
  if (
    typeof latitude !== 'number' ||
    typeof longitude !== 'number' ||
    !Number.isFinite(latitude) ||
    !Number.isFinite(longitude)
  ) {
    return null;
  }

  const markerItems: MapKosMarkerItem[] =
    typeof kosId === 'number' &&
    typeof kosName === 'string' &&
    typeof price === 'number'
      ? [
          {
            id: kosId,
            name: kosName,
            price,
            address,
            city,
            latitude,
            longitude,
          },
        ]
      : [];

  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    `${latitude},${longitude}`
  )}`;

  return (
    <section
      aria-label="Lokasi kos"
      className="rounded-[16px] bg-[var(--bg-canvas)] border border-[var(--border-stone)] p-5 space-y-3"
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h3 className="text-base font-bold text-[var(--ink-primary)]">
            Lokasi &amp; Sekitar
          </h3>
          <p className="text-xs sm:text-sm text-[var(--ink-secondary)] mt-0.5">
            {address}, {city}
          </p>
        </div>
        <a
          href={googleMapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[10px] text-xs font-semibold border border-[var(--border-stone)] bg-[var(--bg-surface)] text-[var(--ink-primary)] hover:border-[var(--accent-primary)] hover:text-[var(--accent-primary)] transition-colors"
        >
          <span>Buka di Google Maps</span>
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
            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
            <polyline points="15 3 21 3 21 9" />
            <line x1="10" y1="14" x2="21" y2="3" />
          </svg>
        </a>
      </div>

      <div className="h-60 rounded-[14px] overflow-hidden border border-[var(--border-stone)] bg-[var(--bg-muted)]">
        <LeafletMap
          position={[latitude, longitude]}
          kosItems={markerItems}
          activeKosId={kosId ?? null}
        />
      </div>
    </section>
  );
};
