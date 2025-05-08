const express = require('express');
const router = express.Router();
const paymentController = require('../Controllers/payController');

router.post('/', paymentController.pay);

router.get('/payments', paymentController.getAllPayments);

router.get('/payments/:OrderId', paymentController.getPaymentByOrderId);

router.get('/payment-callback', paymentController.paymentCallback);

module.exports = router;

