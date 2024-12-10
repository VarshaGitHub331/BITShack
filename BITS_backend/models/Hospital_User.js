module.exports = (sequelize, DataTypes) => {
  const Hospital_User = sequelize.define("Hospital_User", {
    user_id: {
      type: DataTypes.INTEGER,
      references: {
        model: "User",
        key: "user_id",
      },
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
    hospital_role: {
      type: DataTypes.ENUM("Regular_User", "Admin"),
      required: true,
    },
  });
  return Hospital_User;
};
