const express = require("express");
const {
  registerPatient,
  addLocation,
  fetchAppointments,
  getPatientLocation,
} = require("../controllers/Patient");
const patientRouter = express.Router();

patientRouter.post("/patientRegister", registerPatient);
patientRouter.put("/addLocation", addLocation);
patientRouter.get("/fetchAppointments", fetchAppointments);
patientRouter.get("/fetchLocation", getPatientLocation);
module.exports = patientRouter;
