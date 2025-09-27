// routes/transactionRoutes.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth'); // Import the auth middleware
const {
    addTransaction,
    getTransactions,
    updateTransaction,
    deleteTransaction,
} = require('../controllers/transactionController');

// All routes below are PROTECTED by the 'auth' middleware
router.post('/', auth, addTransaction);           // CREATE
router.get('/', auth, getTransactions);          // READ (All/List)
router.put('/:id', auth, updateTransaction);      // UPDATE
router.delete('/:id', auth, deleteTransaction);  // DELETE

module.exports = router;