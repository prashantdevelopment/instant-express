import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import AppError from '../utils/AppError.js';
import { env } from '../config/env.js';

// Add to any route that needs a logged-in user: router.get('/me', protect, me)
export async function protect(req, res, next) {
  const token = req.cookies.token;
  if (!token) throw new AppError(401, 'Please log in');

  let payload;
  try {
    payload = jwt.verify(token, env.jwtSecret, { algorithms: ['HS256'] });
  } catch {
    throw new AppError(401, 'Session expired, please log in again');
  }

  const user = await User.findById(payload.id);
  if (!user) throw new AppError(401, 'User no longer exists');

  req.user = user; // controllers read the logged-in user from here — never trust a user id sent by the client
  next();
}
