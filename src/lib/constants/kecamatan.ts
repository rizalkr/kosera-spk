/**
 * Kecamatan Constants
 *
 * Daftar Kecamatan di Kota Semarang untuk filter dan form.
 * Field `city` pada database sekarang menyimpan nama Kecamatan.
 */

/**
 * Daftar lengkap 16 Kecamatan di Kota Semarang
 */
export const KECAMATAN_SEMARANG = [
  'Banyumanik',
  'Candisari',
  'Gajah Mungkur',
  'Gayamsari',
  'Genuk',
  'Gunungpati',
  'Mijen',
  'Ngaliyan',
  'Pedurungan',
  'Semarang Barat',
  'Semarang Selatan',
  'Semarang Tengah',
  'Semarang Timur',
  'Semarang Utara',
  'Tembalang',
  'Tugu',
] as const;

/**
 * Type untuk Kecamatan
 */
export type KecamatanSemarang = (typeof KECAMATAN_SEMARANG)[number];

/**
 * Kecamatan dengan label "Semua" untuk filter dropdown
 * Menggunakan 'all' sebagai value untuk opsi semua
 */
export const KECAMATAN_FILTER_OPTIONS = [
  { value: '', label: 'Semua Kecamatan' },
  ...KECAMATAN_SEMARANG.map((kec) => ({ value: kec, label: kec })),
];

/**
 * Alias untuk backward compatibility
 * Untuk digunakan di form yang masih menggunakan CITIES
 */
export const CITIES = ['Semua Kecamatan', ...KECAMATAN_SEMARANG] as const;

/**
 * Kelurahan per Kecamatan (subset yang sering digunakan)
 * Untuk referensi lokasi yang lebih detail
 */
export const KELURAHAN_BY_KECAMATAN: Record<string, string[]> = {
  Pedurungan: [
    'Gemah',
    'Kalicari',
    'Muktiharjo Kidul',
    'Palebon',
    'Pedrungan Kidul',
    'Pedurungan Lor',
    'Pedurungan Tengah',
    'Plamongansari',
    'Tlogomulyo',
    'Tlogosari Kulon',
    'Tlogosari Wetan',
  ],
  Gayamsari: ['Gayamsari', 'Pandean Lamper', 'Sambirejo', 'Sawah Besar', 'Siwalan', 'Tambakrejo', 'Kaligawe'],
  Genuk: ['Bangetayu Kulon', 'Bangetayu Wetan', 'Banjardowo', 'Genuksari', 'Karangroto', 'Muktiharjo Lor', 'Penggaron Lor', 'Sembungharjo', 'Terboyo Kulon', 'Terboyo Wetan', 'Trimulyo'],
  Candisari: ['Candi', 'Jatingaleh', 'Jomblang', 'Kaliwiru', 'Tegalsari', 'Wonotingal'],
  'Semarang Selatan': ['Barusari', 'Bulustalan', 'Lamper Kidul', 'Lamper Lor', 'Lamper Tengah', 'Mugassari', 'Peterongan', 'Pleburan', 'Randusari', 'Wonodri'],
  'Semarang Timur': ['Bugangan', 'Karangtempel', 'Karangturi', 'Kebonagung', 'Kemijen', 'Mlatiharjo', 'Mlatibaru', 'Rejomulyo', 'Rejosari', 'Sarirejo'],
  Tembalang: ['Bulusan', 'Jangli', 'Kedungmundu', 'Kramas', 'Mangunharjo', 'Meteseh', 'Rowosari', 'Sambiroto', 'Sendangguwo', 'Sendangmulyo', 'Tandang', 'Tembalang'],
  Banyumanik: ['Gedawang', 'Jabungan', 'Ngesrep', 'Padangsari', 'Pedalangan', 'Pudakpayung', 'Srondol Kulon', 'Srondol Wetan', 'Sumurboto', 'Tinjomoyo'],
};

/**
 * Fungsi untuk mendapatkan kecamatan dari alamat lengkap
 * @param address - Alamat lengkap (misal dari Google Maps)
 * @returns Nama kecamatan atau 'Semarang' jika tidak ditemukan
 */
export function extractKecamatanFromAddress(address: string): string {
  // Pattern 1: "Kec. Pedurungan" or "Kec. Semarang Sel."
  const kecMatch = address.match(/Kec\.\s*([^,]+)/i);
  if (kecMatch) {
    let kecamatan = kecMatch[1].trim();
    // Clean up abbreviated names
    kecamatan = kecamatan
      .replace(/\s+Sel\.?$/i, ' Selatan')
      .replace(/\s+Tim\.?$/i, ' Timur')
      .replace(/\s+Ut\.?$/i, ' Utara')
      .replace(/\s+Bar\.?$/i, ' Barat');
    return kecamatan;
  }

  // Pattern 2: "Kecamatan Pedurungan"
  const kecamatanMatch = address.match(/Kecamatan\s*([^,]+)/i);
  if (kecamatanMatch) {
    return kecamatanMatch[1].trim();
  }

  // Default fallback
  return 'Semarang';
}

/**
 * Normalisasi nama kecamatan untuk konsistensi
 * @param kecamatan - Nama kecamatan yang mungkin tidak standar
 * @returns Nama kecamatan yang standar
 */
export function normalizeKecamatan(kecamatan: string): string {
  const normalized = kecamatan.trim().toLowerCase();
  
  // Map common variations
  const variations: Record<string, string> = {
    'semarang sel': 'Semarang Selatan',
    'semarang sel.': 'Semarang Selatan',
    'semarang selatan': 'Semarang Selatan',
    'semarang tim': 'Semarang Timur',
    'semarang tim.': 'Semarang Timur',
    'semarang timur': 'Semarang Timur',
    'semarang ut': 'Semarang Utara',
    'semarang ut.': 'Semarang Utara',
    'semarang utara': 'Semarang Utara',
    'semarang bar': 'Semarang Barat',
    'semarang bar.': 'Semarang Barat',
    'semarang barat': 'Semarang Barat',
    'gajah mungkur': 'Gajah Mungkur',
    'gajahmungkur': 'Gajah Mungkur',
  };

  if (variations[normalized]) {
    return variations[normalized];
  }

  // Try to find matching kecamatan
  const found = KECAMATAN_SEMARANG.find(
    (k) => k.toLowerCase() === normalized
  );

  return found || kecamatan;
}
