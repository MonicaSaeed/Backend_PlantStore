const express = require("express");
const router = express.Router();
const UserController = require("../Controllers/UserController");
const permission = require("../Middleware/PermissionMiddleware");
const authenticateToken = require("../Middleware/auth")

router.post("/login",UserController.Login);

router.post("/reg",UserController.register);

router.get('/',[authenticateToken,permission],UserController.getAllUsers);

router.get('/:id',authenticateToken,UserController.getUserById);

router.put('/:id',authenticateToken,UserController.updateUser);

router.delete('/:id',[authenticateToken,permission],UserController.deleteUser);


module.exports = router;

