const usermodel = require("../Models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

Login = async(req,res)=>{

let user = req.body; 
user.email = user.email.toLowerCase();

 let founduser = await usermodel.findOne({email:user.email});
 if(!founduser) return res.status(400).json({message:"InValid Email/Password"})

 let IsCorrectPassword =  await bcrypt.compare(user.password,founduser.password);
 if(!IsCorrectPassword) return res.status(400).json({message:"InValid Email/Password"})

 let data = await jwt.sign({email:founduser.email,username:founduser.username},"PrivateKey12345");
 res.header("front-auth-token",data);
 
 return res.status(200).json({message:"LogIN Successfuly",userData:user});

}

register = async(req,res)=>{

    let user = req.body; 
    
    user.email = user.email.toLowerCase();
 
    let founduser = await usermodel.findOne({email:user.email});
 
    if(founduser) 
    {
       return res.status(201).json({message:"Aready Exist,Please LogIn"});
    }
 
    let salt = await bcrypt.genSalt(15);
    let PasswordHashe = await bcrypt.hash(user.password,salt);
    user.password = PasswordHashe;
 
    let newuser = new usermodel(user);
    await newuser.save();
 
    return res.status(200).json({message:"Registered Successfuly",userData:newuser});
 
 }

getAllUsers = async(req,res)=>{

    try
    {
        let users = await usermodel.find();
        res.status(200).json({message:"Found Users",Users:users});
    } 
    catch(error) {
        res.status(400).json({ error:"Not Found Users"});
    }


}

getUserById = async(req,res) =>{
    const id = req.params;

    try
    {
        let user = await usermodel.findById(id);
        res.status(200).json({message:"Found Users",Users:user});
    } 
    catch(error) {
        res.status(400).json({ error:"Not Found User"});
    }

}

updateUser = async(req,res)=>{

    const id  = req.params;
    const UpdatedUser = req.body;      
    UpdatedUser.email = email.toLowerCase();

    try {

        if (UpdatedUser.password) 
        {
            const salt = await bcrypt.genSalt(15);
            let PasswordHashe = await bcrypt.hash(UpdatedUser.password, salt);
            UpdatedUser.password = PasswordHashe;

        }

        const User = await User.findByIdAndUpdate(id,UpdatedUser);
        if (!User)
         {
            return res.status(404).json({ message: 'User not found' });
         }

        res.status(200).json(User);
    } 
    catch (error)
     {
        res.status(400).json({error:"Error"});
     }


}

deleteUser = async(req,res) => {
    
    const id  = req.params;

    try {

        const User = await User.findByIdAndDelete(id);

        if (!User)
         {
            return res.status(404).json({ message: 'User Not Found'});
         }

        res.status(200).json({message:"User Deleted",user:User});
    } 
    catch (error)
     {
        res.status(400).json({error:"Error"});
     }

}


module.exports = {

    Login,
    register,
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser
}
