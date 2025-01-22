import React, { useState } from "react";
import { useAuthContext } from "../../contexts/AuthContext";
import axios from "axios";
import { QueryClient } from "@tanstack/react-query";
function CreateTimeSlot() {
  const queryClient = new QueryClient();
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const { userState } = useAuthContext();
  const { user_id } = userState;
  const [submitting, setSubmitting] = useState(false);
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    // Handle the form submission
    try {
      await axios.post(
        `${process.env.REACT_APP_SERVER_URL}/hospitalProvider/timeslots`,
        {
          date,
          start_time: startTime,
          end_time: endTime,
          provider_id: user_id,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      setSubmitting(false);
      queryClient.invalidateQueries(["timeslots"]);
      console.log("Time Slot Created");
    } catch (e) {
      console.log(e);
      setSubmitting(false);
    }
    const timeSlot = {
      date,
      start_time: startTime,
      end_time: endTime,
      provider_id: user_id,
    };
    console.log("Time Slot Created:", timeSlot);
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="text-md font-bold text-purple-600 mb-4">
        Create Time Slot
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Date Picker */}
        <div className="flex flex-col">
          <label htmlFor="date" className="font-semibold text-gray-700 mb-2">
            Slot Date
          </label>
          <input
            type="date"
            id="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="px-4 py-2 border rounded-md"
            required
          />
        </div>

        {/* Start Time Picker */}
        <div className="flex flex-col">
          <label
            htmlFor="start-time"
            className="font-semibold text-gray-700 mb-2"
          >
            Start Time
          </label>
          <input
            type="time"
            id="start-time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            className="px-4 py-2 border rounded-md"
            required
          />
        </div>

        {/* End Time Picker */}
        <div className="flex flex-col">
          <label
            htmlFor="end-time"
            className="font-semibold text-gray-700 mb-2"
          >
            End Time
          </label>
          <input
            type="time"
            id="end-time"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            className="px-4 py-2 border rounded-md"
            required
          />
        </div>

        {/* Submit Button */}
        <div className="flex justify-start">
          <button
            type="submit"
            disabled={submitting}
            className="bg-purple-600  text-sm text-white px-4 py-2 rounded-lg "
          >
            {submitting === true ? "Submitting" : "Create Time Slot"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default CreateTimeSlot;
