import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import moment from "moment"; // Import moment for date formatting
import { fetchHospitalDetails } from "../../apis/Hospital";
import { useAuthContext } from "../../contexts/AuthContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUserInjured,
  faCalendarCheck,
  faUserMd,
} from "@fortawesome/free-solid-svg-icons";

export default function HospitalAdmin() {
  const { userState } = useAuthContext();
  const { name } = userState;

  const {
    data: hospitalDetails,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["Hospital_Details", name],
    queryFn: () => fetchHospitalDetails({ hospital_name: name }),
  });

  if (isLoading) {
    return <h1>Loading...</h1>;
  }

  if (error) {
    return <h1>Error fetching hospital details: {error.message}</h1>;
  }

  return (
    <div className="flex flex-col w-full space-y-6 p-6">
      {/* First Row */}
      <div className="flex justify-start gap-x-4 w-full">
        {/* Patients Box */}
        <div className="flex flex-col items-center bg-white text-purple-500 rounded-lg shadow-md p-4 w-1/4">
          <div className="text-xl flex gap-x-2">
            <FontAwesomeIcon icon={faUserInjured} />
            <span className="text-sm font-semibold">Patients</span>
          </div>
          <div className="text-md font-bold">
            {hospitalDetails?.Patients?.length}
          </div>
        </div>

        {/* Appointments Box */}
        <div className="flex flex-col items-center bg-white text-purple-500 rounded-lg shadow-md p-4 w-1/4">
          <div className="text-xl flex gap-x-2">
            <FontAwesomeIcon icon={faCalendarCheck} />
            <span className="text-sm font-semibold">Appointments</span>
          </div>
          <div className="text-md font-bold">
            {hospitalDetails?.appointments?.length}
          </div>
        </div>

        {/* Providers Box */}
        <div className="flex flex-col items-center bg-white text-purple-500 rounded-lg shadow-md p-4 w-1/4">
          <div className="text-xl flex gap-x-2">
            <FontAwesomeIcon icon={faUserMd} />
            <span className="text-sm font-semibold">Providers</span>
          </div>
          <div className="text-md font-bold">
            {hospitalDetails?.providers?.length}
          </div>
        </div>
      </div>

      {/* Second Row */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="text-lg font-semibold mb-4">Appointments</div>
        <hr className="mb-4" />
        {hospitalDetails?.appointments?.map((appointment) => (
          <div
            key={appointment.id} // Add a unique key for React's reconciliation
            className="flex justify-between items-center border-b border-gray-200 py-2"
          >
            <div>
              <div className="text-sm font-medium">
                {appointment.provider_name}
              </div>
              <div className="text-sm text-gray-600">
                {moment(appointment.date).format("MMMM Do, YYYY")}
              </div>
            </div>
            <div
              className={`text-sm font-semibold ${
                appointment.status === "Confirmed"
                  ? "text-green-600"
                  : appointment.status === "Pending"
                  ? "text-yellow-600"
                  : "text-red-600"
              }`}
            >
              {appointment.status}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
