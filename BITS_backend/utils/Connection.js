const { Sequelize, DataTypes } = require("sequelize");

const sequelize = new Sequelize({
  database: "bits_hack",
  username: "root",
  password: "Varsha@SQL123",
  host: "localhost",
  dialect: "mysql",
});
sequelize
  .authenticate()
  .then((data) => {
    console.log("Connected and authenticated");
  })
  .catch((e) => {
    console.log("Error in connection");
  });
sequelize.sync({ force: true }).then(() => {
  console.log("Models are synchronized");
});
module.exports = sequelize;
