
import express from "express";
import dotenv from "dotenv";
import { neon } from "@neondatabase/serverless";
import ratelimiter from "./src/middleware/rateLimiter.js";
import transectionRoutes from "./src/routes/transectionRoutes.js";
import { initDB } from "./src/config/db.js";

 dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
app.use(ratelimiter);
app.use(express.json());

// Neon DB
const sql = neon(process.env.DATABASE_URL);
// Initialize DB


// Health check
// app.get("/", (req, res) => {
//   res.send("🚀 Server is running");
// });

app.use("/api/transection", transectionRoutes);
 
// Start server
initDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
});





 