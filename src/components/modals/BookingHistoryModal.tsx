'use client';

import { clsx } from 'clsx';
import { AdminBookingHistoryItem, BookingStatus } from '@/types';

export interface BookingHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookingId: number | null;
  loading: boolean;
  error: string | null;
  items: AdminBookingHistoryItem[];
}

const statusBadge = (status: BookingStatus) =>
  clsx(
    'inline-flex px-2 py-1 text-xs font-semibold rounded-full capitalize',
    status === 'pending'
      ? 'bg-yellow-100 text-yellow-800'
      : status === 'confirmed'
      ? 'bg-green-100 text-green-800'
      : status === 'cancelled'
      ? 'bg-red-100 text-red-800'
      : status === 'completed'
      ? 'bg-blue-100 text-blue-800'
      : 'bg-gray-100 text-gray-800'
  );

export const BookingHistoryModal = ({ isOpen, onClose, bookingId, loading, error, items }: BookingHistoryModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50">
      {/* Subtle overlay with blur, not fully dark */}
      <div className="absolute inset-0 backdrop-blur-[2px] bg-black/10" onClick={onClose} />
      {/* Centered alert-like card */}
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-2xl w-full max-w-xl max-h-[75vh] overflow-y-auto border border-gray-200 animate-in fade-in zoom-in-95 duration-150">
          <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-800">Booking History {bookingId ? `#${bookingId}` : ''}</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl leading-none">×</button>
          </div>

          <div className="p-4">
          {loading ? (
            <div className="text-center py-10">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-3"></div>
              <div className="text-gray-500">Loading history...</div>
            </div>
          ) : error ? (
            <div className="text-center py-10">
              <div className="text-red-600 font-semibold mb-2">Failed to load history</div>
              <div className="text-gray-600">{error}</div>
            </div>
          ) : items.length === 0 ? (
            <div className="text-center py-10 text-gray-500">No history entries found</div>
          ) : (
            <ul className="space-y-3">
              {items.map((item) => (
                <li key={item.id} className="p-3 border border-gray-200 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-sm text-gray-500">{new Date(item.createdAt).toLocaleString()}</div>
                    <div className="text-xs text-gray-500">
                      {item.changedBy ? (
                        <span>by {item.changedBy.name} (@{item.changedBy.username})</span>
                      ) : (
                        <span>by system</span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className={statusBadge(item.previousStatus)}> {item.previousStatus} </span>
                    <span className="text-gray-400">→</span>
                    <span className={statusBadge(item.newStatus)}> {item.newStatus} </span>
                  </div>
                  {item.notes && (
                    <div className="mt-2 text-sm text-gray-600">
                      <span className="font-medium">Notes:</span> {item.notes}
                    </div>
                  )}
                </li>
              ))}
            </ul>
          )}
          </div>
          <div className="p-3 border-t border-gray-200 bg-gray-50 flex justify-end">
            <button onClick={onClose} className="px-3 py-1.5 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100">Close</button>
          </div>
        </div>
      </div>
    </div>
  );
};

// no default export per project conventions
