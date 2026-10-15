import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import { rateLimit } from 'express-rate-limit';
// @if auth
import cookieParser from 'cookie-parser';
import authRoutes from './routes/authRoutes.js';
// @endif
import { env, isProd } from './config/env.js';
import { notFound, errorHandler } from './middlewares/errorMiddleware.js';

const app = express();

app.set('trust proxy', 1); // real client IP behind Render/Railway/Nginx — needed for rate limiting
app.use(helmet()); // secure HTTP headers
app.use(cors({ origin: env.clientUrl, credentials: true })); // only your frontend can call the API
app.use(express.json({ limit: '100kb' })); // parse JSON bodies, reject huge ones
// @if auth
app.use(cookieParser());
// @endif
if (env.nodeEnv !== 'test') app.use(morgan(isProd ? 'combined' : 'dev')); // request logs

// Max 300 requests per 15 minutes per IP on every /api route
app.use('/api', rateLimit({ windowMs: 15 * 60 * 1000, limit: 300 }));

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});
// @if auth
app.use('/api/auth', authRoutes);
// @endif

// These two must stay last
app.use(notFound);
app.use(errorHandler);

export default app;
