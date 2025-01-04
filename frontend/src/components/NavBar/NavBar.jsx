import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuthContext } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
export default function NavBar() {
  const [isOpen, setIsOpen] = useState(false);
  const { userState, UserLogin, UserLogout } = useAuthContext();
  console.log(userState);
  const navigate = useNavigate();
  return (
    <nav className="bg-white text-purple-500">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
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
            <>
              <li
                className="hover:text-purple-500 cursor-pointer"
                onClick={(e) => {
                  navigate("/register");
                }}
              >
                Register
              </li>
              <li className="hover:text-purple-500 cursor-pointer">Sign In</li>
            </>
          )}
          {userState?.user_id && (
            <li
              className="hover:text-purple-500 cursor-pointer"
              onClick={(e) => {
                UserLogout();
                navigate("/");
              }}
            >
              Logout
            </li>
          )}
        </ul>
      </div>
      <hr className="border-t-2 border-gray-400 w-full" />
    </nav>
  );
}
