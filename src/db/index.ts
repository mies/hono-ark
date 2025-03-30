import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import * as schema from './schema';

// Get the database URL from the environment
const DATABASE_URL = process.env.DATABASE_URL as string;

// Initialize neon connection
const sql = neon(DATABASE_URL);
const db = drizzle(sql, { schema });

export default db;