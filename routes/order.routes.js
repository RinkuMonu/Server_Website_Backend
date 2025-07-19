const express = require('express');
const router = express.Router();
const {
    createOrderWithoutPayment,
    // createOrderWithPayment,
    getAllOrders,
    getOrderById,
    updateOrder,
    deleteOrder,
    cancelOrder,
} = require('../controllers/order.controller');

// router.post('/order/create-with-payment', createOrdeerWithPayment);
router.post('/order/createorder', createOrderWithoutPayment);
router.get('/', getAllOrders);
router.get('/:id', getOrderById);
router.put('/:id', updateOrder);
router.delete('/:id', deleteOrder);
router.put('/cancel/:id', cancelOrder);
module.exports = router;
