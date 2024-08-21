import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup, Marker } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';
import 'leaflet-routing-machine';
import waterMarker from '../assets/marker/water.png';
import registerMarker from '../assets/marker/register.png';
import conferenceMarker from '../assets/marker/conference.png';
import toiletMarker from '../assets/marker/toilet.png';
import 'leaflet/dist/leaflet.css';
import axios from 'axios';
import polyline from 'polyline';
import starbucks1 from '../assets/marker/starbucks.png'
import mcdonalds from '../assets/marker/mcodnald.png'
import foodcourt from '../assets/marker/foodcourt.png'
import default1 from '../assets/marker/default.png'
import { Cloudinary } from "@cloudinary/url-gen";
import { AdvancedImage, responsive, placeholder } from "@cloudinary/react"; 
import recenterIcon from "../images/Maprecenter.png";

const MapComponent = (props) => {
  const localhostapi = "http://localhost:5000";
  const serverlessapi = "https://adminilftest-4tmd.onrender.com";
  const [userLocation, setUserLocation] = useState(null);
  const [hasLocationPermission, setHasLocationPermission] = useState(true);
  const [isRouting, setIsRouting] = useState(false);
  const [routingControl, setRoutingControl] = useState(null);
  const [markers, setMarkers] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const position = [1.308437408372863, 103.77671290142386];
  const mapRef = useRef();
  const [cloudName] = useState("dxkozpx6g");
  const [uploadPreset] = useState("jcck4okm");
  const [publicId, setPublicId] = useState("");
  const isMobile = window.innerWidth <= 767;
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


  const cld = new Cloudinary({
    cloud: {
      cloudName,
    },
  });

  const myImage = cld.image(publicId);


  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${serverlessapi}/markers`);
        setMarkers(response.data);
        console.log('Refill data:', response.data);
      } catch (error) {
        console.error('Error fetching refill locations:', error);
      }
    };

    fetchData();
  }, []);

  const handleRouteButtonClick = async (coordinates) => {
    if (isRouting) {
      handleStopRouting();
    } else {
      try {
        if (!mapRef.current || !userLocation) {
          console.error('Map or user location not available.');
          return;
        }
        const startCoordinates = `${userLocation[0].toFixed(6)},${userLocation[1].toFixed(6)}`;
        const endCoordinates = `${coordinates[0].toFixed(6)},${coordinates[1].toFixed(6)}`;



        const directionsApiUrl = `${serverlessapi}/api/getDirections?startCoordinates=${startCoordinates}&endCoordinates=${endCoordinates}`;
        // Replace 'your_nodejs_port' with the actual port where your Node.js server is running
  
        const response = await fetch(directionsApiUrl, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
  
        if (!response.ok) {
          console.error('Error fetching directions:', response.status, response.statusText);
          return;
        }
  
        const routeData = await response.json();
  
        if (!routeData.routes || routeData.routes.length === 0) {
          console.error('No route data found in the API response.');
          return;
        }
  
        // Extract the route geometry from routeData
        const overviewPolyline = routeData.routes[0].overview_polyline.points;
  
        // Decode the polyline
        const decodedCoordinates = polyline.decode(overviewPolyline);
  
        // Create an array of LatLng objects
        const routeLatLngs = decodedCoordinates.map(([lat, lng]) => L.latLng(lat, lng));
  
        // Create a polyline and add it to the map
        const routePolyline = L.polyline(routeLatLngs, { color: 'blue' });
        routePolyline.addTo(mapRef.current);
  
        // Continue with the rest of your code for handling the route display
        const mapboxapi1 = process.env.REACT_APP_MAPBOXAPI1
        const mapboxapi2 = process.env.REACT_APP_MAPBOXAPI2
        const mapboxapi3 = process.env.REACT_APP_MAPBOXAPI3
        const mapboxapi = `${mapboxapi1}.${mapboxapi2}.${mapboxapi3}`
        // Your existing code for setting up the Routing control
        const newRoutingControl = L.Routing.control({
          waypoints: [L.latLng(userLocation[0], userLocation[1]), L.latLng(coordinates[0], coordinates[1])],
          router: L.Routing.mapbox(mapboxapi),
          createMarker: function () {},
          routeLine: (route) => routePolyline,
        });
  
        newRoutingControl.addTo(mapRef.current);
        setRoutingControl(newRoutingControl);
        setIsRouting(true);
  
      } catch (error) {
        console.error('Error:', error.message);
      }
    }
  };
  const handleStopRouting = () => {
    if (isRouting && routingControl) {
      mapRef.current.removeControl(routingControl);
      setRoutingControl(null);
      setIsRouting(false);
    }
  };

  const handleFilterClick = (category) => {
    if (selectedCategory === category) {
      setSelectedCategory(null);
    } else {
      setSelectedCategory(category);
    }
  };

  const handleRecenterClick = () => {
    if (mapRef.current ) {
      mapRef.current.setView(userLocation, 16.5);
    }
  };

  const filteredMarkerLocations = markers.filter((markerlocation) => {
    return selectedCategory ? markerlocation.category === selectedCategory : true;
  });

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation([latitude, longitude]);
      },
      (error) => {
        console.error(error);
        setHasLocationPermission(false);
      }
    );
  }, []);


  return (
    
    <div id="map" className="relative ">
      <MapContainer center={position} zoom={16.5} className="w-full h-screen" id="map2" ref={mapRef}  style={{ height: isMobile ? '91vh' : '924px' }}>
        <TileLayer
          url="https://www.onemap.gov.sg/maps/tiles/Default/{z}/{x}/{y}.png"
          attribution='Map data © <a href="https://www.onemap.sg/" target="_blank">OneMap</a'
        />

        {userLocation && (
          <CircleMarker center={userLocation} radius={5} color="red">
            <Popup>User's Location</Popup>
          </CircleMarker>
        )}

        {filteredMarkerLocations.map((markerlocation) => {
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

       

          const coordinates = markerlocation.coordinates.split(',').map((coord) => parseFloat(coord));

          return (
            <Marker key={markerlocation.mapid} position={coordinates} icon={customIcon}>
            <Popup>
              <div id={`divRefill${markerlocation.mapid}`} style={{ maxWidth: '300px', wordWrap: 'break-word' }}>
                <h3 style={{ fontSize: "25px" }} id={`Refill${markerlocation.mapid}`}>{markerlocation.location_name}</h3>
                <div style={{ width: "200px" }}>
                      <AdvancedImage
                        style={{ maxWidth: "100%" }}
                        cldImg={cld.image(publicId || markerlocation.image)}
                        plugins={[responsive(), placeholder()]}
                      />
                    </div>
                <p>{markerlocation.description}</p>
                {hasLocationPermission && (
                  <button
                    id="RefillButton"
                    style={{ maxWidth: '100%', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
                    onClick={() => (isRouting ? handleStopRouting() : handleRouteButtonClick(coordinates))}
                  >
                    {isRouting ? 'Stop Routing' : `Route to ${markerlocation.location_name}`}
                  </button>
                )}
                {!hasLocationPermission && <p>Please enable location services to show the route</p>}
              </div>
            </Popup>
          </Marker>
          );
        })}
      </MapContainer>

      <div className="absolute top-1 right-4 mt-2">
  <button
    className="flex items-center justify-center bg-white text-white rounded-full text-xs w-[2.75rem] h-[2.75rem] md:w-12 md:h-12 border border-gray-950 shadow-lg hover"
    onClick={handleRecenterClick}
  >
    <img
      className="w-4/6 h-auto"
      src={recenterIcon}
      alt="map"
    />
  </button>
</div>

      <div id="buttons-container" className="flex flex-wrap justify-center items-center fixed bottom-4 sm:bottom-10 left-1/2 transform -translate-x-1/2 z-20">
      <button
  className={`filter-button ${selectedCategory === 'water' ? 'active water' : ''} px-3 py-2 mx-1 my-1 bg-blue-500 hover:bg-blue-600 text-white rounded-md text-xs w-[5.5rem] h-12 md:text-sm md:w-40`}
  onClick={() => handleFilterClick('water')}
>
  Water Refill
</button>
<button
  className={`filter-button ${selectedCategory === 'register' ? 'active register' : ''} px-3 py-2 mx-1 my-1 bg-[#B76711] hover:bg-[#9E5A10] text-white rounded-md text-xs w-[5.5rem] h-12 md:text-sm md:w-40`}
  onClick={() => handleFilterClick('register')}
>
  Registration Desks
</button>
<button
  className={`filter-button ${selectedCategory === 'conference' ? 'active conference' : ''} px-3 py-2 mx-1 my-1 bg-[#39B54A] hover:bg-[#1B6B26] text-white rounded-md text-xs w-[5.5rem] h-12 md:text-sm md:w-40`}
  onClick={() => handleFilterClick('conference')}
>
  Convention Centre
</button>
<button
  className={`filter-button ${selectedCategory === 'toilet' ? 'active toilet' : ''} px-3 py-2 mx-1 my-1 bg-red-500 hover:bg-red-600 text-white rounded-md text-xs w-[5.5rem] h-12 md:text-sm md:w-40`}
  onClick={() => handleFilterClick('toilet')}
>
  Restrooms
</button>
      </div>
    </div>
  );
};

export default MapComponent;
