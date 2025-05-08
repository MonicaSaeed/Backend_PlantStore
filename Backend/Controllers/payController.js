const { getAuthToken, createOrder, generatePaymentKey } = require('../services/paymobService');
const PaymentMapping = require('../Models/PaymentMapping');
const Order = require('../Models/Order');

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

  } catch (error) {
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

      // Get latest mapping in case of multiple attempts
      const mapping = await PaymentMapping.findOne({ paymobOrderId }).sort({ createdAt: -1 });
      if (!mapping) return res.status(404).send('Payment mapping not found');

      const order = await Order.findById(mapping.mongoOrderId);
      if (!order) return res.status(404).send('Order not found');

      if (order.paymentStatus === 'paid') {
        console.log("ℹ️ Order already marked as paid:", order._id);
        return res.send('Order already paid.');
      }

      // Update order status
      await Order.findByIdAndUpdate(mapping.mongoOrderId, { paymentStatus: 'paid' });

      // Update mapping with payment info
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
      res.send('Payment Success!');

    } catch (error) {
      console.error('Callback Error:', error);
      res.status(500).send('Internal Server Error during callback.');
    }
  } else {
    res.send('Payment Failed.');
  }
};
