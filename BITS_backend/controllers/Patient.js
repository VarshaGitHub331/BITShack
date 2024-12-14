const { Patient } = require("../utils/InitializeModels");

const registerPatient = async (req, res, next) => {
  try {
    const { user_id, first_name, last_name, gender, details } = req.body;
    const patient = await Patient.create({
      user_id,
      first_name,
      last_name,
      gender,
      details,
    });
    res.status(200).json(patient);
  } catch (e) {
    console.log(e);
  }
};
const addLocation = async (req, res, next) => {
  try {
    const { location, user_id } = req.body;
    console.log(req.body);
    if (!location || !location.type || !location.coordinates)
      res.status(404).json("Not a valid location");
    const updatedPatient = await Patient.update(
      {
        location: { type: "Point", coordinates: location.coordinates },
      },
      {
        where: {
          user_id,
        },
        raw: true,
      }
    );
    res.status(200).json(updatedPatient);
  } catch (e) {
    next(e);
  }
};
module.exports = { registerPatient, addLocation };
