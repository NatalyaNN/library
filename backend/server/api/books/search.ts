import { defineEventHandler, getQuery } from 'h3';
import { executeQuery } from '../../../utils/ydb';

export default defineEventHandler(async (event) => {
   const { q } = getQuery(event);

   if (!q || typeof q !== 'string') {
      return {
         statusCode: 400,
         body: { error: 'Query parameter "q" is required' }
      };
   }

   try {
      const query = `
      DECLARE $query AS Utf8;
      
      SELECT book_id as id, title, author, publish_year as year, description, cover_url as coverUrl
      FROM books
      WHERE title LIKE $query OR author LIKE $query OR description LIKE $query
      LIMIT 20;
    `;

      const params = {
         '$query': { type: 'Utf8', value: `%${q}%` }
      };

      const results = await executeQuery(query, params);

      return {
         statusCode: 200,
         body: results
      };
   } catch (error) {
      console.error('Search error:', error);
      return {
         statusCode: 500,
         body: { error: 'Internal server error' }
      };
   }
});