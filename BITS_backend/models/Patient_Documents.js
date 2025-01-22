module.exports = (sequelize, DataTypes) => {
  const Patient_Documents = sequelize.define(
    "Patient_Documents",
    {
      patient_id: {
        type: DataTypes.INTEGER,
        references: {
          model: "Patient",
          key: "user_id",
        },
        allowNull: false,
      },
      record: {
        type: DataTypes.STRING,
        allowNull: false,
        required: true,
      },
      record_type: {
        type: DataTypes.TEXT,
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
      tableName: "Patient_Documents",
    }
  );
  Patient_Documents.associate = (models) => {
    Patient_Documents.belongsTo(models.Patient, {
      foreignKey: "patient_id",
    });
  };
  return Patient_Documents;
};
