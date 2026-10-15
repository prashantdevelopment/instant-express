import type { Request, Response, NextFunction } from 'express';
import jwt, { type JwtPayload } from 'jsonwebtoken';
import User, { type UserDocument } from '../models/User.js';
import AppError from '../utils/AppError.js';
import { env } from '../config/env.js';

// Lets TypeScript know about req.user
declare global {
  namespace Express {
    interface Request {
      user?: UserDocument;
    }
  }
}

// Add to any route that needs a logged-in user: router.get('/me', protect, me)
export async function protect(req: Request, res: Response, next: NextFunction) {
  const token: string | undefined = req.cookies.token;
  if (!token) throw new AppError(401, 'Please log in');

  let payload: JwtPayload;
  try {
    payload = jwt.verify(token, env.jwtSecret, { algorithms: ['HS256'] }) as JwtPayload;
  } catch {
    throw new AppError(401, 'Session expired, please log in again');
  }

  const user = await User.findById(payload.id);
  if (!user) throw new AppError(401, 'User no longer exists');

  req.user = user; // controllers read the logged-in user from here — never trust a user id sent by the client
  next();
}
