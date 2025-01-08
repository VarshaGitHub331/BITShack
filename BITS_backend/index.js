const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const cors = require("cors");
require("dotenv").config();
const UsersRouter = require("./routes/UsersRouter");
const patientRouter = require("./routes/PatientRouter");
const hospitalRouter = require("./routes/HospitalRouter");
const HospitalUserRouter = require("./routes/HospitalUserRouter"); // Import the UsersRouter
const HospitalProviderRouter = require("./routes/HospitalProvidersRouter");
const AppointmentRouter = require("./routes/Appointments.js");
const fhirRouter = require("./routes/FHIR");
const app = express();
const server = http.createServer(app);
const io = socketIo(server);
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/user", UsersRouter);
app.use("/patient", patientRouter);
app.use("/hospital", hospitalRouter);
app.use("/hospitalUser", HospitalUserRouter); // Mount the router here*/
app.use("/hospitalProvider", HospitalProviderRouter);
app.use("/appointment", AppointmentRouter);
app.use("/fhir", fhirRouter);
// Start the server
server.listen(3001, () => {
  console.log("Server is running on http://localhost:3001");
});

module.exports = { io };
