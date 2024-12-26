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
router.post("/storeObservation", async function (req, res, next) {
  console.log(req.body);
  const { patient_id, observations } = req.body;

  const patient_fhir_resource_id = await Patient_Resource.findOne({
    where: { patient_id },
    raw: true,
  });
  try {
    const response = await Promise.all(
      observations.map(async (obs) => {
        const observationData = {
          resourceType: "Observation",
          subject: { reference: `Patient/${patient_fhir_resource_id}` },
          code: {
            coding: [
              {
                system: "http://loinc.org", // LOINC code system,you can choose anyone that has an api
                code: obs.observationCode, // The LOINC code (e.g., Blood Pressure, Heart Rate)
                display: obs.code, // The display name (e.g., "Blood Pressure")
              },
            ],
          },
          valueString: obs.value,
          effectiveTime: new Date().toISOString(),
        };
        const fhirResponse = await axios.post(
          "https://hapi.fhir.org/baseR4/Observation",
          observationData,
          {
            headers: {
              Accept: "application /fhir+json", // Ensure the server knows you expect FHIR JSON format
            },
          }
        );
        return fhirResponse.data;
      })
    );
    res.json({ message: "Observations saved successfully", data: response });
  } catch (error) {
    res
      .status(500)
      .send({ message: "Error saving observations", error: error.message });
  }
});
// Create time slots for a hospital provider
module.exports = router;
