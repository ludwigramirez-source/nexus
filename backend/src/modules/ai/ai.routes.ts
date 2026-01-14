import { Router } from 'express';
import { AIController } from './ai.controller';
import { authenticate } from '../../middlewares/auth.middleware';

const router = Router();

// All routes require authentication
router.use(authenticate);

/**
 * @route   POST /api/ai/completion
 * @desc    Generate AI completion
 * @access  Private
 */
router.post('/completion', AIController.generateCompletion);

/**
 * @route   POST /api/ai/insights
 * @desc    Generate insights from data
 * @access  Private
 */
router.post('/insights', AIController.generateInsights);

/**
 * @route   POST /api/ai/analyze-similarity
 * @desc    Analyze request similarity
 * @access  Private
 */
router.post('/analyze-similarity', AIController.analyzeSimilarity);

export default router;
