import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
    return (
        <nav className="bg-blue-600 p-4 text-white">
            <div className="container mx-auto flex justify-between items-center">
                <h1 className="text-xl font-bold">Hospital Management System</h1>
                <div>
                    <Link to="/" className="mr-4">Home</Link>
                    <Link to="/login" className="mr-4">Login</Link>
                    <Link to="/register" className="mr-4">Register</Link>
                    <Link to="/hospital-admin" className="mr-4">Admin Dashboard</Link>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
