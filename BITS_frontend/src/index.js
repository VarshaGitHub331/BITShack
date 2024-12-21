import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import "./index.css"; // TailwindCSS styles
import HospitalAdmin from "./pages/HospitalAdmin";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
// import NotFound from "./src/pages/NotFound";

const App = () => {
    return (
        <Router>
            <div className="min-h-screen flex flex-col bg-gray-50">
                <header className="bg-blue-600 text-white py-4 shadow-md">
                    <div className="container">
                        <h1 className="text-2xl font-bold">Hospital Management System</h1>
                    </div>
                </header>
                <main className="flex-1 container mt-4">
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/hospitaladmin" element={<HospitalAdmin />} />
                        {/*<Route path="*" element={<NotFound />} />*/}
                    </Routes>
                </main>
                <footer className="bg-gray-800 text-white text-center py-4">
                    <p>© 2024 Hospital Management System. All rights reserved.</p>
                </footer>
            </div>
        </Router>
    );
};

ReactDOM.render(<App />, document.getElementById("root"));
