// server.js
import express from 'express';
import { createServer } from 'node:http';
import { Nuxt } from 'nuxt';
import { searchBooks } from './backend/searchBooks.js'; // импорт

const app = express();

// --- Добавляем бэкенд-роуты ---
app.get('/api/health', (req, res) => {
   res.json({ status: 'ok' });
});

app.get('/api/search', async (req, res) => {
   const { q } = req.query;
   try {
      const results = await searchBooks(q);
      res.json(results);
   } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
   }
});
// -------------------------------

const nuxt = new Nuxt({ buildDir: 'dist' });
app.use(nuxt.render);

const server = createServer(app);
server.listen(3000, () => {
   console.log('Server is running on port 3000');
});