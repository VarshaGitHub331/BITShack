const { Sequelize, sequelize } = require("../models/index.js");

const {
  Hospital_Provider,
  Time_Slots,
  Hospital,
  Appointment,
  User,
  Provider_Resource,
  Patient,
  Patient_Resource,
  Appointment_Encounter,
} = require("../utils/InitializeModels");
const axios = require("axios");
const moment = require("moment");
const SECRET_KEY = "bitsnpieces"; // Replace with a secure key
const jwt = require("jsonwebtoken");

const registerHospitalProvider = async (req, res, next) => {
  console.log("called");
  console.log(req.body);
  try {
    const {
      name,
      email,
      password,
      hospital_id,
      specialization,
      details,
      gender,
    } = req.body;

    // Validate input
    if (!name || !email || !password || !hospital_id) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Extract first and last name from full name
    const [first_name, ...last_nameArray] = name.split(" ");
    const last_name = last_nameArray.join(" ");

    // Check if the hospital exists
    const hospital = await Hospital.findByPk(hospital_id);
    if (!hospital) {
      return res.status(404).json({ error: "Hospital not found" });
    }

    // Create user and hospital provider
    const user = await User.create({
      email,
      password,
      role: "Hospital_Provider",
    });

    const practitionerDetails = {
      phone: details?.phone || "Not provided",
      email: details?.email || "Not provided",
      addressLine1: details?.addressLine1 || "Not provided",
      addressLine2: details?.addressLine2 || "Not provided",
      city: details?.city || "Unknown",
      state: details?.state || "Unknown",
      zipCode: details?.zipCode || "00000",
      country: details?.country || "Unknown",
      qualifications: details?.qualifications || "Not provided",
    };

    const hospitalProvider = await Hospital_Provider.create({
      provider_name: name,
      specialization: specialization || "General Practitioner",
      provider_id: user.user_id,
      hospital_id,
      gender,
      details: practitionerDetails,
    });

    // FHIR Practitioner data
    const fhir_practitioner_data = {
      resourceType: "Practitioner",
      name: [
        {
          use: "official",
          family: last_name,
          given: [first_name],
        },
      ],
      gender: gender || "unknown",
      telecom: [
        {
          system: "phone",
          value: practitionerDetails.phone,
          use: "work",
        },
        {
          system: "email",
          value: practitionerDetails.email,
          use: "work",
        },
      ],
      address: [
        {
          use: "work",
          line: [
            practitionerDetails.addressLine1,
            practitionerDetails.addressLine2,
          ],
          city: practitionerDetails.city,
          state: practitionerDetails.state,
          postalCode: practitionerDetails.zipCode,
          country: practitionerDetails.country,
        },
      ],
      qualification: [
        {
          identifier: [
            {
              system: "http://example.org/licenses",
              value: practitionerDetails.qualifications,
            },
          ],
          code: {
            coding: [
              {
                system: "http://hl7.org/fhir/v2/0360/2.7",
                code: specialization,
                display: "Specialization",
              },
            ],
          },
        },
      ],
    };

    let fhirResponse;
    try {
      fhirResponse = await axios.post(
        "https://fhir.simplifier.net/BITS-HACK/Practitioner",
        fhir_practitioner_data,
        {
          headers: {
            "Content-Type": "application/fhir+json",
            Authorization: `Bearer ${process.env.SIMPLIFIER_TOKEN}`,
          },
        }
      );
    } catch (error) {
      console.error(
        "FHIR Practitioner creation failed:",
        error.response?.data || error
      );
      return res
        .status(500)
        .json({ error: "Failed to create FHIR Practitioner resource" });
    }

    // Save FHIR resource to database
    await Provider_Resource.create({
      provider_fhir_resource_id: fhirResponse.data.id,
      provider_id: hospitalProvider.provider_id,
      provider_record: fhirResponse.data,
    });

    const token = jwt.sign(
      { userId: hospitalProvider.provider_id, role: "Hospital_Provider" },
      SECRET_KEY,
      {
        expiresIn: "1h",
      }
    );
    res.status(201).json({
      user: {
        name: hospitalProvider.provider_name,
        user_id: hospitalProvider.provider_id,
        token: token,
        role: "Hospital_Provider",
      },
    });
    res.status(200).json({ user: hospitalProvider });
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
      slot_date: date,
      hospital_id: hospitalProvider.hospital_id,
      isAvailable: "true",
    });

    res.status(200).json(timeSlot);
  } catch (e) {
    console.error(e);
    next(e); // Pass the error to the error-handling middleware
  }
};
const updateTimeSlots = async (req, res, next) => {
  console.log("Here");
  console.log(req.body);
  try {
    const { slot_id, start_time, end_time, slot_date } = req.body;

    // Check if the hospital provider exists
    const timeSlot = await Time_Slots.findByPk(slot_id);
    if (!timeSlot || timeSlot.isAvailable === false) {
      return res
        .status(404)
        .json({ error: "Time Slot not found or not available" });
    }

    // Update the time slot
    timeSlot.start_time = start_time;
    timeSlot.end_time = end_time;
    timeSlot.slot_date = slot_date;
    await timeSlot.save();

    res.status(200).json(timeSlot);
  } catch (e) {
    console.error(e);
    next(e); // Pass the error to the error-handling middleware
  }
};
const deleteTimeSlots = async (req, res, next) => {
  const { slot_id } = req.query;
  try {
    await Time_Slots.destroy({ where: { slot_id } });
    console.log("Deleted");
  } catch (e) {
    console.error(e);
    next(e);
  }
};
const bookAppointment = async (req, res, next) => {
  const { slot_id, user_id, reason } = req.body;

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
        status: "Pending",
        reason, // Status is "Pending" while waiting for confirmation
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
  const { user_id, appointment_id, reason = "Consultation" } = req.body;

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
      const patient_fhir_resource = await Patient_Resource.findOne({
        attributes: ["patient_fhir_resource_id"],
        where: { patient_id: foundAppointment.patient_id },
        raw: true,
      });
      console.log(patient_fhir_resource);
      const provider = await Time_Slots.findOne({
        attributes: ["provider"],
        where: {
          slot_id: foundAppointment.slot_id,
        },
        raw: true,
      });
      const provider_fhir_resource = await Provider_Resource.findOne({
        attributes: ["provider_fhir_resource_id"],
        where: { provider_id: provider.provider },
        raw: true,
      });
      const slot = await Time_Slots.findOne({
        attributes: ["slot_date", "start_time", "end_time"],
        where: {
          slot_id: foundAppointment.slot_id,
        },
        raw: true,
      });
      const fhir_encounter_data = {
        resourceType: "Encounter",
        status: "planned", // Appointment status can be "planned" until confirmed
        class: {
          system: "http://terminology.hl7.org/CodeSystem/v3-ActCode",
          code: "AMB", // Ambulatory (outpatient) encounter
          display: "ambulatory",
        },
        subject: {
          reference: `Patient/${patient_fhir_resource.patient_fhir_resource_id}`, // Reference to Patient resource
        },
        participant: [
          {
            individual: {
              reference: `Practitioner/${provider_fhir_resource.provider_fhir_resource_id}`, // Reference to Practitioner resource
            },
          },
        ],
        reasonCode: [
          {
            coding: [
              {
                system: "http://snomed.info/sct",
                code: "185347001", // Example SNOMED code for reason
                display: reason,
              },
            ],
            text: reason,
          },
        ],
        period: {
          start: slot.slot_date, // Appointment date as start
        },
      };
      const fhirResponse = await axios.post(
        "https://fhir.simplifier.net/BITS-HACK/Encounter",
        fhir_encounter_data,
        {
          headers: {
            "Content-Type": "application/fhir+json",
            Authorization: `Bearer ${process.env.SIMPLIFIER_TOKEN}`,
          },
        }
      );

      console.log(fhirResponse.data);
      await Appointment_Encounter.create({
        encounter_id: fhirResponse.data.id,
        appointment_id: foundAppointment.appointment_id, // Link the appointment with the encounter
      });

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
const fetchTimeSlots = async (req, res, next) => {
  const { provider_id } = req.query;
  const time_slots = await Time_Slots.findAll({
    where: { provider: provider_id },
  });
  return res.status(200).json(time_slots);
};
const fetchProviders = async (req, res, next) => {
  try {
    const providers = await Hospital_Provider.findAll({
      include: [
        {
          model: Hospital,
          attributes: {
            include: [
              [Sequelize.fn("ST_X", Sequelize.col("location")), "longitude"], // Extract longitude
              [Sequelize.fn("ST_Y", Sequelize.col("location")), "latitude"], // Extract latitude
            ],
          },
        },
      ],
    });
    console.log(providers);
    return res.status(200).json(providers);
  } catch (e) {
    console.error("Error fetching providers:", e);
    return res
      .status(500)
      .json({ error: "An error occurred while fetching providers." });
  }
};

const fetchProviderAppointments = async (req, res, next) => {
  const results = [];
  try {
    const { provider_id } = req.query;
    const timeSlots = await Time_Slots.findAll({
      where: {
        provider: provider_id,
      },
    });
    console.log("Fetched timelsots are", timeSlots);
    for (timeSlot of timeSlots) {
      const time_slot_id = timeSlot.slot_id;
      console.log(time_slot_id);
      const appointments = await Appointment.findAll({
        include: [
          {
            model: Patient,
          },
          {
            model: Time_Slots,
          },
        ],
        where: {
          slot_id: time_slot_id,
        },
        raw: true,
      });
      console.log(appointments);
      if (appointments != []) results.push(...appointments);
    }
    console.log(results);
    return res.status(200).json(results);
  } catch (e) {
    console.log(e);
  }
};
module.exports = {
  registerHospitalProvider,
  createTimeSlots,
  bookAppointment,
  confirmAppointment,
  updateTimeSlots,
  fetchTimeSlots,
  fetchProviders,
  deleteTimeSlots,
  fetchProviderAppointments,
};
