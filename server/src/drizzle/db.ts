import { Pool } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import { config } from 'dotenv';

config({ path: '.env' });

const sql = new Pool({ connectionString: process.env.DATABASE_URL });
export const db = drizzle(sql);
