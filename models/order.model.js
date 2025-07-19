const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    plan_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Plan', required: true },
    status: { type: String, enum: ['pending', 'processing', 'active', 'suspended', 'cancelled', 'ordered successfully'], default: 'pending' },
    start_date: { type: Date },
    end_date: { type: Date },
    server_info: {
        ip: String,
        panel: String,
        username: String
    },
    additional_services: [{ type: String }],

    created_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Order', orderSchema);
