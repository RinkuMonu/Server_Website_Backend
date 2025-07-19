const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },

  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },

  password: {
    type: String,
    required: true
  },

  phone: {
    type: String,
    trim: true
  },

  company_name: {
    type: String,
    trim: true
  },

  address: {
    type: String
  },

  role: {
    type: String,
    enum: ['admin', 'customer', 'reseller'],
    default: 'customer'
  },

  resetPasswordToken: {
    type: String
  },

  resetPasswordExpires: {
    type: Date
  },

  is_deleted: {
    type: Boolean,
    default: false
  },

  deleted_at: {
    type: Date,
    default: null
  },

  created_at: {
    type: Date,
    default: Date.now
  }
});

// 🔄 Instead of globally filtering deleted users in all queries, define a static reusable scope
userSchema.statics.findActive = function (filter = {}) {
  return this.find({ ...filter, is_deleted: false });
};

module.exports = mongoose.model('User', userSchema);