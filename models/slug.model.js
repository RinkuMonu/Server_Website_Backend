const mongoose = require('mongoose');

const slugSchema = new mongoose.Schema({
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true }, // e.g., vpsserver, sharedHosting
    type: { type: String, enum: ['server', 'hosting'], required: true }
}, { timestamps: true });

module.exports = mongoose.model('Slug', slugSchema);
