const mongoose = require('mongoose');

const planSchema = new mongoose.Schema({
  category_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  name: { type: String, required: true },
  slug: { type: String, required: true },
  cpu: { type: String },
  ram: { type: String },
  storage: { type: String },
  bandwidth: { type: String },
  os_options: [{ type: String }],
  location: { type: String },
  duration: { type: String, enum: ['monthly', 'yearly', 'custom'], default: 'monthly' },
  price: { type: Number, required: true },
  setup_fee: { type: Number, default: 0 },
  stock: { type: Number, default: 0 },
  is_active: { type: Boolean, default: true },
  features: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Feature' }]
}, { timestamps: true });

module.exports = mongoose.model('Plan', planSchema);