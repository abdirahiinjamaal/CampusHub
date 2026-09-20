import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import { checkDatabase } from './db.js';
import authRoutes from './routes/auth.js';
import studentRoutes from './routes/students.js';
import resultRoutes from './routes/results.js';
import feeRoutes from './routes/fees.js';
import transcriptRoutes from './routes/transcript.js';
import { getConfig } from './config/secrets.js';

const app = express();
let allowedOrigins = [];
app.use(cors({
  origin: (requestOrigin, callback) => {
    if (!requestOrigin || allowedOrigins.includes(requestOrigin)) return callback(null, true);
    return callback(null, false);
  },
}));
app.use(express.json());
app.get('/health', async (_req, res) => { try { await checkDatabase(); return res.json({ status: 'healthy', database: 'connected' }); } catch { return res.status(503).json({ status: 'unhealthy', database: 'disconnected' }); } });
app.use('/api', authRoutes);
app.use('/api/student', studentRoutes);
app.use('/api/student', resultRoutes);
app.use('/api/student', feeRoutes);
app.use('/api/student', transcriptRoutes);
app.use((_req, res) => res.status(404).json({ error: 'Not found' }));
app.use((error, _req, res, _next) => { console.error(error); return res.status(500).json({ error: 'Internal server error' }); });
async function start() {
  try {
    const config = await getConfig();
    allowedOrigins = config.frontendOrigins;
    app.listen(config.port, '0.0.0.0', () => console.log(`Horizon API listening on 0.0.0.0:${config.port}`));
  } catch {
    console.error('Unable to load application configuration');
    process.exitCode = 1;
  }
}

start();
