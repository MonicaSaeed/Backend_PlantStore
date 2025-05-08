const { getAuthToken, createOrder, generatePaymentKey } = require('../services/paymobService');
const OrderMapping = require('../Models/OrderMapping');
const Order = require('../Models/Order'); // replace with your actual Order model

const IFRAME_ID = '917275';

exports.pay = async (req, res) => {
    try {
      const { amount_cents, mongo_order_id } = req.body;
  
      const authToken = await getAuthToken();
      const paymobOrderId = await createOrder(authToken, amount_cents);
      const paymentKey = await generatePaymentKey(authToken, paymobOrderId, amount_cents);
  
      // Save the mapping between your order and Paymob's order
      await OrderMapping.create({
        mongoOrderId: mongo_order_id,
        paymobOrderId: paymobOrderId
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

            const mapping = await OrderMapping.findOne({ paymobOrderId }).sort({ createdAt: -1 });
            if (!mapping) return res.status(404).send('Order mapping not found');

            const order = await Order.findById(mapping.mongoOrderId);
            if (!order) return res.status(404).send('Order not found');

            if (order.paymentStatus === 'paid') {
                console.log("ℹ️ Order already marked as paid:", order._id);
                return res.send('Order already paid.');
            }

            await Order.findByIdAndUpdate(mapping.mongoOrderId, { paymentStatus: 'paid' });

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

  