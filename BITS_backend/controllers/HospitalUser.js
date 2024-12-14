const { Hospital_User, User } = require("../utils/InitializeModels");

const addHospitalUser = async (req, res, next) => {
  try {
    const { add_id, user_id, hospital_id } = req.body;
    const user = await Hospital_User.findOne({
      where: {
        user_id: user_id,
        hospital_id,
      },
    });

    if (!user.role == "Admin") {
      // If the user doesn't exist or doesn't have the correct role, return an error
      return res
        .status(400)
        .json({ message: "User does not have the 'hospital_user' role" });
    }
    const addedUser = await Hospital_User.create({
      user_id: add_id,
      hospital_id,
      hospital_role: "Regular_User",
    });
    res.status(200).json(addedUser);
  } catch (e) {
    next(e);
  }
};

module.exports = { addHospitalUser };
