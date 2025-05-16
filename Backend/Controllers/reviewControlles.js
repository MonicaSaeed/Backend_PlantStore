const reviewModel = require('../Models/Review');
const userModel = require('../Models/User');
const Pot = require('../Models/Pot');
const Plant = require('../Models/Plant');

const addReview = async (req, res) => {
    try {
        const { userId, itemId, itemType, rating, comment } = req.body;
        if (!userId || !itemId || !rating || !comment || !itemType)
            return res.status(400).json({ message: "All fields are required" });

        const review = new reviewModel({
            userId,
            item: {
                id: itemId,
                type: itemType,
            },
            rating,
            comment,
        });
        await review.save();

        if (itemType == "pot") {
            await Pot.findByIdAndUpdate(
                itemId,
                { $push: { reviews: review._id } },
                { new: true }
            );
        } else {
            await Plant.findByIdAndUpdate(
                itemId,
                { $push: { reviews: review._id } },
                { new: true }
            );
        }
        await updateRating(itemId, itemType);

        return res.status(201).json({ message: "Review added successfully", review });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Internal server error" });
    }
};

const getReviews = async (req, res) => {
    try {
        const { productId } = req.body;
        if (!productId) return res.status(400).json({ message: "Product ID is required" });

        const reviews = await reviewModel.find({ 'item.id': productId });
        if (!reviews) return res.status(404).json({ message: "No reviews found" });

        const reviewsList = await Promise.all(reviews.map(async (review) => {
            const user = await userModel.findById(review.userId).select('username');
            return {
                username: user.username,
                date: review.createdAt,
                rating: review.rating,
                comment: review.comment,
            };
        }));

        return res.status(200).json({ message: "Reviews fetched successfully", reviews: reviewsList });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Internal server error" });
    }
};

// New: Admin view to get all reviews with user & item info
const getAllReviews = async (req, res) => {
    try {
        // Fetch all reviews with user info populated (username & email)
        const reviews = await reviewModel.find()
            .populate('userId', 'username email')
            .sort({ createdAt: -1 });

        // Map to a cleaner object with item info, rating, comment, date
        const formatted = reviews.map(r => ({
            reviewId: r._id,
            username: r.userId?.username || "Unknown",
            userEmail: r.userId?.email || "Unknown",
            itemId: r.item.id,
            itemType: r.item.type,
            rating: r.rating,
            comment: r.comment,
            date: r.createdAt,
        }));

        res.status(200).json({ message: "All reviews fetched", reviews: formatted });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// New: Admin deletes a review by review ID
const deleteReview = async (req, res) => {
    try {
        const { reviewId } = req.params;
        if (!reviewId) return res.status(400).json({ message: "Review ID is required" });

        // Find review to get item info for rating update
        const review = await reviewModel.findById(reviewId);
        if (!review) return res.status(404).json({ message: "Review not found" });

        // Remove review reference from related item
        if (review.item.type === "pot") {
            await Pot.findByIdAndUpdate(review.item.id, { $pull: { reviews: review._id } });
        } else {
            await Plant.findByIdAndUpdate(review.item.id, { $pull: { reviews: review._id } });
        }

        // Delete review
        await reviewModel.findByIdAndDelete(reviewId);

        // Update item rating
        await updateRating(review.item.id, review.item.type);

        res.status(200).json({ message: "Review deleted successfully" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
};

module.exports = {
    addReview,
    getReviews,
    getAllReviews,
    deleteReview,
};

async function updateRating(itemId, type) {
    try {
        if (type === "pot") {
            const pot = await Pot.findById(itemId).populate('reviews');
            const reviews = pot?.reviews || [];

            if (reviews.length === 0) {
                await Pot.findByIdAndUpdate(itemId, { rating: 0 });
                return;
            }

            const totalRating = reviews.reduce((sum, r) => sum + r.rating, 0);
            const avgRating = totalRating / reviews.length;

            await Pot.findByIdAndUpdate(itemId, { rating: Number(avgRating.toFixed(1)) });
        } else {
            const plant = await Plant.findById(itemId).populate('reviews');
            const reviews = plant?.reviews || [];

            if (reviews.length === 0) {
                await Plant.findByIdAndUpdate(itemId, { rating: 0 });
                return;
            }

            const totalRating = reviews.reduce((sum, r) => sum + r.rating, 0);
            const avgRating = totalRating / reviews.length;

            await Plant.findByIdAndUpdate(itemId, { rating: Number(avgRating.toFixed(1)) });
        }
    } catch (error) {
        console.error('Error updating rating:', error);
    }
}
