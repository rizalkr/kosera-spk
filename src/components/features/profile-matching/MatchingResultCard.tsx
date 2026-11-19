'use client';

import type { KosMatchingResult } from '@/types/profile-matching';
import UnifiedKosCard from '@/components/molecules/UnifiedKosCard';

interface MatchingResultCardProps {
  kos: KosMatchingResult;
  showDetails?: boolean;
  rank?: number;
  isHighlighted?: boolean;
  onHoverChange?: (kosId: number | null) => void;
}

/**
 * Adapter rendering SPK Profile Matching results through UnifiedKosCard
 * with progressive 4-criteria score disclosure and compare dock integration.
 */
export const MatchingResultCard = ({
  kos,
  showDetails = true,
  rank,
  isHighlighted = false,
  onHoverChange,
}: MatchingResultCardProps) => {
  const primaryPhoto =
    kos.photos?.find((photo) => photo.isPrimary)?.url || kos.photos?.[0]?.url;

  const facilities = kos.facilities
    ? kos.facilities
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean)
    : [];

  return (
    <UnifiedKosCard
      id={kos.id}
      name={kos.name}
      description={kos.description}
      price={kos.price}
      address={kos.address}
      city={kos.city}
      imageUrl={primaryPhoto}
      rating={parseFloat(kos.averageRating || '0')}
      reviewCount={kos.reviewCount}
      facilities={facilities}
      availableRooms={kos.availableRooms}
      totalRooms={kos.totalRooms}
      distance={kos.distance}
      matchingScore={kos.matchingScore}
      matchingDetails={showDetails ? kos.matchingDetails : undefined}
      rank={rank}
      isTopMatch={rank === 1}
      isHighlighted={isHighlighted}
      onHoverChange={onHoverChange}
      layout="horizontal"
    />
  );
};

export default MatchingResultCard;
