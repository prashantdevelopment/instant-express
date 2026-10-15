<p align="center">
  <h1 align="center">⚡ instant-express</h1>
  <p align="center">One command. A production-ready Express backend — JavaScript or TypeScript.</p>
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/instant-express"><img src="https://img.shields.io/npm/v/instant-express?color=blue&label=npm" alt="npm version"></a>
  <a href="https://www.npmjs.com/package/instant-express"><img src="https://img.shields.io/npm/dm/instant-express?color=green" alt="npm downloads"></a>
  <a href="https://github.com/prashantdevelopment/instant-express/blob/main/LICENSE"><img src="https://img.shields.io/npm/l/instant-express?color=yellow" alt="license"></a>
</p>

---

## 🚀 Quick Start

```bash
npx instant-express my-api
```

Answer a few questions and your backend is ready. Skip the questions with defaults:

```bash
npx instant-express my-api --yes        # JavaScript
npx instant-express my-api --yes --ts   # TypeScript
```

Requires **Node.js 22+**.

### Demo

```text
$ npx instant-express my-api

⚡ instant-express

? Language: TypeScript
? Use MongoDB (Mongoose)? Yes
? Add authentication (signup, login, logout, me — JWT in httpOnly cookie)? Yes
? Extras: Tests, Initialize a git repository
? Port: 5000
? Install dependencies now? Yes

✔ Created my-api/ (TypeScript)
✔ Git repository initialized

🎉 Done! Next steps:

  cd my-api
  npm run dev
```

---

## ⚙️ What you can choose

| Question | Options | Default |
|----------|---------|---------|
| Language | JavaScript / TypeScript | JavaScript |
| Database | MongoDB (Mongoose) or none | MongoDB |
| Authentication | Signup, login, logout, `/me` with JWT in an httpOnly cookie | Yes |
| Extras | Tests · Docker · git init | Tests + git |
| Port | any | `5000` |
| Install dependencies | yes / no | Yes |

Only the packages you need are installed. Works with npm, pnpm, yarn and bun (`pnpm dlx instant-express my-api`).

---

## ✨ What every project gets

| | |
|---|---|
| **Express 5** | Async errors handled automatically — no try/catch in every controller |
| **Security** | `helmet` headers, CORS locked to your frontend, rate limiting, 100kb body limit |
| **Error handling** | One error middleware, clean JSON errors, no stack traces leaked |
| **Env config** | One `config/env` file, fails fast if a required variable is missing |
| **Graceful shutdown** | Closes the server and DB cleanly on deploy/restart |
| **Logging** | `morgan` request logs |
| **Auth (optional)** | bcrypt hashing, httpOnly cookie, stricter rate limit on login/signup, auto-generated JWT secret |
| **Tests (optional)** | `node:test` + `supertest`, runs without a database |
| **Docker (optional)** | `Dockerfile` + `docker-compose.yml` (with MongoDB) |

---

## 🗂️ Generated structure

```
my-api/
├── src/
│   ├── server.js            # starts server, connects DB, graceful shutdown
│   ├── app.js               # middlewares + routes
│   ├── config/
│   │   ├── env.js           # all env variables in one place
│   │   └── db.js            # MongoDB connection (Atlas DNS fix built in)
│   ├── controllers/authController.js
│   ├── middlewares/
│   │   ├── authMiddleware.js   # protect — requires login
│   │   └── errorMiddleware.js  # 404 + error handler
│   ├── models/User.js
│   ├── routes/authRoutes.js
│   └── utils/AppError.js    # throw new AppError(404, 'Not found')
├── tests/app.test.js
├── .env / .env.example
├── Dockerfile / docker-compose.yml
└── package.json
```

TypeScript projects have the same structure with `.ts` files and a `tsconfig.json`.

---

## 🔌 API (with auth)

| Method | Route | |
|--------|-------|---|
| GET | `/api/health` | Health check |
| POST | `/api/auth/signup` | `{ name, email, password }` |
| POST | `/api/auth/login` | `{ email, password }` |
| POST | `/api/auth/logout` | Clears the cookie |
| GET | `/api/auth/me` | Logged-in user |

Frontend requests need `credentials: 'include'` (fetch) or `withCredentials: true` (axios), and `CLIENT_URL` in `.env` set to your frontend URL.

---

## 📜 Scripts in the generated project

| | JavaScript | TypeScript |
|---|---|---|
| `npm run dev` | `node --watch` | `tsx watch` |
| `npm run build` | — | `tsc` → `dist/` |
| `npm start` | `node src/server.js` | `node dist/server.js` |
| `npm test` | `node --test` | `tsx --test` |

---

## 🛡️ MongoDB Atlas DNS fix

`querySrv ECONNREFUSED` / `ESERVFAIL` on some ISPs? For `mongodb+srv://` URLs the generated `db.js` uses Cloudflare + Google DNS automatically.

---

## 🔄 Upgrading from v1

v2 is a new generator; projects created with v1 keep working as they are. What changed for new projects:

- Code lives in `src/`, built on **Express 5** and **Mongoose 9**
- Auth uses an **httpOnly cookie** (v1 returned the token in the response body) and adds `GET /api/auth/me`
- `dotenv` and `nodemon` replaced by Node's built-in `process.loadEnvFile()` and `node --watch`
- New: TypeScript, security middleware, tests and Docker options

---

## 🤝 Contributing

Issues and pull requests are welcome.

## 📄 License

MIT © [Prashant](https://github.com/prashantdevelopment)
