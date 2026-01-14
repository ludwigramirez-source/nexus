import { Router } from 'express';
import { DashboardController } from './dashboard.controller';
import { authenticate } from '../../middlewares/auth.middleware';

const router = Router();

// All dashboard routes require authentication
router.use(authenticate);

// GET /api/dashboard/metrics - Get dashboard metrics
router.get('/metrics', DashboardController.getMetrics);

// GET /api/dashboard/products-with-clients - Get all products with their clients
router.get('/products-with-clients', DashboardController.getProductsWithClients);

// GET /api/dashboard/products/:productId/clients - Get clients for a specific product
router.get('/products/:productId/clients', DashboardController.getClientsByProduct);

export default router;
