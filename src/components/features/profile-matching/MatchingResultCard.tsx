'use client';

import Link from 'next/link';
import type { KosMatchingResult } from '@/types/profile-matching';
import KosImage from '@/components/ui/KosImage';

/**
 * Props for MatchingResultCard component
 */
interface MatchingResultCardProps {
  kos: KosMatchingResult;
  showDetails?: boolean;
}

/**
 * Card component to display a kos with its matching score
 */
export const MatchingResultCard = ({ kos, showDetails = true }: MatchingResultCardProps) => {
  const scoreColor = kos.matchingScore >= 4 ? 'text-green-600' : 
                     kos.matchingScore >= 3 ? 'text-yellow-600' : 'text-red-600';
  
  const scoreBgColor = kos.matchingScore >= 4 ? 'bg-green-100' : 
                       kos.matchingScore >= 3 ? 'bg-yellow-100' : 'bg-red-100';

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <div className="flex flex-col md:flex-row">
        {/* Image */}
        <div className="w-full md:w-48 h-48 md:h-auto relative">
          <KosImage
            kosId={kos.id}
            kosName={kos.name}
            className="w-full h-full object-cover"
          />
          {/* Matching Score Badge */}
          <div className={`absolute top-2 right-2 ${scoreBgColor} px-3 py-1 rounded-full`}>
            <span className={`text-sm font-bold ${scoreColor}`}>
              {kos.matchingScore.toFixed(2)}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 p-4">
          <div className="flex items-start justify-between mb-2">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 hover:text-blue-600">
                <Link href={`/kos/${kos.id}/view`}>{kos.name}</Link>
              </h3>
              <p className="text-sm text-gray-500">{kos.address}, {kos.city}</p>
            </div>
            <div className="text-right">
              <p className="text-lg font-bold text-blue-600">
                Rp {kos.price.toLocaleString('id-ID')}
              </p>
              <p className="text-xs text-gray-500">/bulan</p>
            </div>
          </div>

          {/* Rating and Stats */}
          <div className="flex items-center gap-4 mb-3 text-sm">
            <div className="flex items-center">
              <svg className="w-4 h-4 text-yellow-400 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span className="font-medium">{parseFloat(kos.averageRating).toFixed(1)}</span>
              <span className="text-gray-400 ml-1">({kos.reviewCount})</span>
            </div>
            <span className="text-gray-300">|</span>
            <span className="text-gray-600">
              {kos.availableRooms} kamar tersedia
            </span>
            {kos.distance !== undefined && (
              <>
                <span className="text-gray-300">|</span>
                <span className="text-gray-600">
                  {kos.distance.toFixed(1)} km
                </span>
              </>
            )}
          </div>

          {/* Facilities */}
          {kos.facilities && (
            <div className="flex flex-wrap gap-1 mb-3">
              {kos.facilities.split(',').slice(0, 4).map((facility, index) => (
                <span
                  key={index}
                  className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full"
                >
                  {facility.trim()}
                </span>
              ))}
              {kos.facilities.split(',').length > 4 && (
                <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full">
                  +{kos.facilities.split(',').length - 4} lainnya
                </span>
              )}
            </div>
          )}

          {/* Matching Details */}
          {showDetails && (
            <div className="border-t pt-3 mt-3">
              <p className="text-xs font-medium text-gray-500 mb-2">Detail Kecocokan:</p>
              <div className="grid grid-cols-4 gap-2">
                <div className="text-center">
                  <div className="text-xs text-gray-400">Harga</div>
                  <div className="text-sm font-medium text-gray-700">
                    {kos.matchingDetails.priceScore.toFixed(1)}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-xs text-gray-400">Lokasi</div>
                  <div className="text-sm font-medium text-gray-700">
                    {kos.matchingDetails.locationScore.toFixed(1)}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-xs text-gray-400">Fasilitas</div>
                  <div className="text-sm font-medium text-gray-700">
                    {kos.matchingDetails.facilitiesScore.toFixed(1)}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-xs text-gray-400">Rating</div>
                  <div className="text-sm font-medium text-gray-700">
                    {kos.matchingDetails.ratingScore.toFixed(1)}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Action Button */}
          <div className="mt-4">
            <Link
              href={`/kos/${kos.id}/view`}
              className="inline-block w-full text-center bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors"
            >
              Lihat Detail
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MatchingResultCard;
