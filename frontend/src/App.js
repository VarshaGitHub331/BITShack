import "./App.css";
import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import NavBar from "./components/NavBar/NavBar";
import UserRegister from "./pages/Register/Regsiter";
import PatientRegister from "./pages/PatientRegister/PatientRegsiter";

function App() {
  const Layout = () => {
    return (
      <div className="App">
        <NavBar />
        <Outlet />
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
          element: <h3>Hospital</h3>,
        },
        {
          path: "/providerRegsiter",
          element: <h3>Provider</h3>,
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
