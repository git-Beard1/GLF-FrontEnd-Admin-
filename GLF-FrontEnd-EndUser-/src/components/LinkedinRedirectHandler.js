//LinkedinRedirectHandler.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function LinkedInRedirectHandler() {
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const loggedInUserID = localStorage.getItem("loggedInUserID");

  const urlParams = new URLSearchParams(window.location.search);
  const localhostapi = "http://localhost:5000";
  const serverlessapi = "https://adminilftest-4tmd.onrender.com";

  const code = urlParams.get("code");

  //setIsLoading(true);
  const fetchUserData = async (code) => {
    setIsLoading(true);
    try {
      const response = await axios.post(
        `${serverlessapi}/getLinkedInUserData`,
        {
          code: code,
        }
      );
      // Axios automatically parses the JSON response,
      // so you can directly access `response.data`
      const data = response.data;

      // Check if data has the expected properties
      const {
        localizedFirstName,
        localizedHeadline,
        vanityName,
        id,
        localizedLastName,
      } = data;

      const first_name = localizedFirstName;
      const company = localizedHeadline ? localizedHeadline : "";
      const last_name = localizedLastName;
      const linkedinurl = `https://www.linkedin.com/in/${vanityName}`;
      const uid = id;

      if (first_name && company && last_name && linkedinurl && uid) {
        // Check if user with the same UID already exists
        const userExistsResponse = await axios.get(
          `${serverlessapi}/useruid/${uid}`
        );

        console.log("userExistsResponse:", userExistsResponse);

        if (
          userExistsResponse.data !== null &&
          userExistsResponse.data.exists !== null
        ) {
          setUserData(data);
          setIsLoading(false);

          console.log("User exists. Logging data:", data);

          // Store uid in localStorage
          localStorage.setItem("loggedInUserID", uid);
          // Navigate to the edit profile page using the uid from the response
          
          navigate(`/editprofile/${uid}`);
          window.location.reload()
          
        } else {
          // User doesn't exist, insert new user
          const addUserResponse = await axios.post(
            `${serverlessapi}/addlinkedinuser`,
            {
              first_name,
              company,
              last_name,
              linkedinurl,
              uid,
              type: process.env.REACT_APP_TYPE,
            }
          );

          // Post user data to adduser endpoint
          console.log("User added to the database:", addUserResponse.data);
          // Store uid in localStorage
          localStorage.setItem("loggedInUserID", uid);
          // Navigate to the edit profile page using the uid from the response
          navigate(`/editprofile/${uid}`);
          window.location.reload()
          
          
        }
      } else {
        console.error("Missing expected properties in data:", data);
        setIsLoading(false);
      }
      return data;
    } catch (error) {
      console.error("Error fetching data: ", error);
      setError(error); // Assuming setError is a useState setter for handling errors
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // ... (existing code)
    fetchUserData(code)
      .then((data) => {
        console.log(`FetchData: ${JSON.stringify(data)}`);
        // Handle the received credentials (e.g., store them, redirect, etc.)
        // Ensure userData is updated after successful fetch
        setUserData(data);
      })
      .catch((error) => {
        // Handle any errors that occurred during the fetchUserData call
      });
  }, [code]);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <h1>User Data</h1>
      {/* Render your userData here */}
      <pre>{JSON.stringify(userData, null, 2)}</pre>
    </div>
  );
}

export default LinkedInRedirectHandler;
