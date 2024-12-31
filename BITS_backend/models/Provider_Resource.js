module.exports = (sequelize, DataTypes) => {
  const Provider_Resource = sequelize.define(
    "Provider_Resource",
    {
      provider_fhir_resource_id: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false,
      },
      provider_id: {
        type: DataTypes.INTEGER,
        references: {
          model: "Hospital_Provider",
          key: "provider_id",
        },
        allowNull: false,
      },
      provider_record: {
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
      tableName: "Provider_Resource",
    }
  );
  Provider_Resource.associate = (models) => {
    Provider_Resource.belongsTo(models.Hospital_Provider, {
      foreignKey: "provider_id",
    });
  };
  return Provider_Resource;
};
