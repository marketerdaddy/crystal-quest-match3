import http from 'http';
import { handleApiRequests } from './apiHandler';

const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3001;

const server = http.createServer((req, res) => {
  handleApiRequests(req, res, () => {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Route not found' }));
  });
});

server.listen(PORT, () => {
  console.log(`[CRYSTAL QUEST SERVER] Running on http://localhost:${PORT}`);
});
