const express = require('express');
const { submitRating, getUserRatings, getStoreRatings, getDashboardStats } = require('../controllers/ratingController');
const { authenticateToken, requireRole } = require('../middleware/auth');
const { validateRating, handleValidationErrors } = require('../middleware/validation');

const router = express.Router();

router.post('/', authenticateToken, requireRole(['user']), validateRating, handleValidationErrors, submitRating);
router.get('/user', authenticateToken, getUserRatings);
router.get('/store/:storeId', authenticateToken, getStoreRatings);
router.get('/stats', authenticateToken, requireRole(['admin']), getDashboardStats);

module.exports = router;