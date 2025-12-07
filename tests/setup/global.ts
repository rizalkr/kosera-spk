import { beforeAll, afterAll, beforeEach } from 'vitest';
import './env';
import { resetDatabase, closeDatabase } from './db';
import { execSync } from 'node:child_process';

beforeAll(async () => {
  // Optionally run migrations before tests if DRIZZLE_MIGRATE_ON_TEST=1
  if (process.env.DRIZZLE_MIGRATE_ON_TEST === '1') {
    try {
      // Use drizzle-kit migrate with .env.test
      execSync('dotenv -e .env.test -- npx drizzle-kit migrate', { stdio: 'inherit' });
    } catch (e) {
      console.error('[test:migrate] Failed to apply migrations', e);
      throw e;
    }
  }
});

beforeEach(async () => {
  // Skip database reset for pure unit tests
  if (process.env.SKIP_DB_RESET === '1') {
    return;
  }
  if (process.env.INTEGRATION_PERSIST === '1') {
    return; // allow state to persist across tests in a file
  }
  await resetDatabase();
});

afterAll(async () => {
  await closeDatabase();
});
