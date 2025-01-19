import React from "react";
import { useNavigate } from "react-router-dom";
import { faLocationDot } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";
const ProviderCard = ({ provider }) => {
  const navigate = useNavigate();
  const { provider_name, specialization, gender, Hospital, details } = provider;

  return (
    <div className="bg-white shadow-md rounded-lg p-2 mb-4 w-72">
      <div>
        <img
          src="./assets/Logo.webp"
          alt="doctor"
          className="w-full h-40  object-cover rounded-lg"
        />
      </div>
      <h3 className="text-lg font-semibold mx-4 my-2  text-gray-800">
        {provider_name}
      </h3>
      <div className="p-4 space-y-2">
        <p className="text-md text-gray-500">
          <span className="font-medium text-md">Specialization:</span>{" "}
          {specialization}
        </p>

        <p className="text-md text-gray-500">
          <span className="font-medium text-md">Hospital:</span>{" "}
          {Hospital.hospital_name || "N/A"}
        </p>
      </div>
      <div className="flex">
        <button
          className="mt-4 w-full bg-purple-500 hover:bg-purple-300 text-white font-medium py-1 px-4 rounded-lg"
          onClick={(e) => {
            navigate("/book-appointment", { state: { provider } });
          }}
        >
          Book
        </button>
        <Link
          className="flex items-center gap-2 text-md hover:underline p-2 rounded transition"
          onClick={(e) => {
            navigate(
              `/hospitalLocation?lat=${Hospital.latitude}&lng=${Hospital.longitude}`
            );
          }}
        >
          <FontAwesomeIcon icon={faLocationDot} className="h-4 w-4" />
          Location
        </Link>
      </div>
    </div>
  );
};

export default ProviderCard;
