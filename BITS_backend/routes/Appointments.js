const { updateAppointment } = require("../controllers/Appointment");
const express = require("express");
const AppointmentRouter = express.Router();

AppointmentRouter.post("/updateStatus", updateAppointment);
module.exports = AppointmentRouter;
