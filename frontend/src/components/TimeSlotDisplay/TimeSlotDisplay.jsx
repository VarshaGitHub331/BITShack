import React, { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
const TimeSlotDisplay = ({ timeSlots }) => {
  const [selectedSlot, setSelectedSlot] = useState(null); // State to track the selected timeslot
  const [isEditing, setIsEditing] = useState(false); // State to track edit mode
  const [editedSlot, setEditedSlot] = useState(null); // State to store edited slot values
  const queryClient = useQueryClient();
  const updateTimeSlot = async (editSlot) => {
    const response = await axios.post(
      `${process.env.REACT_APP_SERVER_URL}/hospitalProvider/updateTimeSlots`,
      editSlot,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    console.log(response);
  };
  const deleteTimeSlot = async (selectedSlot) => {
    const response = await axios.delete(
      `${process.env.REACT_APP_SERVER_URL}/hospitalProvider/deleteTimeSlots?slot_id=${selectedSlot.slot_id}`
    );
    console.log(response);
  };
  const handleSlotClick = (slot) => {
    setSelectedSlot(slot); // Set the clicked slot as selected
    setIsEditing(false); // Ensure edit mode is off initially
  };

  const closePopup = () => {
    setSelectedSlot(null); // Clear the selected slot to close the popup
    setIsEditing(false); // Exit edit mode
  };

  const handleEditClick = () => {
    setIsEditing(true); // Enable edit mode
    setEditedSlot({ ...selectedSlot }); // Initialize editedSlot with current values
  };

  const handleInputChange = (field, value) => {
    setEditedSlot((prev) => ({
      ...prev,
      [field]: value,
    })); // Update editedSlot with new values
  };

  const saveChanges = () => {
    console.log("Saving changes:", editedSlot);
    // Here, you would typically send the updated data to the server or update state
    mutation.mutate(editedSlot);
    setSelectedSlot(editedSlot); // Update the displayed data
    setIsEditing(false); // Exit edit mode
  };

  const cancelEdit = () => {
    setIsEditing(false); // Exit edit mode without saving changes
  };
  const mutation = useMutation({
    mutationFn: (editSlot) => updateTimeSlot(editSlot),
    onSuccess: () => {
      console.log("Mutation Success");
      queryClient.invalidateQueries("timeSlots");
    },
    onError: (error) => {
      console.log("Mutation Error", error);
    },
  });
  const deleteMutation = useMutation({
    mutationFn: (selectedSlot) => deleteTimeSlot(selectedSlot),
    onSuccess: () => {
      console.log("Delete Mutation Success");
      queryClient.invalidateQueries("timeSlots");
      setSelectedSlot(null);
    },
    onError: (error) => {
      console.log("Delete Mutation Error", error);
    },
  });

  return (
    <div className="p-6">
      <h2 className="text-md font-bold text-purple-500 mb-4">
        Available Timeslots
      </h2>

      {/* Tabular View */}
      <table className="w-full table-auto border-collapse border border-gray-300">
        <thead>
          <tr className="bg-purple-100">
            <th className="border border-gray-300 p-2 text-sm text-purple-500">
              Start Time
            </th>
            <th className="border border-gray-300 p-2 text-sm text-purple-500">
              End Time
            </th>
            <th className="border border-gray-300 p-2 text-sm text-purple-500">
              Date
            </th>
            <th className="border border-gray-300 p-2 text-sm text-purple-500">
              Availability
            </th>
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
                {slot.isAvailable == "True" ? (
                  <span className="text-green-600 font-semibold">
                    Available
                  </span>
                ) : (
                  <span className="text-red-600 font-semibold">Booked</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Popup to show selected timeslot details */}
      {selectedSlot && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-4 rounded shadow-lg w-80 space-y-4">
            {/* Modal Header with Close Button */}
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-bold text-purple-500">
                Timeslot Details
              </h3>
              <button
                className="text-gray-600 hover:text-gray-900 text-lg font-bold"
                onClick={closePopup}
              >
                ×
              </button>
            </div>

            {/* Modal Content */}
            {!isEditing ? (
              <>
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
                <div className="flex justify-between items-center">
                  <p
                    className={`text-sm font-semibold mt-2 ${
                      selectedSlot.isAvailable
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {selectedSlot.isAvailable ? "Available" : "Booked"}
                  </p>
                  {selectedSlot.isAvailable && (
                    <div className=" flex space-x-4">
                      <button
                        className="w-1/3 text-green-500"
                        onClick={handleEditClick}
                      >
                        Edit
                      </button>
                      <button
                        className="w-1/3 text-red-500"
                        onClick={(e) => {
                          deleteMutation.mutate(selectedSlot);
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <div>
                  <label className="block text-sm font-semibold">
                    Start Time:
                  </label>
                  <input
                    type="text"
                    className="border border-gray-300 rounded p-1 w-full"
                    value={editedSlot.start_time}
                    onChange={(e) =>
                      handleInputChange("start_time", e.target.value)
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold">
                    End Time:
                  </label>
                  <input
                    type="text"
                    className="border border-gray-300 rounded p-1 w-full"
                    value={editedSlot.end_time}
                    onChange={(e) =>
                      handleInputChange("end_time", e.target.value)
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold">Date:</label>
                  <input
                    type="date"
                    className="border border-gray-300 rounded p-1 w-full"
                    value={
                      new Date(editedSlot.slot_date).toISOString().split("T")[0]
                    }
                    onChange={(e) =>
                      handleInputChange("slot_date", e.target.value)
                    }
                  />
                </div>
                <div className=" flex w-full justify-between items-center">
                  <button
                    className="w-1/3 text-green-500"
                    onClick={saveChanges}
                  >
                    Save
                  </button>
                  <button className="w-1/3 text-red-500" onClick={cancelEdit}>
                    Cancel
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default TimeSlotDisplay;
