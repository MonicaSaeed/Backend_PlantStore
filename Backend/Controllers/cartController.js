const cartModel = require('../Models/Cart');
const plantModel = require('../Models/Plant');
const potModel = require('../Models/Pot');

const getCartItems = async (req, res) => {
    try {
        const { userId } = req.body;
        if (!userId) {
            return res.status(400).json({ success: false, message: "User ID is required" });
        }
        const cartItems = await cartModel.findOne({ userId });
        if (!cartItems) {
            return res.status(404).json({ success: false, message: "No items found in the cart" });
        }
        return res.status(200).json({ success: true, cartItems });
    } catch (error) {
        console.error("Error fetching cart items:", error.message);
        return res.status(500).json({ success: false, message: `Server error: ${error.message}` });
    }
};
const addToCart = async (req, res) => {
    try {
        const { userId, plantId } = req.body;

        if (!userId || !plantId) {
            return res.status(400).json({ success: false, message: "User ID and Plant ID are required" });
        }

        const cartItems = await cartModel.findOne({ userId });
        const itemPlant = await plantModel.findById(plantId);
        const itemPot = await potModel.findById(plantId);

        // if (itemPlant && itemPot) {
        //     return res.status(400).json({ success: false, message: "Item ID is ambiguous (found in both Plant and Pot)" });
        // } -> at most it's not possible to have the same id in both collections

        if (!itemPlant && !itemPot) {
            return res.status(404).json({ success: false, message: "Item not found" });
        }

        if (!cartItems) {
            const newCart = new cartModel({
                userId,
                itemsPlant: itemPlant ? [{ plantId, quantity: 1 }] : [],
                itemsPot: itemPot ? [{ plantId, quantity: 1 }] : []
            });
            await newCart.save();
            return res.status(201).json({ success: true, message: "Item added to cart", cartItems: newCart });
        } else {
            if (itemPlant) {
                const index = cartItems.itemsPlant.findIndex(item => item.plantId.toString() === plantId);
                if (index > -1) {
                    cartItems.itemsPlant[index].quantity += 1;
                } else {
                    cartItems.itemsPlant.push({ plantId, quantity: 1 });
                }
            }

            if (itemPot) {
                const index = cartItems.itemsPot.findIndex(item => item.plantId.toString() === plantId);
                if (index > -1) {
                    cartItems.itemsPot[index].quantity += 1;
                } else {
                    cartItems.itemsPot.push({ plantId, quantity: 1 });
                }
            }

            await cartItems.save();
            return res.status(200).json({ success: true, message: "Item updated in cart", cartItems });
        }
    } catch (error) {
        console.error("Error adding to cart:", error.message);
        return res.status(500).json({ success: false, message: `Server error: ${error.message}` });
    }
};
const updateCartItem = async (req, res) => {
    try {
        // it's in cart put just need to update quantity by 1
        const {userId, operation} = req.body;
        const {plantId} = req.params;

        if (!userId || !plantId) {
            return res.status(400).json({ success: false, message: "User ID and Plant ID are required" });
        }
        const itemPlant = await plantModel.findById(plantId);
        const itemPot = await potModel.findById(plantId);
        if(itemPlant){
            const findIndex = cartItems.itemsPlant.findIndex(item => item.plantId.toString() === plantId);
            if (operation === "add") {
                if(itemPlant.stock > cartItems.itemsPlant[findIndex].quantity){
                    cartItems.itemsPlant[findIndex].quantity += 1;
                }
                else{
                    return res.status(400).json({ success: false, message: "No more stock available" });
                }
            } else if (operation === "remove") {
                cartItems.itemsPlant[findIndex].quantity -= 1;
                if (cartItems.itemsPlant[findIndex].quantity <= 0) {
                    cartItems.itemsPlant.splice(findIndex, 1);
                }
            }
            await cartItems.save();
        }else{
            const findIndex = cartItems.itemsPot.findIndex(item => item.plantId.toString() === plantId);
            if (operation === "add") {
                if(itemPot.stock > cartItems.itemsPot[findIndex].quantity){
                    cartItems.itemsPot[findIndex].quantity += 1;
                }
                else{
                    return res.status(400).json({ success: false, message: "No more stock available" });
                }
            } else if (operation === "remove") {
                cartItems.itemsPot[findIndex].quantity -= 1;
                if (cartItems.itemsPot[findIndex].quantity <= 0) {
                    cartItems.itemsPot.splice(findIndex, 1);
                }
            }
            await cartItems.save();
        }
        return res.status(200).json({ success: true, message: "Item updated in cart", cartItems });
    }
    catch(error){
        console.error("Error updating cart item:", error.message);
        return res.status(500).json({ success: false, message: `Server error: ${error.message}` });
    }
}
const removeFromCart = async (req, res) => {
    try{
        const {userId} = req.body;
        const {plantId} = req.params;
        if (!userId || !plantId) {
            return res.status(400).json({ success: false, message: "User ID and Plant ID are required" });
        }
        const cartItems = await cartModel.findOne({ userId });
        if (!cartItems) {
            return res.status(404).json({ success: false, message: "No items found in the cart" });
        }
        const index = cartItems.itemsPlant.findIndex(item => item.plantId.toString() === plantId);
        if (index > -1) {
            cartItems.itemsPlant.splice(index, 1);
            await cartItems.save();
            return res.status(200).json({ success: true, message: "Item removed from cart", cartItems });
        } else {
            return res.status(404).json({ success: false, message: "Item not found in the cart" });
        }
    }
    catch (error) {
        console.error("Error removing from cart:", error.message);
        return res.status(500).json({ success: false, message: `Server error: ${error.message}` });
    }
};

const clearCart = async (req, res) => {
    try {
        const { userId } = req.body;
        if (!userId) {
            return res.status(400).json({ success: false, message: "User ID is required" });
        }
        await cartModel.deleteOne({ userId });
        return res.status(200).json({ success: true, message: "Cart cleared successfully" });
    } catch (error) {
        console.error("Error clearing cart:", error.message);
        return res.status(500).json({ success: false, message: `Server error: ${error.message}` });
    }
};
module.exports = {
    getCartItems,
    addToCart,
    removeFromCart,
    clearCart,
    updateCartItem
}