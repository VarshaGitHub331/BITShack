const models = require("../models"); // Adjust the path if necessary
const {
  User,
  Patient,
  Time_Slots,
  Patient_Resource,
  Hospital,
  Hospital_Provider,
  Hospital_User,
  FHIR_Resource,
  Appointment,
  Appointment_Encounter,
  Provider_Resource,
  Patient_Documents,
} = models; // Ensure you're destructuring correctly from the imported models
const sequelize = models.sequelize;

// Ensure associations are defined
Object.keys(models).forEach((modelName) => {
  if (models[modelName].associate) {
    console.log(`Associating model: ${modelName}`); // Optional: for debugging purposes
    models[modelName].associate(models);
  }
});

// Sync models
sequelize
  .sync({ force: false })
  .then(() => {
    console.log("All models are synced successfully!");
  })
  .catch((e) => {
    console.log("Error syncing models:", e);
  });
module.exports = {
  User,
  Patient,
  Time_Slots,
  Patient_Resource,
  Hospital,
  Hospital_Provider,
  Hospital_User,
  FHIR_Resource,
  Appointment,
  Appointment_Encounter,
  Provider_Resource,
  Patient_Documents,
};
