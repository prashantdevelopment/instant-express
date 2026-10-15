import type { ErrorRequestHandler, RequestHandler } from 'express';

export const notFound: RequestHandler = (req, res) => {
  res.status(404).json({ success: false, message: `Route not found: ${req.method} ${req.originalUrl}` });
};

// Express 5 sends errors thrown in async controllers here automatically — no try/catch needed
export const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  let status: number = err.statusCode || err.status || 500; // AppError or body-parser errors (bad JSON → 400)
  let message: string = err.message;

  // @if db
  if (err.name === 'ValidationError') status = 400; // Mongoose schema validation failed
  if (err.name === 'CastError') [status, message] = [400, 'Invalid id'];
  if (err.code === 11000) [status, message] = [409, 'Already exists']; // unique index violation

  // @endif
  // Never leak internal details (stack, DB errors) to the client
  if (status >= 500) {
    console.error(err);
    message = 'Something went wrong';
  }

  res.status(status).json({ success: false, message });
};
