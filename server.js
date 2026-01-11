
import express from 'express';
import dotenv from 'dotenv';
import { neon } from '@neondatabase/serverless';

dotenv.config();

const PORT = process.env.PORT || 5000;
const app = express();
app.use(express.json());
// app.use((req, res, next) => {
//     console.log("hy we hit the request metohod is" , req.method )

// //   res.header('Access-Control-Allow-Origin', '*');
// //   res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
//   next();
// });
// Create sql instance for Neon DB
const sql = neon(process.env.DATABASE_URL);

// Initialize DB and table
async function initDB() {
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS Transection (
        id SERIAL PRIMARY KEY,
        user_id VARCHAR(255) NOT NULL,
        title VARCHAR(255) NOT NULL,
        amount NUMERIC(10,2) NOT NULL,
        create_at DATE DEFAULT CURRENT_DATE,
        category VARCHAR(255) NOT NULL
      )
    `;
    console.log('✅ Database initialized successfully');
  } catch (error) {
    console.error('❌ Error initializing database:', error);
    process.exit(1);
  }
}

 
// Test route
app.get('/', (req, res) => {
  res.send('Server is running');
});

 app.get('/api/transection', async (req, res) => {
  try {
    const result = await sql`SELECT * FROM Transection ORDER BY create_at DESC`;  
    res.status(200).json(result);
  } catch (error) {
    console.error('Error executing query:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


// Create Transection

app.post('/api/transection', async (req, res) => {
  try {
    console.log(req.body)
    const { user_id, title, amount, category } = req.body;
    if (!user_id || !title || !amount || !category === undefined) {
      return res.status(400).json({ error: 'All fields are required' });
    }


    const result = await sql` INSERT INTO transection (user_id, title, amount, category)
      VALUES (${user_id}, ${title}, ${amount}, ${category})
      RETURNING *`;

    res.status(201).json(result[0]);
    console.log(result)
    
  } catch (error) {
    console.error('Error executing query:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Get all Transections with id
app.get('/api/transection/:user_id', async (req, res) => {
  const { user_id } = req.params;
  console.log(user_id)
  try {
    const result = await sql`SELECT * FROM Transection WHERE user_id = ${user_id} ORDER BY create_at DESC`;
    res.status(200).json(result);
  } catch (error) {
    console.error('Error executing query:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
  
});

//delete transection
app.delete('/api/transection/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if(isNaN(parseInt(id))){
      return res.status(400).json({ error: 'Invalid ID ' });
    }
    const result =  
      await sql`DELETE FROM Transection WHERE id = ${id} RETURNING *`;
      if (result.length === 0) {
        return res.status(404).json({ error: 'Transection not found' });
      }
     res.status(200).json({ message: 'Transection deleted successfully' });
    // console.log(result)
  } catch (error) {
    console.error('Error executing query:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.put('/api/transection/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { user_id, title, amount, category } = req.body;
    if(isNaN(parseInt(id))){
      return res.status(400).json({ error: 'Invalid ID ' });
    }
    const result = await sql`
      UPDATE Transection
      SET user_id = ${user_id}, title = ${title}, amount = ${amount}, category = ${category}
      WHERE id = ${id}
      RETURNING *
    `;
    if (result.length === 0) {
      return res.status(404).json({ error: 'Transection not found' });
    }
    res.status(200).json(result[0]);
  } catch (error) {
    console.error('Error executing query:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/api/transection/summary/:user_id', async (req, res) => {
  const { user_id } = req.params;
  try {
    const balenceResult = await sql`
      SELECT 
        SUM(CASE WHEN category = 'income' THEN amount ELSE 0 END) AS total_income,
        SUM(CASE WHEN category = 'expense' THEN amount ELSE 0 END) AS total_expense
      FROM Transection
      WHERE user_id = ${user_id}
    `;
    res.status(200).json(balenceResult[0]);
  } catch (error) {
    console.error('Error executing query:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Start server after DB init
initDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
  });
});





 