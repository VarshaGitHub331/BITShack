const express = require("express");
const {
  registerHospitalProvider,
  createTimeSlots,
  bookAppointment,
  confirmAppointment,
  updateTimeSlots,
  fetchTimeSlots,
  fetchProviders,
  deleteTimeSlots,
  fetchProviderAppointments,
} = require("../controllers/HospitalProvidersController");

const router = express.Router();

// Register a new hospital provider
router.post("/register", registerHospitalProvider);
router.get("/fetchProviders", fetchProviders);
// Create time slots for a hospital provider
router.post("/timeSlots", createTimeSlots);
router.post("/updateTimeSlots", updateTimeSlots);
router.get("/getTimeSlots", fetchTimeSlots);
router.post("/bookAppointment", bookAppointment);
router.post("/confirmAppointment", confirmAppointment);
router.delete("/deleteTimeSlots", deleteTimeSlots);
router.get("/fetchProviderAppointments", fetchProviderAppointments);
module.exports = router;
