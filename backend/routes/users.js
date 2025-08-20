const express = require('express');
const { getUsers, createUser, updatePassword, getProfile } = require('../controllers/userController');
const { authenticateToken, requireRole } = require('../middleware/auth');
const { validateUser, handleValidationErrors } = require('../middleware/validation');

const router = express.Router();

router.get('/', authenticateToken, requireRole(['admin']), getUsers);
router.post('/', authenticateToken, requireRole(['admin']), validateUser, handleValidationErrors, createUser);
router.put('/password', authenticateToken, updatePassword);
router.get('/profile', authenticateToken, getProfile);

module.exports = router;