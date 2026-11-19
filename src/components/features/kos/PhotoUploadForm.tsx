'use client';

import { useState } from 'react';
import { useAuthGuard } from '@/hooks/auth/useAuthGuard';
import { useAuthToken } from '@/hooks/auth/useAuthToken';

interface PhotoUploadFormProps {
  kosId: number;
  onUploadSuccess?: (photos: Array<{ id: number; url: string; isPrimary: boolean }>) => void;
  onUploadError?: (error: string) => void;
}

export default function PhotoUploadForm({ 
  kosId, 
  onUploadSuccess, 
  onUploadError 
}: PhotoUploadFormProps) {
  const [files, setFiles] = useState<FileList | null>(null);
  const [isPrimary, setIsPrimary] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  
  const { isAuthenticated } = useAuthGuard();
  const { getToken, hasValidToken } = useAuthToken();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFiles(e.target.files);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setFiles(e.dataTransfer.files);
    }
  };

  const handleUpload = async () => {
    if (!files || files.length === 0) {
      onUploadError?.('Pilih file foto terlebih dahulu');
      return;
    }

    // Check authentication with more robust validation
    if (!isAuthenticated || !hasValidToken()) {
      onUploadError?.('Login terlebih dahulu untuk upload foto');
      return;
    }

    // Validate file types and sizes
    const maxSize = 5 * 1024 * 1024; // 5MB
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (!allowedTypes.includes(file.type)) {
        onUploadError?.(`File ${file.name} bukan format gambar yang didukung`);
        return;
      }
      if (file.size > maxSize) {
        onUploadError?.(`File ${file.name} terlalu besar (max 5MB)`);
        return;
      }
    }

    setIsUploading(true);

    try {
      const formData = new FormData();
      
      // Add all files to FormData
      for (let i = 0; i < files.length; i++) {
        formData.append('photos', files[i]);
      }
      
      formData.append('isPrimary', isPrimary.toString());

      // Get token using hook with validation
      const token = getToken();
      if (!token) {
        onUploadError?.('Sesi login telah berakhir, silakan login kembali');
        return;
      }
      
      const response = await fetch(`/api/kos/${kosId}/photos/upload`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        onUploadSuccess?.(data.data.photos);
        setFiles(null);
        setIsPrimary(false);
        // Reset file input
        const fileInput = document.getElementById('photo-upload') as HTMLInputElement;
        if (fileInput) fileInput.value = '';
      } else {
        onUploadError?.(data.error || 'Gagal upload foto');
      }
    } catch (error) {
      console.error('Upload error:', error);
      onUploadError?.('Terjadi kesalahan saat upload foto');
    } finally {
      setIsUploading(false);
    }
  };

  const removeFile = (index: number) => {
    if (files) {
      const newFiles = Array.from(files).filter((_, i) => i !== index);
      const dt = new DataTransfer();
      newFiles.forEach(file => dt.items.add(file));
      setFiles(dt.files);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="bg-[var(--bg-canvas)] border border-[var(--border-stone)] rounded-[14px] p-6 text-center">
        <p className="text-sm text-[var(--ink-secondary)]">Login terlebih dahulu untuk mengunggah foto</p>
      </div>
    );
  }

  return (
    <div className="bg-[var(--bg-surface)] rounded-[16px] border border-[var(--border-stone)] p-6">
      <h3 className="text-base font-bold text-[var(--ink-primary)] mb-4">Unggah Foto Kos</h3>

      {/* Drag and Drop Area */}
      <div
        className={`border-2 border-dashed rounded-[14px] p-8 text-center transition-colors ${
          dragActive
            ? 'border-[var(--accent-primary)] bg-[var(--accent-tint)]'
            : 'border-[var(--border-stone)] bg-[var(--bg-canvas)] hover:border-[var(--accent-primary)]'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <div className="h-12 w-12 mx-auto mb-3 rounded-full bg-[var(--accent-tint)] text-[var(--accent-primary)] flex items-center justify-center">
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
            <polyline points="17 8 12 3 7 8" />
            <line x1="12" y1="3" x2="12" y2="15" />
          </svg>
        </div>
        <p className="text-sm text-[var(--ink-primary)] mb-1.5">
          Seret foto ke sini atau{' '}
          <label
            htmlFor="photo-upload"
            className="font-semibold text-[var(--accent-primary)] hover:underline cursor-pointer"
          >
            pilih file
          </label>
        </p>
        <p className="text-xs text-[var(--ink-secondary)]">
          Mendukung JPG, PNG, WebP (maks. 5MB per file)
        </p>

        <input
          id="photo-upload"
          type="file"
          multiple
          accept="image/jpeg,image/jpg,image/png,image/webp"
          onChange={handleFileChange}
          className="hidden"
        />
      </div>

      {/* Selected Files */}
      {files && files.length > 0 && (
        <div className="mt-4">
          <h4 className="text-xs font-semibold text-[var(--ink-primary)] mb-2">File terpilih:</h4>
          <div className="space-y-2">
            {Array.from(files).map((file, index) => (
              <div
                key={index}
                className="flex items-center justify-between bg-[var(--bg-canvas)] border border-[var(--border-stone)] rounded-[10px] px-3 py-2"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <span className="text-xs font-medium text-[var(--ink-primary)] truncate">
                    {file.name}
                  </span>
                  <span className="font-mono-tabular text-[11px] text-[var(--ink-secondary)] shrink-0">
                    ({(file.size / 1024 / 1024).toFixed(2)} MB)
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => removeFile(index)}
                  className="text-xs font-semibold text-[var(--accent-danger)] hover:underline cursor-pointer"
                >
                  Hapus
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Options */}
      {files && files.length > 0 && (
        <div className="mt-4 flex items-center gap-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={isPrimary}
              onChange={(e) => setIsPrimary(e.target.checked)}
              className="rounded accent-[var(--accent-primary)]"
            />
            <span className="text-xs font-medium text-[var(--ink-primary)]">
              Jadikan sebagai foto utama
            </span>
          </label>
        </div>
      )}

      {/* Upload Button */}
      {files && files.length > 0 && (
        <div className="mt-5">
          <button
            type="button"
            onClick={handleUpload}
            disabled={isUploading}
            className="w-full bg-[var(--accent-primary)] text-white py-2.5 px-4 rounded-[10px] text-sm font-semibold hover:bg-[var(--accent-primary-hover)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {isUploading ? 'Mengunggah...' : `Unggah ${files.length} foto`}
          </button>
        </div>
      )}
    </div>
  );
}
