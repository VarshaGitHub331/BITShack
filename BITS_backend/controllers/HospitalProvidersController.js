const { Sequelize, sequelize } = require("../models/index.js");
const {
  Hospital_Provider,
  Time_Slots,
  Hospital,
  Appointment,
  User,
} = require("../utils/InitializeModels");
const moment = require("moment");

// Register a new hospital provider
const registerHospitalProvider = async (req, res, next) => {
  try {
    const { name, email, password, hospital_id, specialization } = req.body;

    // Validate input
    if (!name || !email || !password || !hospital_id) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Check if the hospital exists
    const hospital = await Hospital.findByPk(hospital_id);
    if (!hospital) {
      return res.status(404).json({ error: "Hospital not found" });
    }
    const user = await User.create({
      email,
      password,
      role: "Hospital_Provider",
    });
    // Create the hospital provider (ensure passwords are hashed in the model)
    const hospitalProvider = await Hospital_Provider.create({
      provider_name: name,
      specialization,
      provider_id: user.user_id,
      hospital_id,
    });

    res.status(200).json(hospitalProvider);
  } catch (e) {
    console.error(e);
    next(e); // Pass the error to the error-handling middleware
  }
};

// Create time slots for a hospital provider
const createTimeSlots = async (req, res, next) => {
  try {
    const { provider_id, start_time, end_time, date } = req.body;

    // Validate input
    if (!provider_id || !start_time || !end_time || !date) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Check if the hospital provider exists
    const hospitalProvider = await Hospital_Provider.findByPk(provider_id);
    if (!hospitalProvider) {
      return res.status(404).json({ error: "Hospital Provider not found" });
    }

    // Create the time slot
    const timeSlot = await Time_Slots.create({
      provider: provider_id,
      start_time,
      end_time,
      date,
      hospital_id: hospitalProvider.hospital_id,
      isAvailable: "true",
    });

    res.status(200).json(timeSlot);
  } catch (e) {
    console.error(e);
    next(e); // Pass the error to the error-handling middleware
  }
};
const bookAppointment = async (req, res, next) => {
  const { slot_id, user_id } = req.body;

  try {
    // Start a transaction to ensure atomicity
    const transaction = await sequelize.transaction();
    const foundAppointment = await Appointment.findOne(
      {
        where: {
          slot_id,
          patient_id: user_id,
          status: "Pending", // Status is "Pending" while waiting for confirmation
        },
      },
      { transaction }
    );
    if (foundAppointment)
      return res.status(200).json("An appointmnet already exists");

    // Step 1: Lock the time slot for 2 minutes
    const timeSlot = await Time_Slots.findOne({
      where: {
        slot_id: slot_id,
        isAvailable: true, // Slot must be available
        [Sequelize.Op.or]: [
          { locked_until: null }, // Not locked
          { locked_until: { [Sequelize.Op.lt]: moment().toDate() } }, // Lock expired
        ],
      },
      lock: true, // Lock the row in the database to prevent other transactions
      transaction,
    });

    if (!timeSlot) {
      // If time slot is not available or locked by another user, return error
      await transaction.rollback();
      return res.status(400).json({ error: "Time slot not available." });
    }

    // Step 2: Set the lock expiration time (2 minutes from now)
    const lockedDuration = 2 * 60 * 1000; // 2 minutes in milliseconds
    timeSlot.locked_until = moment()
      .add(lockedDuration, "milliseconds")
      .toDate();
    await timeSlot.save({ transaction });

    // Step 3: Create a pending appointment record (status is "Pending")

    const appointment = await Appointment.create(
      {
        slot_id,
        patient_id: user_id,
        status: "Pending", // Status is "Pending" while waiting for confirmation
        appointment_deadline: timeSlot.locked_until, // Deadline when the lock expires
      },
      { transaction }
    );

    // Commit the transaction
    await transaction.commit();

    // Step 4: Return response to the user
    return res.status(200).json({
      message: "Appointment is pending. Please confirm within 2 minutes.",
      appointment,
      timeout: timeSlot.locked_until,
    });
  } catch (e) {
    // If something goes wrong, rollback the transaction
    console.error(e);
    return res
      .status(500)
      .json({ error: "Something went wrong while booking the appointment." });
  }
};

const confirmAppointment = async (req, res, next) => {
  const { user_id, appointment_id } = req.body;

  try {
    // Step 1: Find the appointment by ID
    const foundAppointment = await Appointment.findOne({
      where: {
        appointment_id: appointment_id,
      },
    });
    console.log(foundAppointment);
    if (!foundAppointment) {
      return res.status(404).json({ error: "No appointment to confirm." });
    }

    // Step 2: Find the time slot to check availability
    const timeSlot = await Time_Slots.findOne({
      where: { slot_id: foundAppointment.slot_id },
    });

    if (!timeSlot || timeSlot.isAvailable === false) {
      return res.status(400).json({ error: "Time slot no longer available." });
    }

    // Step 3: Check if the lock has expired
    const lockExpired = moment().isAfter(moment(timeSlot.locked_until)); // Fix here
    if (!lockExpired || (lockExpired && timeSlot.isAvailable)) {
      // If the lock expired and no one else booked the slot, allow the user to confirm
      foundAppointment.status = "Confirmed"; // Confirm the appointment
      timeSlot.isAvailable = "False"; // Mark the time slot as no longer available
      timeSlot.locked_until = null; // Remove the lock

      // Step 4: Save the appointment and time slot
      await foundAppointment.save();
      await timeSlot.save();

      return res
        .status(200)
        .json({ message: "Appointment confirmed successfully." });
    } else {
      // If lock has expired and another user booked it, reject the confirmation
      return res.status(400).json({ error: "Time slot no longer available." });
    }
  } catch (e) {
    console.error(e);
    return res.status(500).json({
      error: "Something went wrong while confirming the appointment.",
    });
  }
};

module.exports = {
  registerHospitalProvider,
  createTimeSlots,
  bookAppointment,
  confirmAppointment,
};
