import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBook,
  faCalendarPlus,
  faCalendarDay,
} from "@fortawesome/free-solid-svg-icons";
import { useAuthContext } from "../../contexts/AuthContext";
import { Link } from "react-router-dom";
import { faRightFromBracket } from "@fortawesome/free-solid-svg-icons";

function SideBar({ setOpenSidebar }) {
  const { userState, UserLogin, UserLogout } = useAuthContext();
  const { role, name } = userState;

  return (
    <div className="h-full w-64 bg-gray-300 bg-opacity-40 backdrop-blur-lg fixed top-0 right-0 rounded-md shadow-lg py-4 px-6 flex flex-col text-left space-y-4">
      {/* Header Section */}
      <div className="flex gap-2 items-end">
        <img src="./assets/Logo.webp" alt="logo" className="h-8 w-8" />
        <div className="text-sm font-bold text-purple-600">{name}</div>
      </div>

      {/* Sidebar Links */}
      <ul className="space-y-4  text-purple-600">
        {/* Dashboard for everyone */}
        <li>
          <Link
            to="/dashboard"
            className="flex items-center gap-2 text-md hover:underline p-2 rounded transition"
          >
            <FontAwesomeIcon icon={faBook} className="h-4 w-4" />
            Dashboard
          </Link>
        </li>

        {/* Conditional Links for Hospital Providers */}
        {role === "Hospital_Provider" && (
          <>
            <li>
              <Link
                to="/create-timeslot"
                className="flex items-center gap-2 text-md hover:underline p-2 rounded transition"
              >
                <FontAwesomeIcon icon={faCalendarPlus} className="h-4 w-4" />
                Create Timeslot
              </Link>
            </li>
            <li>
              <Link
                to="/view-timeslots"
                className="flex items-center gap-2 text-md hover:underline p-2 rounded transition"
              >
                <FontAwesomeIcon icon={faCalendarDay} className="h-4 w-4" />
                View Timeslots
              </Link>
            </li>
          </>
        )}
        {role === "Patient" && (
          <>
            <li>
              <Link
                to="/view-providers"
                className="flex items-center gap-2 text-md hover:underline p-2 rounded transition"
              >
                <FontAwesomeIcon icon={faBook} className="h-4 w-4" />
                All Providers
              </Link>
            </li>
            <li>
              <Link
                to="/book-appointment"
                className="flex items-center gap-2 text-md hover:underline p-2 rounded transition"
              >
                <FontAwesomeIcon icon={faCalendarPlus} className="h-4 w-4" />
                Book Appointment
              </Link>
            </li>
          </>
        )}
        <li>
          <Link
            onClick={(e) => {
              UserLogout();
            }}
            className="flex items-center gap-2 text-md hover:underline p-2 rounded transition"
          >
            <FontAwesomeIcon icon={faRightFromBracket} className="h-4 w-4" />
            Logout
          </Link>
        </li>
      </ul>

      {/* Close Button */}
      <button
        onClick={(e) => setOpenSidebar(false)}
        className="absolute top-4 right-4 text-white rounded-full p-1.5 hover:bg-purple-300"
      >
        <FontAwesomeIcon icon={faBook} className="h-6 w-6" />
      </button>
    </div>
  );
}

export default SideBar;
