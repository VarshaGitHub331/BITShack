const models = require("../models"); // Adjust the path if necessary
const sequelize = models.sequelize;

// Sync Patient_Resource first
models.Appointment.sync({ force: true })
  .then(() => {
    console.log("Appoint table created");

    // Add additional models if needed
    return models.Patient_Resource.sync({ force: true });
  })
  .then(() => {
    console.log("Patient res table created");

    // Add additional models if needed
    return models.FHIR_Resource.sync({ force: true });
  })
  .then(() => {
    console.log("all done");

    // Add additional models if needed
  })
  .catch((e) => {
    console.log(e);
  });
