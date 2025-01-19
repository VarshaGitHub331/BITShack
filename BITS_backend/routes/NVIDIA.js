const { extractObservationDetails } = require("../controllers/AI_Controllers");
const express = require("express");
const NVIDIARouter = express.Router();

NVIDIARouter.post("/getCodes", extractObservationDetails);

module.exports = NVIDIARouter;
