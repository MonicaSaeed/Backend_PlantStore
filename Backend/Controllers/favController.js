const Favorites = require('../Models/Favorites');
const Plants = require('../Models/Plant');
const Pots = require('../Models/Pot');
const User = require('../Models/User');

// get fav or create if not exsits
exports.getOrCreateFavorites = async (req, res) => {
    try {
        const { userId } = req.params;

        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: 'User not found' });

        let favorites = await Favorites.findOne({ userId })
        // .populate('plants')
        // .populate('pots');

        console.log(favorites);
        if (!favorites) {
        favorites = new Favorites({ userId, plants: [], pots: [] });
        await favorites.save();
        let user = await User.findByIdAndUpdate(userId,{ favorites: favorites._id }, { new: true });
        console.log(user);
        }

        res.json(favorites);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};


// get fav or create if not exsits
exports.getOrCreateFavoritesWithPopulate = async (req, res) => {
    try {
        const { userId } = req.params;

        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: 'User not found' });

        let favorites = await Favorites.findOne({ userId })
        .populate({
    path: 'plants',
    model: 'Plant' // make sure this matches your Plant model name
  })
        .populate({
    path: 'pots',
    model: 'Pot' // make sure this matches your Plant model name
  });

        console.log(favorites);
        if (!favorites) {
        favorites = new Favorites({ userId, plants: [], pots: [] });
        await favorites.save();
        let user = await User.findByIdAndUpdate(userId,{ favorites: favorites._id }, { new: true });
        console.log(user);
        }

        res.json(favorites);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
//Add a plant to favorites
exports.addPlantToFavorites = async (req, res) => {
    try {
        const { userId, plantId } = req.params;
    
        const plant = await Plants.findById(plantId);
        if (!plant) return res.status(404).json({ message: 'Plant not found' });

        let favorites = await Favorites.findOneAndUpdate(
            { userId },
            { $addToSet: { plants: plantId } },
            { new: true, upsert: true }
        ).populate('plants');
    
        res.json({ message: 'Plant added to favorites', favorites });
        } catch (err) {
        res.status(500).json({ message: err.message });
        }
};

//Add a pot to favorites
exports.addPotToFavorites = async (req, res) => {
    try {
        const { userId, potId } = req.params;
    
        const pot = await Pots.findById(potId);
        if (!pot) return res.status(404).json({ message: 'Pot not found' });

        let favorites = await Favorites.findOneAndUpdate(
            { userId },
            { $addToSet: { pots: potId } },
            { new: true, upsert: true }
        ).populate('pots');
    
        res.json({ message: 'Pot added to favorites', favorites });
        } catch (err) {
        res.status(500).json({ message: err.message });
    }
};


//Delete a plant from favorites
exports.removePlantFromFavorites = async (req, res) => {
        try {
        const { userId, plantId } = req.params;
    
        const favorites = await Favorites.findOneAndUpdate(
            { userId },
            { $pull: { plants: plantId } },
            { new: true }
        ).populate('plants');
    
        res.json({ message: 'Plant removed from favorites', favorites });
        } catch (err) {
        res.status(500).json({ message: err.message });
        }
};

//delete a pot from favorites
exports.removePotFromFavorites = async (req, res) => {
        try {
        const { userId, potId } = req.params;
    
        const favorites = await Favorites.findOneAndUpdate(
            { userId },
            { $pull: { pots: potId } },
            { new: true }
        ).populate('pots');
    
        res.json({ message: 'Pot removed from favorites', favorites });
        } catch (err) {
        res.status(500).json({ message: err.message });
        }
};


//Clear all favorites for a user
exports.clearFavorites = async (req, res) => {
    try {
        const { userId } = req.params;
    
        await Favorites.findOneAndDelete({ userId });
        res.json({ message: 'Favorites cleared'});
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};


//Create a new favorites list for a user (for test)
exports.createFavorites = async (req, res) => {
    try {
        const favorites = new Favorites(req.body); 
        await favorites.save();
        res.status(201).json({ message: 'Favorites created', data: favorites });
        } catch (error) {
        res.status(400).json({ error: error.message });
    }
};