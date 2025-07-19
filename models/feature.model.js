const mongoose = require('mongoose');

const featureSchema = new mongoose.Schema({
    title: { type: String, required: true },
    group: { type: String, required: true }, // e.g., 'Email Features'
    values: {
        basic: { type: String, default: '' },
        standard: { type: String, default: '' },
        premium: { type: String, default: '' }
    }
}, { timestamps: true });

module.exports = mongoose.model('Feature', featureSchema);
