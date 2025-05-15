const express = require("express");
const router = express.Router();
const UserController = require("../Controllers/UserController");
const permission = require("../Middleware/PermissionMiddleware");
const authenticateToken = require("../Middleware/auth")

router.post("/login",UserController.Login);

router.post("/reg",UserController.register);

router.get('/',UserController.getAllUsers);

router.get('/:id',UserController.getUserById);

router.put('/:id',UserController.updateUser);

router.put('/change-password/:id', UserController.changePassword);

router.delete('/:id',UserController.deleteUser);


module.exports = router;

