/**
 * Script untuk transform data scraping Google Maps LENGKAP ke format seed database
 *
 * Data baru memiliki:
 * - name yang lengkap
 * - address lengkap dengan Kecamatan
 * - photos array dengan URLs gambar
 * - phone number
 * - reviews dengan avatar
 *
 * Usage: npx tsx scripts/transform-complete-kos.ts [input-file]
 */

import * as fs from 'fs';
import * as path from 'path';

interface ScrapedReview {
  user: string;
  avatar: string;
  rating: number | null;
  text: string;
  time: string;
}

interface ScrapedKos {
  name: string;
  rating: number | null;
  totalReviews: number;
  address: string;
  category: string;
  phone: string | null;
  photos: string[];
  reviews: ScrapedReview[];
  url: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  distanceKm: number;
}

interface TransformedReview {
  rating: number;
  comment: string;
  reviewerName: string;
  reviewTimeText: string; // Original time text (e.g., "5 bulan lalu")
}

interface TransformedKos {
  name: string;
  address: string;
  city: string; // Now stores Kecamatan
  title: string;
  description: string;
  price: number;
  facilities: string;
  totalRooms: number;
  occupiedRooms: number;
  latitude: number;
  longitude: number;
  averageRating: number;
  reviewCount: number;
  isFeatured: boolean;
  contact: string | null;
  photos: string[]; // Array of photo URLs
  reviews: TransformedReview[];
}

/**
 * Extract Kecamatan from address
 * Example: "Jl. Tlogo Timun 2 No.4, Tlogosari Kulon, Kec. Pedurungan, Kota Semarang, Jawa Tengah 50196"
 * Returns: "Pedurungan"
 */
function extractKecamatan(address: string): string {
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
 * Clean address - remove leading newline and extra whitespace
 */
function cleanAddress(address: string): string {
  return address.replace(/^\n+/, '').replace(/\s+/g, ' ').trim();
}

/**
 * Generate harga acak berdasarkan kategori dan rating
 */
function generatePrice(category: string, rating: number | null): number {
  const basePrices: Record<string, { min: number; max: number }> = {
    'Hotel jangka panjang': { min: 700000, max: 1500000 },
    'Apartemen sewa liburan': { min: 800000, max: 1800000 },
    'Rumah Pondokan': { min: 500000, max: 1200000 },
    'Pondok': { min: 400000, max: 900000 },
    'Hostel': { min: 400000, max: 800000 },
    'Komplek perumahan': { min: 600000, max: 1300000 },
    'Penginapan Dalam Ruangan': { min: 500000, max: 1100000 },
    default: { min: 500000, max: 1300000 },
  };

  const priceRange = basePrices[category] || basePrices.default;

  // Adjust based on rating
  let multiplier = 1;
  if (rating && rating >= 4.5) multiplier = 1.2;
  else if (rating && rating >= 4.0) multiplier = 1.1;

  const basePrice = Math.floor(
    Math.random() * (priceRange.max - priceRange.min) + priceRange.min
  );

  // Round to nearest 50000
  return Math.round((basePrice * multiplier) / 50000) * 50000;
}

/**
 * Extract fasilitas dari reviews
 */
function extractFacilities(reviews: ScrapedReview[], category: string): string {
  const facilityKeywords: Record<string, string> = {
    wifi: 'WiFi',
    ac: 'AC',
    'kamar mandi': 'Kamar Mandi Dalam',
    parkir: 'Parkir',
    tv: 'TV',
    lemari: 'Lemari',
    kasur: 'Kasur',
    'spring bed': 'Spring Bed',
    dapur: 'Dapur Bersama',
    laundry: 'Laundry',
    mushola: 'Mushola',
    masjid: 'Dekat Masjid',
    bersih: 'Kebersihan',
    nyaman: 'Nyaman',
    aman: 'Keamanan',
    alfamart: 'Dekat Minimarket',
    indomaret: 'Dekat Minimarket',
    warteg: 'Dekat Warung Makan',
    gym: 'Dekat Gym',
  };

  const foundFacilities = new Set<string>();

  // Search in reviews
  for (const review of reviews) {
    const text = review.text.toLowerCase();
    for (const [keyword, facility] of Object.entries(facilityKeywords)) {
      if (text.includes(keyword)) {
        foundFacilities.add(facility);
      }
    }
  }

  // Add some default facilities if too few found
  if (foundFacilities.size < 3) {
    foundFacilities.add('Kamar Mandi Dalam');
    foundFacilities.add('Kasur');
    foundFacilities.add('Lemari');
  }

  return Array.from(foundFacilities).slice(0, 8).join(', ');
}

/**
 * Generate description dari reviews dan info
 */
function generateDescription(
  name: string,
  reviews: ScrapedReview[],
  category: string,
  distanceKm: number,
  kecamatan: string
): string {
  const parts: string[] = [];

  parts.push(`${name} adalah ${category.toLowerCase()} yang berlokasi di Kecamatan ${kecamatan}.`);
  parts.push(`Berjarak sekitar ${distanceKm.toFixed(1)} km dari kampus USM.`);

  // Extract positive phrases from reviews
  const positiveReviews = reviews
    .filter((r) => r.rating && r.rating >= 4 && r.text.length > 20)
    .slice(0, 2);

  if (positiveReviews.length > 0) {
    const reviewTexts = positiveReviews
      .map((r) => r.text.replace(/\n/g, ' ').substring(0, 100))
      .join(' ');
    parts.push(`Menurut penghuni: "${reviewTexts}..."`);
  }

  return parts.join(' ');
}

/**
 * Filter valid reviews (remove owner promotions and duplicates)
 */
function filterValidReviews(reviews: ScrapedReview[]): TransformedReview[] {
  const ownerKeywords = [
    'owner',
    'pemilik',
    'kontak',
    'hub.',
    'wa ',
    'info ',
    'sewa kost',
    'pesan kamar',
  ];

  return reviews
    .filter((r, i, arr) => {
      // Remove duplicates
      const isDuplicate = arr.findIndex((x) => x.text === r.text) !== i;

      // Remove owner promotions
      const textLower = r.text.toLowerCase();
      const userLower = r.user.toLowerCase();
      const isOwnerPromo = ownerKeywords.some(
        (kw) => textLower.includes(kw) || userLower.includes(kw)
      );

      return !isDuplicate && !isOwnerPromo && r.text.length > 10;
    })
    .map((r) => ({
      rating: r.rating || 4,
      comment: r.text.replace(/\n/g, ' ').substring(0, 500),
      reviewerName: r.user,
      reviewTimeText: r.time || '', // Original time text from scraping
    }));
}

/**
 * Transform scraped data to database format
 */
function transformKos(scraped: ScrapedKos): TransformedKos | null {
  const name = scraped.name.trim();

  // Skip if no name
  if (!name) {
    console.warn('Skipping: No name found');
    return null;
  }

  const cleanedAddress = cleanAddress(scraped.address);
  const kecamatan = extractKecamatan(cleanedAddress);
  const validReviews = filterValidReviews(scraped.reviews);

  const rating =
    scraped.rating ||
    (validReviews.length > 0
      ? validReviews.reduce((sum, r) => sum + r.rating, 0) / validReviews.length
      : 4.0);

  return {
    name,
    address: cleanedAddress,
    city: kecamatan, // Using Kecamatan as city for filtering
    title: `${name} - ${scraped.category || 'Kos'} di ${kecamatan}`,
    description: generateDescription(
      name,
      scraped.reviews,
      scraped.category || 'Kos',
      scraped.distanceKm,
      kecamatan
    ),
    price: generatePrice(scraped.category, scraped.rating),
    facilities: extractFacilities(scraped.reviews, scraped.category),
    totalRooms: Math.floor(Math.random() * 10) + 5, // 5-15 rooms
    occupiedRooms: Math.floor(Math.random() * 5), // 0-5 occupied
    latitude: scraped.coordinates.lat,
    longitude: scraped.coordinates.lng,
    averageRating: Math.round(rating * 10) / 10,
    reviewCount: scraped.totalReviews || validReviews.length,
    isFeatured: (scraped.rating || 0) >= 4.5 || scraped.totalReviews >= 10,
    contact: scraped.phone || null,
    photos: scraped.photos || [],
    reviews: validReviews,
  };
}

async function main(): Promise<void> {
  // Read scraped data
  const inputPath = process.argv[2] || 'kos-usm-complete-photos.json';
  const absolutePath = path.isAbsolute(inputPath)
    ? inputPath
    : path.resolve(process.cwd(), inputPath);

  console.log(`Reading from: ${absolutePath}`);

  if (!fs.existsSync(absolutePath)) {
    console.error('File not found:', absolutePath);
    process.exit(1);
  }

  const rawData = fs.readFileSync(absolutePath, 'utf-8');
  const scrapedData: ScrapedKos[] = JSON.parse(rawData);

  console.log(`Found ${scrapedData.length} scraped items`);

  // Transform data
  const transformed: TransformedKos[] = [];
  let skipped = 0;

  for (const item of scrapedData) {
    const result = transformKos(item);
    if (result) {
      transformed.push(result);
    } else {
      skipped++;
    }
  }

  console.log(`Transformed: ${transformed.length}, Skipped: ${skipped}`);

  // Collect unique kecamatan
  const kecamatanSet = new Set(transformed.map((k) => k.city));
  console.log(`\nKecamatan found: ${Array.from(kecamatanSet).join(', ')}`);

  // Output
  const outputPath = path.resolve(__dirname, '../src/db/seed-data-usm-complete.json');
  fs.writeFileSync(outputPath, JSON.stringify(transformed, null, 2));
  console.log(`\nOutput written to: ${outputPath}`);

  // Print summary
  console.log('\n--- Summary ---');
  console.log(`Total kos: ${transformed.length}`);
  console.log(`Featured: ${transformed.filter((k) => k.isFeatured).length}`);
  console.log(`With reviews: ${transformed.filter((k) => k.reviews.length > 0).length}`);
  console.log(`With photos: ${transformed.filter((k) => k.photos.length > 0).length}`);
  console.log(
    `Price range: Rp${Math.min(...transformed.map((k) => k.price)).toLocaleString()} - Rp${Math.max(...transformed.map((k) => k.price)).toLocaleString()}`
  );

  // Kecamatan distribution
  console.log('\n--- Kecamatan Distribution ---');
  const kecamatanCount: Record<string, number> = {};
  for (const k of transformed) {
    kecamatanCount[k.city] = (kecamatanCount[k.city] || 0) + 1;
  }
  for (const [kec, count] of Object.entries(kecamatanCount).sort((a, b) => b[1] - a[1])) {
    console.log(`  ${kec}: ${count}`);
  }
}

main().catch(console.error);
