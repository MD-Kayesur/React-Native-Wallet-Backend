import express from 'express';
import { sql } from '../config/db.js';
const router = express.Router();
import {
  createTransaction,
  getTransactionsByUserid,
  deleteTransaction,
  updateTransaction,
  getTransactionSummary,
} from '../controller/transectionController.js';
// Get ALL transactions
router.get('/', async (req, res) => {
  try {
    const result = await sql`
      SELECT * FROM Transection ORDER BY created_at DESC
    `;
    res.status(200).json(result);
  } catch {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Create transaction
router.post('/', createTransaction);

// Get transactions by user
router.get('/user/:user_id', getTransactionsByUserid);

// Update transaction
router.put('/:id', updateTransaction);

// Delete transaction
router.delete('/:id', deleteTransaction);

// Transaction summary
router.get('/summary/:user_id', getTransactionSummary);
export default router;
