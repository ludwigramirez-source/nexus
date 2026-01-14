import { Request, Response, NextFunction } from 'express';
import { DashboardService } from './dashboard.service';
import logger from '../../config/logger';

export class DashboardController {
  /**
   * Get dashboard metrics
   */
  static async getMetrics(req: Request, res: Response, next: NextFunction) {
    try {
      logger.info('GET /api/dashboard/metrics');

      const metrics = await DashboardService.getMetrics();

      res.json({
        success: true,
        data: metrics,
      });
    } catch (error) {
      logger.error('Error in getMetrics:', error);
      next(error);
    }
  }

  /**
   * Get all products with their clients
   */
  static async getProductsWithClients(req: Request, res: Response, next: NextFunction) {
    try {
      logger.info('GET /api/dashboard/products-with-clients');

      const products = await DashboardService.getProductsWithClients();

      res.json({
        success: true,
        data: products,
      });
    } catch (error) {
      logger.error('Error in getProductsWithClients:', error);
      next(error);
    }
  }

  /**
   * Get clients for a specific product
   */
  static async getClientsByProduct(req: Request, res: Response, next: NextFunction) {
    try {
      const { productId } = req.params;
      logger.info(`GET /api/dashboard/products/${productId}/clients`);

      const data = await DashboardService.getClientsByProduct(productId);

      res.json({
        success: true,
        data,
      });
    } catch (error) {
      logger.error('Error in getClientsByProduct:', error);
      next(error);
    }
  }
}
