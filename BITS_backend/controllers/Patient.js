const { Patient, Patient_Resource } = require("../utils/InitializeModels");
const axios = require("axios");
const registerPatient = async (req, res, next) => {
  console.log(req.body);
  try {
    const { user_id, first_name, last_name, gender, details } = req.body;

    // Check if 'details' exists and provide default values if missing
    const patientDetails = {
      birthDate: details?.birthDate || "1970-01-01", // Provide a default birthDate if it's missing
      addressLine1: details?.addressLine1 || "Not provided",
      addressLine2: details?.addressLine2 || "Not provided",
      city: details?.city || "Unknown",
      state: details?.state || "Unknown",
      zipCode: details?.zipCode || "00000",
      country: details?.country || "Unknown",
    };

    const patient = await Patient.create({
      user_id,
      first_name,
      last_name,
      gender,
      details: patientDetails, // Save the details object with the default values
    });

    // FHIR patient data
    const fhir_patient_data = {
      resourceType: "Patient",
      name: [
        {
          use: "official",
          family: last_name,
          given: [first_name],
        },
      ],
      gender: gender,
      birthDate: patientDetails.birthDate,
      address: [
        {
          use: "home",
          line: [patientDetails.addressLine1, patientDetails.addressLine2],
          city: patientDetails.city,
          state: patientDetails.state,
          postalCode: patientDetails.zipCode,
          country: patientDetails.country,
        },
      ],
    };

    // FHIR API request
    const fhirResponse = await axios.post(
      "https://fhir.simplifier.net/BITS-HACK/Patient",
      fhir_patient_data,
      {
        headers: {
          "Content-Type": "application/fhir+json",
          Authorization: `Bearer ${process.env.SIMPLIFIER_TOKEN}`,
        },
      }
    );
    console.log(fhirResponse);

    // Save patient resource
    await Patient_Resource.create({
      patient_fhir_resource_id: fhirResponse.data.id,
      patient_id: user_id,
      patient_record: fhirResponse.data,
    });

    res.status(200).json(patient);
  } catch (e) {
    console.log("Error during patient registration:", e);
    res.status(500).json({ message: "An error occurred during registration." });
  }
};

const addLocation = async (req, res, next) => {
  try {
    const { location, user_id } = req.body;
    console.log(req.body);
    if (!location || !location.type || !location.coordinates)
      res.status(404).json("Not a valid location");
    const updatedPatient = await Patient.update(
      {
        location: { type: "Point", coordinates: location.coordinates },
      },
      {
        where: {
          user_id,
        },
        raw: true,
      }
    );
    res.status(200).json(updatedPatient);
  } catch (e) {
    next(e);
  }
};
module.exports = { registerPatient, addLocation };
