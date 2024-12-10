module.exports = (sequelize, DataTypes) => {
  const FHIR_Resource = sequelize.define("FHIR_Resource", {
    resource_id: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    patient_fhir_resource_id: {
      type: DataTypes.STRING,
      references: {
        model: "Patient_Resource", // Make sure this references the correct table name
        key: "patient_fhir_resource_id", // This should match the primary key in the referenced table
      },
      allowNull: false,
    },
    resource_type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    resource_content: {
      type: DataTypes.JSON,
      allowNull: false, // Corrected from 'required' to 'allowNull'
    },
  });

  return FHIR_Resource;
};
