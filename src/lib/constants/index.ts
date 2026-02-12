/**
 * Constants Module
 *
 * Centralized exports for all application constants.
 */

export * from './kecamatan';

/**
 * Daftar Fasilitas Kos
 */
export const FACILITIES = [
  'WiFi',
  'AC',
  'Parkir',
  'Kamar Mandi Dalam',
  'Kamar Mandi Luar',
  'Dapur Bersama',
  'Ruang Tamu',
  'Laundry',
  'Security 24 Jam',
  'CCTV',
  'Kasur',
  'Lemari',
  'Meja Belajar',
  'Kursi',
  'TV',
  'Kulkas',
  'Dispenser',
  'Jemuran',
  'Taman',
  'Musholla',
] as const;

export type Facility = (typeof FACILITIES)[number];

/**
 * Fasilitas untuk filter (dengan label)
 */
export const FACILITY_FILTER_OPTIONS = FACILITIES.map((f) => ({
  value: f,
  label: f,
}));
