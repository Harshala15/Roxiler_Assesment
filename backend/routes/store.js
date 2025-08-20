const express = require('express');
const { getStores, createStore, getStoresByOwner } = require('../controllers/storeController');
const { authenticateToken, requireRole } = require('../middleware/auth');
const { validateStore, handleValidationErrors } = require('../middleware/validation');

const router = express.Router();

router.get('/', authenticateToken, getStores);
router.post('/', authenticateToken, requireRole(['admin']), validateStore, handleValidationErrors, createStore);
router.get('/owner', authenticateToken, requireRole(['store_owner']), getStoresByOwner);

module.exports = router;