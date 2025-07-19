const OrderAddon = require('../models/orderAddon.model');
const Order = require('../models/order.model');

exports.createAddon = async (req, res) => {
  try {
    const { name, description, price } = req.body;

    if (!name || !description || price == null) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const addon = await OrderAddon.create({
      name,
      description,
      price,
      order_id: null,
      quantity: 1,
      status: 'active'
    });

    res.status(201).json({ message: 'Addon template created successfully', addon });
  } catch (err) {
    res.status(500).json({ message: 'Failed to create addon', error: err.message });
  }
};

exports.addAddonToOrder = async (req, res) => {
  try {
    const { order_id, name, description, price, quantity = 1 } = req.body;

    if (!order_id || !name || !description || price == null) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const order = await Order.findById(order_id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    const total_price = price * quantity;

    const addon = await OrderAddon.create({
      order_id,
      name,
      description,
      price,
      quantity,
      total_price,
      status: 'active'
    });

    res.status(201).json({ message: 'Addon added to order successfully', addon });
  } catch (err) {
    res.status(500).json({ message: 'Failed to add addon to order', error: err.message });
  }
};

exports.getAllOrderAddons = async (req, res) => {
  try {
    const addons = await OrderAddon.find().populate('order_id');
    res.status(200).json({ addons });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch addons', error: err.message });
  }
};

exports.getGlobalAddons = async (req, res) => {
  try {
    const templates = await OrderAddon.find({ order_id: null });
    res.status(200).json({ templates });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch addon templates', error: err.message });
  }
};

exports.getOrderAddonsByOrderId = async (req, res) => {
  try {
    const { order_id } = req.params;
    const addons = await OrderAddon.find({ order_id });
    res.status(200).json({ addons });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch addons by order', error: err.message });
  }
};
