import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';

// {{AUTH_IMPORT}}

const app = express();

// Built-in middlewares
app.use(express.json());              // JSON body parse karne ke liye
app.use(express.urlencoded({ extended: true })); // Form data ke liye
app.use(cors());                       // Cross-origin requests allow karne ke liye
app.use(cookieParser());              // Cookies read karne ke liye
app.use(morgan('dev'));               // HTTP request logging ke liye

// Routes
// {{AUTH_ROUTE}}

// Health check route
app.get('/', (req, res) => {
  res.json({ message: '{{PROJECT_NAME}} API is running 🚀' });
});

export default app;
