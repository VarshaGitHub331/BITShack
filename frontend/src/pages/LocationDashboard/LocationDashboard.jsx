import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import axios from "axios";
import { useAuthContext } from "../../contexts/AuthContext";

const HospitalMap = () => {
  const [hospitals, setHospitals] = useState([]);
  const [location, setLocation] = useState({
    lat: 13.3410096,
    lng: 74.7472785,
  }); // Default location
  const [radius, setRadius] = useState(10); // Default radius (in kilometers)
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { userState } = useAuthContext();
  const { user_id } = userState;
  const [usePatientLocation, setUsePatientLocation] = useState(false);

  // Set up Leaflet default marker icon
  const defaultIcon = new L.Icon({
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
  });

  useEffect(() => {
    const fetchHospitals = async () => {
      try {
        setLoading(true);

        const response = await axios.get(
          `${process.env.REACT_APP_SERVER_URL}/hospital/getNearbyHospitals`,
          {
            params: {
              latitude: location.lat,
              longitude: location.lng,
              radius: radius * 1000,
            },
          }
        );
        console.log("API Response:", response.data);
        if (Array.isArray(response.data)) {
          setHospitals(response.data);
        } else {
          console.error("Unexpected data format:", response.data);
          setError("Failed to load hospital data.");
        }
      } catch (err) {
        console.error("Error fetching hospitals:", err);
        setError("Failed to load hospital data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    if (radius) {
      fetchHospitals();
    }
  }, [location, radius, usePatientLocation]);

  useEffect(() => {
    async function getPatientLocation() {
      const resultLocation = await axios.get(
        `${process.env.REACT_APP_SERVER_URL}/patient/fetchLocation?user_id=${user_id}`
      );
      console.log(resultLocation);
      setLocation((location) => {
        return {
          lat: resultLocation.data.latitude,
          lng: resultLocation.data.longitude,
        };
      });
    }
    // Try to fetch current location
    if (usePatientLocation == "current") {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setLocation({
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            });
          },
          (error) => {
            console.error("Error fetching geolocation:", error);
            setError("Unable to retrieve your location.");
          }
        );
      } else {
        setError("Geolocation is not supported by this browser.");
      }
    } else {
      try {
        getPatientLocation();
      } catch (e) {
        console.log(e);
      }
    }
  }, [usePatientLocation, user_id]);

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      <div style={{ flex: 1, height: "100%" }}>
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p style={{ color: "red" }}>{error}</p>
        ) : (
          <MapContainer
            center={location}
            zoom={13}
            style={{ height: "100%", width: "100%" }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            <RecenterMap location={location} />
            {location && (
              <Marker position={location} icon={defaultIcon}>
                <Popup>
                  <b>Your Location</b>
                </Popup>
              </Marker>
            )}
            {hospitals.map((hospital, index) => {
              const { latitude, longitude, hospital_name, details } = hospital;
              if (!latitude || !longitude) {
                console.warn("Invalid hospital location:", hospital);
                return null; // Skip markers with invalid data
              }

              return (
                <Marker
                  key={index}
                  position={{
                    lat: parseFloat(latitude),
                    lng: parseFloat(longitude),
                  }}
                  icon={defaultIcon}
                >
                  <Popup>
                    <b>{hospital_name}</b>
                    <br />
                    {details.city}, {details.state}, {details.country}
                    <br />
                    Zip: {details.zipCode}
                    <br />
                    Contact: {details.contact_no}
                  </Popup>
                </Marker>
              );
            })}
          </MapContainer>
        )}
      </div>
      <div style={{ display: "flex", height: "100vh" }}>
        <div style={{ flex: 1, height: "100%" }}>
          {loading ? (
            <p>Loading...</p>
          ) : error ? (
            <p style={{ color: "red" }}>{error}</p>
          ) : (
            <MapContainer
              center={location}
              zoom={13}
              style={{ height: "100%", width: "100%" }}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              <RecenterMap location={location} />
              {location && (
                <Marker position={location} icon={defaultIcon}>
                  <Popup>
                    <b>Your Location</b>
                  </Popup>
                </Marker>
              )}
              {hospitals.map((hospital, index) => {
                const { latitude, longitude, hospital_name, details } =
                  hospital;
                if (!latitude || !longitude) {
                  console.warn("Invalid hospital location:", hospital);
                  return null; // Skip markers with invalid data
                }

                return (
                  <Marker
                    key={index}
                    position={{
                      lat: parseFloat(latitude),
                      lng: parseFloat(longitude),
                    }}
                    icon={defaultIcon}
                  >
                    <Popup>
                      <b>{hospital_name}</b>
                      <br />
                      {details.city}, {details.state}, {details.country}
                      <br />
                      Zip: {details.zipCode}
                      <br />
                      Contact: {details.contact_no}
                    </Popup>
                  </Marker>
                );
              })}
            </MapContainer>
          )}
        </div>
        <div
          className="flex flex-col justify-center items-center space-y-6 bg-purple-400 bg-opacity-75 text-white p-8 shadow-lg rounded-l-lg"
          style={{ width: "300px" }}
        >
          <div className="w-full">
            <label className="block mb-2 font-medium">Radius (km):</label>
            <input
              type="number"
              value={radius}
              onChange={(e) => setRadius(e.target.value)}
              min="1"
              className="w-full p-2 rounded-md border-none text-purple-900 focus:outline-none focus:ring-2 focus:ring-purple-300"
            />
          </div>
          <div className="w-full">
            <label className="block mb-2 font-medium">Search From:</label>
            <select
              onChange={(e) => setUsePatientLocation(e.target.value)}
              className="w-full p-2 rounded-md border-none text-purple-900 focus:outline-none focus:ring-2 focus:ring-purple-300"
            >
              <option value="current">Current Location</option>
              <option value="home">Home Location</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

const RecenterMap = ({ location }) => {
  const map = useMap();

  useEffect(() => {
    map.setView(location, 13); // Update map view on location change
  }, [location, map]);

  return null;
};

export default HospitalMap;
