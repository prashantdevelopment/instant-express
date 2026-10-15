import app from './app.js';
import { env } from './config/env.js';
// @if db
import { connectDB, disconnectDB } from './config/db.js';

// Connect to the database first — if it fails the app crashes here, instead of serving broken requests
await connectDB();
// @endif

const server = app.listen(env.port, () => {
  console.log(`🚀 Server running on http://localhost:${env.port}`);
});

// Graceful shutdown: stop taking new requests, finish the running ones, then exit
function shutdown(signal: string) {
  console.log(`${signal} received, shutting down...`);
  server.close(async () => {
    // @if db
    await disconnectDB();
    // @endif
    process.exit(0);
  });
}

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);
