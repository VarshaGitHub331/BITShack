module.exports = (sequelize, DataTypes) => {
  const Patient = sequelize.define(
    "Patient",
    {
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true, // Assuming `user_id` is the primary key
        references: {
          model: "User", // Referencing the User model
          key: "user_id",
        },
      },
      first_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      last_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      gender: {
        type: DataTypes.ENUM("male", "female", "Other"),
        allowNull: false,
      },
      location: {
        type: DataTypes.GEOMETRY("POINT"),
        allowNull: true,
      },
      details: {
        type: DataTypes.JSON,
        allowNull: false, // You may want to make this `true` if some patients don't have extra details
      },
    },
    {
      tableName: "Patient",
      timestamps: false, // Include if you don’t have `createdAt` or `updatedAt` fields
    }
  );

  return Patient;
};
