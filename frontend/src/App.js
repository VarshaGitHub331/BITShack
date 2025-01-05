import "./App.css";
import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import NavBar from "./components/NavBar/NavBar";
import UserRegister from "./pages/Register/Regsiter";
import PatientRegister from "./pages/PatientRegister/PatientRegsiter";
import HospitalRegister from "./pages/HospitalRegister/HopsitalRegister";
import ProviderRegister from "./pages/ProviderRegister/ProviderRegsiter";
import Footer from "./components/Footer/Footer";
function App() {
  const Layout = () => {
    return (
      <div className="flex flex-col min-h-screen">
        {/* Navigation Bar */}
        <NavBar />

        {/* Main Content */}
        <div className="flex-grow">
          <Outlet />
        </div>

        {/* Footer */}
        <Footer />
      </div>
    );
  };

  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      children: [
        {
          path: "/register",
          element: <UserRegister />,
        },
        {
          path: "/patientRegister",
          element: <PatientRegister />,
        },
        {
          path: "/hospitalRegister",
          element: <HospitalRegister />,
        },
        {
          path: "/providerRegister",
          element: <ProviderRegister />,
        },
        {
          path: "/hospitalUserRegister",
          element: <h3>Hospital User</h3>,
        },
      ],
    },
  ]);
  return <RouterProvider router={router} />;
}

export default App;
