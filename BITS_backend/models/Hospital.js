module.exports = (sequelize, DataTypes) => {
  const Hospital = sequelize.define(
    "Hospital",
    {
      hospital_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
      hospital_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      location: {
        type: DataTypes.GEOMETRY("POINT"),
        allowNull: true,
      },
      details: {
        type: DataTypes.JSON,
      },
    },
    {
      tableName: "Hospital",
    }
  );
  return Hospital;
};
