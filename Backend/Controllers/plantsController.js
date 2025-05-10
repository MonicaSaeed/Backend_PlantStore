const Plant = require('../Models/Plant');
const Review = require('../Models/Review'); 

//Get all plants
exports.getAllPlants = async (req, res) => {
    try {
        const plants = await Plant.find().populate('reviews');
        res.json(plants);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Get batch of plants 
exports.getBatch = async (req, res) => {
    try {
        const size = parseInt(req.body.size) ||  10;      
        const offset = parseInt(req.body.offset) ||  0;   

        const plants = await Plant.find()
            .skip(offset*size)
            .limit(size)
            .populate('reviews');

        res.status(200).json({
            data: plants,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


//Get a single plant data by ID
exports.getPlantById = async (req, res) => {
    try {
        const plant = await Plant.findById(req.params.id).populate('reviews');
        if (!plant) return res.status(404).json({ message: 'Plant not found' });
        res.json(plant);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

//Create a new plant
exports.createPlant = async (req, res) => {
    try {
        const plant = new Plant(req.body);
        const savedPlant = await plant.save();
        res.status(201).json({ message:"Added Successfully", savedPlant});
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

//Update a plant
exports.updatePlant = async (req, res) => {
    try {
        const plant = await Plant.findByIdAndUpdate(req.params.id, req.body, {
        new: true, //Return the updated document
        runValidators: true //Run validators on the update
        });
        if (!plant) return res.status(404).json({ message: 'Plant not found' });
        res.json(plant);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

//Delete a plant
exports.deletePlant = async (req, res) => {
    try {
        const plant = await Plant.findByIdAndDelete(req.params.id);
        if (!plant) return res.status(404).json({ message: 'Plant not found' });
        res.json({ message: 'Plant deleted successfully', plant });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

//Add a review to a plant
exports.addReviewToPlant = async (req, res) => {
    try {
    const { rating, comment, userId } = req.body;
    const { plantId } = req.params;

    const review = new Review({
        userId,
        rating,
        comment,
        item: {
        id: plantId,
        type: 'plant'
        }
    });

    await review.save();

    const plant = await Plant.findByIdAndUpdate(
        plantId,
        { $push: { reviews: review._id } },
        { new: true }
    ).populate('reviews');

    await updatePlantRating(plantId);

    res.status(201).json({
        message: 'Review added successfully',
        plant
    });
    } catch (error) {
    res.status(500).json({ error: error.message });
    }
};


//Bulk insert plants
exports.bulkInsertPlants = async (req, res) => {
    try {
    const plantsData = req.body;
    const insertedPlants = await Plant.insertMany(plantsData);

    res.status(201).json({
        message: 'Plants inserted successfully',
        data: insertedPlants
    });
    } catch (error) {
    res.status(500).json({ error: error.message });
    }
};


//Search plants by filters
exports.searchPlants = async (req, res) => {
    try {
        console.log('search');
          console.log('Received /plant/fillter POST request');
        console.log(req.body)
        const { category, sunlightNeeds, careLevel, size, priceMin, priceMax } = req.body || {};
        const filter = {};

        // if (category) filter.category = category;
        // if (sunlightNeeds) filter.sunlightNeeds = sunlightNeeds;
        // if (size) filter.size = size;
        // if (careLevel) filter.careLevel = careLevel;
        // if (priceMin || priceMax) filter.price = {};
        // if (priceMin) filter.price.$gte = priceMin;
        // if (priceMax) filter.price.$lte = priceMax;
if (Array.isArray(category) && category.length > 0) {
  filter.category = { $in: category };
}

if (Array.isArray(sunlightNeeds) && sunlightNeeds.length > 0) {
  filter.sunlightNeeds = { $in: sunlightNeeds };
}

if (Array.isArray(careLevel) && careLevel.length > 0) {
  filter.careLevel = { $in: careLevel };
}

if (Array.isArray(size) && size.length > 0) {
  filter.size = { $in: size };
}

if (priceMin != null || priceMax != null) {
  filter.price = {};
  if (priceMin != null) filter.price.$gte = priceMin;
  if (priceMax != null) filter.price.$lte = priceMax;
}

        console.log(filter);
        const plants = await Plant.find(filter);

        if (plants.length === 0) {
            return res.status(200).json({plants, message: 'No plants found for the given filters' });
        }

        res.json(plants);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};


//Update plant rating based on reviews
exports.updatePlantRating = async (plantId) => {
    try {
        const plant = await Plant.findById(plantId).populate('reviews');

        const reviews = plant.reviews;
        if (reviews.length === 0) {
            await Plant.findByIdAndUpdate(plantId, { rating: 0 });
            return;
        }

        const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
        const averageRating = totalRating / reviews.length;

        await Plant.findByIdAndUpdate(plantId, { rating: averageRating.toFixed(1) });
    } catch (error) {
        console.error("Error updating plant rating:", error.message);
    }
};