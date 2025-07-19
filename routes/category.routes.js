const express = require('express');
const router = express.Router();
const {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory
} = require('../controllers/category.controller');

router.post('/', createCategory);             // Admin: Create
router.get('/', getAllCategories);            // Admin: List
router.get('/:id', getCategoryById);          // Admin: Get by ID
router.put('/:id', updateCategory);           // Admin: Update
router.delete('/:id', deleteCategory);        // Admin: Delete

module.exports = router;
