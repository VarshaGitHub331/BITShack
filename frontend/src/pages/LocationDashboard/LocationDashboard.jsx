import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import axios from "axios";

const HospitalMap = () => {
  const [hospitals, setHospitals] = useState([]);
  const [location, setLocation] = useState({
    lat: 13.3410096,
    lng: 74.7472785,
  }); // Default location
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

    fetchHospitals();
  }, [location]);

  return (
    <div>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p style={{ color: "red" }}>{error}</p>
      ) : (
        <MapContainer
          center={location}
          zoom={13}
          style={{ height: "500px", width: "100%" }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          <RecenterMap location={location} />

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
