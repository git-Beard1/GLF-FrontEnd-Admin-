import { useState, useEffect } from "react";
import CloudinaryUploadWidget from "../components/CloudinaryUpload";
import { Cloudinary } from "@cloudinary/url-gen";
import { AdvancedImage, responsive, placeholder } from "@cloudinary/react";
import axios from "axios";
import {
  NotificationContainer,
  NotificationManager,
} from "react-notifications";
import "react-notifications/lib/notifications.css";
import { useNavigate } from "react-router-dom";
import "../styles/App.css";

 const AddAnnouncement = () =>{
  const [publicId, setPublicId] = useState("");
  const [cloudName] = useState("dxkozpx6g");
  const [uploadPreset] = useState("jcck4okm");
  const [title, setTitle] = useState("");
  const [event, setEvent] = useState("");
  const [eventlist, setEventlist] = useState([]);
  const [description, setDescription] = useState("");
  const [titleError, setTitleError] = useState("");
  const [descriptionError, setDescriptionError] = useState("");
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const localhostapi= "http://localhost:5000"
  const serverlessapi = "https://adminilftest-4tmd.onrender.com";

  const [uwConfig] = useState({
    cloudName,
    uploadPreset,
    cropping: true, //add a cropping step
    // showAdvancedOptions: true,  //add advanced options (public_id and tag)
    // sources: [ "local", "url"], // restrict the upload sources to URL and local files
    multiple: false, //restrict upload to a single file
    // folder: "user_images", //upload files to the specified folder
    // tags: ["users", "profile"], //add the given tags to the uploaded files
    // context: {alt: "user_uploaded"}, //add the given context data to the uploaded files
    // clientAllowedFormats: ["images"], //restrict uploading to image files only
    // maxImageFileSize: 2000000,  //restrict file size to less than 2MB
    // maxImageWidth: 500, //Scales the image down to a width of 2000 pixels before uploading
    // theme: "purple", //change to a purple theme
  });

  // Create a Cloudinary instance and set your cloud name

  const cld = new Cloudinary({
    cloud: {
      cloudName,
    },
  });

  const myImage = cld.image(publicId);

  useEffect(() => {
    setLoading(true);
    const fetchData = async () => {
      try {
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
          `${serverlessapi}/eventsannouncement`
        );
        setEventlist(response.data);
        setLoading(false);
        setEvent(response.data[0].eventid)
        console.log("Event List", event);
      } catch (error) {
        console.error("Error fetching events", error);
      }
    };

    fetchData();
  }, []);

  const validateInput = () => {
    let isValid = true;

    if (title.trim() === "") {
      setTitleError("Please enter a title");
      isValid = false;
    } else {
      setTitleError("");
    }

    if (description.trim() === "") {
      setDescriptionError("Please enter a description");
      isValid = false;
    } else {
      setDescriptionError("");
    }

    return isValid;
  };

  const handleAdd = async (e) => {
    e.preventDefault(); // Prevent the default form submission behavior
  
    if (!validateInput()) {
      // If input is not valid, stop the function
      return;
    }
  
    try {
      const response = await axios.post(`${serverlessapi}/announcement`, {
        title,
        description,
        publicId,
        event,
      });
      console.log("API Response:", response.data);
      NotificationManager.success("Announcement added successfully", "Success");
      return navigate("/viewannouncements");
    } catch (error) {
      console.error("Error adding announcement:", error);
      NotificationManager.error("Failed to add announcement", "Error");
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

  const handleDescriptionChange = (e) => {
    const inputValue = e.target.value;

    if (inputValue.length <= 255) {
      setDescription(inputValue);
      setDescriptionError('');
    } else {
      setDescriptionError('Description must be 255 characters or less');
    }
  };


  return (
    <div>
      {loading ? (
        <div className="loader-container">
          <div className="spinner"></div>
        </div>
      ) : (
        <div className="container mx-auto p-4">
          <h1 className="text-2xl font-bold mb-4">Add Announcement</h1>
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
        className={`mt-1 p-2 border ${
          titleError ? 'border-red-500' : 'border-gray-300'
        } rounded-md w-full`}
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
        className={`mt-1 p-2 border ${
          descriptionError ? 'border-red-500' : 'border-gray-300'
        } rounded-md w-full`}
      ></textarea>
      {descriptionError && (
        <p className="text-red-500 text-xs mt-1">{descriptionError}</p>
      )}
      <p className="text-gray-500 text-xs mt-1">
        Character Limit: { description.length} / 255
      </p>
    </div>
            <div className="mb-4">
              <label
                htmlFor="eventlist"
                className="block text-sm font-medium text-gray-600"
              >
                Event list
              </label>
              <select
                id="eventlist"
                name="eventlist"
                placeholder="No Event"
                value={event}
     
                onChange={(e) => {
                  console.log('Selected Event:', e.target.value);
                  setEvent(e.target.value);
                }}
                className="mt-1 p-2 border border-gray-300 rounded-md w-full"
              >
                {eventlist.map((eventlisting, index) => (
                  <option key={index} value={eventlisting.eventid}>
                    {eventlisting.title}
                  </option>
                ))}

              </select>
            </div><CloudinaryUploadWidget
            uwConfig={uwConfig}
            setPublicId={setPublicId}
          />
          <div style={{ maxWidth: "400px" }}>
            <label
              htmlFor="imageupload"
              className="block text-sm font-medium text-gray-600"
            >
              Preview Image
            </label>
            <AdvancedImage
              style={{ maxWidth: "100%" }}
              cldImg={myImage}
              plugins={[responsive(), placeholder()]}
            />
          </div>
          
            <button
            onClick={handleAdd}
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
            >
              Add Announcement
            </button>
            </div>
            
      )}<NotificationContainer
            style={{ bottom: "0", right: "0", left: "0", top: "auto" }}
          />
    </div>
  );
};

export default AddAnnouncement;