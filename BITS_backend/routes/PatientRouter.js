const express = require("express");
const { registerPatient, addLocation } = require("../controllers/Patient");
const patientRouter = express.Router();

patientRouter.post("/patientRegister", registerPatient);
patientRouter.put("/addLocation", addLocation);
module.exports = patientRouter;
