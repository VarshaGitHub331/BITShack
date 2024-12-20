const express = require("express");
const { Patient_Resource } = require("../utils/InitializeModels");
const router = express.Router();
const axios = require("axios");

// Register a new hospital provider
router.post("/getPatientResource", async function (req, res, next) {
  const { user_id } = req.body;
  const patientResource = await Patient_Resource.findOne({
    where: { patient_id: user_id },
    raw: true,
  });
  const fhir_id = patientResource.patient_fhir_resource_id;
  try {
    const fhirResponse = await axios.get(
      `https://hapi.fhir.org/baseR4/Patient/${fhir_id}`,
      {
        headers: {
          Accept: "application /fhir+json", // Ensure the server knows you expect FHIR JSON format
        },
      }
    );
    console.log(fhirResponse.data); // Logs the patient data received
    res.status(200).json(fhirResponse.data); // Return the patient data
  } catch (error) {
    console.error("Error fetching patient data:", error);
    return null; // Return null if there's an error
  }
});

// Create time slots for a hospital provider
module.exports = router;
