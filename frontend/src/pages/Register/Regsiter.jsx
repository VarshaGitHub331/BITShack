import { useState } from "react";
import axios from "axios";
import { useAuthContext } from "../../contexts/AuthContext";
import ReactLoading from "react-loading";
import { useSearchParams, useNavigate } from "react-router-dom";
import ClipLoader from "react-spinners/ClipLoader";

export default function UserRegister() {
  const { UserLogin } = useAuthContext();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const SERVER = process.env.REACT_APP_SERVER_URL;
  const [searchParams] = useSearchParams();
  const role = searchParams?.get("role");
  const navigate = useNavigate();

  async function RegisterUser(e) {
    e.preventDefault(); // Prevent default form submission behavior
    try {
      setLoading(true);
      const response = await axios.post(
        `${SERVER}/user/register`,
        {
          email: email,
          password: password,
          role,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log(response);
      UserLogin(response.data.user); // Log in the user
      setLoading(false);
      navigate("/patientRegister"); // Navigate to patient register
    } catch (e) {
      console.error("Registration failed:", e);
      setLoading(false);
    }
  }

  return (
    <>
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div
          className="bg-white px-4 py-6 rounded-lg shadow-md w-full max-w-md mx-4
        md:w-1/4"
        >
          <h2 className="text-md font-bold text-purple-500 text-center mb-6">
            Sign Up
          </h2>
          <form onSubmit={RegisterUser}>
            <div className="w-full h-full flex justify-center items-center">
              {loading && <ClipLoader color="purple" size={20} />}
            </div>
            <div className="mb-8">
              <label
                htmlFor="email"
                className="block text-gray-500 text-sm font-medium mb-2 text-left"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-200 focus:border-purple-200"
                required
              />
            </div>
            <div className="mb-8">
              <label
                htmlFor="password"
                className="block text-gray-500 text-sm font-medium mb-2 text-left"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-200 focus:border-purple-200"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-purple-500 text-white py-2 px-4 rounded-lg hover:bg-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-1"
            >
              Sign Up
            </button>
          </form>
          <p className="text-gray-600 text-sm text-center mt-4">
            Already have an account?{" "}
            <a href="#" className="text-purple-500 hover:underline">
              Sign In
            </a>
          </p>
        </div>
      </div>
    </>
  );
}
