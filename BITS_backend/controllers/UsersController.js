const jwt = require("jsonwebtoken");
const { User } = require("../models");
const {
  Hospital_User,
  Hospital,
  Hospital_Provider,
} = require("../utils/InitializeModels");

const SECRET_KEY = "bitsnpieces"; // Replace with a secure key

// Register a new user
const registerUser = async (req, res) => {
  console.log("CALLED");
  const { email, password, role } = req.body;

  if (!email || !password || !role) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const newUser = await User.create({ email, password, role });
    const token = jwt.sign(
      { userId: newUser.user_id, role: newUser.role },
      SECRET_KEY,
      {
        expiresIn: "1h",
      }
    );
    res.status(201).json({
      user: {
        user_id: newUser.user_id,
        token: token,
        role: newUser.role,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error registering user" });
  }
};

// Login user and generate JWT
const loginUser = async (req, res) => {
  console.log("LOGGN IN");
  const { email, password, role } = req.body;
  let name = "";
  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  try {
    const user = await User.findOne({ where: { email } });

    if (!user || !(await user.validatePassword(password))) {
      return res.status(401).json({ error: "Invalid email or password" });
    }
    if (role == "Admin") {
      const hospitalUser = await Hospital_User.findOne({
        include: { model: Hospital, attributes: ["hospital_name"] },
        where: { user_id: user.user_id },
        raw: true,
      });
      console.log(hospitalUser);
      name = hospitalUser["Hospital.hospital_name"];
    }
    if (role == "Provider") {
      const hospitalProvider = await Hospital_Provider.findOne({
        where: { provider_id: user.user_id },
        raw: true,
      });
      name = hospitalProvider.provider_name;
    }
    // Generate JWT
    const token = jwt.sign(
      { userId: user.user_id, role: user.role },
      SECRET_KEY,
      {
        expiresIn: "1h",
      }
    );

    res.status(200).json({
      resultUser: { user_id: user.user_id, name, role: user.role, token },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error logging in" });
  }
};

// Get user profile (protected)
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.userId); // `req.user` is set by authMiddleware
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(user);
  } catch (error) {
    console.error("Error fetching user profile:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getUserProfile,
};
