const express = require("express");
const UsersController = require("../controllers/UsersController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Register endpoint
router.post("/api/register", UsersController.registerUser);

// Login endpoint
router.post("/api/login", UsersController.loginUser);

// Protected route (Example: Get user profile)
router.get("/api/profile", authMiddleware, UsersController.getUserProfile);

module.exports = router;
