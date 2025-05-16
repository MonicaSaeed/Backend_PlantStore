const Pot = require('../Models/Pot');
const Review = require('../Models/Review');


// addpot
exports.addPot = async(req,res)=>{
    try{
        // const {id}=req.headers;
        // const user=await User.findById(id);
        // if(user.role!=='admin')
        //     return res.status(403).json({message:"You Are not Authorized to add Pot"});
         const pot = req.body;
        const newPot = new Pot(pot);
        await newPot.save();
        return res.status(201).json({message:"Pot added successfully"})
    }catch(err)
    {
        res.status(500).json({message:`Internal server error + ${err}`});
    }
}
// insert many
exports.InsertMany = async(req,res)=>{
   try{
      // const {id}=req.headers;
        // const user=await User.findById(id);
        // if(user.role!=='admin')
        //     return res.status(403).json({message:"You Are not Authorized to add Pot"});
        const pots = req.body;
        await Pot.insertMany(pots);
        res.status(201).json({ message: 'Pots inserted successfully', count: pots.length });
    
   }catch(err)
   {
       res.status(500).json({message:`Internal server error + ${err}`});
   }
}

// update pot 
exports.updatePot = async(req,res)=>{
    try{
        const potid=req.params.id;
       // const {id}=req.headers;
         // const user = await User.findById(id);
        // if(user.role!='admin')
        //    return res.status(403).json({message:"You Are not Authorized to add Pot"});
        const newPot = req.body;
        await Pot.findByIdAndUpdate(potid,newPot);
        return res.status(201).json({message:"Pot updated successfully"});

    }catch(err)
    {
        res.status(500).json({message:`Internal server error + ${err}`});
    }
}


// delete-pot 
exports.deletePot=async(req,res)=>{
    try{
        const {id}=req.params;
        console.log(id);
        // const user = await User.findById(id);
        // if(user.role!='admin')
        //    return res.status(403).json({message:"You Are not Authorized to add Pot"});
        console.log(id);
        const pot = await Pot.findByIdAndDelete(id);
        if(!pot)
            return res.status(404).json({message:"Pot not found"});
        return res.status(200).json({message:"Pot deleted successfully",pot});
      }catch(err) 
      {
        res.status(500).json({message:`Internal server error + ${err}`});
      }

}

// delete all pots 

exports.deleteAllPots=async (req,res)=>{
    try{
        await Pot.deleteMany({});
        return res.status(200).json({message:"All Pots are Deleted Successfully"})
    }catch(err)
    {
        res.status(500).json({message:`Internal server error + ${err}`});
    }
}

// get all 
exports.getAll = async (req,res)=>{
    try{
        const allPots = await Pot.find({}).sort({createdAt:-1});
        return res.status(200).json({message:"Pots found successfully",allPots});    

    }catch(err)
    {
        res.status(500).json({message:`Internal server error + ${err}`});
    }
}

// get by id 

exports.getPotById=async (req,res)=>{
    try{
        const id = req.params.id;
        const pot = await Pot.findById(id);
        return res.status(200).json({message:"Pot Found Successfully",pot})
    }catch(err)
    {
        res.status(500).json({message:`Internal server error + ${err}`});
    }
}

// filter 

exports.Filter= async (req, res) => {
    try {
      console.log('Searching pots with body filters…' + req.body);
      const { material, color, size, priceMin, priceMax,stock  } = req.body;
      const filter = {};
  
      if (material) filter.material = material;
      if (color)    filter.color    = color;
if (Array.isArray(size) && size.length > 0) {
  filter.size = { $in: size };
}  
      if (priceMin != null || priceMax != null) {
  filter.price = {};
  if (priceMin != null) filter.price.$gte = priceMin;
  if (priceMax != null) filter.price.$lte = priceMax;
}
    if (stock !== undefined) {
      filter.stock = stock ? { $gt: 0 } : 0;
    }
      console.log('Applied filter:', filter);
      const pots = await Pot.find(filter);
  
      if (pots.length === 0) {
        
        return res.status(200).json({pots, message: 'No pots found for the given filters' });
      }
      //console.log(pots)
      res.json(pots);
  
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: err.message });
    }
  }

  /// getpatch 

exports.getBatch=async(req,res)=>{
      try {
          // Destructure from body with defaults
          const {
            size   = 10,   
            offset = 0     
          } = req.body;
      
          // Ensure numeric values
          const limit  = parseInt(size, 10);
          const skip   = parseInt(offset, 10) * limit;
      
          // Fetch the batch
          const pots = await Pot.find()
            .skip(skip)
            .limit(limit)
      
          res.status(200).json({
            data: pots,
            page:   offset,
            count:  pots.length
          });
        } catch (error) {
          console.error(error);
          res.status(500).json({ message: error.message });
        }
      } 
 
// add review 





