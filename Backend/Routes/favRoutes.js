const express = require('express');
const router = express.Router();
const favoritesController = require('../Controllers/favController');

router.post('/', favoritesController.createFavorites);
router.get('/:userId', favoritesController.getOrCreateFavorites);
router.get('/pop/:userId', favoritesController.getOrCreateFavoritesWithPopulate);
router.post('/:userId/plants/:plantId', favoritesController.addPlantToFavorites);
router.post('/:userId/pots/:potId', favoritesController.addPotToFavorites);
router.delete('/:userId/plants/:plantId', favoritesController.removePlantFromFavorites);
router.delete('/:userId/pots/:potId', favoritesController.removePotFromFavorites);
router.delete('/:userId/clear', favoritesController.clearFavorites);

module.exports = router;
