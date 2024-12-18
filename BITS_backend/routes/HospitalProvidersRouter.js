const express = require("express");
const {
  registerHospitalProvider,
  createTimeSlots,
} = require("../controllers/HospitalProvidersController");

const router = express.Router();

// Register a new hospital provider
router.post("/register", registerHospitalProvider);

// Create time slots for a hospital provider
router.post("/timeSlots", createTimeSlots);

module.exports = router;
