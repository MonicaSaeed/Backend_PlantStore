const jwt = require("jsonwebtoken");

const permission = (req, res, next) => {
      console.log("Received token:", req.headers['Authorization']);
      const authHeader = req.headers['Authorization'];
      const token = authHeader && authHeader.split(' ')[1];
      console.log("Received token:", token);
      if (!token) {
         return res.status(401).json({ message: "Authentication token required" });
      }
      
      try {
         const decoded = jwt.verify(token, "PrivateKey12345");

         if (decoded.role !== "admin") {
               return res.status(403).json({ message: "Access Denied. Admins only." });
         }

         req.user = decoded; //pass user data to next middleware
         next();

      } catch (err) {
         return res.status(400).json({ message: "Invalid token." });
      }
};

module.exports = permission;