const Category = require('../models/category.model');

exports.createCategory = async (req, res) => {
  try {
    const { name, slug, type, description, is_active } = req.body;

    const existing = await Category.findOne({ slug });
    if (existing) return res.status(400).json({ message: 'Slug already exists' });

    const category = new Category({ name, slug, type, description, is_active });
    await category.save();

    res.status(201).json({ message: 'Category created successfully', category });
  } catch (err) {
    res.status(500).json({ message: 'Failed to create category', error: err.message });
  }
};

exports.getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.status(200).json(categories);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch categories', error: err.message });
  }
};

exports.getCategoryById = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) return res.status(404).json({ message: 'Category not found' });
    res.status(200).json(category);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch category', error: err.message });
  }
};

exports.updateCategory = async (req, res) => {
  try {
    const updated = await Category.findByIdAndUpdate(req.params.id, req.body, {
      new: true, runValidators: true
    });
    if (!updated) return res.status(404).json({ message: 'Category not found' });
    res.status(200).json({ message: 'Category updated successfully', category: updated });
  } catch (err) {
    res.status(500).json({ message: 'Failed to update category', error: err.message });
  }
};

exports.deleteCategory = async (req, res) => {
  try {
    const deleted = await Category.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Category not found' });
    res.status(200).json({ message: 'Category deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete category', error: err.message });
  }
};
