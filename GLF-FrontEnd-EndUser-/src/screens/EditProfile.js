import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import {
  NotificationContainer,
  NotificationManager,
} from "react-notifications";
import "react-notifications/lib/notifications.css";
import "../styles/App.css";

import CloudinaryUploadWidget from "../components/CloudinaryUpload";
import { Cloudinary } from "@cloudinary/url-gen";
import { AdvancedImage, responsive, placeholder } from "@cloudinary/react";

const EditProfileForm = () => {
  const [user, setUser] = useState({});
  const { uid } = useParams();
  const navigate = useNavigate();
  const localhostapi = "http://localhost:5000";
  const serverlessapi = "https://adminilftest-4tmd.onrender.com";
  const [publicId, setPublicId] = useState("");
  const [cloudName] = useState("dxkozpx6g");
  const [uploadPreset] = useState("jcck4okm");
  const [loading, setLoading] = useState(false);
  const loggedInUserID = localStorage.getItem("loggedInUserID");

  const cld = new Cloudinary({
    cloud: {
      cloudName,
    },
  });
  const uwConfig = {
    cloudName,
    uploadPreset,
    cropping: true,
    multiple: false,
  };
  useEffect(() => {
    if (loggedInUserID !== uid) {
      navigate("/"); // Redirect to home page or show a message indicating unauthorized access
      return;
    }
    const fetchData = async () => {
      try {
        const response = await axios.get(`${serverlessapi}/useruid/${uid}`);
        setUser(response.data);
        setPublicId(response.data.profile_pic || "");
        console.log("profile info", response.data);
      } catch (error) {
        console.error("Error fetching user information:", error);
      }
    };

    fetchData();
  }, [uid, loggedInUserID]);

  const handleChange = (e) => {
    setUser({
      ...user,
      [e.target.name]: e.target.value,
    });
  };

  const isValidLinkedInUrl = (url) => {
    // Check if the LinkedIn URL includes specific characters
    const regex = /^(https?:\/\/)?(www\.)?linkedin\.com\/.*$/;
    return regex.test(url);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log(publicId);
    // Check if the LinkedIn URL is valid
    if (user.linkedinurl && !isValidLinkedInUrl(user.linkedinurl)) {
      // Show error notification for an invalid LinkedIn URL
      NotificationManager.error(
        "Invalid LinkedIn URL. Please check and try again."
      );
      return;
    }

    try {
      // Update user profile with Cloudinary publicId
      await axios.put(`${serverlessapi}/user/${uid}`, {
        ...user,
        publicId,
      });
      // Show success notification
      NotificationManager.success("Changes saved successfully", "",1000);


      
  
      // Redirect after a delay
      setTimeout(() => {
        navigate(`/`);
      }, 2000);
    } catch (error) {
      console.error("Error updating user profile:", error.message);
      // Show error notification
      NotificationManager.error("Error updating user profile");
    }
  };

  const myImage = cld.image(publicId);
  return (
    <div className="container mx-auto p-4 max-w-xl">
      <h1 className="text-xl font-bold mb-4">Complete Your Profile</h1>
      <div id="form" onSubmit={handleSubmit} className="max-w-md">
        <div className="mb-4">
          <label
            htmlFor="username"
            className="block text-sm font-medium text-gray-600"
          >
            Username
          </label>
          <input
            type="text"
            name="username"
            value={
              user.username ||
              `${user.first_name || ""} ${user.last_name || ""}`
            }
            onChange={handleChange}
            readOnly // Make the username field non-editable
            className="mt-1 p-2 border border-gray-300 rounded-md w-full"
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="company"
            className="block text-sm font-medium text-gray-600"
          >
            Company Name
          </label>
          <input
            type="text"
            name="company"
            value={user.company || ""}
            onChange={handleChange}
            className="mt-1 p-2 border border-gray-300 rounded-md w-full"
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="jobtitle"
            className="block text-sm font-medium text-gray-600"
          >
            Job Title
          </label>
          <input
            type="text"
            name="jobtitle"
            value={user.jobtitle || ""}
            onChange={handleChange}
            className="mt-1 p-2 border border-gray-300 rounded-md w-full"
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="linkedinurl"
            className="block text-sm font-medium text-gray-600"
          >
            LinkedIn URL
          </label>
          <input
            type="text"
            name="linkedinurl"
            value={user.linkedinurl || ""}
            onChange={handleChange}
            className="mt-1 p-2 border border-gray-300 rounded-md w-full"
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="cloudinary"
            className="block text-sm font-medium text-gray-600"
          >
            Upload Profile picture
          </label>
          {/* Pass publicId and setPublicId to CloudinaryUploadWidget */}
          <CloudinaryUploadWidget
            uwConfig={uwConfig}
            setPublicId={setPublicId}
            publicId={publicId}
          />
          <div style={{ width: "200px" }}>
            <AdvancedImage
              style={{ maxWidth: "100%" }}
              cldImg={cld.image(publicId)}
              plugins={[responsive(), placeholder()]}
            />
          </div>
        </div>
        <button
          onClick={handleSubmit}
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
        >
          Proceed
        </button>
      </div>
      <NotificationContainer />
    </div>
  );
};

export default EditProfileForm;
