const express = require("express");
const {
  registerPatient,
  addLocation,
  fetchAppointments,
} = require("../controllers/Patient");
const patientRouter = express.Router();

patientRouter.post("/patientRegister", registerPatient);
patientRouter.put("/addLocation", addLocation);
patientRouter.get("/fetchAppointments", fetchAppointments);
module.exports = patientRouter;
