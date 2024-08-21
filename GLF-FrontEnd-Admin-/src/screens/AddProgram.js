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

const AddProgramPage = () => {
  const [title, setTitle] = useState("");
  const [image_banner, setImage] = useState(null);
  const [time_start, setTimeStart] = useState("");
  const [time_end, setTimeEnd] = useState("");
  const [location, setLocation] = useState("");
  const [keynote_speaker, setKeynoteSpeaker] = useState("");
  const [description, setDescription] = useState("");
  const [survey_link, setSurveyLink] = useState("");
  const [publicId, setPublicId] = useState("");
  const [cloudName] = useState("dxkozpx6g");
  const [uploadPreset] = useState("jcck4okm");
  const [titleError, setTitleError] = useState("");
  const [timeStartError, setTimeStartError] = useState("");
  const [timeEndError, setTimeEndError] = useState("");
  const [locationError, setLocationError] = useState("");
  const [keynoteSpeakerError, setKeynoteSpeakerError] = useState("");
  const [descriptionError, setDescriptionError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const localhostapi= "http://localhost:5000"
  const serverlessapi = "https://adminilftest-4tmd.onrender.com";


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
  const handleImageUpload = (publicId) => {
    setPublicId(publicId);
  };

  const myImage = cld.image(publicId);

  const handleAddEvent = async () => {
    if (!validateInput()) {
      // If input is not valid, stop the function
      return;
    }

    try {
      setLoading(true);

      const response = await axios.post(`${serverlessapi}/events`, {
        title,
        publicId,
        time_start,
        time_end,
        location,
        keynote_speaker,
        description,
        survey_link,
      });

      console.log("API Response:", response.data);

      // Show success notification
      NotificationManager.success("Important information added successfully");

      // Auto-refresh the page after a short delay (you can adjust the delay as needed)
      setTimeout(() => {
        window.location.replace("/");
      }, 600);
    } catch (error) {
      console.error("Error adding information:", error);
      // Show error notification
      NotificationManager.error("Error adding important information");
    }
  };
  const validateInput = () => {
    let isValid = true;

    if (title.trim() === "") {
      setTitleError("Please enter a title");
      isValid = false;
    } else {
      setTitleError("");
    }

    if (time_start.trim() === "") {
      setTimeStartError("Please choose a start date and time");
      isValid = false;
    } else {
      setTimeStartError("");
    }

    if (time_end.trim() === "") {
      setTimeEndError("Please choose an end date and time");
      isValid = false;
    } else {
      setTimeEndError("");
    }

    if (location.trim() === "") {
      setLocationError("Please enter a location");
      isValid = false;
    } else {
      setLocationError("");
    }

    if (keynote_speaker.trim() === "") {
      setKeynoteSpeakerError("Please enter a keynote speaker");
      isValid = false;
    } else {
      setKeynoteSpeakerError("");
    }

    if (description.trim() === "") {
      setDescriptionError("Please enter a description");
      isValid = false;
    } else {
      setDescriptionError("");
    }

    return isValid;
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

  const handleDescriptionChange = (e) => {
    const inputValue = e.target.value;

    if (inputValue.length <= 1000) {
      setDescription(inputValue);
      setDescriptionError('');
    } else {
      setDescriptionError('Description must be 1000 characters or less');
    }
  };
  return (
    <div>
      {loading ? (
        <div className="loader-container">
          <div className="spinner"></div>
        </div>
      ) : (
        <div className="max-w-2xl mx-auto mt-8 p-4">
          <h1 className="text-2xl font-bold mb-4">Add Program</h1>

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
        value={title}
        className={`mt-1 p-2 w-full border ${
          titleError ? 'border-red-500' : 'border-gray-300'
        } rounded-md`}
        onChange={handleTitleChange}
      />
      {titleError && (
        <p className="text-red-500 text-xs mt-1">{titleError}</p>
      )}
      <p className="text-gray-500 text-xs mt-1">
        Character Limit: { title.length} / 255
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
                cldImg={cld.image(publicId || image_banner)}
                plugins={[responsive(), placeholder()]}
              />
            </div>
          </div>

          <div className="mb-4">
            <label
              htmlFor="timestamp"
              className="block text-sm font-medium text-gray-600"
            >
              Choose Date and Time: Event Start
            </label>

            <input
              type="datetime-local"
              id="startTimestamp"
              name="startTimestamp"
              value={time_start}
              onChange={(e) => setTimeStart(e.target.value)}
              className={`mt-1 p-2 w-full border ${
                timeStartError ? "border-red-500" : "border-gray-300"
              } rounded-md`}
            />
            {timeStartError && (
              <p className="text-red-500 text-xs mt-1">{timeStartError}</p>
            )}
          </div>

          <div className="mb-4">
            <label
              htmlFor="timestamp"
              className="block text-sm font-medium text-gray-600"
            >
              Choose Date and Time: Event End
            </label>
            <input
              type="datetime-local"
              id="endTimestamp"
              name="endTimestamp"
              value={time_end}
              onChange={(e) => setTimeEnd(e.target.value)}
              className={`mt-1 p-2 w-full border ${
                timeEndError ? "border-red-500" : "border-gray-300"
              } rounded-md`}
            />
            {timeEndError && (
              <p className="text-red-500 text-xs mt-1">{timeEndError}</p>
            )}
          </div>

          <div className="mb-4">
            <label
              htmlFor="location"
              className="block text-sm font-medium text-gray-600"
            >
              Location
            </label>
            <input
              type="text"
              id="location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className={`mt-1 p-2 w-full border ${
                locationError ? "border-red-500" : "border-gray-300"
              } rounded-md`}
            />
            {locationError && (
              <p className="text-red-500 text-xs mt-1">{locationError}</p>
            )}
          </div>

          <div className="mb-4">
            <label
              htmlFor="keynoteSpeaker"
              className="block text-sm font-medium text-gray-600"
            >
              Keynote Speaker
            </label>
            <input
              type="text"
              id="keynoteSpeaker"
              value={keynote_speaker}
              onChange={(e) => setKeynoteSpeaker(e.target.value)}
              className={`mt-1 p-2 w-full border ${
                keynoteSpeakerError ? "border-red-500" : "border-gray-300"
              } rounded-md`}
            />
            {keynoteSpeakerError && (
              <p className="text-red-500 text-xs mt-1">{keynoteSpeakerError}</p>
            )}
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
        value={description}
        onChange={handleDescriptionChange}
        className={`mt-1 p-2 w-full border ${
          descriptionError ? 'border-red-500' : 'border-gray-300'
        } rounded-md`}
      ></textarea>
      {descriptionError && (
        <p className="text-red-500 text-xs mt-1">{descriptionError}</p>
      )}
      <p className="text-gray-500 text-xs mt-1">
        Character Limit: {description.length} / 1000
      </p>
    </div>

          <div className="mb-4">
            <label
              htmlFor="surveyLink"
              className="block text-sm font-medium text-gray-600"
            >
              Survey Link
            </label>
            <input
              type="text"
              id="surveyLink"
              className="mt-1 p-2 w-full border rounded-md"
              value={survey_link}
              onChange={(e) => setSurveyLink(e.target.value)}
            />
          </div>

          <button
            type="button"
            className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
            onClick={handleAddEvent}
          >
            Add Event
          </button>
        </div>
      )}
    </div>
  );
};

export default AddProgramPage;
