import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuthContext } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { FaBars } from "react-icons/fa";
import Sidebar from "../SideBar/SideBar";

export default function NavBar() {
  const [isOpen, setIsOpen] = useState(false);
  const { userState, UserLogin, UserLogout } = useAuthContext();
  const [openSidebar, setOpenSidebar] = useState(false);
  const [showLinks, setShowLinks] = useState(false);
  console.log(userState);
  const navigate = useNavigate();

  return (
    <>
      <nav className="bg-white text-purple-500">
        <div className="container mx-auto px-6 py-6 flex justify-between items-center">
          {/* Logo */}
          <div className="text-xl font-bold">MediCare</div>

          {/* Desktop Menu */}
          <ul className="flex space-x-6">
            {/* Links visible only on medium screens and above */}
            <Link to="/">
              <li className="hidden md:block hover:text-purple-500 cursor-pointer">
                Home
              </li>
            </Link>
            <li className="hidden md:block hover:text-purple-500 cursor-pointer">
              About
            </li>

            {/* Always visible */}
            {!userState.user_id && (
              <div className="relative">
                <li
                  className="hover:text-purple-500 cursor-pointer"
                  onClick={(e) => {
                    setShowLinks(!showLinks);
                  }}
                >
                  Register
                </li>
                {showLinks && (
                  <ul className="absolute  mt-2  bg-white shadow-md rounded-md p-2 border border-gray-200 text-sm">
                    <li className="hover:text-purple-500 cursor-pointer">
                      <Link to="/register?role=Patient">User</Link>
                    </li>
                    <li className="hover:text-purple-500 cursor-pointer">
                      <Link to="/providerRegister">Provider</Link>
                    </li>
                    <li className="hover:text-purple-500 cursor-pointer">
                      <Link to="/hospitalRegister">Hospital Admin</Link>
                    </li>
                  </ul>
                )}
              </div>
            )}

            {userState?.name && (
              <button
                className="text-md p-2 bg-white text-purple-500 rounded-md hover:bg-purple-300 transition"
                onClick={(e) => setOpenSidebar(!openSidebar)}
              >
                <FaBars />
              </button>
            )}
          </ul>
        </div>
        <hr className="border-t-2 border-gray-300 w-full" />
      </nav>
      {openSidebar && <Sidebar setOpenSidebar={setOpenSidebar} />}
    </>
  );
}
