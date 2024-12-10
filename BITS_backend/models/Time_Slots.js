module.exports = (sequelize, DataTypes) => {
  const Time_Slots = sequelize.define(
    "Time_Slots",
    {
      slot_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
      },
      hospital_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Hospital",
          key: "hospital_id",
        },
      },
      provider: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Hospital_Provider",
          key: "provider_id",
        },
      },
      isAvailable: {
        type: DataTypes.ENUM("True", "False"),
        allowNull: false,
      },
      start_time: {
        type: DataTypes.TIME,
        allowNull: false,
      },
      end_time: {
        type: DataTypes.TIME,
        allowNull: false,
      },
    },
    {
      tableName: "Time_Slots",
    }
  );
  return Time_Slots;
};
