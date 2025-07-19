const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    name: { type: String, required: true },
    slug: { type: String, required: true },
    type: { type: String, enum: ['hosting', 'server'], required: true },
    description: { type: String },
    is_active: { type: Boolean, default: true }
});

module.exports = mongoose.model('Category', categorySchema);
