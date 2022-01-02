const express = require('express');
const { createServer: createViteServer } = require('vite');

async function createServer() {
  const app = express();

  const vite = await createViteServer({
    server: {
      open: true,
      fs: {
        strict: false
      },
      host: 'localhost',
      port: 8000,
      middlewareMode: 'html'
    }
  });
  
  app.use(vite.middlewares);

  app.listen(9000);
}

createServer();
