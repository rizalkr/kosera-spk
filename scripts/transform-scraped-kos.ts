/**
 * Script untuk transform data scraping Google Maps ke format seed database
 *
 * Menangani:
 * - Extract nama dari URL jika kosong
 * - Generate harga random (karena tidak tersedia di scraping)
 * - Generate fasilitas dari category dan reviews
 * - Set default values untuk field yang kosong
 *
 * Usage: npx tsx scripts/transform-scraped-kos.ts
 */

import * as fs from 'fs';
import * as path from 'path';

interface ScrapedReview {
  name: string;
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
  website: string | null;
  hours: string | null;
  summary: string;
  reviews: ScrapedReview[];
  url: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  distanceKm: number;
}

interface TransformedKos {
  name: string;
  address: string;
  city: string;
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
  website: string | null;
  reviews: Array<{
    rating: number;
    comment: string;
    reviewerName: string;
  }>;
}

/**
 * Extract nama kos dari Google Maps URL
 */
function extractNameFromUrl(url: string): string {
  // URL format: https://www.google.com/maps/place/Kost+Putri+Dekat+USM/data=...
  const match = url.match(/\/place\/([^/]+)\//);
  if (match) {
    return decodeURIComponent(match[1].replace(/\+/g, ' '));
  }
  return '';
}

/**
 * Generate alamat dari koordinat (placeholder)
 */
function generateAddress(lat: number, lng: number, name: string): string {
  // Karena tidak ada alamat, generate berdasarkan lokasi relatif ke USM
  const usmLat = -6.9784;
  const usmLng = 110.4569;
  
  const latDiff = lat - usmLat;
  const lngDiff = lng - usmLng;
  
  let direction = '';
  if (latDiff < -0.005) direction += 'Selatan ';
  else if (latDiff > 0.005) direction += 'Utara ';
  
  if (lngDiff < -0.005) direction += 'Barat ';
  else if (lngDiff > 0.005) direction += 'Timur ';
  
  if (!direction) direction = 'Dekat ';
  
  return `Jl. ${direction}USM, Tlogosari`;
}

/**
 * Generate harga acak berdasarkan kategori
 */
function generatePrice(category: string, rating: number | null): number {
  // Base prices
  const basePrices = {
    'Hostel': { min: 400000, max: 800000 },
    'Rumah Pondokan': { min: 500000, max: 1200000 },
    'default': { min: 500000, max: 1500000 },
  };

  const priceRange = basePrices[category as keyof typeof basePrices] || basePrices.default;
  
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
 * Generate fasilitas dari reviews dan category
 */
function extractFacilities(reviews: ScrapedReview[], category: string): string {
  const facilityKeywords: Record<string, string> = {
    'wifi': 'WiFi',
    'ac': 'AC',
    'kamar mandi': 'Kamar Mandi Dalam',
    'parkir': 'Parkir',
    'tv': 'TV',
    'lemari': 'Lemari',
    'kasur': 'Kasur',
    'dapur': 'Dapur Bersama',
    'laundry': 'Laundry',
    'air mineral': 'Air Mineral',
    'bersih': 'Kebersihan',
    'nyaman': 'Nyaman',
  };

  const foundFacilities = new Set<string>();
  
  // Default facilities based on category
  if (category === 'Hostel') {
    foundFacilities.add('Kasur');
    foundFacilities.add('Lemari');
  }
  
  // Search in reviews
  for (const review of reviews) {
    const text = review.text.toLowerCase();
    for (const [keyword, facility] of Object.entries(facilityKeywords)) {
      if (text.includes(keyword)) {
        foundFacilities.add(facility);
      }
    }
  }
  
  // Add some default facilities
  if (foundFacilities.size < 3) {
    foundFacilities.add('Kamar Mandi Dalam');
    foundFacilities.add('Kasur');
    foundFacilities.add('Lemari');
  }
  
  return Array.from(foundFacilities).slice(0, 6).join(', ');
}

/**
 * Generate description dari reviews
 */
function generateDescription(
  name: string,
  reviews: ScrapedReview[],
  category: string,
  distanceKm: number
): string {
  const parts: string[] = [];
  
  parts.push(`${name} adalah ${category.toLowerCase()} yang berlokasi strategis.`);
  parts.push(`Berjarak sekitar ${distanceKm.toFixed(1)} km dari kampus USM.`);
  
  // Extract positive phrases from reviews
  const positiveReviews = reviews
    .filter(r => r.rating && r.rating >= 4 && r.text.length > 20)
    .slice(0, 2);
  
  if (positiveReviews.length > 0) {
    const reviewTexts = positiveReviews
      .map(r => r.text.replace(/\n/g, ' ').substring(0, 100))
      .join(' ');
    parts.push(`Menurut penghuni: "${reviewTexts}..."`);
  }
  
  return parts.join(' ');
}

/**
 * Transform scraped data to database format
 */
function transformKos(scraped: ScrapedKos): TransformedKos | null {
  // Get name from data or extract from URL
  let name = scraped.name.trim();
  if (!name) {
    name = extractNameFromUrl(scraped.url);
  }
  
  // Skip if still no name
  if (!name) {
    console.warn('Skipping: No name found for', scraped.url);
    return null;
  }
  
  // Filter valid reviews (remove duplicates and owner promotions)
  const validReviews = scraped.reviews
    .filter((r, i, arr) => {
      // Remove duplicates
      const isDuplicate = arr.findIndex(x => x.text === r.text) !== i;
      // Remove owner promotions
      const isOwnerPromo = r.name.toLowerCase().includes('owner') ||
                          r.name.toLowerCase().includes('kontak kost');
      return !isDuplicate && !isOwnerPromo && r.text.length > 10;
    })
    .map(r => ({
      rating: r.rating || 4,
      comment: r.text.replace(/\n/g, ' ').substring(0, 500),
      reviewerName: r.name,
    }));

  const rating = scraped.rating || (validReviews.length > 0
    ? validReviews.reduce((sum, r) => sum + r.rating, 0) / validReviews.length
    : 4.0);

  return {
    name,
    address: scraped.address || generateAddress(
      scraped.coordinates.lat,
      scraped.coordinates.lng,
      name
    ),
    city: 'Semarang',
    title: `${name} - ${scraped.category || 'Kos'} Dekat USM`,
    description: generateDescription(
      name,
      scraped.reviews,
      scraped.category || 'Kos',
      scraped.distanceKm
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
    website: scraped.website,
    reviews: validReviews,
  };
}

async function main() {
  // Read scraped data
  const inputPath = process.argv[2] || '../pupeter-gmaps-kos/output/kos-usm-final.json';
  const absolutePath = path.resolve(__dirname, inputPath);
  
  console.log(`Reading from: ${absolutePath}`);
  
  if (!fs.existsSync(absolutePath)) {
    // Try relative to cwd
    const cwdPath = path.resolve(process.cwd(), inputPath);
    if (fs.existsSync(cwdPath)) {
      console.log(`Found at: ${cwdPath}`);
    } else {
      console.error('File not found:', inputPath);
      process.exit(1);
    }
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
  
  // Output
  const outputPath = path.resolve(__dirname, '../src/db/seed-data-usm.json');
  fs.writeFileSync(outputPath, JSON.stringify(transformed, null, 2));
  console.log(`Output written to: ${outputPath}`);
  
  // Print summary
  console.log('\n--- Summary ---');
  console.log(`Total kos: ${transformed.length}`);
  console.log(`Featured: ${transformed.filter(k => k.isFeatured).length}`);
  console.log(`With reviews: ${transformed.filter(k => k.reviews.length > 0).length}`);
  console.log(`Price range: Rp${Math.min(...transformed.map(k => k.price)).toLocaleString()} - Rp${Math.max(...transformed.map(k => k.price)).toLocaleString()}`);
}

main().catch(console.error);
