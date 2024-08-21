import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/App.css";

import { useParams } from "react-router-dom";
import {
  NotificationContainer,
  NotificationManager,
} from "react-notifications";
import "react-notifications/lib/notifications.css";
import CloudinaryUploadWidget from "../components/CloudinaryUpload";
import { AdvancedImage, responsive, placeholder } from "@cloudinary/react";
import { Cloudinary } from "@cloudinary/url-gen";
import { useNavigate } from "react-router-dom";
const EditHelpInformation = () => {
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [description, setDescription] = useState("");
  const [infodata, setInfodata] = useState([]);
  const { helpid } = useParams();
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
            if (response.data.message == "Unauthorized access") {
              localStorage.clear();
              navigate('/login')
            }
          })
          .catch(function (response) {
            //Handle error
            console.dir(response);
          });
        const response = await axios.get(
          `${serverlessapi}/helpinfos/${helpid}`
        );

        // Check if the response data is an array and set infodata accordingly
        if (Array.isArray(response.data)) {
          setInfodata(response.data);
        } else {
          // If the response data is not an array, wrap it in an array
          setInfodata([response.data]);
        }
        setLoading(false);

        const { title, subtitle, description, image } = response.data[0]; // Assuming the data is an array
        setTitle(title);
        setSubtitle(subtitle);
        setDescription(description);
        setPublicId(image);
      } catch (error) {
        console.error("Error fetching information:", error);
      }
    };

    fetchData();
  }, [helpid]);

  const handleEdit = async (e) => {
    e.preventDefault();

    // Validate Title
    if (!title.trim()) {
      setTitleError("Title is required");
      return;
    } else {
      setTitleError("");
    }

    // Validate Subtitle
    if (!subtitle.trim()) {
      setSubtitleError("Subtitle is required");
      return;
    } else {
      setSubtitleError("");
    }

    // Validate Description
    if (!description.trim()) {
      setDescriptionError("Description is required");
      return;
    } else {
      setDescriptionError("");
    }
    try {
      setLoading(true);

      const response = await axios.put(
        `${serverlessapi}/helpinfo/${helpid}`,
        {
          title,
          subtitle,
          description,
          publicId,
        }
      );
      console.log("API Response:", response.data);
        
      // Show success notification
      NotificationManager.success("Information updated successfully");
      navigate('/viewhelp')
    } catch (error) {
      console.error("Error updating information:", error);
      // Show error notification

      NotificationManager.error("Error updating information");
    }
    // setTimeout(() => {
    //   window.location.replace("/viewimportantinfo");
    // }, 900);
  };

  const handleDelete = async () => {
    try {
      const response = await axios.delete(
        `${serverlessapi}/delhelpinfo/${helpid}`
      );
      console.log("API Response:", response.data);

      // Show success notification
      NotificationManager.success("Information deleted successfully");
      navigate('/viewhelp')
    } catch (error) {
      console.error("Error deleting information:", error);
      // Show error notification
      NotificationManager.error("Error deleting information");
    }
    // setTimeout(() => {
    //   window.location.replace("/viewimportantinfo");
    // }, 900);
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

    if (inputValue.length <= 999) {
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
      ) : (
        infodata &&
        infodata.map((infolist, index) => (
          <div className="container mx-auto p-4" key={infolist.id}>
            <h1 className="text-2xl font-bold mb-4">
              Edit Important Information
            </h1>
            <div id="form">
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
                    cldImg={cld.image(publicId)}
                    plugins={[responsive(), placeholder()]}
                  />
                </div>
              </div>
              <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                onClick={handleEdit}
              >
                Edit Information
              </button>
            </div>
            <button
              onClick={handleDelete}
              className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
            >
              Delete Information
            </button>
          </div>
        ))
      )}
      {}
      <NotificationContainer />
    </div>
  );
};

export default EditHelpInformation;
