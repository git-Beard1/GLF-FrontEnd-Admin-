import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/App.css";
import { toast, Toaster } from "react-hot-toast";

const AdminLoginScreen = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      setLoading(true);

      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/login`,
        {
          username,
          password,
        }
      );

      // Assuming your server responds with a token upon successful login
      const token = response.data.token;
      localStorage.setItem("token", token);
      localStorage.setItem("username", username);

      setUsername("");
      setPassword("");
      navigate("/");
    } catch (error) {
      console.error("Error logging in:", error);
      if (error.response && error.response.status !== 200) {
        toast.error(error.response.data.message);
        localStorage.clear();
        navigate("/login");
      } else {
        toast.error("An error occurred. Please try again later.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {loading ? (
        <div className="loader-container">
          <div className="spinner"></div>
        </div>
      ) : (
        <div className="flex items-center justify-center h-screen bg-gray-100">
          <div>
            <Toaster position="top-right" reverseOrder={false} />
            <h1 className="text-2xl font-bold mb-4">Admin Login</h1>

            <div className="mb-4">
              <label
                htmlFor="username"
                className="block text-sm font-medium text-gray-600"
              >
                Username
              </label>
              <input
                type="text"
                id="username"
                name="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="mt-1 p-3 border border-gray-300 rounded-full w-full"
              />
            </div>

            <div className="mb-4">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-600"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 p-3 border border-gray-300 rounded-full w-full"
              />
            </div>

            <button
              onClick={handleLogin}
              className="bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-600 focus:outline-none"
            >
              Log In
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminLoginScreen;
