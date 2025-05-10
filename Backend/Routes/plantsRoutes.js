const express = require('express');
const router = express.Router();
const plantController = require('../Controllers/plantsController');

// Public routes
router.get('/', plantController.getAllPlants);
router.post('/fillter', plantController.searchPlants);
router.get('/batch', plantController.getBatch);
router.get('/:id', plantController.getPlantById);
router.post('/:plantId/reviews', plantController.addReviewToPlant);

// Admin-only routes
router.post('/', plantController.createPlant);
router.post('/bulk', plantController.bulkInsertPlants);
router.put('/:id', plantController.updatePlant);
router.delete('/:id', plantController.deletePlant);

module.exports = router;
