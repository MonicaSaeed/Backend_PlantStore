const express = require('express'); 
let router = express.Router();

const cartController = require('../Controllers/reviewController');

router.post('/addReview', cartController.addReview);
router.get('/getReviews', cartController.getReviews);

module.exports = router;