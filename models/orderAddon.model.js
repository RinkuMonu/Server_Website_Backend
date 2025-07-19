const mongoose = require('mongoose');

const orderAddonSchema = new mongoose.Schema(
    {
        order_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Order',
            default: null
        },
        name: {
            type: String,
            required: true,
            trim: true
        },
        description: {
            type: String,
            required: true
        },
        price: {
            type: Number,
            required: true
        },
        quantity: {
            type: Number,
            default: 1
        },
        total_price: {
            type: Number
        },
        status: {
            type: String,
            enum: ['active', 'cancelled'],
            default: 'active'
        },
        added_on: {
            type: Date,
            default: Date.now
        }
    },
    { timestamps: true }
);

orderAddonSchema.pre('save', function (next) {
    if (!this.total_price) {
        this.total_price = this.price * this.quantity;
    }
    next();
});

module.exports = mongoose.model('OrderAddon', orderAddonSchema);
