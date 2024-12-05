const express = require("express");
const socketIo = require("socket.io");
const http = require("http");
const app = express();
const server = http.createServer(app);
const io = socketIo(server);
require("./utils/InitialzeModels.js");
const cors = require("cors");

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

server.listen(3001, () => {
  console.log("SERVER LISTENING AT 3001");
});
module.exports = { io };
