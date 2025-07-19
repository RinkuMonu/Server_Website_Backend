const Slug = require('../models/slug.model');

exports.createSlug = async (req, res) => {
    try {
        const { title, slug, type } = req.body;
        if (!title || !slug || !type) {
            return res.status(400).json({ message: 'Title, slug, and type are required' });
        }

        const exists = await Slug.findOne({ slug });
        if (exists) {
            return res.status(400).json({ message: 'Slug already exists' });
        }

        const newSlug = await Slug.create({ title, slug, type });
        res.status(201).json({ message: 'Slug created successfully', data: newSlug });
    } catch (err) {
        res.status(500).json({ message: 'Error creating slug', error: err.message });
    }
};

exports.getAllSlugs = async (req, res) => {
    try {
        const slugs = await Slug.find();
        res.status(200).json({ data: slugs });
    } catch (err) {
        res.status(500).json({ message: 'Failed to fetch slugs', error: err.message });
    }
};