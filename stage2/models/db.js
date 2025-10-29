import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

let db;

try {
  db = await mysql.createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  });
  console.log('✅ Connected to MySQL Database');
} catch (err) {
  console.error('❌ MySQL connection failed:', err.message);
  process.exit(1); // stop the app if DB fails
}

export { db };
