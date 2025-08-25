// server/api/books/index.ts
import { defineEventHandler } from 'h3';
import { executeQuery } from '../../../utils/ydb';

export default defineEventHandler(async () => {
   const query = `
    SELECT * FROM books
    WHERE title LIKE '%query%' OR author LIKE '%query%';
  `;

   const result = await executeQuery<{ book_id: string; title: string; author: string }>(query);

   return {
      statusCode: 200,
      body: JSON.stringify(result),
      headers: { 'Content-Type': 'application/json' },
   };
});