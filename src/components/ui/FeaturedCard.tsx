'use client';

import UnifiedKosCard from '@/components/molecules/UnifiedKosCard';
import { parsePriceValue } from '@/lib/utils/discovery';

export interface FeaturedCardProps {
  id: number;
  images: string[];
  price: string;
  description: string;
  area: string;
  city: string;
  rating?: number;
  reviewCount?: number;
  facilities?: string[];
  isFavorite?: boolean;
  name?: string;
  availableRooms?: number;
  totalRooms?: number;
  aiSimilarity?: number;
  isHighlighted?: boolean;
  onHoverChange?: (kosId: number | null) => void;
  layout?: 'vertical' | 'horizontal';
}

export default function FeaturedCard({
  id,
  images,
  price,
  description,
  area,
  city,
  rating,
  reviewCount = 0,
  facilities = [],
  isFavorite = false,
  name,
  availableRooms,
  totalRooms,
  aiSimilarity,
  isHighlighted = false,
  onHoverChange,
  layout = 'vertical',
}: FeaturedCardProps) {
  const displayName = name || description || 'Kos Semarang';
  const secondaryDescription = name && description && description !== name ? description : undefined;
  const explicitImageUrl = images.length > 0 ? images[0] : undefined;

  return (
    <UnifiedKosCard
      id={id}
      name={displayName}
      description={secondaryDescription}
      price={parsePriceValue(price)}
      address={area}
      city={city}
      imageUrl={explicitImageUrl}
      rating={rating}
      reviewCount={reviewCount}
      facilities={facilities}
      availableRooms={availableRooms}
      totalRooms={totalRooms}
      aiSimilarity={aiSimilarity}
      isFavorite={isFavorite}
      isHighlighted={isHighlighted}
      onHoverChange={onHoverChange}
      layout={layout}
    />
  );
}
