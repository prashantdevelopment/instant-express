import dns from 'node:dns';
import mongoose from 'mongoose';
import { env } from './env.js';

// Fixes Atlas "querySrv ECONNREFUSED / ESERVFAIL" on ISPs whose DNS can't resolve SRV records
if (env.mongoUri.startsWith('mongodb+srv://')) dns.setServers(['1.1.1.1', '8.8.8.8']);

export async function connectDB() {
  await mongoose.connect(env.mongoUri);
  console.log(`✅ MongoDB connected: ${mongoose.connection.host}`);
}

export async function disconnectDB() {
  await mongoose.disconnect();
}
