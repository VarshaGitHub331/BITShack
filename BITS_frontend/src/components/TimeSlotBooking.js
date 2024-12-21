import React, { useState, useEffect } from 'react';
import axios from '../utils/api';

const TimeSlotBooking = () => {
    const [timeSlots, setTimeSlots] = useState([]);
    const [selectedSlot, setSelectedSlot] = useState(null);

    useEffect(() => {
        axios.get('/api/time_slots').then((res) => setTimeSlots(res.data));
    }, []);

    const bookSlot = (slotId) => {
        axios.post('/api/appointments', { time_slot_id: slotId }).then((res) => {
            alert('Appointment booked successfully!');
            setSelectedSlot(null);
        });
    };

    return (
        <div className="container mx-auto p-6">
            <h2 className="text-2xl font-bold mb-4">Available Time Slots</h2>
            <div className="grid grid-cols-3 gap-4">
                {timeSlots.map((slot) => (
                    <div
                        key={slot.id}
                        className="border p-4 rounded shadow hover:shadow-lg cursor-pointer"
                        onClick={() => setSelectedSlot(slot.id)}
                    >
                        <p>Date: {slot.date}</p>
                        <p>Time: {slot.start_time} - {slot.end_time}</p>
                    </div>
                ))}
            </div>
            {selectedSlot && (
                <button
                    className="mt-4 bg-green-600 text-white py-2 px-4 rounded"
                    onClick={() => bookSlot(selectedSlot)}
                >
                    Confirm Booking
                </button>
            )}
        </div>
    );
};

export default TimeSlotBooking;
