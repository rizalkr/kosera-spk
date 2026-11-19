'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import ProtectedRoute from '@/components/layouts/ProtectedRoute';
import { useAuthToken } from '@/hooks/auth/useAuthToken';
import { useKosDetails } from '@/hooks/useApi';
import { showSuccess, showError, showConfirm, showLoading, showToast } from '@/lib/sweetalert';
import type { ApiResponse, PublicKosData } from '@/types';
import Swal from 'sweetalert2';

// API response types
interface PhotosListResponse {
  success: true;
  data: { photos: Array<{ id: number; url: string; isPrimary: boolean; caption?: string; createdAt: string }> };
  message?: string;
}
interface GenericOkResponse {
  success: true;
  message?: string;
}
interface GenericErrorResponse {
  success: false;
  error: string;
  message?: string;
}
type PhotosApiResponse = PhotosListResponse | GenericOkResponse | GenericErrorResponse;

export default function SellerKosPhotosPage() {
  const params = useParams();
  const router = useRouter();
  const { getToken } = useAuthToken();
  const kosId = params.id as string;
  
  const { data: kosResponse, isLoading, error, refetch } = useKosDetails(parseInt(kosId));
  const kosData = (kosResponse as ApiResponse<PublicKosData> | undefined)?.data;
  
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
  const [photos, setPhotos] = useState<Array<{ 
    id: number; 
    url: string; 
    isPrimary: boolean; 
    caption?: string; 
    createdAt: string; 
  }>>([]);
  const [loadingPhotos, setLoadingPhotos] = useState(true);
  const [dragActive, setDragActive] = useState(false);

  // Fetch photos
  const fetchPhotos = useCallback(async () => {
    try {
      const token = getToken();
      if (!token) return;

      const data: PhotosApiResponse = await (await import('@/lib/api/client')).apiClient.get(`/api/kos/${kosId}/photos`, undefined, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (data.success && 'data' in data) {
        setPhotos(data.data.photos || []);
      } else {
        const err = !data.success ? data.error : 'Invalid response';
        console.error('Failed to fetch photos:', err);
      }
    } catch (error) {
      console.error('Error fetching photos:', error);
    } finally {
      setLoadingPhotos(false);
    }
  }, [kosId, getToken]);

  useEffect(() => {
    if (kosId) {
      fetchPhotos();
    }
  }, [kosId, fetchPhotos]);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    validateAndSetFiles(files);
  };

  const validateAndSetFiles = (files: FileList | null) => {
    if (files) {
      // Validate file count
      if (files.length > 10) {
        showError('Maksimal 10 foto dapat diupload sekaligus');
        return;
      }

      // Validate each file
      let hasError = false;
      Array.from(files).forEach(file => {
        // Check file type
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
        if (!allowedTypes.includes(file.type)) {
          showError(`File ${file.name} bukan format gambar yang didukung`);
          hasError = true;
          return;
        }

        // Check file size (5MB)
        const maxSize = 5 * 1024 * 1024;
        if (file.size > maxSize) {
          showError(`File ${file.name} terlalu besar. Maksimal 5MB per foto`);
          hasError = true;
          return;
        }
      });

      if (!hasError) {
        setSelectedFiles(files);
      }
    }
  };

  // Drag and drop handlers
  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const files = e.dataTransfer.files;
    validateAndSetFiles(files);
  };

  const handleUpload = async () => {
    if (!selectedFiles || selectedFiles.length === 0) return;
    
    showLoading('Mengupload foto...');
    setIsUploading(true);
    
    try {
      const token = getToken();
      if (!token) {
        Swal.close();
        setIsUploading(false);
        return;
      }
      
      const formData = new FormData();
      
      Array.from(selectedFiles).forEach(file => {
        formData.append('photos', file);
      });

      // Set first photo as primary if no photos exist yet
      const isFirstUpload = photos.length === 0;
      if (isFirstUpload) {
        formData.append('isPrimary', 'true');
      }

      const data: PhotosApiResponse = await (await import('@/lib/api/client')).apiClient.request(`/api/kos/${kosId}/photos/upload`, { method: 'POST', body: formData, headers: { Authorization: `Bearer ${token}` } });
      
      if (data.success) {
        Swal.close();
        showSuccess(('message' in data && data.message) ? data.message : 'Foto berhasil diupload');
        setSelectedFiles(null);
        // Reset file input
        const fileInput = document.getElementById('photo-upload') as HTMLInputElement;
        if (fileInput) fileInput.value = '';
        // Refresh photos
        await fetchPhotos();
        // Refresh kos data to update photo count
        refetch();
      } else {
        Swal.close();
  const err = !data.success ? data.error : 'Gagal mengupload foto';
  showError(err);
      }
    } catch (error) {
      console.error('Upload error:', error);
      Swal.close();
      showError('Terjadi kesalahan saat mengupload foto');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeletePhoto = async (photoId: number) => {
    const result = await showConfirm(
      'Foto yang dihapus tidak dapat dikembalikan',
      'Hapus foto ini?',
      'Ya, Hapus',
      'Batal'
    );

    if (result.isConfirmed) {
      showLoading('Menghapus foto...');
      
      try {
        const token = getToken();
        if (!token) {
          Swal.close();
          return;
        }

  const data: PhotosApiResponse = await (await import('@/lib/api/client')).apiClient.request(`/api/kos/${kosId}/photos`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }, body: { photoId } });
        
        if (data.success) {
          Swal.close();
          showToast('Foto berhasil dihapus', 'success');
          // Refresh photos
          await fetchPhotos();
          // Refresh kos data to update photo count
          refetch();
        } else {
          Swal.close();
          const err = !data.success ? data.error : 'Gagal menghapus foto';
          showError(err);
        }
      } catch (error) {
        console.error('Delete error:', error);
        Swal.close();
        showError('Terjadi kesalahan saat menghapus foto');
      }
    }
  };

  const handleSetPrimary = async (photoId: number) => {
    const result = await showConfirm(
      'Foto ini akan menjadi foto utama yang ditampilkan pertama kali',
      'Jadikan foto utama?',
      'Ya, Jadikan Utama',
      'Batal'
    );

    if (result.isConfirmed) {
      showLoading('Mengatur foto utama...');
      
      try {
        const token = getToken();
        if (!token) {
          Swal.close();
          return;
        }
        
        const data: PhotosApiResponse = await (await import('@/lib/api/client')).apiClient.put(`/api/kos/${kosId}/photos/${photoId}/primary`, undefined, { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' } });
        
        if (data.success) {
          Swal.close();
          showToast('Foto utama berhasil diatur', 'success');
          // Refresh photos
          await fetchPhotos();
        } else {
          Swal.close();
          const err = !data.success ? data.error : 'Gagal mengatur foto utama';
          showError(err);
        }
      } catch (error) {
        console.error('Set primary error:', error);
        Swal.close();
        showError('Terjadi kesalahan saat mengatur foto utama');
      }
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <ProtectedRoute requireAuth={true} allowedRoles={['SELLER']}>
        <div className="min-h-[100dvh] bg-[var(--bg-canvas)]">
          <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="bg-[var(--bg-surface)] border border-[var(--border-stone)] rounded-[20px] p-8 animate-pulse space-y-6">
              <div className="h-8 bg-[var(--bg-muted)] rounded w-64" />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="h-48 bg-[var(--bg-muted)] rounded-[14px]" />
                ))}
              </div>
            </div>
          </main>
        </div>
      </ProtectedRoute>
    );
  }

  // Error state
  if (error || !kosData) {
    return (
      <ProtectedRoute requireAuth={true} allowedRoles={['SELLER']}>
        <div className="min-h-[100dvh] bg-[var(--bg-canvas)]">
          <main className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
            <div className="bg-[var(--bg-surface)] border border-[var(--border-stone)] rounded-[20px] p-8 text-center space-y-4">
              <div className="h-12 w-12 mx-auto rounded-full bg-[var(--accent-danger-tint)] text-[var(--accent-danger)] flex items-center justify-center">
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                  <line x1="12" y1="9" x2="12" y2="13" />
                  <line x1="12" y1="17" x2="12.01" y2="17" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-[var(--ink-primary)]">Gagal Memuat Data Kos</h3>
              <p className="text-sm text-[var(--ink-secondary)]">
                Terjadi kesalahan saat mengambil data kos untuk mengelola foto.
              </p>
              <div className="flex flex-wrap justify-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => refetch()}
                  className="px-5 py-2.5 rounded-[10px] text-xs font-semibold bg-[var(--accent-primary)] text-white hover:bg-[var(--accent-primary-hover)] transition-colors cursor-pointer"
                >
                  Coba Lagi
                </button>
                <button
                  type="button"
                  onClick={() => router.push(`/seller/kos/${kosId}`)}
                  className="px-5 py-2.5 rounded-[10px] text-xs font-semibold border border-[var(--border-stone)] bg-[var(--bg-canvas)] text-[var(--ink-primary)] hover:border-[var(--ink-secondary)] transition-colors cursor-pointer"
                >
                  Kembali ke Detail
                </button>
              </div>
            </div>
          </main>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute requireAuth={true} allowedRoles={['SELLER']}>
      <div className="min-h-[100dvh] bg-[var(--bg-canvas)]">
        <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-[var(--bg-surface)] border border-[var(--border-stone)] rounded-[20px] p-6 sm:p-8 space-y-8">
            {/* Header */}
            <div className="flex flex-wrap items-center justify-between gap-4 pb-5 border-b border-[var(--border-stone)]">
              <div className="space-y-1.5">
                <button
                  type="button"
                  onClick={() => router.push(`/seller/kos/${kosId}`)}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--ink-secondary)] hover:text-[var(--accent-primary)] transition-colors cursor-pointer"
                >
                  <span>Kembali ke Detail Kos</span>
                </button>
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[var(--ink-primary)]">
                  Kelola Foto Kos
                </h1>
                <p className="text-sm text-[var(--ink-secondary)]">
                  Atur galeri foto untuk{' '}
                  <span className="font-semibold text-[var(--ink-primary)]">{kosData.name}</span>
                </p>
              </div>
            </div>

            {/* Upload Section */}
            <div className="bg-[var(--bg-canvas)] rounded-[16px] p-6 border border-[var(--border-stone)] space-y-4">
              <h3 className="text-base font-bold text-[var(--ink-primary)]">Unggah Foto Baru</h3>
              <div className="space-y-4">
                <div
                  className={`border-2 border-dashed rounded-[14px] p-7 text-center transition-colors ${
                    dragActive
                      ? 'border-[var(--accent-primary)] bg-[var(--accent-tint)]'
                      : 'border-[var(--border-stone)] bg-[var(--bg-surface)] hover:border-[var(--accent-primary)]'
                  }`}
                  onDragEnter={handleDragEnter}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                    id="photo-upload"
                  />
                  <label htmlFor="photo-upload" className="cursor-pointer block space-y-2">
                    <div className="h-12 w-12 mx-auto rounded-full bg-[var(--accent-tint)] text-[var(--accent-primary)] flex items-center justify-center">
                      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
                        <polyline points="17 8 12 3 7 8" />
                        <line x1="12" y1="3" x2="12" y2="15" />
                      </svg>
                    </div>
                    <div className="text-sm font-semibold text-[var(--ink-primary)]">
                      Klik untuk pilih foto atau seret file ke area ini
                    </div>
                    <div className="text-xs text-[var(--ink-secondary)]">
                      Maksimal 10 foto, format JPG/PNG/WebP, ukuran maksimal 5MB per foto
                    </div>
                  </label>
                </div>

                {selectedFiles && selectedFiles.length > 0 && (
                  <div className="space-y-4">
                    <div className="text-xs font-semibold text-[var(--ink-secondary)]">
                      <span className="font-mono-tabular">{selectedFiles.length}</span> foto dipilih:
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-h-60 overflow-y-auto">
                      {Array.from(selectedFiles).map((file, index) => (
                        <div
                          key={index}
                          className="bg-[var(--bg-surface)] rounded-[12px] p-2.5 border border-[var(--border-stone)]"
                        >
                          <div className="relative mb-2">
                            <Image
                              src={URL.createObjectURL(file)}
                              alt={file.name}
                              width={100}
                              height={64}
                              className="w-full h-16 object-cover rounded-[8px]"
                              onLoad={(e) => {
                                URL.revokeObjectURL(e.currentTarget.src);
                              }}
                            />
                          </div>
                          <div className="text-xs text-[var(--ink-primary)] truncate">
                            {file.name}
                          </div>
                          <div className="font-mono-tabular text-[11px] text-[var(--ink-secondary)]">
                            {(file.size / 1024 / 1024).toFixed(2)} MB
                          </div>
                        </div>
                      ))}
                    </div>
                    <button
                      type="button"
                      onClick={handleUpload}
                      disabled={isUploading}
                      className="w-full py-3 px-6 rounded-[10px] text-sm font-semibold bg-[var(--accent-primary)] text-white hover:bg-[var(--accent-primary-hover)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                    >
                      {isUploading ? 'Mengunggah...' : 'Unggah Foto'}
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Current Photos */}
            <div className="space-y-4">
              <h3 className="text-base font-bold text-[var(--ink-primary)]">
                Foto Saat Ini (<span className="font-mono-tabular">{photos.length}</span> foto)
              </h3>

              {loadingPhotos ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div
                      key={i}
                      className="bg-[var(--bg-muted)] rounded-[14px] h-64 animate-pulse"
                    />
                  ))}
                </div>
              ) : photos.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {photos.map((photo, index) => (
                    <div
                      key={photo.id}
                      className="bg-[var(--bg-canvas)] rounded-[14px] overflow-hidden border border-[var(--border-stone)]"
                    >
                      <div className="relative">
                        <Image
                          src={photo.url}
                          alt={photo.caption || `Foto kos ${index + 1}`}
                          width={400}
                          height={192}
                          className="w-full h-48 object-cover"
                          onError={() => {
                            console.log('Failed to load photo:', photo.id);
                          }}
                        />
                        <div className="absolute top-3 right-3">
                          <button
                            type="button"
                            onClick={() => handleDeletePhoto(photo.id)}
                            className="h-8 w-8 rounded-full bg-[var(--accent-danger)] text-white hover:opacity-90 transition-opacity flex items-center justify-center cursor-pointer"
                            title="Hapus foto"
                            aria-label="Hapus foto"
                          >
                            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                              <polyline points="3 6 5 6 21 6" />
                              <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" />
                              <path d="M10 11v6" />
                              <path d="M14 11v6" />
                            </svg>
                          </button>
                        </div>
                        {photo.isPrimary && (
                          <div className="absolute top-3 left-3">
                            <span className="bg-[var(--accent-primary)] text-white px-2.5 py-1 rounded-full text-[11px] font-semibold">
                              Foto Utama
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="p-4 space-y-1.5">
                        <div className="flex justify-between items-center gap-2">
                          <span className="text-xs font-semibold text-[var(--ink-primary)] truncate">
                            {photo.caption || `Foto ${index + 1}`}
                          </span>
                          {!photo.isPrimary && (
                            <button
                              type="button"
                              onClick={() => handleSetPrimary(photo.id)}
                              className="text-[11px] font-semibold bg-[var(--accent-tint)] text-[var(--accent-primary)] px-2.5 py-1 rounded-[8px] hover:bg-[var(--accent-primary)] hover:text-white transition-colors shrink-0 cursor-pointer"
                            >
                              Jadikan Utama
                            </button>
                          )}
                        </div>
                        <div className="font-mono-tabular text-[11px] text-[var(--ink-secondary)]">
                          Diunggah: {new Date(photo.createdAt).toLocaleDateString('id-ID')}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-[var(--bg-canvas)] rounded-[16px] border border-[var(--border-stone)] space-y-2">
                  <h3 className="text-base font-bold text-[var(--ink-primary)]">Belum Ada Foto</h3>
                  <p className="text-xs sm:text-sm text-[var(--ink-secondary)] max-w-md mx-auto">
                    Unggah foto kamar, kamar mandi, dan area bersama agar profil kos Anda lebih meyakinkan.
                  </p>
                </div>
              )}
            </div>

            {/* Tips Section */}
            <div className="bg-[var(--bg-canvas)] rounded-[16px] p-6 border border-[var(--border-stone)]">
              <h3 className="text-base font-bold text-[var(--ink-primary)] mb-4">
                Panduan Foto Berkualitas
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs sm:text-sm text-[var(--ink-secondary)]">
                <p>1. Gunakan cahaya alami di pagi atau siang hari agar ruangan terlihat jelas.</p>
                <p>2. Ambil dari sudut ruangan untuk menampilkan luas kamar secara utuh.</p>
                <p>3. Sertakan foto kamar mandi, parkir, dan area bersama.</p>
                <p>4. Pilih foto kamar utama terbaik sebagai Foto Utama listing.</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => router.push(`/seller/kos/${kosId}`)}
                className="px-5 py-2.5 rounded-[10px] text-xs font-semibold border border-[var(--border-stone)] bg-[var(--bg-canvas)] text-[var(--ink-primary)] hover:border-[var(--ink-secondary)] transition-colors cursor-pointer"
              >
                Kembali ke Detail
              </button>
              <button
                type="button"
                onClick={() => router.push(`/kos/${kosId}/view`)}
                className="px-5 py-2.5 rounded-[10px] text-xs font-semibold bg-[var(--accent-primary)] text-white hover:bg-[var(--accent-primary-hover)] transition-colors cursor-pointer"
              >
                Lihat Halaman Publik
              </button>
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
