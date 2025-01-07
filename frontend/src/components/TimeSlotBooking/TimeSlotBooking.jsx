import React, { useState, useEffect } from "react";
import moment from "moment";

export default function TimeSlotBooking({ timeSlots }) {
  const [selectedDay, setSelectedDay] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  console.log(timeSlots);
  // Group slots by date for easier rendering
  const groupedSlots = timeSlots?.reduce((acc, slot) => {
    const date = moment(slot.slot_date).format("YYYY-MM-DD"); // Format date
    if (!acc[date]) acc[date] = [];
    acc[date].push(slot);
    return acc;
  }, {});
  console.log(groupedSlots);
  const handleDaySelect = (day) => {
    setSelectedDay(day);
    setSelectedTime(null); // Reset time selection
  };

  const handleTimeSelect = (time) => {
    setSelectedTime(time);
  };

  return (
    <div className="p-6 rounded-lg w-10/12 ml-44 px-1/4 ">
      <div className="text-sm font-semibold text-gray-500 mb-4">
        Booking slots
      </div>

      {/* Day Selector */}
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
          groupedSlots[selectedDay].map((slot) => (
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
              disabled={slot.isAvailable !== "True"} // Disable if not available
            >
              {moment(slot.start_time, "HH:mm:ss").format("hh:mm A")}
            </button>
          ))
        ) : (
          <div className="col-span-3 text-center text-gray-500">
            Please select a day to view slots.
          </div>
        )}
      </div>

      {/* Confirm Button */}
      {selectedDay && (
        <button
          className="w-1/4 py-2 px-2 mt-8 text-white font-semibold rounded-lg bg-purple-500 hover:bg-purple-600 "
          disabled={!selectedTime}
          onClick={() =>
            alert(
              `Booking confirmed for Slot ID: ${selectedTime.slot_id}, Time: ${selectedTime.start_time}`
            )
          }
        >
          Book an appointment
        </button>
      )}
    </div>
  );
}
