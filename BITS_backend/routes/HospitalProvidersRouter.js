const express = require("express");
const { registerHospitalProvider, createTimeSlots } = require("../controllers/HospitalProvidersController");

const router = express.Router();

// Register a new hospital provider
router.post("/api/hospital_providers/register", registerHospitalProvider);

// Create time slots for a hospital provider
router.post("/api/hospital_providers/time_slots", createTimeSlots);

module.exports = router;
