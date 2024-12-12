const express = require("express");
const jwt = require("jsonwebtoken");
const { User } = require("../models");

const router = express.Router();
const SECRET_KEY = "bitsnpieces"; // Replace with a secure key

// Register endpoint
router.post("/api/register", async (req, res) => {
    const { email, password, role } = req.body;

    if (!email || !password || !role) {
        return res.status(400).json({ error: "All fields are required" });
    }

    try {
        const newUser = await User.create({ email, password, role });
        res.status(201).json({ message: "User registered successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Error registering user" });
    }
});

// Login endpoint
router.post("/api/login", async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: "Email and password are required" });
    }

    try {
        const user = await User.findOne({ where: { email } });

        if (!user || !(await user.validatePassword(password))) {
            return res.status(401).json({ error: "Invalid email or password" });
        }

        // Generate JWT
        const token = jwt.sign({ userId: user.user_id, role: user.role }, SECRET_KEY, {
            expiresIn: "1h",
        });

        res.json({ token });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Error logging in" });
    }
});

module.exports = router;