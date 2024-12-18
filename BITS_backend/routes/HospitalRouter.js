const express = require("express");
const hospitalRouter = express.Router();
const {
  registerHospital,
  addLocation,
  createAdminUser,
} = require("../controllers/Hospital");

hospitalRouter.put("/addLocation", addLocation);
hospitalRouter.post("/registerHospital", registerHospital, createAdminUser);
module.exports = hospitalRouter;
