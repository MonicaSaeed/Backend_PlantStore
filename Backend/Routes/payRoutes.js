const express = require('express');
const router = express.Router();
const { pay, paymentCallback } = require('../controllers/payController');

router.post('/', pay);

router.get('/payment-callback', paymentCallback);

module.exports = router;