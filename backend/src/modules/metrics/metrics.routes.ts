import { Router } from 'express';
import { MetricsController } from './metrics.controller';
import { authenticate } from '../../middlewares/auth.middleware';

const router = Router();

// All routes require authentication
router.use(authenticate);

/**
 * @route   GET /api/metrics/overview
 * @desc    Get overview metrics
 * @access  Private
 */
router.get('/overview', MetricsController.getOverview);

/**
 * @route   GET /api/metrics/weekly
 * @desc    Get weekly metrics
 * @access  Private
 */
router.get('/weekly', MetricsController.getWeeklyMetrics);

/**
 * @route   POST /api/metrics/weekly
 * @desc    Create weekly metric
 * @access  Private
 */
router.post('/weekly', MetricsController.createWeeklyMetric);

/**
 * @route   GET /api/metrics/capacity
 * @desc    Get capacity metrics
 * @access  Private
 */
router.get('/capacity', MetricsController.getCapacityMetrics);

/**
 * @route   GET /api/metrics/requests-funnel
 * @desc    Get requests funnel metrics
 * @access  Private
 */
router.get('/requests-funnel', MetricsController.getRequestsFunnel);

/**
 * @route   GET /api/metrics/product-vs-custom
 * @desc    Get product vs custom metrics
 * @access  Private
 */
router.get('/product-vs-custom', MetricsController.getProductVsCustom);

/**
 * @route   GET /api/metrics/team-velocity
 * @desc    Get team velocity metrics
 * @access  Private
 */
router.get('/team-velocity', MetricsController.getTeamVelocity);

/**
 * @route   POST /api/metrics/generate-insights
 * @desc    Generate AI insights
 * @access  Private
 */
router.post('/generate-insights', MetricsController.generateInsights);

export default router;
