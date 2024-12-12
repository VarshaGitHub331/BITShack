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
  Hospital.associate = (models) => {
    Hospital.hasMany(models.Hospital_User, {
      foreignKey: "hospital_id",
    });
    Hospital.hasMany(models.Hospital_Provider, {
      foreignKey: "hospital_id",
    });
    Hospital.hasMany(models.Time_Slots, {
      foreignKey: "hospital_id",
    });
  };
  return Hospital;
};
