module.exports = (sequelize, DataTypes) => {
  const Hospital_Provider = sequelize.define(
    "Hospital_Provider",
    {
      provider_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
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
  return Hospital_Provider;
};
