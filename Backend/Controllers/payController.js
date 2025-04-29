const { getAuthToken, createOrder, generatePaymentKey } = require('../services/paymobService');

const IFRAME_ID = '917275';

exports.pay = async (req, res) => {
    try {
        const amountCents = req.body.amount_cents;

        const authToken = await getAuthToken();
        const orderId = await createOrder(authToken, amountCents);
        const paymentKey = await generatePaymentKey(authToken, orderId, amountCents);

        const iframeURL = `https://accept.paymobsolutions.com/api/acceptance/iframes/${IFRAME_ID}?payment_token=${paymentKey}`;

        res.json({ iframe_url: iframeURL });
    } catch (error) {
        console.error(error.response ? error.response.data : error.message);
        res.status(500).send('Payment Error');
    }
};

exports.paymentCallback = (req, res) => {
    const query = req.query;

    if (query.success === 'true' && query.txn_response_code === 'APPROVED') {
        console.log("✅ Payment successful for order:", query.order);
        res.send('Payment Success!');
    } else {
        console.log("❌ Payment failed for order:", query.order);
        res.send('Payment Failed.');
    }
};
