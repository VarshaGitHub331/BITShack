import "./App.css";
import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import NavBar from "./components/NavBar/NavBar";
import Footer from "./components/Footer/Footer";
import LandingPage from "./pages/LandingPage/LandingPage";
import UserRegister from "./pages/Register/Regsiter";
import PatientRegister from "./pages/PatientRegister/PatientRegsiter";
import HospitalRegister from "./pages/HospitalRegister/HopsitalRegister";
import ProviderRegister from "./pages/ProviderRegister/ProviderRegsiter";
import CreateTimeSlot from "./pages/CreateTimeSlots/CreateTimeSlots";
import DisplayTimeSlots from "./pages/DisplayTimeSlots/DisplayTimeSlots";
import ViewProviders from "./pages/ViewProviders/ViewProviders";
import BookAppointment from "./pages/BookAppointment/BookAppointment";
import ViewAppointments from "./pages/ViewAppointments/ViewAppointment";
import Dashboard from "./pages/LocationDashboard/LocationDashboard.jsx";
import HospitalMap from "./pages/LocationDashboard/LocateHospital.jsx";
import Login from "./pages/Login/Login.jsx";

function App() {
  const Layout = () => {
    return (
      <div className="flex min-h-screen">
        {/* Main Layout */}
        <div className="flex flex-col flex-grow">
          <NavBar />
          <div className="flex-grow overflow-auto mb-2 p-6 bg-gray-100">
            <Outlet />
          </div>
          <Footer />
        </div>
      </div>
    );
  };

  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      children: [
        { path: "/", element: <LandingPage /> },
        { path: "/register", element: <UserRegister /> },
        { path: "/patientRegister", element: <PatientRegister /> },
        { path: "/hospitalRegister", element: <HospitalRegister /> },
        { path: "/providerRegister", element: <ProviderRegister /> },
        { path: "/create-timeslot", element: <CreateTimeSlot /> },
        { path: "/view-timeslots", element: <DisplayTimeSlots /> },
        { path: "/view-providers", element: <ViewProviders /> },
        { path: "/book-appointment", element: <BookAppointment /> },
        { path: "/viewAppointments", element: <ViewAppointments /> },
        { path: "/locationHelp", element: <Dashboard /> },
        { path: "/hospitalLocation", element: <HospitalMap /> },
        { path: "/login", element: <Login /> },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;
