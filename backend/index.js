// backend/index.js
const { defineEventHandler, getQuery } = require('h3');
const { searchBooks } = require('./searchBooks');

exports.handler = defineEventHandler(async (event) => {
   const { q } = getQuery(event);

   try {
      const results = await searchBooks(q);
      return {
         statusCode: 200,
         headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
         },
         body: JSON.stringify(results)
      };
   } catch (error) {
      return {
         statusCode: 500,
         body: JSON.stringify({ error: 'Internal server error' })
      };
   }
});