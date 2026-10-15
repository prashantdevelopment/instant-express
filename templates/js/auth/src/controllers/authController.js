import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import AppError from '../utils/AppError.js';
import { env, isProd } from '../config/env.js';

const SEVEN_DAYS = 7 * 24 * 60 * 60 * 1000;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const cookieOptions = { httpOnly: true, secure: isProd, sameSite: 'lax' };

// Put the JWT in an httpOnly cookie — JavaScript in the browser can't read it, so XSS can't steal it
function sendToken(res, user, statusCode) {
  const token = jwt.sign({ id: user.id }, env.jwtSecret, { expiresIn: '7d' });
  res.cookie('token', token, { ...cookieOptions, maxAge: SEVEN_DAYS });
  res.status(statusCode).json({ success: true, user });
}

// POST /api/auth/signup
export async function signup(req, res) {
  const { name, email, password } = req.body ?? {};

  // typeof checks also block NoSQL injection like { "email": { "$ne": null } }
  if (typeof name !== 'string' || !name.trim()) throw new AppError(400, 'Name is required');
  if (typeof email !== 'string' || !EMAIL_REGEX.test(email)) throw new AppError(400, 'A valid email is required');
  if (typeof password !== 'string' || password.length < 8 || password.length > 64) {
    throw new AppError(400, 'Password must be 8-64 characters');
  }

  if (await User.exists({ email: email.toLowerCase() })) throw new AppError(409, 'Email is already registered');

  const user = await User.create({ name, email, password });
  sendToken(res, user, 201);
}

// POST /api/auth/login
export async function login(req, res) {
  const { email, password } = req.body ?? {};
  if (typeof email !== 'string' || typeof password !== 'string') {
    throw new AppError(400, 'Email and password are required');
  }

  const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
  // Same message for "no user" and "wrong password", so attackers can't discover which emails exist
  if (!user || !(await user.comparePassword(password))) throw new AppError(401, 'Invalid email or password');

  sendToken(res, user, 200);
}

// POST /api/auth/logout
export function logout(req, res) {
  res.clearCookie('token', cookieOptions);
  res.json({ success: true, message: 'Logged out' });
}

// GET /api/auth/me  (protected)
export function me(req, res) {
  res.json({ success: true, user: req.user });
}
