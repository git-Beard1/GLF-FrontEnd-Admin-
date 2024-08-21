import React, { useState, useEffect, useRef } from "react";
import { MapContainer, TileLayer, Popup, Marker } from "react-leaflet";
import L from "leaflet";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
import "leaflet-routing-machine";
import waterMarker from "../assets/marker/water.png";
import registerMarker from "../assets/marker/register.png";
import conferenceMarker from "../assets/marker/conference.png";
import toiletMarker from "../assets/marker/toilet.png";
import "leaflet/dist/leaflet.css";
import axios from "axios";
import "../styles/map.css";
import "../styles/marker.css";
import "../styles/App.css";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import CloudinaryUploadWidget from "../components/CloudinaryUpload";
import { Cloudinary } from "@cloudinary/url-gen";
import { AdvancedImage, responsive, placeholder } from "@cloudinary/react";
import starbucks1 from '../assets/marker/starbucks.png'
import mcdonalds from '../assets/marker/mcodnald.png'
import foodcourt from '../assets/marker/foodcourt.png'
import default1 from '../assets/marker/default.png'

const AdminMapedit = () => {
  const position = [1.310411032362568, 103.77767848691333];

  const [markers, setMarkers] = useState([]);
  const [location_name, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [locationNameError, setLocationNameError] = useState("");
  const [descriptionError, setDescriptionError] = useState("");
  const [categoryError, setCategoryError] = useState("");
  const { markerid } = useParams();
  console.log("useparams", markerid);
  const navigate = useNavigate(); // Add this line
  const [publicId, setPublicId] = useState("");
  const [cloudName] = useState("dxkozpx6g");
  const [uploadPreset] = useState("jcck4okm");
  const [loading, setLoading] = useState(false);
  const localhostapi= "http://localhost:5000"
  const serverlessapi = "https://adminilftest-4tmd.onrender.com";

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
            if (response.data.message == "Unauthorized access") {
              localStorage.clear();
              navigate('/login')
            }
          })
          .catch(function (response) {
            //Handle error
            console.dir(response);
          });
        console.log("markerid", markerid);
        const response = await axios.get(
          `${serverlessapi}/markerindiv/${markerid}`
        );

        if (Array.isArray(response.data)) {
          setMarkers(response.data);
        } else {
          // If the response data is not an array, wrap it in an array
          setMarkers([response.data]);
        }

        const { location_name, description, category, image } =
          response.data[0]; // Assuming the data is an array
        setLocation(location_name);
        setDescription(description);
        setCategory(category);
        setPublicId(image || "");

        setLoading(false);

        console.log("Refill data:", response.data);
      } catch (error) {
        console.error("Error fetching refill locations:", error);
      }
    };

    fetchData();
  }, [markerid]);

  const mapRef = useRef();

  const cld = new Cloudinary({
    cloud: {
      cloudName,
    },
  });

  const myImage = cld.image(publicId);

  const updatelocation = async () => {
    try {
      // Reset previous error messages
      setLocationNameError("");
      setDescriptionError("");
      setCategoryError("");

      // Input validation
      if (!location_name.trim()) {
        setLocationNameError("Location Name is required");
        return;
      }

      if (!description.trim()) {
        setDescriptionError("Description is required");
        return;
      }

     
      const response = await axios.put(
        `${serverlessapi}/marker/${markerid}`,
        {
          location_name,
          description,
          category,
          publicId,
        }
      );


      console.log("Marker updated:", response.data);

      window.location.reload();
    } catch (error) {
      console.error("Error updating marker:", error);
    }
  };

  const deleteMarker = async () => {
    try {
      const response = await axios.delete(
        `${serverlessapi}/delmarker/${markerid}`
      );
      console.log("API Response:", response.data);
      navigate(`/mapadding`);
    } catch (error) {
      console.error("Error deleting information:", error);
    }
  };

  const handleLocationChange = (e) => {
    const inputValue = e.target.value;

    if (inputValue.length <= 255) {
      setLocation(inputValue);
      setLocationNameError('');
    } else {
      setLocationNameError('Location name must be 255 characters or less');
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
    <div className="admin-map-container">
      {loading ? (
        <div className="loader-container">
          <div className="spinner"></div>
        </div>
      ) : (
        <div></div>
      )}
      <div
        id="markerlist"
        style={{
          width: "50%",
          float: "left",
          marginRight: "10px",
          marginTop: "2%",
        }}
      >
        <MapContainer
          center={position}
          zoom={16}
          style={{ width: "100%", height: "800px" }}
          ref={mapRef}
        >
          <TileLayer
            url="https://www.onemap.gov.sg/maps/tiles/Default/{z}/{x}/{y}.png"
            attribution='Map data © <a href="https://www.onemap.sg/" target="_blank">OneMap</a>'
          />

          {markers.map((markerlocation) => {
            let iconUrl;
            let iconSize;

            switch (markerlocation.category) {
               case 'water':
              iconUrl = waterMarker;
              iconSize = [18, 29];
              break;
            case 'register':
              iconUrl = registerMarker;
              iconSize = [18, 29];
              break;
            case 'conference':
              iconUrl = conferenceMarker;
              iconSize = [18, 29];
              break;
            case 'toilet':
              iconUrl = toiletMarker;
              iconSize = [18, 29];
              break;
            case 'sbux':
              iconUrl = starbucks1;
              iconSize = [30, 29]; // Set different size for 'sbux'
              break;
            case 'mcd':
              iconUrl = mcdonalds;
              iconSize = [30, 29]; // Set different size for 'mcd'
              break;
            case 'fc':
                iconUrl = foodcourt;
                iconSize = [40, 40]; // Set different size for 'mcd'
                break;
            default:
              iconUrl = default1;
              iconSize = [18, 29];
            }

            const customIcon = L.icon({
              iconUrl: iconUrl,
              iconSize: iconSize,
              iconAnchor: [16, 32],
              popupAnchor: [0, -32],
            });

            const coordinates1 = markerlocation.coordinates
              .split(",")
              .map((coord) => parseFloat(coord));
            console.log("Refill Location:", coordinates1);
            return (
              <Marker
                key={markerlocation.markerid}
                position={coordinates1}
                icon={customIcon}
              >
                <Popup>
                  <div id={`divRefill${markerlocation.mapid}`}  style={{ maxWidth: '300px', wordWrap: 'break-word' }}> 
                    <h3 style={{ fontSize: "25px" }} id={`Refill${markerlocation.mapid}`}>
                      {markerlocation.location_name}
                    </h3>
                    <div style={{ width: "300px" }}>
                      <AdvancedImage
                        style={{ maxWidth: "100%" }}
                        cldImg={cld.image(publicId || markerlocation.image)}
                        plugins={[responsive(), placeholder()]}
                      />
                    </div>
                    <p>{markerlocation.description}</p>
                    <button
                      id="RefillButton"
                      style={{ maxWidth: '100%', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
                      
                    >{`Edit marker`}</button>
                  </div>
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>
      </div>
      <div
        id="form"
        style={{ width: "40%", float: "right", marginLeft: "10px" }}
      >
        {markers.map((markerlist) => (
          <div className="container mx-auto p-4" key={markerlist.id}>
            <h1 className="text-2xl font-bold mb-4">Edit Marker</h1>

            <div className="mb-4">
      <label
        htmlFor="Location_name"
        className="block text-sm font-medium text-gray-600"
      >
        Location Name
      </label>
      <input
        type="text"
        id="Location_name"
        name="Location_name"
        value={location_name}
        onChange={handleLocationChange}
        className={`mt-1 p-2 border rounded-md w-full ${
          locationNameError ? 'border-red-500' : 'border-gray-300'
        }`}
      />
      {locationNameError && (
        <p className="text-red-500 text-xs mt-1">{locationNameError}</p>
      )}
      <p className="text-gray-500 text-xs mt-1">
        Character Limit: { location_name.length} / 255
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
        Character Limit: {description.length} / 255
      </p>
    </div>



            <div className="mb-4">
              <label
                htmlFor="location"
                className="block text-sm font-medium text-gray-600"
              >
                Category
              </label>
              <select
                id="location"
                name="location"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className={`mt-1 p-2 border rounded-md w-full ${
                  categoryError ? "border-red-500" : "border-gray-300"
                }`}
              >
                <option value="">Select a location</option>
                <option value="water">Water Refill Station</option>
                <option value="register">Registration Counter</option>
                <option value="conference">Conference Room</option>
                <option value="toilet">Toilet</option>
              </select>
              {categoryError && (
                <p className="text-red-500 text-xs mt-1">{categoryError}</p>
              )}
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

              <div style={{ width: "200px", marginRight: "10px" }}>
                <label
                  htmlFor="cloudinary"
                  className="block text-sm font-medium text-gray-600"
                >
                  Image Preview
                </label>
                <AdvancedImage
                  style={{ maxWidth: "100%" }}
                  cldImg={myImage}
                  plugins={[responsive(), placeholder()]}
                />
              </div>
            </div>

            

            <button
              onClick={updatelocation}
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
            >
              Update Marker
            </button>
            <button
              onClick={deleteMarker}
              className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
            >
              Delete Marker
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminMapedit;
