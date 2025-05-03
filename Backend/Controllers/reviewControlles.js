const reviewModel = require('../Models/Review');
const userModel = require('../Models/User');


const addReview = async (req, res) => {
    try{
        const {userId, itemId, itemType, rating, comment} = req.body;
        if(!userId || !item || !rating || !comment || !type) return res.status(400).json({message: "All fields are required"});
        const review = new reviewModel({
            userId,
            item: {
                id: itemId,
                type: itemType
            },
            rating,
            comment
        });
        await review.save();
        // function total review rating
        return res.status(201).json({message: "Review added successfully", review});
    }
    catch(err){
        console.log(err);
        return res.status(500).json({message: "Internal server error"});
    }
};

const getReviews = async (req, res) => {
    try{
        const {productId} = req.body;
        if(!productId) return res.status(400).json({message: "Product ID is required"});
        const reviews = await reviewModel.find({item: {id: productId}});
        if(!reviews) return res.status(404).json({message: "No reviews found"});
        // res list of  -> user name, date, rating, comment
        const reviewsList = await Promise.all(reviews.map(async (review) => {
            const user = await userModel.findById(review.userId).select('username');
            return {
                username: user.username,
                date: review.createdAt,
                rating: review.rating,
                comment: review.comment
            };
        }));
        return res.status(200).json({message: "Reviews fetched successfully", reviews: reviewsList});   
    }catch(err){
        console.log(err);
        return res.status(500).json({message: "Internal server error"});
    }
};

module.exports = {
    addReview,
    getReviews
};

