const reviewModel = require('../Models/Review');
const userModel = require('../Models/User');
const Pot = require('../Models/Pot')
const Plant=require('../Models/Plant')

const addReview = async (req, res) => {
    try{
        const {userId, itemId, itemType, rating, comment} = req.body;
        if(!userId || !itemId || !rating || !comment || !itemType) return res.status(400).json({message: "All fields are required"});
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
        if(itemType=="pot")
        {
            await Pot.findByIdAndUpdate(
                itemId,
                { $push: { reviews: review._id } },
                { new: true }
            )

        }else {
             await Plant.findByIdAndUpdate(
                itemId,
                { $push: { reviews: review._id } },
                { new: true }
            )
            // await updateRating(itemId)

        }
        await updateRating(itemId,itemType)

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
        const reviews = await reviewModel.find({ 'item.id': productId });
        // console.log(reviews)

        if(!reviews) return res.status(404).json({message: "No reviews found"});
        // res list of  -> user name, date, rating, comment
        // console.log(reviews)
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

async function updateRating(itemId , type) {
    try {
      // Fetch all reviews for this pot
      if(type=="pot"){
      const pot = await Pot.findById(itemId).populate('reviews');
      const reviews = pot.reviews || [];

      // If no reviews, set rating to 0
      if (reviews.length === 0) {
        await Pot.findByIdAndUpdate(itemId, { rating: 0 });
        return;
      }

      // Sum ratings and compute average
      const totalRating = reviews.reduce((sum, r) => sum + r.rating, 0);
      const avgRating   =( totalRating / reviews.length);

      // Save average (one decimal place)
      await Pot.findByIdAndUpdate(itemId, { rating: Number(avgRating.toFixed(1)) });
    }else {
        const planet = await Plant.findById(itemId).populate('reviews');
      const reviews = planet.reviews || [];

      // If no reviews, set rating to 0
      if (reviews.length === 0) {
        await Plant.findByIdAndUpdate(itemId, { rating: 0 });
        return;
      }

      // Sum ratings and compute average
      const totalRating = reviews.reduce((sum, r) => sum + r.rating, 0);
      const avgRating   =( totalRating / reviews.length);

      // Save average (one decimal place)
      await Plant.findByIdAndUpdate(itemId, { rating: Number(avgRating.toFixed(1)) });
    }
    } catch (error) {
      console.error('Error updating pot rating:', error);
      }}