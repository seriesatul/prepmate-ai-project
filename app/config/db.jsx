import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import * as schema from './schema'; // Import everything from your schema

// Check if the DATABASE_URL is set
if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is not set');
}

// Create the database client
const sql = neon(process.env.DATABASE_URL);

// Create the Drizzle instance with the schema and client
export const db = drizzle(sql, { schema });