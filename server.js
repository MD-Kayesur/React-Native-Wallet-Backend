
import express from "express";
import dotenv from "dotenv";
import { neon } from "@neondatabase/serverless";
import ratelimiter from "./middleware/rateLimiter.js";

 dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
app.use(ratelimiter);
app.use(express.json());

// Neon DB
const sql = neon(process.env.DATABASE_URL);
import transectionRoutes from "./routes/transectionRoutes.js";
// Initialize DB
async function initDB() {
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

// Health check
app.get("/", (req, res) => {
  res.send("🚀 Server is running");
});

app.use("/api/transection", transectionRoutes);
 
// Start server
initDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
});





 