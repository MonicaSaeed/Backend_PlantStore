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
    const paymobOrderId = Number(query.order); // make sure it's a number
  
    try {
      const mapping = await OrderMapping.findOne({ paymobOrderId });
      if (!mapping) {
        console.error(`⚠️ No mapping found for Paymob order: ${paymobOrderId}`);
        return res.status(404).send('Order not found');
      }
  
      const status = (query.success === 'true' && query.txn_response_code === 'APPROVED')
        ? 'paid'
        : 'waiting';
  
      await Order.findByIdAndUpdate(mapping.mongoOrderId, { paymentStatus: status });
  
      console.log(`✅ Payment ${status === 'paid' ? 'successful' : 'failed'} for order: ${mapping.mongoOrderId}`);
      res.send(status === 'paid' ? 'Payment Success!' : 'Payment Failed.');
    } catch (error) {
      console.error('❌ Error processing payment callback:', error.message);
      res.status(500).send('Server error');
    }
  };
  