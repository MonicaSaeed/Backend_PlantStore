const jwt = require("jsonwebtoken");

permission = (req,res,next)=>{

const datauser_jwt = req.header("front-auth-token");

const decode_jwt  = jwt.decode(datauser_jwt,"PrivateKey12345");

if(decode_jwt.role !== "admin")
{
   res.status().json({message:"Not Allowed"});
}
next();
}