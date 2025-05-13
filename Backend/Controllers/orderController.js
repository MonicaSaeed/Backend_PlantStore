const Order = require('../Models/Order');

// POST - Create new order
exports.postOrderInfo = async (req, res) => {
    try {
        const { userId, itemsPlant, itemsPot, totalAmount, orderStatus, shippingAddress, paymentStatus } = req.body;

        const newOrder = new Order({
            userId,
            itemsPlant,
            itemsPot,
            totalAmount,
            orderStatus,
            shippingAddress,
            paymentStatus,
        });

        const savedOrder = await newOrder.save();
        res.status(201).json(savedOrder);
    } catch (err) {
        console.error(err);
        res.status(400).json({ message: err.message });
    }
};
//insert many orderss 

exports.postMultipleOrders = async (req, res) => {
  try {
    const orders = req.body;

    // Validate input: must be an array
    if (!Array.isArray(orders)) {
      return res.status(400).json({ message: "Request body must be an array of orders" });
    }

    // Optional: Validate each order structure before insertion
    const validOrders = orders.map(order => ({
      userId: order.userId,
      itemsPlant: order.itemsPlant || [],
      itemsPot: order.itemsPot || [],
      totalAmount: order.totalAmount,
      orderStatus: order.orderStatus || 'pending',
      shippingAddress: order.shippingAddress,
      paymentStatus: order.paymentStatus || 'pending',
      createdAt: order.createdAt || new Date(), // for analytics by month
      updatedAt: order.updatedAt || new Date()
    }));

    const insertedOrders = await Order.insertMany(validOrders, { ordered: false });
    res.status(201).json(insertedOrders);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};


// GET - All orders
exports.getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find().populate('userId itemsPlant.plantId itemsPot.potId');
        res.json(orders);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// GET - Order by ID
exports.getOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id).populate('userId itemsPlant.plantId itemsPot.potId');
        if (!order) return res.status(404).json({ message: 'Order not found' });
        res.json(order);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// PUT - Update order
exports.updateOrderById = async (req, res) => {
    try {
        const updatedOrder = await Order.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedOrder) return res.status(404).json({ message: 'Order not found' });
        res.json(updatedOrder);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// DELETE - Delete order
exports.deleteOrderById = async (req, res) => {
    try {
        const deletedOrder = await Order.findByIdAndDelete(req.params.id);
        if (!deletedOrder) return res.status(404).json({ message: 'Order not found' });
        res.json({ message: 'Order deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// GET - Orders by User ID
exports.getOrdersByUserId = async (req, res) => {
    try {
        const orders = await Order.find({ userId: req.params.userId }).populate('itemsPlant.plantId itemsPot.potId');
        res.json(orders);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// PATCH - orderStatus by User ID
exports.updateOrderStatus = async (req, res) => {
  try {
    const { orderStatus } = req.body;

    if (!['pending', 'shipped', 'delivered'].includes(orderStatus)) {
      return res.status(400).json({ message: 'Invalid order status value.' });
    }

    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      { orderStatus },
      { new: true }
    );

    if (!updatedOrder) return res.status(404).json({ message: 'Order not found.' });

    res.json(updatedOrder);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// PATCH - paymentStatus by User ID
exports.updatePaymentStatus = async (req, res) => {
  try {
    const { paymentStatus } = req.body;

    if (!['pending', 'onDelivere', 'paid'].includes(paymentStatus)) {
      return res.status(400).json({ message: 'Invalid payment status value.' });
    }

    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      { paymentStatus },
      { new: true }
    );

    if (!updatedOrder) return res.status(404).json({ message: 'Order not found.' });

    res.json(updatedOrder);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
