const express = require("express");
const hospitalRouter = express.Router();
const {
  registerHospital,
  addLocation,
  createAdminUser,
  getHospitals,
  getNearByHospitals,
  getProvidersAppointments,
} = require("../controllers/Hospital");

hospitalRouter.put("/addLocation", addLocation);
hospitalRouter.post("/registerHospital", registerHospital, createAdminUser);
hospitalRouter.get("/getHospitals", getHospitals);
hospitalRouter.get("/getNearbyHospitals", getNearByHospitals);
hospitalRouter.get("/getProviderAppointments", getProvidersAppointments);
module.exports = hospitalRouter;
