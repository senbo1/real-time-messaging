import { drizzle } from 'drizzle-orm/neon-serverless';
import { Pool, neonConfig } from '@neondatabase/serverless';
import * as schema from './schema';
import { config } from 'dotenv';
import ws from 'ws';

config({ path: '.env' });
neonConfig.webSocketConstructor = ws;

const sql = new Pool({ connectionString: process.env.DB_URL! });
export const db = drizzle(sql, { schema });
