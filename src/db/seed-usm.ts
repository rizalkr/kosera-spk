/**
 * Seed Script untuk Data Kos USM (dari scraping Google Maps)
 *
 * Script ini menambahkan data kos hasil scraping ke database TANPA menghapus
 * data existing. Cocok untuk menambah data real ke database yang sudah ada.
 *
 * Usage:
 *   npx tsx src/db/seed-usm.ts
 *
 * Prerequisite:
 *   - Jalankan transform-scraped-kos.ts dulu untuk generate seed-data-usm.json
 *   - Database sudah termigrasi
 */

import { db, users, posts, kos, reviews } from './index';
import { hashPassword } from '@/lib/auth';
import * as fs from 'fs';
import * as path from 'path';

interface SeedKosData {
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

async function seedUSM() {
  try {
    console.log('🌱 Starting USM kos seeding...');

    // Read transformed data
    const dataPath = path.resolve(__dirname, 'seed-data-usm.json');
    if (!fs.existsSync(dataPath)) {
      console.error('❌ seed-data-usm.json not found!');
      console.error('   Run: npx tsx scripts/transform-scraped-kos.ts <input.json>');
      process.exit(1);
    }

    const kosDataList: SeedKosData[] = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
    console.log(`📄 Found ${kosDataList.length} kos to seed`);

    // Create or find a seller for USM kos
    const sellerPassword = await hashPassword('usmkos123');

    // Check if USM seller exists
    let usmSeller = await db.query.users.findFirst({
      where: (users, { eq }) => eq(users.username, 'usm_kos_owner'),
    });

    if (!usmSeller) {
      const [newSeller] = await db.insert(users).values({
        name: 'Pemilik Kos USM',
        username: 'usm_kos_owner',
        contact: '081234567890',
        role: 'SELLER',
        password: sellerPassword,
      }).returning();
      usmSeller = newSeller;
      console.log('👤 Created USM kos seller');
    } else {
      console.log('👤 Using existing USM kos seller');
    }

    // Create some renters for reviews
    const renterPassword = await hashPassword('renter123');
    const renterUsernames: string[] = [];

    for (let i = 1; i <= 20; i++) {
      const username = `usm_renter${i}`;
      const existing = await db.query.users.findFirst({
        where: (users, { eq }) => eq(users.username, username),
      });

      if (!existing) {
        await db.insert(users).values({
          name: `Mahasiswa USM ${i}`,
          username,
          contact: `08${1000000000 + i}`,
          role: 'RENTER',
          password: renterPassword,
        });
      }
      renterUsernames.push(username);
    }
    console.log('👥 Ensured 20 USM renters exist');

    // Get renter IDs
    const renters = await db.query.users.findMany({
      where: (users, { like }) => like(users.username, 'usm_renter%'),
    });
    const renterIds = renters.map(r => r.id);

    // Insert kos data
    let inserted = 0;
    let skipped = 0;

    for (const kosData of kosDataList) {
      // Check if kos already exists (by name + city)
      const existing = await db.query.kos.findFirst({
        where: (kos, { and, eq }) =>
          and(eq(kos.name, kosData.name), eq(kos.city, kosData.city)),
      });

      if (existing) {
        console.log(`⏭️ Skipping existing: ${kosData.name}`);
        skipped++;
        continue;
      }

      // Create post first
      const [post] = await db.insert(posts).values({
        userId: usmSeller.id,
        title: kosData.title,
        description: kosData.description,
        price: kosData.price,
        isFeatured: kosData.isFeatured,
        viewCount: Math.floor(Math.random() * 500) + 50,
        favoriteCount: Math.floor(Math.random() * 30) + 5,
        averageRating: String(kosData.averageRating),
        reviewCount: kosData.reviewCount,
        photoCount: 0,
      }).returning();

      // Create kos
      const [newKos] = await db.insert(kos).values({
        postId: post.id,
        name: kosData.name,
        address: kosData.address,
        city: kosData.city,
        facilities: kosData.facilities,
        totalRooms: kosData.totalRooms,
        occupiedRooms: kosData.occupiedRooms,
        latitude: kosData.latitude,
        longitude: kosData.longitude,
      }).returning();

      // Insert reviews (max 5 per kos)
      const reviewsToInsert = kosData.reviews.slice(0, 5);
      for (let i = 0; i < reviewsToInsert.length; i++) {
        const review = reviewsToInsert[i];
        const renterId = renterIds[i % renterIds.length];

        // Check if this renter already reviewed this kos
        const existingReview = await db.query.reviews.findFirst({
          where: (reviews, { and, eq }) =>
            and(eq(reviews.kosId, newKos.id), eq(reviews.userId, renterId)),
        });

        if (!existingReview) {
          await db.insert(reviews).values({
            kosId: newKos.id,
            userId: renterId,
            rating: Math.min(5, Math.max(1, review.rating)),
            comment: review.comment.substring(0, 500),
          });
        }
      }

      inserted++;
      console.log(`✅ Inserted: ${kosData.name} (${reviewsToInsert.length} reviews)`);
    }

    console.log('\n--- Seeding Complete ---');
    console.log(`✅ Inserted: ${inserted}`);
    console.log(`⏭️ Skipped (existing): ${skipped}`);
    console.log(`📊 Total in file: ${kosDataList.length}`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
}

seedUSM();
