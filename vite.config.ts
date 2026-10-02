import { defineConfig, Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import { handleApiRequests } from './server/src/apiHandler';

function apiBackendPlugin(): Plugin {
  return {
    name: 'api-backend',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (req.url && req.url.startsWith('/api')) {
          handleApiRequests(req, res, next);
        } else {
          next();
        }
      });
    }
  };
}

export default defineConfig({
  base: './',
  plugins: [react(), apiBackendPlugin()],
  server: {
    port: 5178,
    host: true
  }
});
