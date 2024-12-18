module.exports = (sequelize, DataTypes) => {
  const Hospital_Provider = sequelize.define(
    "Hospital_Provider",
    {
      provider_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        reference: {
          model: "User",
          key: "user_id",
        },
      },
      hospital_id: {
        type: DataTypes.INTEGER,
        references: {
          model: "Hospital",
          key: "hospital_id",
        },
        allowNull: false,
      },
      provider_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      specialization: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      tableName: "Hospital_Provider",
    }
  );
  Hospital_Provider.associate = (models) => {
    Hospital_Provider.belongsTo(models.Hospital, {
      foreignKey: "hospital_id",
    });
  };
  return Hospital_Provider;
};
