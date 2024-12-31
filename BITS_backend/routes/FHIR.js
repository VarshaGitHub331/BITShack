const express = require("express");
const {
  Patient_Resource,
  Appointment_Encounter,
} = require("../utils/InitializeModels");
const router = express.Router();
const axios = require("axios");

// Register a new hospital provider
router.post("/getPatientResource", async function (req, res, next) {
  const { user_id } = req.body;

  try {
    // Retrieve the patient's FHIR resource ID from the database
    const patientResource = await Patient_Resource.findOne({
      where: { patient_id: user_id },
      raw: true,
    });

    if (!patientResource) {
      return res.status(404).json({ error: "Patient resource not found" });
    }

    const fhir_id = patientResource.patient_fhir_resource_id;

    // Fetch the FHIR resource from Simplifier.net
    const fhirResponse = await axios.get(
      `https://fhir.simplifier.net/BITS-HACK/Patient/${fhir_id}`, // Replace 'ProjectName' with your Simplifier project name
      {
        headers: {
          Accept: "application/fhir+json", // Ensure the server knows you expect FHIR JSON format
          Authorization: `Bearer ${process.env.SIMPLIFIER_TOKEN}`, // Include your Simplifier API token if required
        },
      }
    );

    console.log(fhirResponse.data); // Logs the patient data received
    res.status(200).json(fhirResponse.data); // Return the patient data
  } catch (error) {
    console.error("Error fetching patient data:", error.message);
    res.status(500).json({ error: "Error fetching patient data" });
  }
});

router.post("/storeObservation", async function (req, res, next) {
  console.log(req.body);
  const { patient_id, observations, appointment_id } = req.body;

  const patient_fhir_resource_id = await Patient_Resource.findOne({
    where: { patient_id },
    raw: true,
  });
  const appointment_encounter = await Appointment_Encounter.findOne({
    where: { appointment_id: appointment_id },
    raw: true,
  });

  if (!patient_fhir_resource_id) {
    return res.status(404).send({ message: "Patient not found" });
  }

  const fhir_patient_id = patient_fhir_resource_id.patient_fhir_resource_id;

  try {
    const response = [];

    // Use a for loop to send each observation sequentially
    for (let obs of observations) {
      const observationData = {
        resourceType: "Observation",
        status: "final",
        category: [
          {
            coding: [
              {
                system:
                  "http://terminology.hl7.org/CodeSystem/observation-category",
                code: "vital-signs",
                display: "Vital Signs",
              },
            ],
          },
        ],
        code: {
          coding: [
            {
              system: "http://loinc.org",
              code: obs.observationCode,
              display: obs.code,
            },
          ],
          text: obs.code,
        },
        subject: {
          reference: `Patient/${fhir_patient_id}`,
        },
        encounter: {
          reference: `Encounter/${appointment_encounter.encounter_id}`, // Link the encounter here
        },
        effectiveDateTime: new Date().toISOString(),
        valueQuantity: {
          value: parseFloat(obs.value),
          unit: obs.unit || "mmHg",
          system: "http://unitsofmeasure.org",
          code: obs.unitCode || "mm[Hg]",
        },
      };

      console.log(
        "Sending Observation Data:",
        JSON.stringify(observationData, null, 2)
      );

      try {
        const fhirResponse = await axios.post(
          `https://fhir.simplifier.net/BITS-HACK/Observation`,
          observationData,
          {
            headers: {
              Accept: "application/fhir+json",
              Authorization: `Bearer ${process.env.SIMPLIFIER_TOKEN}`,
            },
          }
        );

        console.log("FHIR Response:", fhirResponse.data);
        response.push(fhirResponse.data);
      } catch (error) {
        console.error("Error saving observation:", obs);
        console.error(error.message);
      }
    }

    res.json({ message: "Observations saved successfully", data: response });
  } catch (error) {
    console.error("Error saving observations:", error);
    res
      .status(500)
      .send({ message: "Error saving observations", error: error.message });
  }
});

// Create time slots for a hospital provider
module.exports = router;
