import { withAuth, AuthenticatedRequest } from '@/lib/middleware';
import { db } from '@/db';
import { kos, posts, users } from '@/db/schema';
import { sql, eq, desc, count } from 'drizzle-orm';
import { ok, fail } from '@/types/api';

export const GET = withAuth(async (request: AuthenticatedRequest) => {
  try {
    if (request.user?.role !== 'ADMIN') {
      return fail('forbidden', 'Access denied. Admin role required.', undefined, { status: 403 });
    }

    const [totalKosStats, topPerformingKos, cityDistribution, priceStatistics, featuredStats, recentActivity] = await Promise.all([
      db
        .select({
          totalKos: count(),
          totalViews: sql<number>`COALESCE(sum(${posts.viewCount})::double precision, 0)`,
          totalFavorites: sql<number>`COALESCE(sum(${posts.favoriteCount})::double precision, 0)`,
          averageRating: sql<number>`COALESCE(avg(${posts.averageRating})::double precision, 0)`,
          totalReviews: sql<number>`COALESCE(sum(${posts.reviewCount})::double precision, 0)`,
        })
        .from(kos)
        .innerJoin(posts, eq(kos.postId, posts.id)),
      db
        .select({
          id: kos.id,
            name: kos.name,
            city: kos.city,
            title: posts.title,
            price: posts.price,
            viewCount: posts.viewCount,
            favoriteCount: posts.favoriteCount,
            averageRating: posts.averageRating,
            reviewCount: posts.reviewCount,
            qualityScore: sql<number>`(
            ((${posts.averageRating})::double precision * 0.4) +
            ((${posts.reviewCount})::double precision * 0.2) +
            ((${posts.favoriteCount})::double precision * 0.2) +
            ((${posts.photoCount})::double precision * 0.1) +
            ((${posts.viewCount})::double precision * 0.1)
          )::double precision`,
            owner: { name: users.name, username: users.username },
        })
        .from(kos)
        .innerJoin(posts, eq(kos.postId, posts.id))
        .innerJoin(users, eq(posts.userId, users.id))
        .orderBy(
          desc(
            sql`(
          ((${posts.averageRating})::double precision * 0.4) +
          ((${posts.reviewCount})::double precision * 0.2) +
          ((${posts.favoriteCount})::double precision * 0.2) +
          ((${posts.photoCount})::double precision * 0.1) +
          ((${posts.viewCount})::double precision * 0.1)
        )::double precision`
          )
        )
        .limit(10),
      db
        .select({
          city: kos.city,
          kosCount: count(),
          averagePrice: sql<number>`COALESCE(avg(${posts.price})::double precision, 0)`,
          totalViews: sql<number>`COALESCE(sum(${posts.viewCount})::double precision, 0)`,
        })
        .from(kos)
        .innerJoin(posts, eq(kos.postId, posts.id))
        .groupBy(kos.city)
        .orderBy(desc(count())),
      db
        .select({
          minPrice: sql<number>`COALESCE(min(${posts.price})::double precision, 0)`,
          maxPrice: sql<number>`COALESCE(max(${posts.price})::double precision, 0)`,
          averagePrice: sql<number>`COALESCE(avg(${posts.price})::double precision, 0)`,
          medianPrice: sql<number>`COALESCE((percentile_cont(0.5) within group (order by ${posts.price}))::double precision, 0)`,
        })
        .from(posts)
        .innerJoin(kos, eq(posts.id, kos.postId)),
      db
        .select({
          totalFeatured: count(),
          averageFeaturedViews: sql<number>`COALESCE(avg(${posts.viewCount})::double precision, 0)`,
          averageFeaturedRating: sql<number>`COALESCE(avg(${posts.averageRating})::double precision, 0)`,
        })
        .from(posts)
        .innerJoin(kos, eq(posts.id, kos.postId))
        .where(eq(posts.isFeatured, true)),
      db
        .select({
          kosName: kos.name,
          city: kos.city,
          viewCount: posts.viewCount,
          favoriteCount: posts.favoriteCount,
          updatedAt: posts.updatedAt,
        })
        .from(kos)
        .innerJoin(posts, eq(kos.postId, posts.id))
        .where(sql`${posts.updatedAt} >= NOW() - INTERVAL '7 days'`)
        .orderBy(desc(posts.updatedAt))
        .limit(20),
    ]);

    return ok('Analytics data retrieved successfully', {
      overview: totalKosStats[0],
      topPerforming: topPerformingKos,
      cityDistribution,
      priceStatistics: priceStatistics[0],
      featuredStatistics: featuredStats[0] || {
        totalFeatured: 0,
        averageFeaturedViews: 0,
        averageFeaturedRating: 0,
      },
      recentActivity,
      generatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error retrieving analytics:', error);
    return fail('internal_error', 'Failed to retrieve analytics data', undefined, { status: 500 });
  }
});
