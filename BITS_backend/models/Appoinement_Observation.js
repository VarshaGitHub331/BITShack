module.exports = (sequelize, DataTypes) => {
  const Appointment_Observation = sequelize.define("Appointment_Observation", {
    appointment_id: {
      type: DataTypes.INTEGER,
      references: {
        model: "Appointment",
        key: "appointment_id",
      },
      allowNull: false,
      primaryKey: true,
    },
    observation_id: {
      type: DataTypes.STRING, // FHIR Observation ID can be a string (e.g., "Observation/12345")
      allowNull: false,
      primaryKey: true,
    },
  });

  Appointment_Observation.associate = (models) => {
    // Association to Appointment table (just in case you need to retrieve Appointment details later)
    Appointment_Observation.belongsTo(models.Appointment, {
      foreignKey: "appointment_id",
      targetKey: "appointment_id",
    });
  };

  return Appointment_Observation;
};
