const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const cors = require("cors");

const UsersRouter = require("./routers/UsersRouter"); // Import the UsersRouter

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/users", UsersRouter); // Attach UsersRouter

// Start the server
server.listen(3001, () => {
  console.log("Server is running on http://localhost:3001");
});

module.exports = { io };
