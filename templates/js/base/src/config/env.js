// Load .env in development. In production the hosting platform sets env vars, so a missing file is fine.
try {
  process.loadEnvFile();
} catch {}

function required(name) {
  const value = process.env[name];
  if (!value) throw new Error(`Missing env variable ${name} — copy .env.example to .env and fill it in`);
  return value;
}

// The only file that reads process.env. Everything else imports `env` from here.
export const env = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: Number(process.env.PORT) || {{PORT}},
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
  // @if db
  mongoUri: required('MONGO_URI'),
  // @endif
  // @if auth
  jwtSecret: required('JWT_SECRET'),
  // @endif
};

export const isProd = env.nodeEnv === 'production';
