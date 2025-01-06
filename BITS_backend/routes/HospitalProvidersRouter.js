const express = require("express");
const {
  registerHospitalProvider,
  createTimeSlots,
  bookAppointment,
  confirmAppointment,
  updateTimeSlots,
  fetchTimeSlots,
  deleteTimeSlots,
} = require("../controllers/HospitalProvidersController");

const router = express.Router();

// Register a new hospital provider
router.post("/register", registerHospitalProvider);

// Create time slots for a hospital provider
router.post("/timeSlots", createTimeSlots);
router.post("/updateTimeSlots", updateTimeSlots);
router.get("/getTimeSlots", fetchTimeSlots);
router.post("/bookAppointment", bookAppointment);
router.post("/confirmAppointment", confirmAppointment);
router.delete("/deleteTimeSlots", deleteTimeSlots);
module.exports = router;
