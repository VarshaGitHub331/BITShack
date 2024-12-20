const { Patient, Patient_Resource } = require("../utils/InitializeModels");
const axios = require("axios");
const registerPatient = async (req, res, next) => {
  try {
    const { user_id, first_name, last_name, gender, details } = req.body;
    const patient = await Patient.create({
      user_id,
      first_name,
      last_name,
      gender,
      details,
    });
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
      birthDate: details.birthDate,
      address: [
        {
          use: "home", // Optional: "home", "work", "temp", "old" etc.
          line: [
            details.addressLine1, // Assuming these fields are part of the 'details' object
            details.addressLine2,
          ],
          city: details.city,
          state: details.state,
          postalCode: details.zipCode, // Assuming zip code is available
          country: details.country,
        },
      ],
    };
    const fhirResponse = await axios.post(
      "https://hapi.fhir.org/baseR4/Patient",
      fhir_patient_data,
      {
        headers: {
          "Content-Type": "application/fhir+json",
        },
      }
    );
    console.log(fhirResponse);
    await Patient_Resource.create({
      patient_fhir_resource_id: fhirResponse.data.id,
      patient_id: user_id,
      patient_record: fhirResponse.data,
    });
    res.status(200).json(patient);
  } catch (e) {
    console.log(e);
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
