import React, { useEffect, useState } from "react";
import GoogleButton from "react-google-button";
import LinkedIn from "../components/Linkedin";
import { UserAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import LinkedInLogo from "../images/linkedin.png";
import GoogleLogo from "../images/google.png";

const SignIn = ({ code }) => {
  const { googleSignIn, user } = UserAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const localhostapi = "http://localhost:5000"; // Update with your backend API URL
  const serverlessapi = "https://adminilftest-4tmd.onrender.com";
 
  // Example React component method or useEffect
  const handleLinkedInRedirect = () => {
    const code = new URL(window.location.href).searchParams.get("code");
    if (code) {
      // Send this code to your backend
      fetch(`${serverlessapi}/linkedin/token`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ code }),
      })
        .then((response) => response.json())
        .then((data) => {
          // Handle the data from the backend (e.g., access token)
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    }
  };

  useEffect(() => {
    const handleUserExistence = async () => {
      if (user !== null) {
        const { displayName, uid, userid } = user;

        if (displayName && typeof displayName === "string") {
          const [first_name, last_name] = displayName.split(" ");

          setLoading(true);

          try {
            const response = await axios.get(`${serverlessapi}/useruid/${uid}`);
            if (response.data) {
              console.log(
                "User already exists. Redirecting to home page."
              );
              navigate(`/`);
            } else {
              console.log("User does not exist. Navigating to edit profile page.");
              const userData = {
                first_name,
                last_name,
                company: "",
                uid,
                userid,
                type: process.env.REACT_APP_TYPE,
              };
              console.log("userdata:", userData);
              await axios.post(`${serverlessapi}/adduser`, userData);
              navigate(`/editprofile/${uid}`);
            }
          } catch (error) {
            console.error("Error checking user existence:", error);
            navigate("/");
          } finally {
            setLoading(false);
          }
        } else {
          console.error("User display name is undefined or not a string");
          navigate("/signin");
        }
      }
    };

    handleUserExistence();
  }, [user, navigate, serverlessapi]);

  return (
    <>
      <div className="flex flex-col items-center justify-center mx-4">
        <h1 className="text-center mb-3 text-xl font-bold text-gray-900 md:text-xl mt-4">
          Sign in for a personalised experience!<br/>Log in to save your events for easy access!
        </h1>
        <div className="flex flex-col items-center w-full max-w-sm bg-white border border-gray-200 rounded-lg m-3 shadow outline-dashed outline-2 outline-offset-2 outline-blue-700">
          <h2 className="rounded-tl-lg rounded-tr-lg bg-[#4B558A] w-full text-white p-2 text-center text-xl font-semibold mb-2">
            Recommended!
          </h2>
          <img src={LinkedInLogo} alt="LinkedIn Logo" className="w-1/2 my-2" />
          <p className="flex flex-col items-center text-center text-sm font-normal text-gray-500 my-2">
            Have access to personalized features by signing in with LinkedIn!
          </p>
          <div className="items-start p-4">
            <div className="flex mt-2">
              <span className="text-green-500">
                <FontAwesomeIcon icon={faCheck} className="mr-2" size="xl" />
              </span>
              <p className="flex flex-col text-sm font-normal text-gray-500">
                Automatically connect your LinkedIn profile to Connect with Others.
              </p>
            </div>
            <div className="flex">
              <span className="text-green-500">
                <FontAwesomeIcon icon={faCheck} className="mr-2" size="xl" />
              </span>
              <p className="flex flex-col text-sm font-normal text-gray-500">
                Experience exclusive features such as event saving.
              </p>
            </div>
          </div>
          <div className="flex items-center justify-center mt-3 pb-4">
            <LinkedIn />
          </div>
        </div>

        <p className="flex flex-col items-center text-center text-sm font-normal text-gray-500 m-3">
          or
        </p>

        <div className="flex flex-col items-center w-full max-w-sm bg-white border border-gray-200 rounded-lg shadow sm:p-6 mt-4">
          <img src={GoogleLogo} alt="Google Logo" className="w-1/2 mb-2 mt-4" />
          <p className="flex flex-col items-center text-center text-sm font-normal text-gray-500 my-2">
            Have access to personalized features by signing in with Google!
          </p>
          <div className="items-start p-4">
            <div className="flex mt-2">
              <span className="text-green-500">
                <FontAwesomeIcon icon={faCheck} className="mr-2" size="xl" />
              </span>
              <p className="flex flex-col text-sm font-normal text-gray-500">
                Manually connect your LinkedIn profile to Connect with Others.
              </p>
            </div>
            <div className="flex">
              <span className="text-green-500">
                <FontAwesomeIcon icon={faCheck} className="mr-2" size="xl" />
              </span>
              <p className="flex flex-col text-sm font-normal text-gray-500">
                Experience exclusive features such as event saving.
              </p>
            </div>
          </div>
          <div className="flex items-center justify-center mt-3 pb-4">
            <GoogleButton onClick={googleSignIn} />
          </div>
        </div>
        <div id="disclaimer" className="text-xs text-gray-500 mt-4 p-3 ">
        <p className="font-semibold mb-1">Disclaimer:</p>
        <p>{`Thank you for using the ILF Application. We prioritize your privacy and do not collect personal information from our visitors.`}</p>
      </div>
      </div>
    </>
  );
};

export default SignIn;
