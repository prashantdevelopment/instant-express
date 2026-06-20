<p align="center">
  <h1 align="center">⚡ instant-express</h1>
  <p align="center">Generate a production-ready Express.js + MongoDB backend in seconds.</p>
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/instant-express"><img src="https://img.shields.io/npm/v/instant-express?color=blue&label=npm" alt="npm version"></a>
  <a href="https://www.npmjs.com/package/instant-express"><img src="https://img.shields.io/npm/dm/instant-express?color=green" alt="npm downloads"></a>
  <a href="https://github.com/prashantdevelopment/gen-server/blob/main/LICENSE"><img src="https://img.shields.io/npm/l/instant-express?color=yellow" alt="license"></a>
  <a href="https://github.com/prashantdevelopment/gen-server"><img src="https://img.shields.io/github/stars/prashantdevelopment/gen-server?style=social" alt="GitHub stars"></a>
</p>

---

## 🚀 Quick Start

No installation needed. Just run:

```bash
npx instant-express my-project
```

That's it! Your backend is ready. 🎉

---

## 🎬 Demo

```bash
$ npx instant-express my-app

🚀 Instant-Express CLI

? Enter port number: 5000
? Include JWT Authentication? Yes
? Run npm install automatically? Yes

📁 Folder created: my-app/
✅ Core files generated!
✅ Auth files generated (User model, controller, routes, middleware)!
✅ package.json created!
✅ .env file created!
📦 Installing dependencies...
✅ Dependencies installed successfully!

🎉 my-app successfully generated!

Next steps:
  cd my-app
  npm run dev

Happy coding! 🚀
```

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| ⚡ **One Command Setup** | `npx instant-express my-app` — full backend ready in seconds |
| 🔐 **Optional JWT Auth** | Signup, Login, Logout with protected routes — choose at runtime |
| 🧠 **Smart Dependencies** | Auth packages (`bcryptjs`, `jsonwebtoken`) only install when needed |
| 🛡️ **DNS Fix Built-in** | MongoDB Atlas DNS issues auto-resolved with Google & Cloudflare DNS |
| 📦 **Auto npm install** | Dependencies installed automatically — skip if you prefer manual |
| 🗂️ **MVC Architecture** | Clean folder structure — config, controllers, routes, middlewares, models, services, utils |
| 🎯 **Interactive CLI** | No config files needed — just answer simple prompts |
| 📝 **Auto-generated files** | `.env`, `.env.example`, `.gitignore`, `package.json` — all ready |

---

## 🎯 Generated Project Structure

```
my-project/
├── config/
│   └── db.js                  # MongoDB connection with DNS fix
├── controllers/
│   └── authController.js      # Signup, Login, Logout (if auth selected)
├── middlewares/
│   └── authMiddleware.js      # JWT token verification (if auth selected)
├── models/
│   └── User.js                # User schema with bcrypt (if auth selected)
├── routes/
│   └── authRoutes.js          # Auth API routes (if auth selected)
├── services/                  # Business logic (empty — ready for you)
├── utils/                     # Helper functions (empty — ready for you)
├── app.js                     # Express app setup with middlewares
├── server.js                  # Server entry point
├── .env                       # Environment variables (auto-generated)
├── .env.example               # Environment template for reference
├── .gitignore                 # Git ignore rules
└── package.json               # Project config with all dependencies
```

---

## ⚙️ CLI Options

| Prompt | Description | Default |
|--------|-------------|---------|
| Port number | Server will run on this port | `5000` |
| JWT Authentication | Include signup/login/logout with JWT | `Yes` |
| Auto npm install | Install dependencies automatically | `Yes` |

---

## 🛡️ MongoDB DNS Fix (Built-in)

Many developers face `querySrv ESERVFAIL` or `ENOTFOUND` errors when connecting to **MongoDB Atlas** — especially on certain ISPs.

instant-express **automatically configures** reliable DNS resolvers in the generated `db.js`:

```javascript
import dns from 'dns';
dns.setServers(['1.1.1.1', '8.8.8.8']); // Cloudflare + Google DNS
```

No more connection issues. It just works. ✅

---

## 🚀 After Generation

```bash
cd my-project
npm run dev
```

**Output:**
```
✅ MongoDB Connected: localhost
🚀 Server running on port 5000
```

### API Endpoints (if auth selected)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/signup` | Register a new user |
| POST | `/api/auth/login` | Login and get JWT token |
| POST | `/api/auth/logout` | Logout (protected route) |

---

## 🤝 Contributing

Contributions, issues and feature requests are welcome!

1. Fork the repo
2. Create your branch (`git checkout -b feature/awesome-feature`)
3. Commit changes (`git commit -m 'Add awesome feature'`)
4. Push (`git push origin feature/awesome-feature`)
5. Open a Pull Request

---

## 📄 License

MIT © [Prashant](https://github.com/prashantdevelopment)

---

<p align="center">
  Made with ❤️ by <a href="https://github.com/prashantdevelopment">Prashant</a>
</p>
