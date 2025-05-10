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

        let token = jwt.sign(
            {
                id: founduser._id,
                username: founduser.username,
                role: founduser.role
            },
            "PrivateKey12345",
            { expiresIn: '48h' } 
        );
        return res.status(200).json({
            message: "Login Successfully",
            token: token
        });
}

register = async(req,res)=>{

        let user = req.body; 
        
        user.email = user.email.toLowerCase();
    
        const existUsername = await usermodel.findOne({username:user.username});

        if(existUsername)
            return res.status(400).json({message:"Username already exist"});

        const existEmail = await usermodel.findOne({email:user.email});
        if(existEmail)
            return res.status(400).json({message:"Email already exist"});

    
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
    try
    {
        const {id} = req.params;
        let user = await usermodel.findById(id);
        res.status(200).json({message:"Found Users",Users:user});
    } 
    catch(error) {
        res.status(400).json({ error:"Not Found User"});
    }

}

updateUser = async(req,res)=>{   
    try {

        const {id}  = req.params;
        const UpdatedUser = req.body;   

        if(UpdatedUser.email)
        {
            UpdatedUser.email = UpdatedUser.email.toLowerCase();
        }
        if (UpdatedUser.password) 
        {
            const salt = await bcrypt.genSalt(15);
            let PasswordHashe = await bcrypt.hash(UpdatedUser.password, salt);
            UpdatedUser.password = PasswordHashe;

        }

        const updated = await usermodel.findByIdAndUpdate(id, UpdatedUser, { new: true });
            if (!updated)
            {
                return res.status(404).json({ message: 'User not found' });
            }

        res.status(200).json(updated);
    } 
        catch (error)
        {
            res.status(400).json({error:"Error"});
        }


}

deleteUser = async(req,res) => {


    try {

        const {id}  = req.params;
        const deleted = await usermodel.findByIdAndDelete(id);

            if (!deleted)
            {
                return res.status(404).json({ message: 'User Not Found'});
            }

        res.status(200).json({message:"User Deleted",user:deleted});
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
