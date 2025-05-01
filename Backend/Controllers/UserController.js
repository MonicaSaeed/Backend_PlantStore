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

 let data = await jwt.sign({email:founduser.email,username:founduser.username});
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

getAllUsers = ()=>{


}

getUserById =() =>{



}

updateUser = ()=>{


}

deleteUser = ()=>{




}
