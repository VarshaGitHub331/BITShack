const express = require("express");

const http = require("http");
const socketIo = require("socket.io");
const app = express();
const server = http.createServer(app);
const io = socketIo(server);
const userRouter = require("./routes/UsersRouter");
const patientRouter = require("./routes/PatientRouter");
const hospitalRouter = require("./routes/HospitalRouter");
const HospitalUserRouter = require("./routes/HospitalUserRouter");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/user", userRouter); // Mount the router here*/
app.use("/patient", patientRouter);
app.use("/hospital", hospitalRouter);
app.use("/hospitalUser", HospitalUserRouter);

server.listen(3001, () => {
  console.log("SERVER LISTENING AT 3001");
});
//console.log("The userRouter is ", userRouter);
module.exports = { io };
