const express = require('express'); 
let router = express.Router();

const cartController = require('../Controllers/reviewControlles');

router.post('/addReview', cartController.addReview);
router.post('/getReviews', cartController.getReviews);

module.exports = router;