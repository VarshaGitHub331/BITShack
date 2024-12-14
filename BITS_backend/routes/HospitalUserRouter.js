const express = require("express");
const { addHospitalUser } = require("../controllers/HospitalUser");
const HospitalUserRouter = express.Router();
HospitalUserRouter.post("/addUser", addHospitalUser);

module.exports = HospitalUserRouter;
