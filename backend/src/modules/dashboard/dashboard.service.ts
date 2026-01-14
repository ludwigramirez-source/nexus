import prisma from '../../config/database';
import logger from '../../config/logger';

interface DashboardMetrics {
  totalProducts: number;
  totalServices: number;
  monthlyProductRevenue: number;
  monthlyServiceRevenue: number;
  recurringMRR: number;
  oneTimeMRR: number;
  totalVAT: number;
  totalMonthlyRevenue: number;
  totalClients: number;
  activeClients: number;
}

interface ProductWithClients {
  id: string;
  name: string;
  description: string;
  type: string;
  price: number;
  currency: string;
  recurrence: string;
  hasVAT: boolean;
  vatRate: number | null;
  status: string;
  mrr: number;
  clientCount: number;
  customizations: number;
  debt: number;
  growth: number;
  clients: Array<{
    id: string;
    name: string;
    healthScore: number;
    tier: string;
    mrr: number;
    customizations: number;
    updatedAt: Date;
    status: string;
  }>;
}

export class DashboardService {
  /**
   * Get dashboard metrics
   */
  static async getMetrics(): Promise<DashboardMetrics> {
    try {
      // Get all active products
      const products = await prisma.product.findMany({
        where: { status: 'ACTIVE' },
      });

      // Get all active clients with their products
      const clients = await prisma.client.findMany({
        where: { status: 'ACTIVE' },
        select: {
          id: true,
          products: true,
          mrr: true,
          status: true,
        },
      });

      // Calculate metrics
      const totalProducts = products.filter(p => p.type === 'PRODUCT').length;
      const totalServices = products.filter(p => p.type === 'SERVICE').length;

      // Create a map of product prices by ID
      const productMap = new Map(products.map(p => [p.id, p]));

      let monthlyProductRevenue = 0;
      let monthlyServiceRevenue = 0;
      let recurringMRR = 0;
      let oneTimeMRR = 0;
      let totalVAT = 0;

      // Calculate revenue from clients
      clients.forEach(client => {
        if (Array.isArray(client.products)) {
          client.products.forEach(productId => {
            const product = productMap.get(productId);
            if (product) {
              const price = product.price || 0;
              const vatAmount = product.hasVAT && product.vatRate
                ? price * (product.vatRate / 100)
                : 0;

              // Add to product or service revenue
              if (product.type === 'PRODUCT') {
                monthlyProductRevenue += price;
              } else {
                monthlyServiceRevenue += price;
              }

              // Add to recurring or one-time MRR
              if (product.recurrence === 'ONE_TIME') {
                oneTimeMRR += price;
              } else {
                recurringMRR += price;
              }

              // Add VAT
              totalVAT += vatAmount;
            }
          });
        }
      });

      const totalMonthlyRevenue = monthlyProductRevenue + monthlyServiceRevenue;
      const totalClients = await prisma.client.count();
      const activeClients = clients.length;

      return {
        totalProducts,
        totalServices,
        monthlyProductRevenue,
        monthlyServiceRevenue,
        recurringMRR,
        oneTimeMRR,
        totalVAT,
        totalMonthlyRevenue,
        totalClients,
        activeClients,
      };
    } catch (error) {
      logger.error('Error getting dashboard metrics:', error);
      throw error;
    }
  }

  /**
   * Get all products with their client details
   */
  static async getProductsWithClients(): Promise<ProductWithClients[]> {
    try {
      const products = await prisma.product.findMany({
        where: { status: 'ACTIVE' },
        orderBy: { createdAt: 'desc' },
      });

      const clients = await prisma.client.findMany({
        select: {
          id: true,
          name: true,
          products: true,
          healthScore: true,
          tier: true,
          mrr: true,
          updatedAt: true,
          status: true,
          requests: {
            where: {
              type: 'CUSTOMIZATION',
            },
            select: {
              id: true,
            },
          },
        },
      });

      // Build product data with clients
      const productsWithClients: ProductWithClients[] = products.map(product => {
        // Find clients that have this product
        const productClients = clients.filter(client =>
          Array.isArray(client.products) && client.products.includes(product.id)
        );

        // Calculate MRR for this product (sum of product price for each client)
        const mrr = productClients.length * (product.price || 0);

        // Count customizations
        const customizations = productClients.reduce((sum, client) =>
          sum + client.requests.length, 0
        );

        return {
          id: product.id,
          name: product.name,
          description: product.description || '',
          type: product.type,
          price: product.price,
          currency: product.currency,
          recurrence: product.recurrence || 'MONTHLY',
          hasVAT: product.hasVAT,
          vatRate: product.vatRate,
          status: product.status,
          mrr,
          clientCount: productClients.length,
          customizations,
          debt: 0, // TODO: Calculate debt based on overdue invoices
          growth: 0, // TODO: Calculate growth based on historical data
          clients: productClients.map(client => ({
            id: client.id,
            name: client.name,
            healthScore: client.healthScore,
            tier: client.tier,
            mrr: product.price || 0,
            customizations: client.requests.length,
            updatedAt: client.updatedAt,
            status: client.status,
          })),
        };
      });

      return productsWithClients;
    } catch (error) {
      logger.error('Error getting products with clients:', error);
      throw error;
    }
  }

  /**
   * Get clients for a specific product
   */
  static async getClientsByProduct(productId: string) {
    try {
      const product = await prisma.product.findUnique({
        where: { id: productId },
      });

      if (!product) {
        throw new Error('Product not found');
      }

      const clients = await prisma.client.findMany({
        where: {
          products: {
            has: productId,
          },
        },
        select: {
          id: true,
          name: true,
          healthScore: true,
          tier: true,
          mrr: true,
          updatedAt: true,
          status: true,
          requests: {
            where: {
              type: 'CUSTOMIZATION',
            },
            select: {
              id: true,
            },
          },
        },
      });

      const totalMRR = clients.length * (product.price || 0);

      return {
        product: {
          id: product.id,
          name: product.name,
          price: product.price,
          currency: product.currency,
        },
        totalMRR,
        clientCount: clients.length,
        clients: clients.map(client => ({
          id: client.id,
          name: client.name,
          healthScore: client.healthScore,
          tier: client.tier,
          mrr: product.price || 0,
          customizations: client.requests.length,
          updatedAt: client.updatedAt,
          status: client.status,
        })),
      };
    } catch (error) {
      logger.error('Error getting clients by product:', error);
      throw error;
    }
  }
}
