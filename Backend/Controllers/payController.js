const { getAuthToken, createOrder, generatePaymentKey } = require('../services/paymobService');
const PaymentMapping = require('../Models/PaymentMapping');
const Order = require('../Models/Order');
const { response } = require('express');

const IFRAME_ID = '917275';

exports.pay = async (req, res) => {
  try {
    
    const { amount_cents, mongo_order_id } = req.body;

    const authToken = await getAuthToken();
    const paymobOrderId = await createOrder(authToken, amount_cents);
    const paymentKey = await generatePaymentKey(authToken, paymobOrderId, amount_cents);

    // Save mapping with minimal initial info
    await PaymentMapping.create({
      mongoOrderId: mongo_order_id,
      paymobOrderId,
      paymentStatus: 'pending'
    });

    const iframeURL = `https://accept.paymobsolutions.com/api/acceptance/iframes/${IFRAME_ID}?payment_token=${paymentKey}`;
    res.json({ iframe_url: iframeURL });

    console.log("payment response ----------------------------------");
    console.log(res);

  } catch (error) {
    console.log("payment error ----------------------------------");
    console.log("--------------------------------- ----------------------------------");    
    console.log(error);
    console.error(error.response?.data || error.message);
    res.status(500).send('Payment Error');
  }
};


exports.paymentCallback = async (req, res) => {
  const query = req.query;
  console.log(query);

  if (query.success === 'true' && query.txn_response_code === 'APPROVED') {
    try {
      const paymobOrderId = query.order;

      // Get latest mapping
      const mapping = await PaymentMapping.findOne({ paymobOrderId }).sort({ createdAt: -1 });
      if (!mapping) return res.status(404).send('Payment mapping not found');

      const order = await Order.findById(mapping.mongoOrderId);
      if (!order) return res.status(404).send('Order not found');

      if (order.paymentStatus === 'paid') {
        console.log("ℹ️ Order already marked as paid:", order._id);
        return res.redirect('http://localhost:4200/pay-success');
      }

      // Update order status
      await Order.findByIdAndUpdate(mapping.mongoOrderId, { paymentStatus: 'paid' });

      // Save payment info
      mapping.paymentStatus = 'paid';
      mapping.paymentInfo = {
        id: query.id,
        amount_cents: query.amount_cents,
        currency: query.currency,
        created_at: query.created_at,
        source_data: {
          type: query['source_data.type'],
          pan: query['source_data.pan'],
          sub_type: query['source_data.sub_type']
        },
        success: query.success,
        txn_response_code: query.txn_response_code
      };
      await mapping.save();

      console.log("✅ Payment successful for order:", order._id);

      // ✅ Redirect to frontend success page
      return res.redirect('http://localhost:4200/pay-success');

    } catch (error) {
      console.error('Callback Error:', error);
      return res.status(500).send('Internal Server Error during callback.');
    }
  } else {
    // ❌ Redirect to failure page
    return res.redirect('http://localhost:4200/pay-failed');
  }
};


// GET /payments - Get all payment processes
exports.getAllPayments = async (req, res) => {
  try {
    const payments = await PaymentMapping.find().sort({ createdAt: -1 });
    res.json(payments);
  } catch (error) {
    console.error('Error fetching payments:', error);
    res.status(500).send('Server error while fetching payments.');
  }
};

// GET /payments/:paymobOrderId - Get payment by Paymob Order ID
exports.getPaymentByOrderId = async (req, res) => {
  try {
    const { OrderId } = req.params;

    // Find payments by mongoOrderId (assuming it's a string and not an ObjectId)
    const payment = await PaymentMapping.find({ mongoOrderId:OrderId });

    // If payment is not found, return 404
    if (!payment || payment.length === 0) {
      return res.status(404).send('Payment not found for given Order ID.');
    }

    // Return the payment details
    res.json(payment);
  } catch (error) {
    console.error('Error fetching payment by order ID:', error);
    res.status(500).send('Server error while fetching payment.');
  }
};

