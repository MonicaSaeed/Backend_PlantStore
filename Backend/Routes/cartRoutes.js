const express = require('express'); 
let router = express.Router();

const cartController = require('../Controllers/cartController'); // Import the cart controller

router.post('/getItems', cartController.getCartItems); // Get all items in the cart
router.post('/', cartController.addToCart); // Add an item to the cart
router.put('/:plantId', cartController.updateCartItem); // Update an item in the cart
router.delete('/:plantId', cartController.removeFromCart); // Remove an item from the cart
router.delete('/', cartController.clearCart); // Clear the carta

module.exports = router;