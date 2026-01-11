
import express from 'express';
import dotenv from 'dotenv';
import { neon } from '@neondatabase/serverless';

dotenv.config();

const PORT = process.env.PORT || 5000;
const app = express();

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

// Start server after DB init
initDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
  });
});








// import express from 'express';
// import dotenv from 'dotenv';
// const PORT = process.env.PORT || 5000;
// dotenv.config();
// const app = express();

//  async function initDB() {
//     try {
//         await sql `CREATE TABLE IF NOT EXISTS Transection(
//             id SERIAL PRIMARY KEY,
//             user_id VARCHAR(255) UNIQUE NOT NULL,
//             title VARCHAR(255) UNIQUE NOT NULL,
//             amount VARCHAR(10,2) NOT NULL,
//             create_at DATE NOTE NULL  CURRENT_DATE,
//             category VARCHAR(255) NOT NULL,
            
//         )`;
//         console.log("Database initialized successfully");
//     } catch (error) {
//         console.error("Error initializing database:", error);
//         process.exit(1); //status code 1 means failure,0 means success
//     }

//  }


// app.get('/', (req, res) => {
//   res.send('Server is running');
// });

// initDB().then(() => {
//     app.listen(PORT, () => {
//         console.log(`Server is running on port ${PORT}`);
//     });
// });

