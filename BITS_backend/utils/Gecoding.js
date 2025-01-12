const axios = require("axios");
const apiKey = process.env.GEOCODING_KEY;
async function getGeocoding(details) {
  const {
    addressLine1 = " ",
    addressLine2 = "",
    city = "",
    state = "",
    country = "India",
  } = details;
  // Replace with your actual API key
  const address = `${addressLine1} ${addressLine2} ${city} ${state} ${country}`;
  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
    address
  )}&key=${apiKey}`;

  try {
    const response = await axios.get(url);
    if (response.data.status === "OK") {
      const { lat, lng } = response.data.results[0].geometry.location;
      return { latitude: lat, longitude: lng };
    } else {
      throw new Error("Geocoding API error: " + response.data.status);
    }
  } catch (error) {
    console.error("Error fetching geocoding data:", error);
    throw error;
  }
}

module.exports = getGeocoding;
