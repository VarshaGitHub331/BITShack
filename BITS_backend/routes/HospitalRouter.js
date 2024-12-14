const express = require("express");
const hospitalRouter = express.Router();
const {
  registerHospital,
  addLocation,
  createAdmin,
} = require("../controllers/Hospital");

hospitalRouter.post("/register", registerHospital);
hospitalRouter.put("/addLocation", addLocation);
hospitalRouter.post("/addAdmin", createAdmin);
module.exports = hospitalRouter;
