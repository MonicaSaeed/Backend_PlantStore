const express = require('express');
const router = express.Router();
const Order = require('../Models/Order');
const OrderController = require('../Controllers/orderController');

// POST /api/orders
router.post('/',OrderController.postOrderInfo);

module.exports = router;
