const express = require('express');
const { createServer } = require('node:http');
const { Nuxt } = require('nuxt');

const app = express();
const nuxt = new Nuxt({ buildDir: 'dist' });

app.use(nuxt.render);

const server = createServer(app);
server.listen(3000, () => {
   console.log('Server is running on port 3000');
});