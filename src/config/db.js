import { neon } from '@neondatabase/serverless';
import 'dotenv/config';
// Initialize the Neon client with the  SQL URL from environment variables

export const sql = neon(process.env.DATABASE_URL);

 
export async function initDB() {
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS Transection (
        id SERIAL PRIMARY KEY,
        user_id VARCHAR(255) NOT NULL,
        title VARCHAR(255) NOT NULL,
        amount NUMERIC(10,2) NOT NULL,
        created_at DATE DEFAULT CURRENT_DATE,
        category VARCHAR(255) NOT NULL
      );
    `;
    console.log("✅ Database initialized successfully");
  } catch (error) {
    console.error("❌ DB init failed:", error);
    process.exit(1);
  }
}