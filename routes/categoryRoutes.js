// routes/categoryRoutes.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth'); // Protect these routes
const {
    addCategory,
    getCategories,
    updateCategory,
    deleteCategory,
} = require('../controllers/categoryController');

// All routes below are PROTECTED by the 'auth' middleware
router.post('/', auth, addCategory);            // CREATE
router.get('/', auth, getCategories);           // READ (All for user)
router.put('/:id', auth, updateCategory);       // UPDATE
router.delete('/:id', auth, deleteCategory);   // DELETE

module.exports = router;