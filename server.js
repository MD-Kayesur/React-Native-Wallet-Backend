
import express from "express";
import dotenv from "dotenv";
import { neon } from "@neondatabase/serverless";
import ratelimiter from "./src/middleware/rateLimiter.js";
import transectionRoutes from "./src/routes/transectionRoutes.js";
import { initDB } from "./src/config/db.js";
import job from "./src/config/cron.js"; 
dotenv.config();

if(process.env.NODE_ENV !== 'production')job.start();
const app = express();
const PORT = process.env.PORT || 5000;
app.use(ratelimiter);
app.use(express.json());

// Neon DB
const sql = neon(process.env.DATABASE_URL);
// Initialize DB

app.get("/api/health", (req, res) => {
  res.status(200).json({ message: "Server is running" , status:"ok"});
});
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





 