import { test } from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';

// Tests don't need a running database or a .env file
process.env.NODE_ENV = 'test';
// @if db
process.env.MONGO_URI ??= 'mongodb://127.0.0.1:27017/{{PROJECT_NAME}}-test';
// @endif
// @if auth
process.env.JWT_SECRET ??= 'test-secret';
// @endif
const { default: app } = await import('../src/app.js');

test('GET /api/health returns ok', async () => {
  const res = await request(app).get('/api/health');
  assert.equal(res.status, 200);
  assert.equal(res.body.status, 'ok');
});

test('unknown route returns 404 JSON', async () => {
  const res = await request(app).get('/api/nope');
  assert.equal(res.status, 404);
  assert.equal(res.body.success, false);
});

test('invalid JSON body returns 400', async () => {
  const res = await request(app).post('/api/health').set('Content-Type', 'application/json').send('{bad');
  assert.equal(res.status, 400);
});
// @if auth

test('signup rejects a short password', async () => {
  const res = await request(app).post('/api/auth/signup').send({ name: 'A', email: 'a@b.co', password: '123' });
  assert.equal(res.status, 400);
});

test('login rejects NoSQL injection in email', async () => {
  const res = await request(app).post('/api/auth/login').send({ email: { $ne: null }, password: 'x' });
  assert.equal(res.status, 400);
});

test('GET /api/auth/me without a cookie returns 401', async () => {
  const res = await request(app).get('/api/auth/me');
  assert.equal(res.status, 401);
});
// @endif
