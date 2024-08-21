import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import {
  NotificationContainer,
  NotificationManager,
} from "react-notifications";
import "react-notifications/lib/notifications.css";
import CloudinaryUploadWidget from "../components/CloudinaryUpload";
import { Cloudinary } from "@cloudinary/url-gen";
import { AdvancedImage, responsive, placeholder } from "@cloudinary/react";
import "../styles/App.css";
import { useNavigate } from "react-router-dom";
const EditProgram = () => {
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [image_banner, setImageBanner] = useState("");
  const [image, setImage] = useState(null);
  const [time_start, setTimeStart] = useState("");
  const [time_end, setTimeEnd] = useState("");
  const [location, setLocation] = useState("");
  const [keynote_speaker, setKeynoteSpeaker] = useState("");
  const [description, setDescription] = useState("");
  const [survey_link, setSurveyLink] = useState("");
  const [programData, setProgramData] = useState([]);
  const { eventid } = useParams();
  const [publicId, setPublicId] = useState("");
  const [cloudName] = useState("dxkozpx6g");
  const [uploadPreset] = useState("jcck4okm");
  const [titleError, setTitleError] = useState("");
  const [timeStartError, setTimeStartError] = useState("");
  const [timeEndError, setTimeEndError] = useState("");
  const [locationError, setLocationError] = useState("");
  const [keynoteSpeakerError, setKeynoteSpeakerError] = useState("");
  const [descriptionError, setDescriptionError] = useState("");
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
      try {
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
            if (response.data.message === "Unauthorized access") {
              localStorage.clear();
              navigate('/login')
            }
          })
          .catch(function (response) {
            //Handle error
            console.dir(response);
          });

        const response = await axios.get(
          `${serverlessapi}/events/${eventid}`
        );

        // Check if the response data is an array and set programData accordingly
        if (Array.isArray(response.data)) {
          setProgramData(response.data);
        } else {
          // If the response data is not an array, wrap it in an array
          setProgramData([response.data]);
        }

        const data = response.data[0];
        console.log("Response Data:", data);
        setTitle(data.title);
        setPublicId(data.image_banner || "");
        setTimeStart(data.time_start);
        setTimeEnd(data.time_end);
        setLocation(data.location);
        setKeynoteSpeaker(data.keynote_speaker);
        setDescription(data.description);
        setSurveyLink(data.survey_link);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching program information:", error);
      }
    };

    fetchData();
  }, [eventid]);

  const handleImageUpload = (publicId) => {
    setPublicId(publicId);
  };

  const myImage = cld.image(publicId);

  const handleEdit = async () => {
    if (!validateInput()) {
      // If input is not valid, stop the function
      return;
    }
    try {
      setLoading(true);

      const response = await axios.put(
        `${serverlessapi}/events/${eventid}`,
        {
          title,
          publicId,
          time_start,
          time_end,
          location,
          keynote_speaker,
          description,
          survey_link,
        }
      );
      console.log("API Response:", response.data);

      // Show success notification
      NotificationManager.success("Information updated successfully");
    } catch (error) {
      console.error("Error updating information:", error);
      // Show error notification
      NotificationManager.error("Error updating information");
    }
    setTimeout(() => {
      window.location.replace("/");
    }, 900);
  };

  const handleDelete = async () => {
    try {
      const response = await axios.delete(
        `${serverlessapi}/deleteevent/${eventid}`
      );
      console.log("API Response:", response.data);

      // Show success notification
      NotificationManager.success("Information deleted successfully");
    } catch (error) {
      console.error("Error deleting information:", error);
      // Show error notification
      NotificationManager.error("Error deleting information");
    }
    setTimeout(() => {
      window.location.replace("/");
    }, 900);
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
        programData &&
        programData.map((programData, index) => (
          <div className="container mx-auto p-4" key={programData.id}>
            <div id="form" onSubmit={handleEdit}>
              {/* Title */}
              <div className="mb-4">
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
        placeholder={programData.title}
        value={title}
        onChange={handleTitleChange}
        className={`mt-1 p-2 w-full border ${
          titleError ? 'border-red-500' : 'border-gray-300'
        } rounded-md`}
      />
      {titleError && (
        <p className="text-red-500 text-xs mt-1">{titleError}</p>
      )}
      <p className="text-gray-500 text-xs mt-1">
        Character Limit: {  title.length} / 255
      </p>
    </div>
              <div>
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
                    cldImg={cld.image(publicId || programData.image_banner)}
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
                  value={time_start || programData.time_start}
                  placeholder={programData.time_start}
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
                  value={time_end || programData.time_end}
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
                  placeholder={programData.location}
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className={`mt-1 p-2 w-full border ${
                    locationError ? "border-red-500" : "border-gray-300"
                  } rounded-md`}
                ></input>
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
                  placeholder={programData.keynote_speaker}
                  value={keynote_speaker}
                  onChange={(e) => setKeynoteSpeaker(e.target.value)}
                  className={`mt-1 p-2 w-full border ${
                    keynoteSpeakerError ? "border-red-500" : "border-gray-300"
                  } rounded-md`}
                />
                {keynoteSpeakerError && (
                  <p className="text-red-500 text-xs mt-1">
                    {keynoteSpeakerError}
                  </p>
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
        placeholder={programData.description}
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
        Character Limit: { description.length} / 1000
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
                  placeholder={programData.survey_link}
                  value={survey_link}
                  onChange={(e) => setSurveyLink(e.target.value)}
                />
              </div>

              <button
                onClick={handleEdit}
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
              >
                Edit Events
              </button>
            </div>
            <button
              onClick={handleDelete}
              className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
            >
              Delete Events
            </button>
            <NotificationContainer />
          </div>
        ))
      )}
    </div>
  );
};

export default EditProgram;
