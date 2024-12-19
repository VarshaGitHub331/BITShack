const express = require("express");
const {
  registerHospitalProvider,
  createTimeSlots,
  bookAppointment,
  confirmAppointment,
} = require("../controllers/HospitalProvidersController");

const router = express.Router();

// Register a new hospital provider
router.post("/register", registerHospitalProvider);

// Create time slots for a hospital provider
router.post("/timeSlots", createTimeSlots);

router.post("/bookAppointment", bookAppointment);
router.post("/confirmAppointment", confirmAppointment);
module.exports = router;
