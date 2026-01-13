import { neon } from '@neondatabase/serverless';
import 'dotenv/config';
// Initialize the Neon client with the  SQL URL from environment variables

export const sql = neon(process.env.DATABASE_URL);
