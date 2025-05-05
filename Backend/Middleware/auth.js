const jwt = require('jsonwebtoken');


// Middleware to authenticate user
const authenticateToken=(req, res, next) =>{
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer <token>
  // console.log(token);
    if (!token) return res.status(401).send('Authentication Token required');

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET);
    //    console.log(verified);
        req.user = verified;
        next();
    } catch (err) {
        res.status(400).send('Invalid Token');
    }
}



module.exports = {authenticateToken};