const express = require('express'); 
let router = express.Router();

const cartController = require('../Controllers/reviewControlles');

router.post('/addReview', cartController.addReview);
router.post('/getReviews', cartController.getReviews);
router.get('/reviews', cartController.getAllReviews);
router.delete('/reviews/:id', cartController.deleteReview);
module.exports = router;