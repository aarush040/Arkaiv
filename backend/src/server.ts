import express from 'express';
import http from 'http';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';

// ES Module compatible __dirname replacement
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from project root
// __dirname = backend/src/ -> .. = backend/ -> .. = project root
const envPath = path.resolve(__dirname, '..', '..', '.env');
console.log(`[Startup] Loading .env from: ${envPath}`);
dotenv.config({ path: envPath });

import connectDB from './config/db';
import { configurePassport } from './config/passport';
import { errorHandler } from './middleware/errorHandler';

// Import routes
import authRoutes from './routes/auth';
import taskRoutes from './routes/tasks';
import roadmapRoutes from './routes/roadmap';
import aiRoutes from './routes/ai';
import progressRoutes from './routes/progress';

function startListening(httpServer: http.Server, port: number, maxRetries = 5): Promise<number> {
  return new Promise((resolve, reject) => {
    function attempt(retryCount: number) {
      const currentPort = port + retryCount;
      httpServer.listen(currentPort, '0.0.0.0', () => {
        console.log(`[Startup] 🚀 ARKAIV Platform server running on port ${currentPort}`);
        console.log(`[Startup]    Health: http://localhost:${currentPort}/api/health`);
        console.log(`[Startup]    MongoDB: ${process.env.MONGODB_URI ? 'Configured' : 'Not Configured (running without DB)'}`);
        console.log(`[Startup]    Gemini AI: ${process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'MY_GEMINI_API_KEY' ? 'Configured' : 'Not Configured (simulated mode)'}`);
        resolve(currentPort);
      });
      httpServer.on('error', (err: NodeJS.ErrnoException) => {
        if (err.code === 'EADDRINUSE') {
          if (retryCount < maxRetries) {
            const nextPort = port + retryCount + 1;
            console.warn(`[Startup] Port ${currentPort} is in use, trying ${nextPort}...`);
            httpServer.close(() => attempt(retryCount + 1));
          } else {
            reject(new Error(`All ports from ${port} to ${port + maxRetries} are in use. Cannot start server.`));
          }
        } else {
          reject(err);
        }
      });
    }
    attempt(0);
  });
}

async function startServer() {
  const app = express();
  const PORT: number = parseInt(process.env.PORT || '3000', 10) || 3000;

  console.log('[Startup] Server starting...');
  console.log('[Startup] Environment:', process.env.NODE_ENV || 'development');
  console.log('[Startup] Port:', PORT);

  // Middleware
  app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
  }));
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true }));

  // Connect to MongoDB (non-fatal if fails)
  try {
    await connectDB();
    console.log('[Startup] MongoDB connected successfully');
  } catch (dbError: any) {
    console.warn('[Startup] WARNING: MongoDB connection failed:', dbError.message);
    console.warn('[Startup] Server will run without database. Set MONGODB_URI in .env to connect.');
  }

  // Configure Passport
  configurePassport();

  // Health check - MUST be before Vite middleware
  app.get('/api/health', (_req, res) => {
    res.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development',
    });
  });

  // API Routes
  app.use('/api/auth', authRoutes);
  app.use('/api/tasks', taskRoutes);
  app.use('/api/roadmaps', roadmapRoutes);
  app.use('/api/ai', aiRoutes);
  app.use('/api/progress', progressRoutes);

  // Error Handler
  app.use(errorHandler);

  // Vite dev middleware or static file serving
  if (process.env.NODE_ENV !== 'production') {
    console.log('[Startup] Starting Vite dev middleware...');
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        // Do NOT set hmr.server here — in middleware mode Vite creates its own
        // WebSocket server. We keep hmr defaults so it attaches to the main server.
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  // Start listening with EADDRINUSE graceful fallback
  const httpServer = http.createServer(app);
  const actualPort = await startListening(httpServer, PORT);
  if (actualPort !== PORT) {
    console.log(`[Startup] ⚠️  Port ${PORT} was in use, fell back to port ${actualPort}`);
  }
}

startServer().catch((err) => {
  console.error('[Startup] FATAL: Failed to start server:', err);
  process.exit(1);
});
