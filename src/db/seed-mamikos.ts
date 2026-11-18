/**
 * Fresh Database Seed Script for Mamikos 7,000-row Dataset
 *
 * Replaces existing kos/posts/photos/bookings/reviews/favorites data with
 * the full Mamikos dataset from /home/rizalkurnia/Projects/mamikos_output/mamikos_kost_dataset.csv
 * and maps local image paths to /images/mamikos/<id>/<file>.
 *
 * Usage:
 *   npm run db:seed-mamikos
 */

import '../lib/load-env';

import * as fs from 'fs';
import { like, or } from 'drizzle-orm';
import { hashPassword } from '@/lib/auth';
import {
  db,
  users,
  posts,
  kos,
  reviews,
  kosPhotos,
  favorites,
  bookings,
  bookingStatusHistory,
} from './index';

const DEFAULT_CSV_PATH = '/home/rizalkurnia/Projects/mamikos_output/mamikos_kost_dataset.csv';
const BATCH_SIZE = 500;

interface CsvRow {
  [key: string]: string;
}

const NEEDED_COLUMNS = new Set([
  '_id',
  'room_title',
  'source_url',
  'area_city',
  'area_subdistrict',
  'latitude',
  'longitude',
  'gender',
  'size',
  'available_room',
  'price_monthly',
  'price_quarterly',
  'price_semiannualy',
  'price_yearly',
  'price_weekly',
  'price_daily',
  'price_title',
  'rating',
  'review_count',
  'local_image_paths',
  'description',
  'fac_room',
  'fac_share',
  'fac_bath',
  'fac_near',
  'fac_park',
  'kos_rule',
  'fac_price',
  'map_guide',
  'view_count',
  'love_count',
  'is_promoted',
  'owner_id',
  'owner_name',
  'phone',
]);

/**
 * Stream-parse RFC-4180 CSV file keeping only NEEDED_COLUMNS to minimize memory footprint.
 */
async function parseCsvFile(filePath: string): Promise<CsvRow[]> {
  const stream = fs.createReadStream(filePath, {
    encoding: 'utf-8',
    highWaterMark: 1024 * 1024,
  });

  let headers: string[] | null = null;
  let neededIndices: number[] = [];
  const records: CsvRow[] = [];

  let row: string[] = [];
  let fieldChunks: string[] = [];
  let inQuotes = false;
  let pendingCR = false;
  let pendingQuoteInQuotes = false;
  let isFirstChunk = true;

  const pushField = (val: string) => {
    const colIdx = row.length;
    if (headers === null || NEEDED_COLUMNS.has(headers[colIdx])) {
      row.push(val);
    } else {
      row.push('');
    }
  };

  const finalizeRow = () => {
    if (headers === null) {
      headers = row.map((h) => h.trim());
      neededIndices = headers
        .map((h, idx) => (NEEDED_COLUMNS.has(h) ? idx : -1))
        .filter((idx) => idx !== -1);
    } else if (!(row.length === 1 && row[0] === '')) {
      const obj: CsvRow = {};
      for (const idx of neededIndices) {
        obj[headers[idx]] = row[idx] ?? '';
      }
      records.push(obj);
    }
    row = [];
  };

  for await (const rawChunk of stream) {
    let chunk = rawChunk as string;
    if (isFirstChunk) {
      isFirstChunk = false;
      if (chunk.charCodeAt(0) === 0xfeff) {
        chunk = chunk.slice(1);
      }
    }

    let start = 0;
    for (let i = 0; i < chunk.length; i++) {
      const ch = chunk[i];

      if (pendingCR) {
        pendingCR = false;
        if (ch === '\n') {
          start = i + 1;
          continue;
        }
      }

      if (pendingQuoteInQuotes) {
        pendingQuoteInQuotes = false;
        if (ch === '"') {
          fieldChunks.push('"');
          start = i + 1;
          continue;
        } else {
          inQuotes = false;
          // Fall through to process current character outside quotes
        }
      }

      if (inQuotes) {
        if (ch === '"') {
          if (i > start) fieldChunks.push(chunk.slice(start, i));
          start = i + 1;
          if (i + 1 < chunk.length) {
            if (chunk[i + 1] === '"') {
              fieldChunks.push('"');
              i++;
              start = i + 1;
            } else {
              inQuotes = false;
            }
          } else {
            pendingQuoteInQuotes = true;
          }
        }
        continue;
      }

      if (ch === '"') {
        if (i > start) fieldChunks.push(chunk.slice(start, i));
        start = i + 1;
        inQuotes = true;
      } else if (ch === ',') {
        if (i > start) fieldChunks.push(chunk.slice(start, i));
        pushField(fieldChunks.join(''));
        fieldChunks = [];
        start = i + 1;
      } else if (ch === '\r') {
        if (i > start) fieldChunks.push(chunk.slice(start, i));
        pushField(fieldChunks.join(''));
        fieldChunks = [];
        finalizeRow();
        if (i + 1 < chunk.length) {
          if (chunk[i + 1] === '\n') i++;
        } else {
          pendingCR = true;
        }
        start = i + 1;
      } else if (ch === '\n') {
        if (i > start) fieldChunks.push(chunk.slice(start, i));
        pushField(fieldChunks.join(''));
        fieldChunks = [];
        finalizeRow();
        start = i + 1;
      }
    }

    if (start < chunk.length) {
      fieldChunks.push(chunk.slice(start));
    }
  }

  if (pendingQuoteInQuotes) {
    inQuotes = false;
  }

  if (fieldChunks.length > 0 || row.length > 0) {
    pushField(fieldChunks.join(''));
    finalizeRow();
  }

  return records;
}

function parseJsonStringArray(raw: string | undefined): string[] {
  if (!raw) return [];
  const trimmed = raw.trim();
  if (!trimmed || trimmed === '[]') return [];
  try {
    const parsed = JSON.parse(trimmed);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .map((item) => String(item ?? '').trim())
      .filter((item) => item.length > 0);
  } catch {
    return [];
  }
}

function mapGender(raw: string | undefined): 'campur' | 'putra' | 'putri' {
  const val = (raw ?? '').trim();
  if (val === '1') return 'putra';
  if (val === '2') return 'putri';
  return 'campur';
}

function normalizeMonthlyPrice(row: CsvRow): number {
  const toInt = (v: string | undefined): number => {
    const n = Number.parseInt((v ?? '').trim(), 10);
    return Number.isFinite(n) && n > 0 ? n : 0;
  };

  const monthly = toInt(row.price_monthly);
  if (monthly > 0) return monthly;

  const quarterly = toInt(row.price_quarterly);
  if (quarterly > 0) return Math.round(quarterly / 3);

  const semiannual = toInt(row.price_semiannualy);
  if (semiannual > 0) return Math.round(semiannual / 6);

  const yearly = toInt(row.price_yearly);
  if (yearly > 0) return Math.round(yearly / 12);

  const weekly = toInt(row.price_weekly);
  if (weekly > 0) return Math.round(weekly * 4);

  const daily = toInt(row.price_daily);
  if (daily > 0) return Math.round(daily * 30);

  const fallback = toInt(row.price_title);
  return fallback > 0 ? fallback : 500000;
}

function cleanText(raw: string | undefined): string {
  return (raw ?? '').replace(/\s+/g, ' ').trim();
}

function formatRating(raw: string | undefined): string {
  const n = Number.parseFloat((raw ?? '').trim());
  if (!Number.isFinite(n) || n <= 0) return '0.0';
  return Math.min(5, Math.max(0, n)).toFixed(1);
}

function uniqueStrings(items: string[]): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const item of items) {
    const key = item.toLowerCase();
    if (!seen.has(key)) {
      seen.add(key);
      out.push(item);
    }
  }
  return out;
}

async function seedMamikos(): Promise<void> {
  const csvPath = process.env.MAMIKOS_CSV_PATH || DEFAULT_CSV_PATH;
  if (!fs.existsSync(csvPath)) {
    throw new Error(`Mamikos CSV file not found at: ${csvPath}`);
  }

  console.log(`Reading Mamikos dataset from ${csvPath}...`);
  const rows = await parseCsvFile(csvPath);
  console.log(`Parsed ${rows.length} rows.`);

  if (rows.length === 0) {
    throw new Error('Parsed 0 rows from CSV; aborting.');
  }

  // 1. Clean existing kos data (preserving ADMIN / RENTER accounts)
  console.log('\n--- Cleaning existing kos data ---');
  await db.delete(bookingStatusHistory);
  await db.delete(bookings);
  await db.delete(favorites);
  await db.delete(reviews);
  await db.delete(kosPhotos);
  await db.delete(kos);
  await db.delete(posts);
  await db
    .delete(users)
    .where(
      or(
        like(users.username, 'usm_%'),
        like(users.username, 'kos_%'),
        like(users.username, 'mamikos_%')
      )
    );
  console.log('Existing kos, posts, photos, bookings, reviews, favorites, and seed sellers deleted.');

  // 2. Prepare and insert unique seller accounts in bulk
  console.log('\n--- Creating seller accounts ---');
  const sharedPasswordHash = await hashPassword('seller123');
  const sellerByKey = new Map<
    string,
    { username: string; name: string; contact: string; role: 'SELLER'; password: string }
  >();

  for (const row of rows) {
    const ownerKey = cleanText(row.owner_id) || `row_${cleanText(row._id)}`;
    if (!sellerByKey.has(ownerKey)) {
      const ownerName = cleanText(row.owner_name) || 'Pemilik Kos';
      const contact = cleanText(row.phone) || '081200000000';
      sellerByKey.set(ownerKey, {
        username: `mamikos_owner_${ownerKey}`,
        name: ownerName,
        contact,
        role: 'SELLER',
        password: sharedPasswordHash,
      });
    }
  }

  const sellerValues = Array.from(sellerByKey.values());
  const sellerIdByUsername = new Map<string, number>();

  for (let i = 0; i < sellerValues.length; i += BATCH_SIZE) {
    const chunk = sellerValues.slice(i, i + BATCH_SIZE);
    const inserted = await db
      .insert(users)
      .values(chunk)
      .returning({ id: users.id, username: users.username });
    for (const u of inserted) {
      sellerIdByUsername.set(u.username, u.id);
    }
  }
  console.log(`Inserted ${sellerIdByUsername.size} seller accounts.`);

  // 3. Prepare normalized records
  interface PreparedRecord {
    userId: number;
    title: string;
    description: string;
    price: number;
    isFeatured: boolean;
    viewCount: number;
    favoriteCount: number;
    averageRating: string;
    reviewCount: number;
    photoCount: number;
    name: string;
    address: string;
    city: string;
    subdistrict: string | null;
    gender: 'campur' | 'putra' | 'putri';
    roomSize: string | null;
    facilities: string | null;
    nearbyFacilities: string | null;
    rules: string | null;
    sourceUrl: string | null;
    totalRooms: number;
    occupiedRooms: number;
    latitude: number | null;
    longitude: number | null;
    photoUrls: string[];
  }

  const prepared: PreparedRecord[] = rows.map((row) => {
    const ownerKey = cleanText(row.owner_id) || `row_${cleanText(row._id)}`;
    const userId = sellerIdByUsername.get(`mamikos_owner_${ownerKey}`);
    if (!userId) {
      throw new Error(`Missing seller user ID for owner ${ownerKey}`);
    }

    const name = cleanText(row.room_title) || `Kos ${cleanText(row._id)}`;
    const city = cleanText(row.area_city) || 'Indonesia';
    const subdistrict = cleanText(row.area_subdistrict) || null;
    const mapGuide = cleanText(row.map_guide);
    const address =
      mapGuide && subdistrict
        ? `${mapGuide}, ${subdistrict}`
        : mapGuide || subdistrict || city;

    const gender = mapGender(row.gender);
    const roomSize = cleanText(row.size) || null;
    const price = normalizeMonthlyPrice(row);

    const availableRaw = Number.parseInt(cleanText(row.available_room), 10);
    const availableRooms = Number.isFinite(availableRaw) && availableRaw > 0 ? availableRaw : 0;
    const totalRooms = availableRooms > 0 ? availableRooms : 1;
    const occupiedRooms = availableRooms > 0 ? 0 : 1;

    const allFacilities = uniqueStrings([
      ...parseJsonStringArray(row.fac_room),
      ...parseJsonStringArray(row.fac_bath),
      ...parseJsonStringArray(row.fac_share),
      ...parseJsonStringArray(row.fac_park),
      ...parseJsonStringArray(row.fac_price),
    ]);
    const facilities = allFacilities.length > 0 ? allFacilities.join(', ') : null;

    const nearArr = uniqueStrings(parseJsonStringArray(row.fac_near));
    const nearbyFacilities = nearArr.length > 0 ? nearArr.join(', ') : null;

    const rulesArr = uniqueStrings(parseJsonStringArray(row.kos_rule));
    const rules = rulesArr.length > 0 ? rulesArr.join(', ') : null;

    const rawDesc = cleanText(row.description);
    const genderLabel = gender === 'putra' ? 'Putra' : gender === 'putri' ? 'Putri' : 'Campur';
    const description =
      rawDesc ||
      `${name} adalah kos ${genderLabel.toLowerCase()} di ${subdistrict ? `${subdistrict}, ` : ''}${city}${facilities ? ` dengan fasilitas ${facilities}` : ''}.`;

    const localPaths = parseJsonStringArray(row.local_image_paths);
    const photoUrls = localPaths.map((p) => `/images/mamikos/${p.replace(/^images\//, '')}`);

    const lat = Number.parseFloat(cleanText(row.latitude));
    const lng = Number.parseFloat(cleanText(row.longitude));

    const viewCount = Number.parseInt(cleanText(row.view_count), 10) || 0;
    const favoriteCount = Number.parseInt(cleanText(row.love_count), 10) || 0;
    const reviewCount = Number.parseInt(cleanText(row.review_count), 10) || 0;
    const averageRating = formatRating(row.rating);
    const isFeatured =
      cleanText(row.is_promoted).toLowerCase() === 'true' ||
      Number.parseFloat(averageRating) >= 4.7;

    return {
      userId,
      title: name,
      description,
      price,
      isFeatured,
      viewCount,
      favoriteCount,
      averageRating,
      reviewCount,
      photoCount: photoUrls.length,
      name,
      address,
      city,
      subdistrict,
      gender,
      roomSize,
      facilities,
      nearbyFacilities,
      rules,
      sourceUrl: cleanText(row.source_url) || null,
      totalRooms,
      occupiedRooms,
      latitude: Number.isFinite(lat) ? lat : null,
      longitude: Number.isFinite(lng) ? lng : null,
      photoUrls,
    };
  });

  // 4. Insert posts, kos, and photos in batches
  console.log('\n--- Inserting posts, kos, and photos ---');
  let totalInsertedKos = 0;
  let totalInsertedPhotos = 0;

  for (let i = 0; i < prepared.length; i += BATCH_SIZE) {
    const chunk = prepared.slice(i, i + BATCH_SIZE);

    const insertedPosts = await db
      .insert(posts)
      .values(
        chunk.map((item) => ({
          userId: item.userId,
          title: item.title,
          description: item.description,
          price: item.price,
          isFeatured: item.isFeatured,
          viewCount: item.viewCount,
          favoriteCount: item.favoriteCount,
          averageRating: item.averageRating,
          reviewCount: item.reviewCount,
          photoCount: item.photoCount,
        }))
      )
      .returning({ id: posts.id });

    const insertedKos = await db
      .insert(kos)
      .values(
        chunk.map((item, idx) => ({
          postId: insertedPosts[idx].id,
          name: item.name,
          address: item.address,
          city: item.city,
          subdistrict: item.subdistrict,
          gender: item.gender,
          roomSize: item.roomSize,
          facilities: item.facilities,
          nearbyFacilities: item.nearbyFacilities,
          rules: item.rules,
          sourceUrl: item.sourceUrl,
          totalRooms: item.totalRooms,
          occupiedRooms: item.occupiedRooms,
          latitude: item.latitude,
          longitude: item.longitude,
        }))
      )
      .returning({ id: kos.id });

    totalInsertedKos += insertedKos.length;

    const photoRows: Array<{
      kosId: number;
      url: string;
      caption: string;
      isPrimary: boolean;
    }> = [];

    for (let idx = 0; idx < chunk.length; idx++) {
      const kosId = insertedKos[idx].id;
      const urls = chunk[idx].photoUrls;
      for (let pIdx = 0; pIdx < urls.length; pIdx++) {
        photoRows.push({
          kosId,
          url: urls[pIdx],
          caption: pIdx === 0 ? `Foto utama ${chunk[idx].name}` : `Foto ${pIdx + 1} ${chunk[idx].name}`,
          isPrimary: pIdx === 0,
        });
      }
    }

    for (let p = 0; p < photoRows.length; p += BATCH_SIZE * 2) {
      const photoChunk = photoRows.slice(p, p + BATCH_SIZE * 2);
      await db.insert(kosPhotos).values(photoChunk);
      totalInsertedPhotos += photoChunk.length;
    }

    console.log(
      `Inserted ${Math.min(i + BATCH_SIZE, prepared.length)}/${prepared.length} kos (${totalInsertedPhotos} photos so far)`
    );
  }

  console.log('\n=== Mamikos Seed Complete ===');
  console.log(`Total sellers: ${sellerIdByUsername.size}`);
  console.log(`Total kos/posts: ${totalInsertedKos}`);
  console.log(`Total photos: ${totalInsertedPhotos}`);
}

seedMamikos()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('Mamikos seed failed:', err);
    process.exit(1);
  });
