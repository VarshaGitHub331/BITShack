import React, { useState, useEffect } from "react";
import axios from "axios";

const HospitalAdmin = () => {
    const [users, setUsers] = useState([]);
    const [newUser, setNewUser] = useState({ email: "", role: "" });
    const [timeSlot, setTimeSlot] = useState({ start_time: "", end_time: "" });
    const [timeSlots, setTimeSlots] = useState([]);
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(false);

    // Fetch users and time slots on page load
    useEffect(() => {
        fetchUsers();
        fetchTimeSlots();
        fetchAppointments();
    }, []);

    // Fetch users
    const fetchUsers = async () => {
        try {
            const response = await axios.get("/api/hospital/users");
            setUsers(response.data);
        } catch (error) {
            console.error("Error fetching users:", error);
        }
    };

    // Fetch time slots
    const fetchTimeSlots = async () => {
        try {
            const response = await axios.get("/api/hospital/timeslots");
            setTimeSlots(response.data);
        } catch (error) {
            console.error("Error fetching time slots:", error);
        }
    };

    // Fetch appointments
    const fetchAppointments = async () => {
        try {
            const response = await axios.get("/api/hospital/appointments");
            setAppointments(response.data);
        } catch (error) {
            console.error("Error fetching appointments:", error);
        }
    };

    // Add a new user
    const handleAddUser = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await axios.post("/api/hospital/adduser", newUser);
            setNewUser({ email: "", role: "" });
            fetchUsers();
        } catch (error) {
            console.error("Error adding user:", error);
        } finally {
            setLoading(false);
        }
    };

    // Add a new time slot
    const handleAddTimeSlot = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await axios.post("/api/hospital/timeslots", timeSlot);
            setTimeSlot({ start_time: "", end_time: "" });
            fetchTimeSlots();
        } catch (error) {
            console.error("Error adding time slot:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-8 bg-gray-50 min-h-screen">
            <h1 className="text-2xl font-bold mb-6">Hospital Admin Dashboard</h1>

            {/* Add New User */}
            <section className="mb-8">
                <h2 className="text-xl font-semibold mb-4">Add New User</h2>
                <form onSubmit={handleAddUser} className="flex flex-col space-y-4">
                    <input
                        type="email"
                        placeholder="User Email"
                        value={newUser.email}
                        onChange={(e) =>
                            setNewUser((prev) => ({ ...prev, email: e.target.value }))
                        }
                        className="p-2 border rounded"
                        required
                    />
                    <select
                        value={newUser.role}
                        onChange={(e) =>
                            setNewUser((prev) => ({ ...prev, role: e.target.value }))
                        }
                        className="p-2 border rounded"
                        required
                    >
                        <option value="">Select Role</option>
                        <option value="hospital_user">Hospital User</option>
                        <option value="admin">Admin</option>
                    </select>
                    <button
                        type="submit"
                        disabled={loading}
                        className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                        {loading ? "Adding..." : "Add User"}
                    </button>
                </form>
            </section>

            {/* Add Time Slot */}
            <section className="mb-8">
                <h2 className="text-xl font-semibold mb-4">Add New Time Slot</h2>
                <form onSubmit={handleAddTimeSlot} className="flex flex-col space-y-4">
                    <input
                        type="time"
                        placeholder="Start Time"
                        value={timeSlot.start_time}
                        onChange={(e) =>
                            setTimeSlot((prev) => ({ ...prev, start_time: e.target.value }))
                        }
                        className="p-2 border rounded"
                        required
                    />
                    <input
                        type="time"
                        placeholder="End Time"
                        value={timeSlot.end_time}
                        onChange={(e) =>
                            setTimeSlot((prev) => ({ ...prev, end_time: e.target.value }))
                        }
                        className="p-2 border rounded"
                        required
                    />
                    <button
                        type="submit"
                        disabled={loading}
                        className="p-2 bg-green-500 text-white rounded hover:bg-green-600"
                    >
                        {loading ? "Adding..." : "Add Time Slot"}
                    </button>
                </form>
            </section>

            {/* View Users */}
            <section className="mb-8">
                <h2 className="text-xl font-semibold mb-4">Current Users</h2>
                <ul className="space-y-2">
                    {users.map((user) => (
                        <li key={user.id} className="p-2 border rounded bg-white shadow">
                            {user.email} - {user.role}
                        </li>
                    ))}
                </ul>
            </section>

            {/* View Appointments */}
            <section className="mb-8">
                <h2 className="text-xl font-semibold mb-4">Appointments</h2>
                <ul className="space-y-2">
                    {appointments.map((appointment) => (
                        <li
                            key={appointment.id}
                            className="p-2 border rounded bg-white shadow"
                        >
                            {appointment.date} - {appointment.time} -{" "}
                            {appointment.patient_name}
                        </li>
                    ))}
                </ul>
            </section>
        </div>
    );
};

export default HospitalAdmin;
