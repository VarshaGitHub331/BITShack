const sequelize = require("./Connection.js");
const { DataTypes } = require("sequelize");

const User = require("../models/User.js")(sequelize, DataTypes);

module.exports = {
  User,
};
