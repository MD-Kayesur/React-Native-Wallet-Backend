import { sql } from "../config/db.js";

export async function getTransactionsByUserid(req, res) {
  try {
    const { user_id } = req.params;

    const result = await sql`
          SELECT * FROM Transection
          WHERE user_id = ${user_id}
          ORDER BY created_at DESC
        `;

    res.status(200).json(result);
  } catch {
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

export async function createTransaction(req, res) {
  try {
    const { user_id, title, amount, category } = req.body;

    if (!user_id || !title || amount === undefined || !category) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const result = await sql`
          INSERT INTO Transection (user_id, title, amount, category)
          VALUES (${user_id}, ${title}, ${amount}, ${category})
          RETURNING *
        `;

    res.status(201).json(result[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

export async function deleteTransaction(req, res) {
  try {
    const { id } = req.params;

    if (isNaN(Number(id))) {
      return res.status(400).json({ error: 'Invalid ID' });
    }

    const result = await sql`
          DELETE FROM Transection WHERE id = ${id} RETURNING *
        `;

    if (result.length === 0) {
      return res.status(404).json({ error: 'Transection not found' });
    }

    res.status(200).json({ message: 'Transection deleted successfully' });
  } catch {
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
export async function updateTransaction(req, res) {
  try {
    const { id } = req.params;
    const { user_id, title, amount, category } = req.body;

    if (isNaN(Number(id))) {
      return res.status(400).json({ error: 'Invalid ID' });
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
      return res.status(404).json({ error: 'Transection not found' });
    }

    res.status(200).json(result[0]);
  } catch {
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

export async function getTransactionSummary(req, res) {
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
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
