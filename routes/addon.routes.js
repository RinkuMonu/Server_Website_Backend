const express = require('express');
const router = express.Router();
const addonController = require('../controllers/addon.controller');

router.post('/create', addonController.createAddon);
router.get('/templates', addonController.getGlobalAddons);

router.post('/add', addonController.addAddonToOrder);
router.get('/all', addonController.getAllOrderAddons);
router.get('/order/:order_id', addonController.getOrderAddonsByOrderId);

module.exports = router;
