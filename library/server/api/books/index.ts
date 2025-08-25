// server/api/books/index.js
import { initDb } from '../../../utils/ydb';

export default defineEventHandler(async (event) => {
   const pool = await initDb();
   const query = `
    SELECT * FROM books
    WHERE title LIKE '%query%' OR author LIKE '%query%';
  `;
   const result = await pool.query(query);

   return {
      statusCode: 200,
      body: JSON.stringify(result),
      headers: { 'Content-Type': 'application/json' },
   };
});