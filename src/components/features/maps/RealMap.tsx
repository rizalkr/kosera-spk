'use client';

import { useEffect, useMemo } from 'react';
import Link from 'next/link';
import { MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { formatCompactPricePin, formatRupiah } from '@/lib/utils/discovery';

export const SEMARANG_DEFAULT_CENTER: [number, number] = [-6.9825, 110.43];

export interface MapKosMarkerItem {
  id: number;
  name: string;
  price: number;
  address: string;
  city: string;
  latitude?: number | null;
  longitude?: number | null;
  averageRating?: string | number;
  reviewCount?: number;
  matchingScore?: number;
  imageUrl?: string;
}

interface RealMapProps {
  position: [number, number];
  kosItems?: MapKosMarkerItem[];
  activeKosId?: number | null;
  topKosId?: number | null;
  onHoverKos?: (id: number | null) => void;
  onSelectKos?: (id: number) => void;
}

function isValidCoordinate(
  lat?: number | null,
  lng?: number | null
): lat is number {
  return (
    typeof lat === 'number' &&
    typeof lng === 'number' &&
    Number.isFinite(lat) &&
    Number.isFinite(lng) &&
    lat >= -90 &&
    lat <= 90 &&
    lng >= -180 &&
    lng <= 180
  );
}

function MapCenterController({
  activeLat,
  activeLng,
}: {
  activeLat?: number;
  activeLng?: number;
}) {
  const map = useMap();

  useEffect(() => {
    if (
      typeof activeLat === 'number' &&
      typeof activeLng === 'number' &&
      Number.isFinite(activeLat) &&
      Number.isFinite(activeLng)
    ) {
      const target = L.latLng(activeLat, activeLng);
      if (!map.getBounds().contains(target)) {
        map.panTo(target, { animate: true, duration: 0.45 });
      }
    }
  }, [activeLat, activeLng, map]);

  return null;
}

function createPricePinIcon(
  price: number,
  isActive: boolean,
  isTop: boolean
): L.DivIcon {
  const label = formatCompactPricePin(price);
  const classes = [
    'kosera-price-pin',
    isActive ? 'is-active' : '',
    !isActive && isTop ? 'is-top' : '',
  ]
    .filter(Boolean)
    .join(' ');

  return L.divIcon({
    className: 'kosera-price-pin-wrapper',
    html: `<span class="${classes}">${label}</span>`,
    iconSize: [86, 28],
    iconAnchor: [43, 14],
    popupAnchor: [0, -14],
  });
}

function createFallbackCenterIcon(): L.DivIcon {
  return L.divIcon({
    className: 'kosera-price-pin-wrapper',
    html: '<span style="display:block;width:16px;height:16px;border-radius:9999px;background:#1E6B52;border:3px solid #FFFFFF;box-shadow:0 3px 10px rgba(24,26,24,0.28);"></span>',
    iconSize: [16, 16],
    iconAnchor: [8, 8],
    popupAnchor: [0, -10],
  });
}

export default function RealMap({
  position,
  kosItems = [],
  activeKosId = null,
  topKosId = null,
  onHoverKos,
  onSelectKos,
}: RealMapProps) {
  const isValidPosition =
    Array.isArray(position) &&
    position.length === 2 &&
    isValidCoordinate(position[0], position[1]);

  const validMarkers = useMemo(
    () =>
      kosItems.filter(
        (
          item
        ): item is MapKosMarkerItem & { latitude: number; longitude: number } =>
          isValidCoordinate(item.latitude, item.longitude)
      ),
    [kosItems]
  );

  const initialCenter: [number, number] = useMemo(() => {
    if (validMarkers.length > 0) {
      return [validMarkers[0].latitude, validMarkers[0].longitude];
    }
    return isValidPosition ? position : SEMARANG_DEFAULT_CENTER;
  }, [validMarkers, isValidPosition, position]);

  const activeMarker = validMarkers.find((item) => item.id === activeKosId);

  if (!isValidPosition && validMarkers.length === 0) {
    return (
      <div className="flex items-center justify-center h-full w-full text-sm text-[var(--accent-danger)] bg-[var(--bg-canvas)]">
        Lokasi tidak valid
      </div>
    );
  }

  return (
    <MapContainer
      center={initialCenter}
      zoom={14}
      className="h-full w-full kosera-leaflet-map"
      style={{ zIndex: 0 }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <MapCenterController
        activeLat={activeMarker?.latitude}
        activeLng={activeMarker?.longitude}
      />

      {validMarkers.length > 0 ? (
        validMarkers.map((kos) => {
          const isActive = activeKosId === kos.id;
          const isTop = topKosId === kos.id;
          const ratingValue =
            typeof kos.averageRating === 'string'
              ? parseFloat(kos.averageRating)
              : kos.averageRating;

          return (
            <Marker
              key={kos.id}
              position={[kos.latitude, kos.longitude]}
              icon={createPricePinIcon(kos.price, isActive, isTop)}
              zIndexOffset={isActive ? 500 : isTop ? 250 : 0}
              eventHandlers={{
                mouseover: () => onHoverKos?.(kos.id),
                mouseout: () => onHoverKos?.(null),
                click: () => onSelectKos?.(kos.id),
              }}
            >
              <Popup className="kosera-map-popup">
                <div className="min-w-[190px] space-y-1.5 p-1">
                  <div className="text-xs font-bold text-[var(--ink-primary)] leading-snug">
                    {kos.name}
                  </div>
                  <div className="text-[11px] text-[var(--ink-secondary)]">
                    {kos.address}, {kos.city}
                  </div>
                  <div className="flex items-center justify-between gap-2 pt-1">
                    <span className="font-mono-tabular text-xs font-bold text-[var(--accent-primary)]">
                      {formatRupiah(kos.price)}/bln
                    </span>
                    {typeof ratingValue === 'number' && ratingValue > 0 && (
                      <span className="font-mono-tabular text-[11px] text-[var(--ink-secondary)]">
                        {ratingValue.toFixed(1)} ({kos.reviewCount ?? 0})
                      </span>
                    )}
                  </div>
                  <Link
                    href={`/kos/${kos.id}/view`}
                    className="mt-1.5 block w-full text-center py-1.5 px-2.5 rounded-[8px] text-xs font-semibold bg-[var(--accent-primary)] text-white hover:bg-[var(--accent-primary-hover)]"
                  >
                    Lihat Detail
                  </Link>
                </div>
              </Popup>
            </Marker>
          );
        })
      ) : (
        <Marker position={initialCenter} icon={createFallbackCenterIcon()}>
          <Popup className="kosera-map-popup">
            <span className="text-xs font-medium text-[var(--ink-primary)]">
              Area Pencarian Semarang
            </span>
          </Popup>
        </Marker>
      )}
    </MapContainer>
  );
}
