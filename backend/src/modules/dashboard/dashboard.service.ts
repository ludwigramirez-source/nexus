import prisma from '../../config/database';
import logger from '../../config/logger';
import { getUSDtoCOPRate } from '../../utils/exchangeRateService';

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
  // Métricas por moneda
  mrrUSD: number;
  mrrCOP: number;
  totalMRRConverted: number; // Total en USD usando TRM
  exchangeRate: number; // TRM actual
  exchangeRateLastUpdated: Date; // Fecha de última actualización de TRM
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

      // Get converted quotations (CONVERTED_TO_ORDER)
      const convertedQuotations = await prisma.quotation.findMany({
        where: { status: 'CONVERTED_TO_ORDER' },
        include: {
          quotationItems: {
            include: {
              product: true,
            },
          },
        },
      });

      // Calculate metrics
      const totalProducts = products.filter(p => p.type === 'PRODUCT').length;
      const totalServices = products.filter(p => p.type === 'SERVICE').length;

      let monthlyProductRevenue = 0;
      let monthlyServiceRevenue = 0;
      let recurringMRR = 0;
      let oneTimeMRR = 0;
      let totalVAT = 0;
      let mrrUSD = 0;
      let mrrCOP = 0;

      // Obtener TRM desde la API pública
      const { rate: exchangeRate, lastUpdated: exchangeRateLastUpdated } = await getUSDtoCOPRate();

      // Calculate revenue from converted quotations
      convertedQuotations.forEach(quotation => {
        quotation.quotationItems.forEach(item => {
          const price = item.unitPrice * item.quantity;
          const discount = item.discount || 0;
          const subtotal = price - discount;
          const vatAmount = item.taxAmount || 0;

          // Convertir a USD si la cotización es en COP
          const subtotalUSD = quotation.currency === 'COP'
            ? subtotal / exchangeRate
            : subtotal;
          const vatAmountUSD = quotation.currency === 'COP'
            ? vatAmount / exchangeRate
            : vatAmount;

          // Add to product or service revenue by type (en USD)
          if (item.product?.type === 'PRODUCT') {
            monthlyProductRevenue += subtotalUSD;
          } else if (item.product?.type === 'SERVICE') {
            monthlyServiceRevenue += subtotalUSD;
          }

          // Add to recurring or one-time MRR based on recurrence (en USD)
          if (item.recurrence === 'ONE_TIME') {
            oneTimeMRR += subtotalUSD;
          } else {
            recurringMRR += subtotalUSD;
          }

          // Add VAT (en USD)
          totalVAT += vatAmountUSD;

          // Separate by currency (USD and COP - en su moneda original)
          const itemTotal = subtotal + vatAmount;
          if (quotation.currency === 'USD') {
            mrrUSD += itemTotal;
          } else if (quotation.currency === 'COP') {
            mrrCOP += itemTotal;
          }
        });
      });

      const totalMonthlyRevenue = monthlyProductRevenue + monthlyServiceRevenue;
      const totalClients = await prisma.client.count();
      const activeClients = await prisma.client.count({
        where: { status: 'ACTIVE' },
      });

      // Calculate total MRR converted to USD using exchange rate
      const totalMRRConverted = mrrUSD + (mrrCOP / exchangeRate);

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
        mrrUSD,
        mrrCOP,
        totalMRRConverted,
        exchangeRate,
        exchangeRateLastUpdated,
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
