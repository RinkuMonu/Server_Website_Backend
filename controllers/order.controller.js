const Order = require('../models/order.model');

// exports.createOrderWithPayment = async (req, res) => {
//   try {
//     const {
//       user_id,
//       plan_id,
//       status,
//       start_date,
//       end_date,
//       server_info,
//       payment // payment details
//     } = req.body;

//     // Simulate checking payment success (in real case, verify from gateway)
//     if (!payment || payment.status !== 'success') {
//       return res.status(400).json({ message: 'Payment failed or not completed' });
//     }

//     // Create order
//     const order = await Order.create({
//       user_id,
//       plan_id,
//       status,
//       start_date,
//       end_date,
//       server_info
//     });

//     // Save payment record
//     const savedPayment = await Payment.create({
//       order_id: order._id,
//       user_id,
//       amount: payment.amount,
//       method: payment.method,
//       transaction_id: payment.transaction_id,
//       status: payment.status,
//       paid_on: new Date()
//     });

//     res.status(201).json({
//       message: 'Order and payment recorded successfully',
//       order,
//       payment: savedPayment
//     });
//   } catch (err) {
//     res.status(500).json({ message: 'Failed to create order with payment', error: err.message });
//   }
// };

exports.createOrderWithoutPayment = async (req, res) => {
  try {
    const { user_id, plan_id, start_date, end_date, server_info, additional_services } = req.body;

    const order = await Order.create({
      user_id,
      plan_id,
      status: 'ordered successfully',
      start_date,
      end_date,
      server_info,
      additional_services
    });

    res.status(201).json({
      message: 'Order received and created',
      order
    });
  } catch (err) {
    res.status(500).json({ message: 'Failed to create order', error: err.message });
  }
};

exports.getAllOrders = async (req, res) => {
  try {
    const { user_id, status } = req.query;
    const filter = {};

    if (user_id) filter.user_id = user_id;
    if (status) filter.status = status;

    const orders = await Order.find(filter).populate('user_id plan_id');
    res.status(200).json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch orders', error: err.message });
  }
};

exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('user_id plan_id');
    if (!order) return res.status(404).json({ message: 'Order not found' });

    res.status(200).json(order);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch order', error: err.message });
  }
};

exports.updateOrder = async (req, res) => {
  try {
    const { status, start_date, end_date, server_info } = req.body;

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status, start_date, end_date, server_info },
      { new: true, runValidators: true }
    );

    if (!order) return res.status(404).json({ message: 'Order not found' });

    res.status(200).json({ message: 'Order updated successfully', order });
  } catch (err) {
    res.status(500).json({ message: 'Failed to update order', error: err.message });
  }
};

exports.deleteOrder = async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    res.status(200).json({ message: 'Order deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete order', error: err.message });
  }
};

exports.cancelOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (order.status === 'cancelled') {
      return res.status(400).json({ message: 'Order is already cancelled' });
    }

    order.status = 'cancelled';
    await order.save();

    res.status(200).json({ message: 'Order cancelled successfully', order });
  } catch (err) {
    res.status(500).json({ message: 'Failed to cancel order', error: err.message });
  }
};