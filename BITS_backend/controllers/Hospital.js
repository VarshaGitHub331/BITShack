const { Hospital_User } = require("../utils/InitializeModels");
const { Hospital, User } = require("../utils/InitializeModels");

const registerHospital = async (req, res, next) => {
  const { hospital_name, details } = req.body;
  try {
    const checkHospital = await Hospital.findOne({ where: { hospital_name } });
    if (checkHospital) res.status(403).json("Hospital already exists");
    const hospital = await Hospital.create(
      { hospital_name, details },
      { raw: true }
    );
    console.log(hospital);
    req.body.hospital_id = hospital.hospital_id;
    next();
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
const createAdminUser = async (req, res, next) => {
  try {
    console.log(req.body);
    const { hospital_id, email, password } = req.body;

    // Check if the user has the role 'hospital_user' in the users table
    const user = await User.create({
      email,
      password,
      role: "Hospital_User",
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
      user_id: user.user_id,
      hospital_role: "admin",
    });

    res.status(200).json(hospitalAdmin);
  } catch (e) {
    next(e);
  }
};

module.exports = { registerHospital, addLocation, createAdminUser };
