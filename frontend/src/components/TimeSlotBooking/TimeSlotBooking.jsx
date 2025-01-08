import React, { useState, useEffect } from "react";
import moment from "moment";
import { useAuthContext } from "../../contexts/AuthContext";
import axios from "axios";
import { QueryClient } from "@tanstack/react-query";
export default function TimeSlotBooking({ timeSlots }) {
  const [selectedDay, setSelectedDay] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [bookedAppointment, setBookedAppointment] = useState(null);
  const { userState } = useAuthContext();
  const { user_id } = userState;
  const [loading, setLoading] = useState(false);
  const [showPopup, setShowPopup] = useState(false); // State for popup visibility
  const queryClient = new QueryClient();
  const groupedSlots = timeSlots?.reduce((acc, slot) => {
    const date = moment(slot.slot_date).format("YYYY-MM-DD");
    if (!acc[date]) acc[date] = [];
    acc[date].push(slot);
    return acc;
  }, {});

  const handleDaySelect = (day) => {
    setSelectedDay(day);
    setSelectedTime(null);
  };

  const handleTimeSelect = (time) => {
    setSelectedTime(time);
  };

  async function BookTimeSlot() {
    setLoading(true);
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_SERVER_URL}/hospitalProvider/bookAppointment`,
        {
          slot_id: selectedTime.slot_id,
          user_id: user_id,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      setBookedAppointment(response.data.appointment);
      setLoading(false);
      setShowPopup(true); // Show the popup
      queryClient.invalidateQueries(["timeslots"]);
    } catch (e) {
      console.log(e);
      alert(e);
      setLoading(false);
    }
  }
  async function confirmAppointment() {
    try {
      const result = await axios.post(
        `${process.env.REACT_APP_SERVER_URL}/hospitalProvider/confirmAppointment`,
        {
          user_id: user_id,
          appointment_id: bookedAppointment.appointment_id,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log(result);
      alert("Appointment Confirmed");
      closePopup();
    } catch (e) {
      console.log(e);
      alert("Error Confirming Appointment");
    }
  }
  const closePopup = () => {
    setShowPopup(false); // Close the popup
  };

  return (
    <div className="relative">
      {/* Blur background when popup is visible */}
      <div className={showPopup ? "blur-sm" : ""}>
        <div className="p-6 rounded-lg w-10/12 ml-44 px-1/4">
          <div className="text-sm font-semibold text-gray-500 mb-4">
            Booking slots
          </div>

          <div className="flex gap-2 w-full justify-start mb-6">
            {groupedSlots &&
              Object.keys(groupedSlots).map((date) => (
                <button
                  key={date}
                  onClick={() => handleDaySelect(date)}
                  className={`py-2 px-4 rounded-full border text-center text-gray-700 font-medium 
                  ${
                    selectedDay === date
                      ? "bg-purple-500 text-white"
                      : "bg-white border-gray-300"
                  }`}
                >
                  <span className="block">{moment(date).format("ddd")}</span>
                  <span className="block">{moment(date).format("D")}</span>
                </button>
              ))}
          </div>

          <div className="grid grid-cols-3 gap-3 md:grid-cols-3 sm:flex sm:flex-wrap sm:gap-x-1 sm:gap-y-2">
            {selectedDay && groupedSlots[selectedDay] ? (
              groupedSlots[selectedDay].map(
                (slot) =>
                  slot.isAvailable === "True" && (
                    <button
                      key={slot.slot_id}
                      onClick={() =>
                        handleTimeSelect({
                          slot_id: slot.slot_id,
                          start_time: slot.start_time,
                          end_time: slot.end_time,
                        })
                      }
                      className={`w-40 px-2 py-2 rounded-full border text-center text-sm font-medium
                  ${
                    selectedTime?.slot_id === slot.slot_id
                      ? "bg-purple-500 text-white"
                      : "bg-white border-gray-300"
                  }`}
                      disabled={slot.isAvailable !== "True"}
                    >
                      {moment(slot.start_time, "HH:mm:ss").format("hh:mm A")}
                    </button>
                  )
              )
            ) : (
              <div className="col-span-3 text-center text-gray-500">
                Please select a day to view slots.
              </div>
            )}
          </div>

          {selectedDay && (
            <button
              className="w-1/4 py-2 px-2 mt-8 text-white font-semibold rounded-lg bg-purple-500 hover:bg-purple-600"
              disabled={!selectedTime}
              onClick={() => BookTimeSlot()}
            >
              {loading ? "Booking" : "Book an appointment"}
            </button>
          )}
        </div>
      </div>

      {/* Popup */}
      {showPopup && (
        <div className="fixed inset-0  flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-md font-semibold mb-4">Appointment Booked!</h2>
            <p> Confirm Your appointment within 2 minutes</p>
            <button
              onClick={(e) => confirmAppointment()}
              className="mt-4 py-2 px-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600"
            >
              Confirm
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
