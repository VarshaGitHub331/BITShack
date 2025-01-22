const { Appointment, Time_Slots } = require("../utils/InitializeModels");
const updateAppointment = async (req, res, next) => {
  const { appointment_id, status } = req.body;
  try {
    const appointment = await Appointment.update(
      { status: status },
      { where: { appointment_id } }
    );
    if (status == "Cancelled") {
      const appointment = await Appointment.findOne({
        where: { appointment_id },
      });
      const slot = await Time_Slots.findOne({
        where: { slot_id: appointment.slot_id },
      });
      await Time_Slots.update(
        { isAvailable: "True" },
        { where: { slot_id: slot.slot_id } }
      );
    }
    res.status(200).json("Cancelled");
    console.log("done");
  } catch (e) {
    console.log(e);
  }
};
module.exports = { updateAppointment };
