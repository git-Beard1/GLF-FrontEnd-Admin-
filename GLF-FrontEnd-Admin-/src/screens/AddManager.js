import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/App.css";
import { useNavigate, Link } from "react-router-dom";

const AddManagerScreen = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [typeError, setTypeError] = useState("");
  const [type, setType] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const localhostapi= "http://localhost:5000"
  const serverlessapi = "https://adminilftest-4tmd.onrender.com";
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      let token = localStorage.getItem("token");

      await axios({
        headers: {
          authorization: "Bearer " + token,
        },
        method: "get",
        url: `${serverlessapi}/validateLogin`,
      })
        .then(function (response) {
          console.log(response);
          if (response.data.message == "Unauthorized access") {
            localStorage.clear();
            navigate('/login')
          } else if (response.data.role !== "Admin") {
            navigate("../");
          }
        })
        .catch(function (response) {
          //Handle error
          console.dir(response);
        });
      setLoading(false);
    };

    fetchData();
}, []); 
  const handleAddManager = async () => {
    // Reset previous error messages
    setUsernameError("");
    setPasswordError("");

    try {
      // Input validation
      if (!username.trim()) {
        setUsernameError("Username is required");
        return;
      }

      if (!password.trim()) {
        setPasswordError("Password is required");
        return;
      }

      if (!type) {
        // Assuming type is a string, if it's a number, you might want to use a different check
        setTypeError("Type is required");
        return;
      }

      setLoading(true);

      // Send a POST request to the API to add a new manager
      const response = await axios.post(`${serverlessapi}/register`, {
        username,
        password,
        type,
      });

      console.log("Added Manager:", response.data);

      // Reset the form fields after adding
      setUsername("");
      setPassword("");
      setType("");
    } catch (error) {
      console.error("Error adding manager:", error);
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
        <div className="flex items-center justify-center h-screen">
          <div className="bg-white p-6 rounded-md shadow-md w-96">
            <h1 className="text-2xl font-bold mb-4">Add Manager</h1>

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
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className={`mt-1 p-2 border rounded-md w-full ${
                  usernameError ? "border-red-500" : "border-gray-300"
                }`}
              />
              {usernameError  && (
                <p className="text-red-500 text-xs mt-1">{usernameError }</p>
              )}
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
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`mt-1 p-2 border rounded-md w-full ${
                  passwordError  ? "border-red-500" : "border-gray-300"
                }`}
              />
              {passwordError  && (
                <p className="text-red-500 text-xs mt-1">{passwordError }</p>
              )}
            </div>

            <div className="mb-4">
        <label
          htmlFor="type"
          className="block text-sm font-medium text-gray-600"
        >
          Type
        </label>
        <select
          id="type"
          name="type"
          value={type}
          onChange={(e) => setType(e.target.value)}
          className={`mt-1 p-2 border rounded-md w-full ${
            typeError ? "border-red-500" : "border-gray-300"
          }`}
        >
          <option value="" disabled>
            Select a role
          </option>
          <option value="Event Manager">Event Manager</option>
          <option value="Admin">Admin</option>
        </select>
        {typeError && (
          <p className="text-red-500 text-xs mt-1">{typeError}</p>
        )}
      </div>

            <button
              onClick={handleAddManager}
              className="bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800"
            >
              Add Manager
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddManagerScreen;
