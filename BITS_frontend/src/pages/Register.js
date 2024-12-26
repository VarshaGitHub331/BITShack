import React, { useState } from 'react';
import axios from '../utils/api';

const Register = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('/api/register', { email, password, role });
            alert('Registration successful!');
        } catch (err) {
            alert('Error registering');
        }
    };

    return (
        <div className="container mx-auto p-6">
            <form onSubmit={handleSubmit}>
                <h2 className="text-2xl font-bold mb-4">Register</h2>
                <input
                    type="email"
                    className="border p-2 w-full mb-4"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <input
                    type="password"
                    className="border p-2 w-full mb-4"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <select
                    className="border p-2 w-full mb-4"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                >
                    <option value="">Select Role</option>
                    <option value="patient">Patient</option>
                    <option value="hospital_user">Hospital User</option>
                    <option value="hospital_admin">Hospital Admin</option>
                </select>
                <button type="submit" className="bg-green-600 text-white py-2 px-4 rounded">
                    Register
                </button>
            </form>
        </div>
    );
};

export default Register;
