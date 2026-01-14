import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import { config } from './config/env';
import { errorHandler } from './middlewares/error.middleware';
import logger from './config/logger';

// Import routes
import authRoutes from './modules/auth/auth.routes';
import usersRoutes from './modules/users/users.routes';
import requestsRoutes from './modules/requests/requests.routes';
import assignmentsRoutes from './modules/assignments/assignments.routes';
import okrsRoutes from './modules/okrs/okrs.routes';
import productsRoutes from './modules/products/products.routes';
import clientsRoutes from './modules/clients/clients.routes';
import metricsRoutes from './modules/metrics/metrics.routes';
import aiRoutes from './modules/ai/ai.routes';
import systemConfigRoutes from './modules/system-config/system-config.routes';
import activityLogsRoutes from './modules/activity-logs/activity-logs.routes';
import dashboardRoutes from './modules/dashboard/dashboard.routes';
import quotationsRoutes from './modules/quotations/quotations.routes';

const app = express();

// Trust proxy - allows Express to read IP from X-Forwarded-For header
app.set('trust proxy', true);

// Security middleware
app.use(helmet());

// CORS
app.use(
  cors({
    origin: config.cors.allowedOrigins,
    credentials: true,
  })
);

// Body parser - Increased limit for base64 images
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// Request logging
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.path}`);
  next();
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API routes
const API_PREFIX = '/api';
app.use(`${API_PREFIX}/auth`, authRoutes);
app.use(`${API_PREFIX}/users`, usersRoutes);
app.use(`${API_PREFIX}/requests`, requestsRoutes);
app.use(`${API_PREFIX}/assignments`, assignmentsRoutes);
app.use(`${API_PREFIX}/okrs`, okrsRoutes);
app.use(`${API_PREFIX}/products`, productsRoutes);
app.use(`${API_PREFIX}/clients`, clientsRoutes);
app.use(`${API_PREFIX}/metrics`, metricsRoutes);
app.use(`${API_PREFIX}/ai`, aiRoutes);
app.use(`${API_PREFIX}/system-config`, systemConfigRoutes);
app.use(`${API_PREFIX}/activity-logs`, activityLogsRoutes);
app.use(`${API_PREFIX}/dashboard`, dashboardRoutes);
app.use(`${API_PREFIX}/quotations`, quotationsRoutes);

// Error handling
app.use(errorHandler);

export default app;
