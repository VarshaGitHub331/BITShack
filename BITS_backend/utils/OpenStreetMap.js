const express = require("express");
const axios = require("axios");

const router = express.Router();

// Function to fetch nearby hospitals
const fetchNearbyHospitals = async (lat, lon) => {
    const overpassUrl = `https://overpass-api.de/api/interpreter`;
    const query = `
    [out:json];
    node["amenity"="hospital"](around:5000,${lat},${lon});
    out body;
  `;

    try {
        const response = await axios.post(overpassUrl, query, {
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
        });

        return response.data.elements.map((hospital) => ({
            id: hospital.id,
            name: hospital.tags.name || "Unknown Hospital",
            lat: hospital.lat,
            lon: hospital.lon,
            details: hospital.tags,
        }));
    } catch (error) {
        console.error("Error fetching data from OpenStreetMap:", error);
        throw new Error("Failed to fetch hospital data");
    }
};

// Hospitals endpoint
router.get("/hospitals", async (req, res) => {
    const { lat, lon } = req.query;

    if (!lat || !lon) {
        return res.status(400).json({ error: "Latitude and Longitude are required" });
    }

    try {
        const hospitals = await fetchNearbyHospitals(lat, lon);
        res.json(hospitals);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to fetch hospitals" });
    }
});

module.exports = router;
