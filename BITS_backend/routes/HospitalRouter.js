const express = require("express");
const hospitalRouter = express.Router();
const {
  registerHospital,
  addLocation,
  createAdminUser,
  getHospitals,
} = require("../controllers/Hospital");

hospitalRouter.put("/addLocation", addLocation);
hospitalRouter.post("/registerHospital", registerHospital, createAdminUser);
hospitalRouter.get("/getHospitals", getHospitals);
module.exports = hospitalRouter;
