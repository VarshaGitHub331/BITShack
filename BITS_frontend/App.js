import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './src/components/Navbar';
import Footer from './src/components/Footer';
import Home from './src/pages/Home';
import Login from './src/pages/Login';
import Register from './src/pages/Register';
import HospitalDashboard from './src/components/HospitalDashboard';
import TimeSlotBooking from './src/components/TimeSlotBooking';

function App() {
    return (
        <Router>
            <Navbar />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/hospital-admin" element={<HospitalDashboard />} />
                <Route path="/book-slot" element={<TimeSlotBooking />} />
            </Routes>
            <Footer />
        </Router>
    );
}

export default App;
