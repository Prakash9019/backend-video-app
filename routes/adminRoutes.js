const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { verifyToken, checkRole } = require('../middleware/authMiddleware');

// Only Admins can see/delete users
router.get('/users', verifyToken, checkRole(['admin']), adminController.getUsers);
router.delete('/users/:id', verifyToken, checkRole(['admin']), adminController.deleteUser);

module.exports = router;