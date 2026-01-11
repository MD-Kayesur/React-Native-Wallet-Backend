
import express from "express";
import dotenv from "dotenv";
import { neon } from "@neondatabase/serverless";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

// Neon DB
const sql = neon(process.env.DATABASE_URL);

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

// Get ALL transactions
app.get("/api/transection", async (req, res) => {
  try {
    const result = await sql`
      SELECT * FROM Transection ORDER BY created_at DESC
    `;
    res.status(200).json(result);
  } catch {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Create transaction
app.post("/api/transection", async (req, res) => {
  try {
    const { user_id, title, amount, category } = req.body;

    if (!user_id || !title || amount === undefined || !category) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const result = await sql`
      INSERT INTO Transection (user_id, title, amount, category)
      VALUES (${user_id}, ${title}, ${amount}, ${category})
      RETURNING *
    `;

    res.status(201).json(result[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Get transactions by user
app.get("/api/transection/user/:user_id", async (req, res) => {
  try {
    const { user_id } = req.params;

    const result = await sql`
      SELECT * FROM Transection
      WHERE user_id = ${user_id}
      ORDER BY created_at DESC
    `;

    res.status(200).json(result);
  } catch {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Update transaction
app.put("/api/transection/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { user_id, title, amount, category } = req.body;

    if (isNaN(Number(id))) {
      return res.status(400).json({ error: "Invalid ID" });
    }

    const result = await sql`
      UPDATE Transection
      SET user_id = ${user_id},
          title = ${title},
          amount = ${amount},
          category = ${category}
      WHERE id = ${id}
      RETURNING *
    `;

    if (result.length === 0) {
      return res.status(404).json({ error: "Transection not found" });
    }

    res.status(200).json(result[0]);
  } catch {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Delete transaction
app.delete("/api/transection/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (isNaN(Number(id))) {
      return res.status(400).json({ error: "Invalid ID" });
    }

    const result = await sql`
      DELETE FROM Transection WHERE id = ${id} RETURNING *
    `;

    if (result.length === 0) {
      return res.status(404).json({ error: "Transection not found" });
    }

    res.status(200).json({ message: "Transection deleted successfully" });
  } catch {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Transaction summary
app.get("/api/transection/summary/:user_id", async (req, res) => {
  try {
    const { user_id } = req.params;

    const result = await sql`
      SELECT
        COALESCE(SUM(amount), 0) AS balance,
        COALESCE(SUM(amount) FILTER (WHERE amount > 0), 0) AS income,
        COALESCE(ABS(SUM(amount) FILTER (WHERE amount < 0)), 0) AS expenses
      FROM Transection
      WHERE user_id = ${user_id}
    `;

    res.status(200).json({
      balance: Number(result[0].balance),
      income: Number(result[0].income),
      expenses: Number(result[0].expenses),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Start server
initDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
});





 