const axios = require('axios');

const PAYMOB_API_KEY = process.env.PAYMOB_API_KEY;
const INTEGRATION_ID = process.env.PAYMOB_INTEGRATION_ID;

exports.getAuthToken = async () => {
    const response = await axios.post('https://accept.paymobsolutions.com/api/auth/tokens', {
        api_key: PAYMOB_API_KEY
    });
    return response.data.token;
};

exports.createOrder = async (authToken, amountCents) => {
    const response = await axios.post('https://accept.paymobsolutions.com/api/ecommerce/orders', {
        auth_token: authToken,
        delivery_needed: "false",
        amount_cents: amountCents,
        currency: "EGP",
        items: []
    });
    return response.data.id;
};

exports.generatePaymentKey = async (authToken, orderId, amountCents) => {
    const response = await axios.post('https://accept.paymobsolutions.com/api/acceptance/payment_keys', {
        auth_token: authToken,
        amount_cents: amountCents,
        expiration: 3600,
        order_id: orderId,
        billing_data: {
            apartment: "NA",
            email: "test@example.com",
            floor: "NA",
            first_name: "Test",
            street: "NA",
            building: "NA",
            phone_number: "+201000000000",
            shipping_method: "NA",
            postal_code: "NA",
            city: "NA",
            country: "EG",
            last_name: "User",
            state: "NA"
        },
        currency: "EGP",
        integration_id: INTEGRATION_ID
    });
    return response.data.token;
};
