const Order = require('../Models/Order');

// POST - Create new order
exports.postOrderInfo = async (req, res) => {
    try {
        const { userId, itemsPlant, itemsPot, totalAmount, orderStatus, shippingAddress, paymentStatus, TraxId } = req.body;

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
