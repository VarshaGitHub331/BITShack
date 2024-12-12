module.exports = (sequelize, DataTypes) => {
  const Appointment = sequelize.define(
    "Appointment",
    {
      appointment_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      slot_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Time_Slots", // Ensure the model name here matches the defined model
          key: "slot_id",
        },
      },
      patient_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Patient", // Corrected from 'Patient' to 'Patients' if model is named 'Patients'
          key: "user_id",
        },
      },
      status: {
        type: DataTypes.ENUM("Cancelled", "Rescheduled", "Scheduled"),
        allowNull: false,
      },
    },
    {
      tableName: "Appointment", // Ensure this matches your actual table name if it's different
    }
  );
  Appointment.associate = (models) => {
    Appointment.belongsTo(models.Time_Slots, {
      foreignKey: "slot_id",
    });
    Appointment.belongsTo(models.Patient, {
      foreignKey: "patient_id",
    });
  };
  return Appointment;
};
