const express = require("express");
const {
  Patient_Resource,
  Appointment_Encounter,
} = require("../utils/InitializeModels");
const {
  extractStructuredData,
  extractObservationDetails,
} = require("../controllers/AI_Controllers");
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

router.post(
  "/storeObservation",
  extractObservationDetails,
  async function (req, res, next) {
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
  }
);
router.post(
  "/storeDiagnosis",
  extractStructuredData,
  async function (req, res, next) {
    console.log(req.body);
    const { patient_id, diagnoses, appointment_id } = req.body;

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

      for (let diagnosis of diagnoses) {
        const diagnosisData = {
          resourceType: "Condition",
          clinicalStatus: {
            coding: [
              {
                system:
                  "http://terminology.hl7.org/CodeSystem/condition-clinical",
                code: "active",
                display: "Active",
              },
            ],
          },
          code: {
            coding: [
              {
                system: "http://www.nlm.nih.gov/research/umls/rxnorm",
                code: diagnosis.diagnosisCode,
                display: diagnosis.code,
              },
            ],
            text: diagnosis.code,
          },
          subject: {
            reference: `Patient/${fhir_patient_id}`,
          },
          encounter: {
            reference: `Encounter/${appointment_encounter.encounter_id}`,
          },
          onsetDateTime: new Date().toISOString(),
        };

        console.log(
          "Sending Diagnosis Data:",
          JSON.stringify(diagnosisData, null, 2)
        );

        try {
          const fhirResponse = await axios.post(
            `https://fhir.simplifier.net/BITS-HACK/Condition`,
            diagnosisData,
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
          console.error("Error saving diagnosis:", diagnosis);
          console.error(error.message);
        }
      }

      res.json({ message: "Diagnoses saved successfully", data: response });
    } catch (error) {
      console.error("Error saving diagnoses:", error);
      res
        .status(500)
        .send({ message: "Error saving diagnoses", error: error.message });
    }
  }
);
router.post(
  "/storePrescription",
  extractStructuredData,
  async function (req, res, next) {
    console.log(req.body);
    const { patient_id, prescriptions, appointment_id } = req.body;

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

      for (let prescription of prescriptions) {
        const prescriptionData = {
          resourceType: "MedicationRequest",
          status: "active",
          intent: "order",
          medicationCodeableConcept: {
            coding: [
              {
                system: "http://www.nlm.nih.gov/research/umls/rxnorm",
                code: prescription.medicationCode,
                display: prescription.medicationName,
              },
            ],
          },
          subject: {
            reference: `Patient/${fhir_patient_id}`,
          },
          encounter: {
            reference: `Encounter/${appointment_encounter.encounter_id}`,
          },
          authoredOn: new Date().toISOString(),
          dosageInstruction: [
            {
              text: prescription.dosage,
            },
          ],
        };

        console.log(
          "Sending Prescription Data:",
          JSON.stringify(prescriptionData, null, 2)
        );

        try {
          const fhirResponse = await axios.post(
            `https://fhir.simplifier.net/BITS-HACK/MedicationRequest`,
            prescriptionData,
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
          console.error("Error saving prescription:", prescription);
          console.error(error.message);
        }
      }

      res.json({ message: "Prescriptions saved successfully", data: response });
    } catch (error) {
      console.error("Error saving prescriptions:", error);
      res
        .status(500)
        .send({ message: "Error saving prescriptions", error: error.message });
    }
  }
);
router.post("/getObservationsForAppointment", async function (req, res, next) {
  const { appointment_id } = req.body;

  try {
    // Find the appointment encounter details
    const appointment_encounter = await Appointment_Encounter.findOne({
      where: { appointment_id },
      raw: true,
    });

    if (!appointment_encounter) {
      return res.status(404).json({ error: "Appointment encounter not found" });
    }

    const encounter_id = appointment_encounter.encounter_id;

    // Fetch the observations related to this encounter
    const fhirResponse = await axios.get(
      `https://fhir.simplifier.net/BITS-HACK/Observation`,
      {
        params: {
          encounter: encounter_id, // Pass the encounter ID to filter observations
        },
        headers: {
          Accept: "application/fhir+json",
          Authorization: `Bearer ${process.env.SIMPLIFIER_TOKEN}`,
        },
      }
    );

    console.log(fhirResponse.data); // Logs the observations fetched
    res.status(200).json(fhirResponse.data); // Return the observations
  } catch (error) {
    console.error("Error fetching observations:", error.message);
    res.status(500).json({ error: "Error fetching observations" });
  }
});

// Retrieve Diagnoses for a given appointment
router.post("/getDiagnosesForAppointment", async function (req, res, next) {
  const { appointment_id } = req.body;

  try {
    // Find the appointment encounter details
    const appointment_encounter = await Appointment_Encounter.findOne({
      where: { appointment_id },
      raw: true,
    });

    if (!appointment_encounter) {
      return res.status(404).json({ error: "Appointment encounter not found" });
    }

    const encounter_id = appointment_encounter.encounter_id;

    // Fetch the conditions (diagnoses) related to this encounter
    const fhirResponse = await axios.get(
      `https://fhir.simplifier.net/BITS-HACK/Condition`,
      {
        params: {
          encounter: encounter_id, // Pass the encounter ID to filter diagnoses
        },
        headers: {
          Accept: "application/fhir+json",
          Authorization: `Bearer ${process.env.SIMPLIFIER_TOKEN}`,
        },
      }
    );

    console.log(fhirResponse.data); // Logs the diagnoses fetched
    res.status(200).json(fhirResponse.data); // Return the diagnoses
  } catch (error) {
    console.error("Error fetching diagnoses:", error.message);
    res.status(500).json({ error: "Error fetching diagnoses" });
  }
});

// Retrieve Prescriptions for a given appointment
router.post("/getPrescriptionsForAppointment", async function (req, res, next) {
  const { appointment_id } = req.body;

  try {
    // Find the appointment encounter details
    const appointment_encounter = await Appointment_Encounter.findOne({
      where: { appointment_id },
      raw: true,
    });

    if (!appointment_encounter) {
      return res.status(404).json({ error: "Appointment encounter not found" });
    }

    const encounter_id = appointment_encounter.encounter_id;

    // Fetch the prescriptions (medication requests) related to this encounter
    const fhirResponse = await axios.get(
      `https://fhir.simplifier.net/BITS-HACK/MedicationRequest`,
      {
        params: {
          encounter: encounter_id, // Pass the encounter ID to filter prescriptions
        },
        headers: {
          Accept: "application/fhir+json",
          Authorization: `Bearer ${process.env.SIMPLIFIER_TOKEN}`,
        },
      }
    );

    console.log(fhirResponse.data); // Logs the prescriptions fetched
    res.status(200).json(fhirResponse.data); // Return the prescriptions
  } catch (error) {
    console.error("Error fetching prescriptions:", error.message);
    res.status(500).json({ error: "Error fetching prescriptions" });
  }
});

// Create time slots for a hospital provider
module.exports = router;
