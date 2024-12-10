module.exports = (sequelize, DataTypes) => {
  const Patient_Resource = sequelize.define(
    "Patient_Resource",
    {
      patient_fhir_resource_id: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false,
      },
      patient_id: {
        type: DataTypes.INTEGER,
        references: {
          model: "Patient",
          key: "user_id",
        },
        allowNull: false,
      },

      patient_record: {
        type: DataTypes.JSON,
        required: true,
        allowNull: false,
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      updated_at: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      tableName: "Patient_Resource",
    }
  );
  return Patient_Resource;
};
