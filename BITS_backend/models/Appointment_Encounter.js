module.exports = (sequelize, DataTypes) => {
  const Appointment_Encounter = sequelize.define(
    "Appointment_Encounter",
    {
      appointment_id: {
        type: DataTypes.INTEGER,
        references: {
          model: "Appointment",
          key: "appointment_id",
        },
        allowNull: false,
        primaryKey: true,
      },
      encounter_id: {
        type: DataTypes.STRING, // FHIR Observation ID can be a string (e.g., "Observation/12345")
        allowNull: false,
        primaryKey: true,
      },
    },
    { tableName: "appointment_encounters" }
  );

  Appointment_Encounter.associate = (models) => {
    // Association to Appointment table (just in case you need to retrieve Appointment details later)
    Appointment_Encounter.belongsTo(models.Appointment, {
      foreignKey: "appointment_id",
      targetKey: "appointment_id",
    });
  };

  return Appointment_Encounter;
};
