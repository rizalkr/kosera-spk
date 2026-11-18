/**
 * Script to index all kos embeddings
 * Run: npx ts-node --compiler-options '{"module":"commonjs"}' scripts/index-embeddings.ts
 * Or inside container: docker exec -it kosera-app npx tsx scripts/index-embeddings.ts
 */

// Load environment variables (.env.local first, fallback to .env)
import '../src/lib/load-env';

import { indexBatch, getIndexingStats, checkHealth } from '../src/lib/ai';

async function main() {
  console.log('=== AI Embedding Indexer ===\n');

  // Check AI service health
  console.log('1. Checking AI service health...');
  try {
    const health = await checkHealth();
    console.log(`   Status: ONLINE`);
    console.log(`   Model: ${health.model}`);
    console.log(`   Dimensions: ${health.dimension}\n`);
  } catch (error) {
    console.error('   ERROR: AI service is not available');
    console.error('   Make sure docker compose is running with ai-service\n');
    process.exit(1);
  }

  // Get current stats
  console.log('2. Current indexing stats:');
  const stats = await getIndexingStats();
  console.log(`   Total kos: ${stats.total}`);
  console.log(`   Indexed: ${stats.indexed}`);
  console.log(`   Pending: ${stats.unindexed}\n`);

  if (stats.unindexed === 0) {
    console.log('All kos are already indexed!');
    process.exit(0);
  }

  // Index in batches
  console.log(`3. Indexing ${stats.unindexed} kos in batches of 50...`);
  const batchSize = 50;
  let totalProcessed = 0;
  let totalSuccessful = 0;
  let totalFailed = 0;
  const failedItems: Array<{ kosId: number; error?: string }> = [];

  while (totalProcessed < stats.unindexed) {
    const result = await indexBatch(batchSize, batchSize);
    if (result.totalProcessed === 0) break;

    totalProcessed += result.totalProcessed;
    totalSuccessful += result.successful;
    totalFailed += result.failed;
    failedItems.push(...result.results.filter((r) => !r.success));

    console.log(
      `   Progress: ${totalProcessed}/${stats.unindexed} (ok: ${totalSuccessful}, failed: ${totalFailed})`
    );
  }

  console.log(`\n4. Indexing complete!`);
  console.log(`   Processed: ${totalProcessed}`);
  console.log(`   Successful: ${totalSuccessful}`);
  console.log(`   Failed: ${totalFailed}`);

  if (failedItems.length > 0) {
    console.log('\n   Failed items:');
    failedItems
      .slice(0, 20)
      .forEach((r) => console.log(`   - Kos ${r.kosId}: ${r.error}`));
  }
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
