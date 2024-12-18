const express = require("express");
const UsersController = require("../controllers/UsersController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Register endpoint
router.post("/register", UsersController.registerUser);

// Login endpoint
router.post("/login", UsersController.loginUser);

// Protected route (Example: Get user profile)
router.get("/profile", authMiddleware, UsersController.getUserProfile);

module.exports = router;
