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
        allowNull: true,
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
  Patient_Resource.associate = (models) => {
    Patient_Resource.belongsTo(models.Patient, {
      foreignKey: "patient_id",
    });
    Patient_Resource.hasMany(models.FHIR_Resource, {
      foreignKey: "patient_fhir_resource_id",
    });
  };
  return Patient_Resource;
};
