const express = require('express');
const router = express.Router();
const Order = require('../Models/Order');
const OrderController = require('../Controllers/orderController');

// POST /api/orders
router.post('/',OrderController.postOrderInfo);
// GET all orders
router.get('/', OrderController.getAllOrders);
router.post('/insertmany',OrderController.postMultipleOrders);

// GET a specific order by ID
router.get('/:id', OrderController.getOrderById);

// PUT (update) an order by ID
router.put('/:id', OrderController.updateOrderById);

// DELETE an order by ID
router.delete('/:id', OrderController.deleteOrderById);

// GET orders by user ID
router.get('/user/:userId', OrderController.getOrdersByUserId);

// PATCH /api/orders/:id/status
router.patch('/:id/status', OrderController.updateOrderStatus);

// PATCH /api/orders/:id/payment
router.patch('/:id/payment', OrderController.updatePaymentStatus);


module.exports = router;
