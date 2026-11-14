import { config } from 'dotenv';
import fs from 'node:fs';
import path from 'node:path';

/**
 * Load environment variables deterministically for standalone CLI scripts.
 * Prioritizes .env.local for local development, then falls back to .env.
 */
const envLocalPath = path.join(process.cwd(), '.env.local');
if (fs.existsSync(envLocalPath)) {
  config({ path: envLocalPath });
}
config();
