module.exports = (sequelize, DataTypes) => {
  const Time_Slots = sequelize.define(
    "Time_Slots",
    {
      slot_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
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
      slot_date: {
        type: DataTypes.DATE,
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
      locked_until: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      tableName: "Time_Slots",
    }
  );
  Time_Slots.associate = (models) => {
    Time_Slots.belongsTo(models.Hospital, {
      foreignKey: "hospital_id",
    });
    Time_Slots.belongsTo(models.Hospital_Provider, {
      foreignKey: "provider_id",
    });
  };
  return Time_Slots;
};
