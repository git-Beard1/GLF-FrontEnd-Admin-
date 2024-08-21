import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  NotificationContainer,
  NotificationManager,
} from "react-notifications";
import "react-notifications/lib/notifications.css";
import CloudinaryUploadWidget from "../components/CloudinaryUpload";
import { AdvancedImage, responsive, placeholder } from "@cloudinary/react";
import { Cloudinary } from "@cloudinary/url-gen";
import "../styles/App.css";
import { useNavigate } from "react-router-dom";

const AddImportantInformation = () => {
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [description, setDescription] = useState("");
  const [publicId, setPublicId] = useState("");
  const [cloudName] = useState("dxkozpx6g");
  const [uploadPreset] = useState("jcck4okm");
  const [titleError, setTitleError] = useState("");
  const [subtitleError, setSubtitleError] = useState("");
  const [descriptionError, setDescriptionError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const localhostapi= "http://localhost:5000"
  const serverlessapi = "https://adminilftest-4tmd.onrender.com";
  useEffect(() => {
    const fetchData = async () => {
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
          }
        })
        .catch(function (response) {
          //Handle error
          console.dir(response);
        });
      setLoading(false);
    };
    fetchData();
  });
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

  const handleImageUpload = (publicId) => {
    setPublicId(publicId);
  };
  const myImage = cld.image(publicId);

  const validateInput = () => {
    let isValid = true;

    if (title.trim() === "") {
      setTitleError("Please enter a title");
      isValid = false;
    } else {
      setTitleError("");
    }

    if (subtitle.trim() === "") {
      setSubtitleError("Please enter a subtitle");
      isValid = false;
    } else {
      setSubtitleError("");
    }

    if (description.trim() === "") {
      setDescriptionError("Please enter a description");
      isValid = false;
    } else {
      setDescriptionError("");
    }

    return isValid;
  };

  const handleAdd = async () => {
    if (!validateInput()) {
      // If input is not valid, stop the function
      return;
    }

    try {
      setLoading(true);

      // Send a POST request to your API endpoint to add information
      const response = await axios.post(
        `${serverlessapi}/importantInformation`,
        {
          title,
          subtitle,
          publicId,
          description,
        }
      );

      // Handle the response as needed
      console.log("Added Information:", response.data);
        navigate('/viewimportantinfo')
      // Show success notification
      NotificationManager.success("Important information added successfully");

      // Reset the form fields after adding
      setTitle("");
      setSubtitle("");
      setDescription("");

      // Auto-refresh the page after a short delay (you can adjust the delay as needed)
      // setTimeout(() => {
      //   window.location.replace("/viewimportantinfo");
      // }, 600);
    } catch (error) {
      console.error("Error adding information:", error);
      // Show error notification
      NotificationManager.error("Error adding important information");
    }
  };

  const handleTitleChange = (e) => {
    const inputValue = e.target.value;

    if (inputValue.length <= 255) {
      setTitle(inputValue);
      setTitleError('');
    } else {
      setTitleError('Title must be 255 characters or less');
    }
  };

  const handleSubtitleChange = (e) => {
    const inputValue = e.target.value;

    if (inputValue.length <= 100) {
      setSubtitle(inputValue);
      setSubtitleError('');
    } else {
      setSubtitleError('Subtitle must be 100 characters or less');
    }
  };

  const handleDescriptionChange = (e) => {
    const inputValue = e.target.value;

    if (inputValue.length <= 499) {
      setDescription(inputValue);
      setDescriptionError('');
    } else {
      setDescriptionError('Description must be 499 characters or less');
    }
  };

  return (
    <div>
      {loading ? (
        <div className="loader-container">
          <div className="spinner"></div>
        </div>
      ) : (<div></div>)}
        <div className="container mx-auto p-4">
          <h1 className="text-2xl font-bold mb-4">Add Important Information</h1>

          <div id="form" className="mb-4">
      <label
        htmlFor="title"
        className="block text-sm font-medium text-gray-600"
      >
        Title
      </label>
      <input
        type="text"
        id="title"
        name="title"
        value={title}
        onChange={handleTitleChange}
        className={`mt-1 p-2 border rounded-md w-full ${
          titleError ? 'border-red-500' : 'border-gray-300'
        }`}
      />
      {titleError && (
        <p className="text-red-500 text-xs mt-1">{titleError}</p>
      )}
      <p className="text-gray-500 text-xs mt-1">
        Character Limit: {title.length} / 255
      </p>
    </div>

    <div className="mb-4">
      <label
        htmlFor="subtitle"
        className="block text-sm font-medium text-gray-600"
      >
        Subtitle
      </label>
      <input
        type="text"
        id="subtitle"
        name="subtitle"
        value={subtitle}
        onChange={handleSubtitleChange}
        className={`mt-1 p-2 border rounded-md w-full ${
          subtitleError ? 'border-red-500' : 'border-gray-300'
        }`}
      />
      {subtitleError && (
        <p className="text-red-500 text-xs mt-1">{subtitleError}</p>
      )}
      <p className="text-gray-500 text-xs mt-1">
        Character Limit: { subtitle.length} / 100
      </p>
    </div>

    <div className="mb-4">
      <label
        htmlFor="description"
        className="block text-sm font-medium text-gray-600"
      >
        Description
      </label>
      <textarea
        id="description"
        name="description"
        rows="4"
        value={description}
        onChange={handleDescriptionChange}
        className={`mt-1 p-2 border rounded-md w-full ${
          descriptionError ? 'border-red-500' : 'border-gray-300'
        }`}
      ></textarea>
      {descriptionError && (
        <p className="text-red-500 text-xs mt-1">{descriptionError}</p>
      )}
      <p className="text-gray-500 text-xs mt-1">
        Character Limit: { description.length} / 499
      </p>
    </div>


          <div className="mb-4">
            <label
              htmlFor="cloudinary"
              className="block text-sm font-medium text-gray-600"
            >
              Cloudinary Upload
            </label>
            <CloudinaryUploadWidget
              uwConfig={uwConfig}
              setPublicId={setPublicId}
            />
            <div style={{ width: "400px" }}>
              <AdvancedImage
                style={{ maxWidth: "100%" }}
                cldImg={myImage}
                plugins={[responsive(), placeholder()]}
              />
            </div>
          </div>

          <button
            onClick={handleAdd}
            className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
          >
            Add Information
          </button>
          <NotificationContainer
            style={{ bottom: "0", right: "0", left: "0", top: "auto" }}
          />
        </div>
      
    </div>
  );
};

export default AddImportantInformation;
