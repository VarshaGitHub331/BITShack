module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    "User",
    {
      user_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      role: {
        type: DataTypes.ENUM("Patient", "Hospital_User"),
        required: true,
      },
    },
    {
      tableName: "User",
    }
  );
  User.associate = (models) => {
    User.belongsTo(models.Patient, {
      foreignKey: "user_id",
    });
    User.belongsTo(models.Hospital_User, {
      foreignKey: "user_id",
    });
  };
  return User;
};
