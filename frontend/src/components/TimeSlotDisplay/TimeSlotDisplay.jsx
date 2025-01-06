import React, { useState } from "react";

const TimeSlotDisplay = ({ timeSlots }) => {
  const [selectedSlot, setSelectedSlot] = useState(null); // State to track the selected timeslot

  const handleSlotClick = (slot) => {
    setSelectedSlot(slot); // Set the clicked slot as selected
  };

  const closePopup = () => {
    setSelectedSlot(null); // Clear the selected slot to close the popup
  };

  return (
    <div className="p-6">
      <h2 className="text-md font-bold text-purple-500 mb-4">
        Available Timeslots
      </h2>

      {/* Tabular View */}
      <table className="w-full table-auto border-collapse border border-gray-300">
        <thead>
          <tr className="bg-purple-100">
            <th className="border border-gray-300 p-2">Start Time</th>
            <th className="border border-gray-300 p-2">End Time</th>
            <th className="border border-gray-300 p-2">Date</th>
            <th className="border border-gray-300 p-2">Availability</th>
            <th className="border border-gray-300 p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {timeSlots?.map((slot) => (
            <tr
              key={slot.slot_id}
              className="hover:bg-gray-100 cursor-pointer"
              onClick={() => handleSlotClick(slot)} // Handle slot click
            >
              <td className="border border-gray-300 p-2 text-center">
                {slot.start_time}
              </td>
              <td className="border border-gray-300 p-2 text-center">
                {slot.end_time}
              </td>
              <td className="border border-gray-300 p-2 text-center">
                {new Date(slot.slot_date).toISOString().split("T")[0]}
              </td>
              <td className="border border-gray-300 p-2 text-center">
                {slot.isAvailable ? (
                  <span className="text-green-600 font-semibold">
                    Available
                  </span>
                ) : (
                  <span className="text-red-600 font-semibold">Booked</span>
                )}
              </td>
              <td className="border border-gray-300 p-2 text-center">
                Click to View
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Popup/Modal for Card View */}
      {selectedSlot && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-4 rounded shadow-lg w-80 space-y-4">
            <button
              className="absolute top-2 right-2 text-gray-600 hover:text-gray-900 text-lg font-bold"
              onClick={closePopup}
            >
              ×
            </button>
            <h3 className="text-lg font-bold text-purple-500 mb-4">
              Timeslot Details
            </h3>
            <p className="text-sm">
              <span className="font-semibold">Start Time:</span>{" "}
              {selectedSlot.start_time}
            </p>
            <p className="text-sm">
              <span className="font-semibold">End Time:</span>{" "}
              {selectedSlot.end_time}
            </p>
            <p className="text-sm">
              <span className="font-semibold">Date:</span>{" "}
              {new Date(selectedSlot.slot_date).toISOString().split("T")[0]}
            </p>
            <p
              className={`text-sm font-semibold mt-2 ${
                selectedSlot.isAvailable ? "text-green-600" : "text-red-600"
              }`}
            >
              {selectedSlot.isAvailable ? "Available" : "Booked"}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default TimeSlotDisplay;
