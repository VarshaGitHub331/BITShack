const express = require("express");
const jwt = require("jsonwebtoken");
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
  fetchPatientDocuments,
} = require("../controllers/HospitalProvidersController");
const SECRET_KEY = "bitsnpieces"; // Replace with a secure key
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
router.get(
  "/patientDocuments",
  async (req, res, next) => {
    try {
      console.log(req.headers);
      const token = req.headers["authorization"].split(" ")[1];
      if (!token) {
        return res.status(403).json("Token is missing");
      }
      console.log(token);
      jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) {
          console.log("error verifying");
          return res.status(403).send("Invalid token.");
        }
        console.log(user);
        req.user = user; // Attach the user information to the request object
        next();
      });
    } catch (e) {
      next(e);
    }
  },
  fetchPatientDocuments
);
module.exports = router;
