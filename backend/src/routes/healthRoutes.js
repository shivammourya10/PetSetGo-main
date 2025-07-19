import express from 'express';
import healthCheck from '../controller/HealthController.js';
import listUsers from '../controller/debug/listUsers.js';

const router = express.Router();

// Health check route
router.get('/', healthCheck);

/**
 * @route   HEAD /api/health
 * @desc    Lightweight connectivity check (HEAD method)
 * @access  Public
 */
router.head('/', (req, res) => {
  res.status(200).end();
});

/**
 * @route   GET /api/health/debug/users
 * @desc    List users for debugging (only in development)
 * @access  Public (should be restricted in production)
 */
router.get('/debug/users', listUsers);

export default router;
