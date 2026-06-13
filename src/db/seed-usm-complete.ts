/**
 * Seed Script untuk Data Kos USM LENGKAP (Fresh Data)
 *
 * Script ini:
 * - MENGHAPUS semua data kos, posts, reviews, photos existing
 * - Membuat seller UNIK untuk setiap kos (berdasarkan nama kos)
 * - Data terlihat real seperti diinput oleh pengguna berbeda
 *
 * Features:
 * - Fresh database (hapus data lama)
 * - Seller unik per kos
 * - Photos dari Google Maps
 * - Reviews dengan nama asli dari scraping
 *
 * Usage:
 *   npx tsx src/db/seed-usm-complete.ts
 */

// Load environment variables
import 'dotenv/config';

import { db, users, posts, kos, reviews, kosPhotos, favorites, bookings } from './index';
import { hashPassword } from '@/lib/auth';
import { like } from 'drizzle-orm';
import * as fs from 'fs';
import * as path from 'path';

interface SeedKosData {
  name: string;
  address: string;
  city: string; // Kecamatan
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
  photos: string[];
  reviews: Array<{
    rating: number;
    comment: string;
    reviewerName: string;
    reviewTimeText?: string;
  }>;
}

/**
 * Generate username dari nama kos
 * Example: "KOS NUSA BANGSA ( Khusus Putra)" -> "kos_nusa_bangsa"
 */
function generateUsernameFromKosName(kosName: string, index: number): string {
  const cleaned = kosName
    .toLowerCase()
    .replace(/\([^)]*\)/g, '') // Remove text in parentheses
    .replace(/[^a-z0-9\s]/g, '') // Remove special chars
    .trim()
    .replace(/\s+/g, '_') // Replace spaces with underscore
    .substring(0, 20); // Max 20 chars
  
  return `${cleaned}_${index}`;
}

/**
 * Generate display name dari nama kos (untuk nama pemilik)
 * Example: "KOS NUSA BANGSA ( Khusus Putra)" -> "Pemilik Kos Nusa Bangsa"
 */
function generateOwnerName(kosName: string): string {
  const cleaned = kosName
    .replace(/\([^)]*\)/g, '') // Remove text in parentheses
    .replace(/kos(t)?/gi, '') // Remove "kos" or "kost"
    .replace(/putra|putri|campur/gi, '') // Remove gender types
    .trim()
    .split(/\s+/)
    .slice(0, 3) // Take first 3 words
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
  
  return `Pemilik ${cleaned}`.trim();
}

async function seedUSMComplete(): Promise<void> {
  try {
    console.log('Starting FRESH USM kos seeding...');
    console.log('WARNING: This will DELETE all existing kos data!\n');

    // Read transformed data
    const dataPath = path.resolve(__dirname, 'seed-data-usm-complete.json');
    if (!fs.existsSync(dataPath)) {
      console.error('seed-data-usm-complete.json not found!');
      console.error('Run: npx tsx scripts/transform-complete-kos.ts <input.json>');
      process.exit(1);
    }

    const kosDataList: SeedKosData[] = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
    console.log(`Found ${kosDataList.length} kos to seed`);

    // ============================================
    // STEP 1: Delete all existing data
    // ============================================
    console.log('\n--- Cleaning Database ---');
    
    // Delete in order (respect foreign keys)
    await db.delete(reviews);
    console.log('Deleted all reviews');
    
    await db.delete(kosPhotos);
    console.log('Deleted all kos_photos');
    
    await db.delete(favorites);
    console.log('Deleted all favorites');
    
    await db.delete(bookings);
    console.log('Deleted all bookings');
    
    await db.delete(kos);
    console.log('Deleted all kos');
    
    await db.delete(posts);
    console.log('Deleted all posts');

    // Delete old USM sellers and renters
    await db.delete(users).where(like(users.username, 'usm_%'));
    await db.delete(users).where(like(users.username, 'kos_%'));
    console.log('Deleted all USM users');

    // ============================================
    // STEP 2: Create renters for reviews
    // ============================================
    console.log('\n--- Creating Renter Users ---');
    const renterPassword = await hashPassword('renter123');
    const renterIds: number[] = [];

    for (let i = 1; i <= 30; i++) {
      const [renter] = await db
        .insert(users)
        .values({
          name: `Mahasiswa ${i}`,
          username: `renter_${i}`,
          contact: `08${1200000000 + i}`,
          role: 'RENTER',
          password: renterPassword,
        })
        .returning();
      renterIds.push(renter.id);
    }
    console.log(`Created ${renterIds.length} renter users`);

    // ============================================
    // STEP 3: Insert kos data with unique sellers
    // ============================================
    console.log('\n--- Inserting Kos Data ---');
    const sellerPassword = await hashPassword('seller123');
    
    let inserted = 0;
    let photosInserted = 0;
    let reviewsInserted = 0;
    let sellersCreated = 0;

    for (let idx = 0; idx < kosDataList.length; idx++) {
      const kosData = kosDataList[idx];

      // Create unique seller for this kos
      const sellerUsername = generateUsernameFromKosName(kosData.name, idx + 1);
      const sellerName = generateOwnerName(kosData.name);
      const sellerContact = kosData.contact || `08${1300000000 + idx}`;

      const [seller] = await db
        .insert(users)
        .values({
          name: sellerName,
          username: sellerUsername,
          contact: sellerContact,
          role: 'SELLER',
          password: sellerPassword,
        })
        .returning();
      sellersCreated++;

      // Create post
      const [post] = await db
        .insert(posts)
        .values({
          userId: seller.id,
          title: kosData.title,
          description: kosData.description,
          price: kosData.price,
          isFeatured: kosData.isFeatured,
          viewCount: Math.floor(Math.random() * 500) + 50,
          favoriteCount: Math.floor(Math.random() * 30) + 5,
          averageRating: String(kosData.averageRating),
          reviewCount: kosData.reviewCount,
          photoCount: kosData.photos.length,
        })
        .returning();

      // Create kos
      const [newKos] = await db
        .insert(kos)
        .values({
          postId: post.id,
          name: kosData.name,
          address: kosData.address,
          city: kosData.city,
          facilities: kosData.facilities,
          totalRooms: kosData.totalRooms,
          occupiedRooms: kosData.occupiedRooms,
          latitude: kosData.latitude,
          longitude: kosData.longitude,
        })
        .returning();

      // Insert photos (max 10 per kos)
      const photosToInsert = kosData.photos.slice(0, 10);
      for (let i = 0; i < photosToInsert.length; i++) {
        const photoUrl = photosToInsert[i];
        await db.insert(kosPhotos).values({
          kosId: newKos.id,
          url: photoUrl,
          caption: i === 0 ? `Foto utama ${kosData.name}` : `Foto ${i + 1}`,
          isPrimary: i === 0,
        });
        photosInserted++;
      }

      // Insert reviews (max 5 per kos)
      const reviewsToInsert = kosData.reviews.slice(0, 5);
      for (let i = 0; i < reviewsToInsert.length; i++) {
        const review = reviewsToInsert[i];
        // Use different renter for each review
        const renterId = renterIds[(idx * 5 + i) % renterIds.length];

        await db.insert(reviews).values({
          kosId: newKos.id,
          userId: renterId,
          rating: Math.min(5, Math.max(1, review.rating)),
          comment: review.comment.substring(0, 500),
          reviewerName: review.reviewerName,
          reviewTimeText: review.reviewTimeText || null,
        });
        reviewsInserted++;
      }

      inserted++;
      console.log(
        `[${idx + 1}/${kosDataList.length}] ${kosData.name} -> ${sellerUsername}`
      );
    }

    // ============================================
    // Summary
    // ============================================
    console.log('\n========================================');
    console.log('         SEEDING COMPLETE');
    console.log('========================================');
    console.log(`Sellers created: ${sellersCreated}`);
    console.log(`Kos inserted: ${inserted}`);
    console.log(`Photos inserted: ${photosInserted}`);
    console.log(`Reviews inserted: ${reviewsInserted}`);
    console.log(`Renters created: ${renterIds.length}`);

    // Print kecamatan distribution
    const kecamatanCount: Record<string, number> = {};
    for (const k of kosDataList) {
      kecamatanCount[k.city] = (kecamatanCount[k.city] || 0) + 1;
    }
    console.log('\n--- Kecamatan Distribution ---');
    for (const [kec, count] of Object.entries(kecamatanCount).sort((a, b) => b[1] - a[1])) {
      console.log(`  ${kec}: ${count}`);
    }

    console.log('\n--- Login Credentials ---');
    console.log('Sellers: username sesuai nama kos, password: seller123');
    console.log('Renters: renter_1 s/d renter_30, password: renter123');

    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
}

seedUSMComplete();
