"use strict";

const fs = require("fs");
const path = require("path");
const Sequelize = require("sequelize");
const process = require("process");
const express = require("express");
const cors = require("cors");
const usersRouter = require("../routers/UsersRouter");
const OpenStreetMapRouter = require("../utils/OpenStreetMap");
const authenticate = require("../utils/authMiddleware");
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || "development";
const config = require(__dirname + "/../config/config.json")[env];
const db = {};

// Sequelize setup
let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(
      config.database,
      config.username,
      config.password,
      config
  );
}

// Dynamically load models
fs.readdirSync(__dirname)
    .filter((file) => {
      return (
          file.indexOf(".") !== 0 &&
          file !== basename &&
          file.slice(-3) === ".js" &&
          file.indexOf(".test.js") === -1
      );
    })
    .forEach((file) => {
      const model = require(path.join(__dirname, file))(
          sequelize,
          Sequelize.DataTypes
      );
      db[model.name] = model;
    });

// Set up model associations
Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;

// Express setup
const app = express();

// Middleware
app.use(cors()); // Enable CORS
app.use(express.json()); // Parse JSON requests

// Attach routes
app.use("/api/users", usersRouter); // Users Router
app.use("/api", OpenStreetMapRouter); // OpenStreetMap Router

// Protected route example
app.get("/api/protected", authenticate, (req, res) => {
  res.json({ message: "You have access!", user: req.user });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
