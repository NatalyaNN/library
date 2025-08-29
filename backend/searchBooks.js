// backend/searchBooks.js
const { executeQuery } = require('./utils/ydb');

async function searchBooks(q) {
   const query = `
      DECLARE $query AS Utf8;
      SELECT book_id as id, title, author, publish_year as year, description, cover_url as coverUrl
      FROM books
      WHERE title LIKE $query OR author LIKE $query OR description LIKE $query
      LIMIT 20;
   `;

   const params = {
      '$query': `%${q}%`
   };

   return await executeQuery(query, params);
}

module.exports = { searchBooks };