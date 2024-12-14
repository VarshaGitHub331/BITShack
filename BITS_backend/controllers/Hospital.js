const { Hospital_User } = require("../utils/InitializeModels");
const { Hospital } = require("../utils/InitializeModels");

const registerHospital = async (req, res, next) => {
  const { hospital_name, details, Hospital_User } = req.body;
  try {
    const hospital = await Hospital.create({ hospital_name, details });
    res.status(200).json(hospital);
  } catch (e) {
    console.log(e);
  }
};
const addLocation = async (req, res, next) => {
  try {
    const { location, hospital_id } = req.body;
    console.log(req.body);
    if (!location || !location.type || !location.coordinates)
      res.status(404).json("Not a valid location");
    const updatedPatient = await Patient.update(
      {
        location: { type: "Point", coordinates: location.coordinates },
      },
      {
        where: {
          hospital_id,
        },
        raw: true,
      }
    );
    res.status(200).json(updatedPatient);
  } catch (e) {
    next(e);
  }
};
const createAdmin = async (req, res, next) => {
  try {
    const { hospital_id, user_id } = req.body;

    // Check if the user has the role 'hospital_user' in the users table
    const user = await User.findOne({
      where: {
        user_id: user_id,
        role: "hospital_user", // Ensure the role is 'hospital_user'
      },
    });

    if (!user) {
      // If the user doesn't exist or doesn't have the correct role, return an error
      return res
        .status(400)
        .json({ message: "User does not have the 'hospital_user' role" });
    }

    // Create the admin if the user is valid
    const hospitalAdmin = await Hospital_User.create({
      hospital_id,
      user_id,
      hospital_role: "admin",
    });

    res.status(200).json(hospitalAdmin);
  } catch (e) {
    next(e);
  }
};

module.exports = { registerHospital, addLocation, createAdmin };
