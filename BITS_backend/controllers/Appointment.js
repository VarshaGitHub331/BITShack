const { Appointment } = require("../utils/InitializeModels");
const updateAppointment = async (req, res, next) => {
  const { appointment_id, status } = req.body;
  try {
    await Appointment.update({ status: status }, { where: { appointment_id } });
    res.status(200).json("Cancelled");
    console.log("done");
  } catch (e) {
    console.log(e);
  }
};
module.exports = { updateAppointment };
