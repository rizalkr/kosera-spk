'use client';

import { useState } from 'react';
import Link from 'next/link';
import Header from '@/components/layouts/Header';
import Footer from '@/components/layouts/Footer';
import BookingModal from '@/components/modals/BookingModal';
import ImageModal from '@/components/modals/ImageModal';
import { Breadcrumbs } from '@/components/features/kos/detail/molecules/Breadcrumbs';
import { ImageGallery } from '@/components/features/kos/detail/molecules/ImageGallery';
import { FacilitiesList } from '@/components/features/kos/detail/molecules/FacilitiesList';
import { LocationCard } from '@/components/features/kos/detail/molecules/LocationCard';
import { ReviewsSection } from '@/components/features/kos/detail/organisms/ReviewsSection';
import { SidebarPanel } from '@/components/features/kos/detail/organisms/SidebarPanel';
import { RatingStars } from '@/components/features/kos/detail/atoms/RatingStars';
import { useKosDetailView } from '@/hooks/kos/useKosDetailView';
import { useCompare } from '@/contexts/CompareContext';
import type { PublicKosData } from '@/types/kos';

interface Review {
  id: number;
  rating: number;
  comment: string;
  createdAt: string;
  user: { id: number; name: string; username: string };
}

function KosDetailPage() {
  const {
    kos,
    isLoading,
    error,
    isFavorited,
    isAuthenticated,
    displayImages,
    activeImageIndex,
    showBookingModal,
    showImageModal,
    handlers,
  } = useKosDetailView();

  const { isCompared, toggleCompare, maxReached } = useCompare();
  const [selectedDuration, setSelectedDuration] = useState<number>(1);

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

  if (isLoading) {
    return (
      <div className="min-h-[100dvh] bg-[var(--bg-canvas)] pt-16 flex flex-col">
        <Header />
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-4 bg-[var(--bg-muted)] rounded w-64" />
            <div className="bg-[var(--bg-surface)] border border-[var(--border-stone)] rounded-[20px] p-4 sm:p-6 lg:p-8 space-y-8">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-3">
                <div className="lg:col-span-7 aspect-[4/3] bg-[var(--bg-muted)] rounded-[16px]" />
                <div className="lg:col-span-5 grid grid-cols-2 lg:grid-cols-1 gap-3">
                  <div className="aspect-[4/3] lg:aspect-auto bg-[var(--bg-muted)] rounded-[16px]" />
                  <div className="aspect-[4/3] lg:aspect-auto bg-[var(--bg-muted)] rounded-[16px]" />
                </div>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                <div className="lg:col-span-7 space-y-4">
                  <div className="h-8 bg-[var(--bg-muted)] rounded w-2/3" />
                  <div className="h-4 bg-[var(--bg-muted)] rounded w-full" />
                  <div className="h-4 bg-[var(--bg-muted)] rounded w-4/5" />
                </div>
                <div className="lg:col-span-5 h-72 bg-[var(--bg-muted)] rounded-[16px]" />
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !kos) {
    return (
      <div className="min-h-[100dvh] bg-[var(--bg-canvas)] pt-16 flex flex-col">
        <Header />
        <main className="flex-1 max-w-3xl w-full mx-auto px-4 sm:px-6 py-12">
          <div className="bg-[var(--bg-surface)] border border-[var(--border-stone)] rounded-[20px] p-10 text-center space-y-4">
            <svg
              className="w-10 h-10 mx-auto text-[var(--accent-danger)]"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.75}
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="15" y1="9" x2="9" y2="15" />
              <line x1="9" y1="9" x2="15" y2="15" />
            </svg>
            <h1 className="text-2xl font-bold text-[var(--ink-primary)]">
              Kos Tidak Ditemukan
            </h1>
            <p className="text-sm text-[var(--ink-secondary)]">
              Maaf, kos yang Anda cari tidak tersedia atau telah dihapus.
            </p>
            <Link
              href="/"
              className="inline-block px-5 py-2.5 rounded-[10px] text-xs font-semibold bg-[var(--accent-primary)] text-white hover:bg-[var(--accent-primary-hover)] transition-colors"
            >
              Kembali ke Beranda
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const reviewsData = kos.reviews?.data || [];
  const reviewStats = kos.reviews?.statistics;
  const reviewPagination = kos.reviews?.pagination;

  const averageRatingNumber =
    typeof reviewStats?.averageRating === 'string'
      ? parseFloat(reviewStats.averageRating)
      : typeof reviewStats?.averageRating === 'number'
        ? reviewStats.averageRating
        : undefined;

  const totalRooms = kos.totalRooms ?? 0;
  const occupiedRooms = kos.occupiedRooms ?? 0;
  const availableRooms =
    totalRooms > 0 ? Math.max(0, totalRooms - occupiedRooms) : undefined;

  const facilitiesList = kos.facilities
    ? kos.facilities
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean)
    : [];

  const compared = isCompared(kos.id);

  const handleToggleCompare = () => {
    toggleCompare({
      id: kos.id,
      name: kos.name,
      address: kos.address,
      city: kos.city,
      price: kos.price,
      imageUrl: displayImages[0],
      averageRating: averageRatingNumber,
      reviewCount: reviewStats?.totalReviews ?? 0,
      facilities: facilitiesList,
      availableRooms,
      totalRooms,
    });
  };

  const bookingKos: PublicKosData = {
    id: kos.id,
    name: kos.name,
    description: kos.description,
    price: kos.price,
    address: kos.address,
    city: kos.city,
    facilities: kos.facilities ?? '',
    totalRooms,
    occupiedRooms,
    latitude: kos.latitude ?? undefined,
    longitude: kos.longitude ?? undefined,
    owner: {
      id: kos.owner?.id ?? 0,
      username: kos.owner?.username ?? 'unknown',
      fullName:
        (kos.owner && 'fullName' in kos.owner
          ? (kos.owner as { fullName?: string }).fullName
          : undefined) ||
        kos.owner?.name ||
        kos.owner?.username ||
        'Unknown',
      contact: kos.owner?.contact || '',
    },
    averageRating: (reviewStats?.averageRating ?? '0').toString(),
    reviewCount: reviewStats?.totalReviews ?? 0,
    photos: [],
    createdAt:
      'createdAt' in kos
        ? (kos as { createdAt: string }).createdAt
        : new Date().toISOString(),
    updatedAt:
      'updatedAt' in kos
        ? (kos as { updatedAt: string }).updatedAt
        : new Date().toISOString(),
  };

  return (
    <div className="min-h-[100dvh] bg-[var(--bg-canvas)] text-[var(--ink-primary)] pt-16 flex flex-col">
      <Header />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 pb-28">
        <Breadcrumbs kosName={kos.name} />

        <div className="bg-[var(--bg-surface)] border border-[var(--border-stone)] rounded-[20px] p-4 sm:p-6 lg:p-8 space-y-8">
          {/* Asymmetric Editorial Media Header */}
          <ImageGallery
            images={displayImages}
            activeIndex={activeImageIndex}
            onImageClick={handlers.onImageClick}
            kosName={kos.name}
          />

          {/* 2-Column Editorial Split */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Content Column */}
            <div className="lg:col-span-7 space-y-8">
              <div className="space-y-3 pb-6 border-b border-[var(--border-stone)]">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[var(--bg-muted)] text-[var(--ink-primary)]">
                    {kos.city || 'Semarang'}
                  </span>
                  {typeof availableRooms === 'number' && (
                    <span className="font-mono-tabular px-3 py-1 rounded-full text-xs font-medium bg-[var(--accent-tint)] text-[var(--accent-primary)]">
                      {availableRooms} dari {totalRooms} kamar tersedia
                    </span>
                  )}
                  <span className="font-mono-tabular px-3 py-1 rounded-full text-xs font-medium bg-[var(--bg-canvas)] border border-[var(--border-stone)] text-[var(--ink-secondary)]">
                    {kos.viewCount} dilihat
                  </span>
                </div>

                <h1 className="text-2xl sm:text-3xl font-bold tracking-[-0.02em] text-[var(--ink-primary)]">
                  {kos.name}
                </h1>

                <p className="text-sm sm:text-base text-[var(--ink-secondary)]">
                  {kos.address}, {kos.city}
                </p>

                {averageRatingNumber !== undefined &&
                  Number.isFinite(averageRatingNumber) &&
                  averageRatingNumber > 0 &&
                  reviewStats?.totalReviews !== undefined && (
                    <div className="flex items-center gap-2 pt-1">
                      <RatingStars
                        rating={Math.round(averageRatingNumber)}
                        size="sm"
                      />
                      <span className="font-mono-tabular text-sm font-semibold text-[var(--ink-primary)]">
                        {averageRatingNumber.toFixed(1)}
                      </span>
                      <span className="text-xs sm:text-sm text-[var(--ink-secondary)]">
                        ({reviewStats.totalReviews} ulasan)
                      </span>
                    </div>
                  )}
              </div>

              <section className="space-y-2.5">
                <h2 className="text-lg font-bold text-[var(--ink-primary)]">
                  Deskripsi Kos
                </h2>
                <p className="text-sm sm:text-base text-[var(--ink-secondary)] leading-[1.62] max-w-[65ch] whitespace-pre-line">
                  {kos.description}
                </p>
              </section>

              <FacilitiesList facilities={kos.facilities ?? undefined} />

              <LocationCard
                address={kos.address}
                city={kos.city}
                latitude={kos.latitude ?? undefined}
                longitude={kos.longitude ?? undefined}
                kosId={kos.id}
                kosName={kos.name}
                price={kos.price}
              />

              <ReviewsSection
                totalReviews={reviewStats?.totalReviews || 0}
                averageRating={reviewStats?.averageRating}
                reviews={reviewsData as Review[]}
                hasNext={reviewPagination?.hasNext || false}
                formatDate={formatDate}
              />
            </div>

            {/* Right Sticky Decision & Owner Sidebar */}
            <div className="lg:col-span-5 lg:sticky lg:top-20">
              <SidebarPanel
                owner={kos.owner}
                latitude={kos.latitude ?? undefined}
                longitude={kos.longitude ?? undefined}
                address={kos.address}
                city={kos.city}
                viewCount={kos.viewCount}
                favoriteCount={kos.favoriteCount}
                reviewCount={reviewStats?.totalReviews || 0}
                price={kos.price}
                kosId={kos.id}
                kosName={kos.name}
                averageRating={averageRatingNumber}
                availableRooms={availableRooms}
                totalRooms={totalRooms}
                isFavorited={isFavorited}
                isAuthenticated={isAuthenticated}
                isCompared={compared}
                compareDisabled={maxReached}
                selectedDuration={selectedDuration}
                onDurationChange={setSelectedDuration}
                onOpenBooking={handlers.onOpenBooking}
                onToggleFavorite={handlers.onToggleFavorite}
                onToggleCompare={handleToggleCompare}
                showLocationInSidebar={false}
              />
            </div>
          </div>
        </div>
      </main>

      <Footer />

      <BookingModal
        kos={bookingKos}
        isOpen={showBookingModal}
        initialDuration={selectedDuration}
        onClose={handlers.onCloseBooking}
        onBookingCreated={handlers.onBookingCreated}
      />

      <ImageModal
        isOpen={showImageModal}
        onClose={handlers.onCloseImageModal}
        images={displayImages}
        currentIndex={activeImageIndex}
        onImageChange={handlers.onImageModalChange}
        kosName={kos.name}
      />
    </div>
  );
}

export default KosDetailPage;
