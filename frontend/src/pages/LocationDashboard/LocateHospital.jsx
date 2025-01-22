import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import axios from "axios";
import { useAuthContext } from "../../contexts/AuthContext";
import { useSearchParams } from "react-router-dom";

const HospitalMap = () => {
  const [searchParams] = useSearchParams();
  const hospitalLatitude = searchParams.get("lat");
  const hospitalLongitude = searchParams.get("lng");
  const hospitalName = searchParams.get("name") || "Hospital";

  const [hospitalLocation, setHospitalLocation] = useState(null);
  const [location, setLocation] = useState({
    lat: 13.3410096,
    lng: 74.7472785,
  }); // Default location
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

  // Fetch patient's saved location or use current location
  useEffect(() => {
    async function getPatientLocation() {
      try {
        const resultLocation = await axios.get(
          `${process.env.REACT_APP_SERVER_URL}/patient/fetchLocation?user_id=${user_id}`
        );
        setLocation({
          lat: resultLocation.data.latitude,
          lng: resultLocation.data.longitude,
        });
      } catch (e) {
        console.error("Error fetching patient location:", e);
      }
    }

    if (usePatientLocation === "current") {
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
          }
        );
      } else {
        console.error("Geolocation is not supported by this browser.");
      }
    } else if (usePatientLocation === "home") {
      getPatientLocation();
    }
  }, [usePatientLocation, user_id]);

  // Set hospital location from query parameters
  useEffect(() => {
    if (hospitalLatitude && hospitalLongitude) {
      setHospitalLocation({
        lat: parseFloat(hospitalLatitude),
        lng: parseFloat(hospitalLongitude),
      });
    } else {
      console.warn("Invalid hospital coordinates.");
    }
  }, [hospitalLatitude, hospitalLongitude]);

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      <div style={{ flex: 1, height: "100%" }}>
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
          {/* User Location Marker */}
          <Marker position={location} icon={defaultIcon}>
            <Popup>
              <b>Your Location</b>
            </Popup>
          </Marker>
          {/* Hospital Location Marker */}
          {hospitalLocation && (
            <Marker position={hospitalLocation} icon={defaultIcon}>
              <Popup>
                <b>{hospitalName}</b>
              </Popup>
            </Marker>
          )}
        </MapContainer>
      </div>
      <div
        className="flex flex-col justify-center items-center space-y-6 bg-purple-400 bg-opacity-75 text-white p-8 shadow-lg rounded-l-lg"
        style={{ width: "300px" }}
      >
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
