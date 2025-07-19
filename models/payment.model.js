const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
    order_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true },
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    amount: { type: Number, required: true },
    method: { type: String },
    transaction_id: { type: String },
    status: { type: String, enum: ['success', 'failed', 'pending'], default: 'pending' },
    paid_on: { type: Date }
});

module.exports = mongoose.model('Payment', paymentSchema);
