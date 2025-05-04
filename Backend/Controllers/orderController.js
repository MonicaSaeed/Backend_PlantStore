const Order = require('../Models/Order');

exports.postOrderInfo = async (req, res) => {
    try {
      const {
        userId,
        itemsPlant,
        itemsPot,
        totalAmount,
        orderStatus,
        shippingAddress,
        paymentStatus,
        TraxId
      } = req.body;
  
      const newOrder = new Order({
        userId,
        itemsPlant,
        itemsPot,
        totalAmount,
        orderStatus,
        shippingAddress,
        paymentStatus,
        TraxId
      });
  
      const savedOrder = await newOrder.save();
      res.status(201).json(savedOrder);
    } catch (err) {
      console.error(err);
      res.status(400).json({ message: err.message });
    }
};
