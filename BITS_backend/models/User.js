module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    "User",
    {
      user_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      password: {
        type: DataTypes.STRING,
        required: true,
      },
      role: {
        type: DataTypes.ENUM("hospital", "patient"),
        required: true,
      },
    },
    {
      tableName: "User",
      timestamps: true,
    }
  );
  return User;
};
