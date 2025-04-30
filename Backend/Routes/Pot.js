const router = require('express').Router();
const Pot = require('../Models/Pot');
const User=require('../Models/User')

/// add-pot 
router.post('/add-pot',async(req,res)=>{
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
})


// insert Many 
router.post('/insert-many',async(req,res)=>{
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
})


/// update-pot 
router.put('/update-pot',async(req,res)=>{
    try{
        const {potid}=req.headers;
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
})

 // delete-pot 
router.delete('/delete-pot',async(req,res)=>{
    try{

        const {potid,id}=req.headers;
        // const user = await User.findById(id);
        // if(user.role!='admin')
        //    return res.status(403).json({message:"You Are not Authorized to add Pot"});
        await Pot.findByIdAndDelete(potid);
        return res.status(201).json({message:"Pot deleted Suceddfully"})
    }catch(err)
    {
        res.status(500).json({message:`Internal server error + ${err}`});
    }
})

// delete all pots
router.delete('/delete-all-pots',async (req,res)=>{
    try{
        await Pot.deleteMany({});
        return res.status(200).json({message:"All Pots are Deleted Successfully"})
    }catch(err)
    {
        res.status(500).json({message:`Internal server error + ${err}`});
    }
})


// get-all-pots

router.get('/getAll',async (req,res)=>{
    try{
        const allPots = await Pot.find({}).sort({createdAt:-1});
        return res.status(200).json({message:"Pots found successfully",allPots});    

    }catch(err)
    {
        res.status(500).json({message:`Internal server error + ${err}`});
    }
})

// getPot-byId
router.get('/getPot-byId/:id',async (req,res)=>{
    try{
        const id = req.params.id;
        const pot = await Pot.findById(id);
        return res.status(200).json({message:"Pot Found Successfully",pot})
    }catch(err)
    {
        res.status(500).json({message:`Internal server error + ${err}`});
    }
})














module.exports=router;