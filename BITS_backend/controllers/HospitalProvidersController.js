const { Hospital_Provider, Time_Slots, Hospital } = require("../utils/InitializeModels");

// Register a new hospital provider
const registerHospitalProvider = async (req, res, next) => {
    try {
        const { name, email, password, hospital_id } = req.body;

        // Validate input
        if (!name || !email || !password || !hospital_id) {
            return res.status(400).json({ error: "All fields are required" });
        }

        // Check if the hospital exists
        const hospital = await Hospital.findByPk(hospital_id);
        if (!hospital) {
            return res.status(404).json({ error: "Hospital not found" });
        }

        // Create the hospital provider (ensure passwords are hashed in the model)
        const hospitalProvider = await Hospital_Provider.create({
            name,
            email,
            password,
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
            provider_id,
            start_time,
            end_time,
            date,
        });

        res.status(200).json(timeSlot);
    } catch (e) {
        console.error(e);
        next(e); // Pass the error to the error-handling middleware
    }
};

module.exports = { registerHospitalProvider, createTimeSlots };