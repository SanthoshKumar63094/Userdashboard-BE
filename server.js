import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import apiRouter from './routes/api.js';

dotenv.config();

const app = express();
app.use(express.json());

const corsOrigin = 'https://useradminecommerce.netlify.app';
app.use(cors({
  origin: [corsOrigin],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials:true
}));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Mount API routes
app.use('/api', apiRouter);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

