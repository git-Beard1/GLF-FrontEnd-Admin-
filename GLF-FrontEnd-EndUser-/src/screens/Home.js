import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { IoBookmark, IoBookmarkOutline } from "react-icons/io5";
import { Cloudinary } from "@cloudinary/url-gen";
import { AdvancedImage, responsive, placeholder } from "@cloudinary/react";
import "../styles/App.css";
import GoogleButton from "react-google-button";
import { UserAuth } from "../context/AuthContext";
import LinkedIn from "../components/Linkedin";
import LinkedInLogo from "../images/linkedin.png";
import GoogleLogo from "../images/google.png";


const Home = ({
  eventid,
  title,
  description,
  image,
  formattedDate,
  location,
  startTime,
  endTime,
  onClick,
  isEventPassed
}) => {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [publicId, setPublicId] = useState("");
  const [cloudName] = useState("dxkozpx6g");
  const [bookmarkedEvents, setBookmarkedEvents] = useState([]);
  const localhostapi = "http://localhost:5000";
  const serverlessapi = "https://adminilftest-4tmd.onrender.com";
  const loggedInUserID = localStorage.getItem("loggedInUserID");
  const navigate = useNavigate();

  const cld = new Cloudinary({
    cloud: {
      cloudName,
    },
  });

  useEffect(() => {
    const fetchBookmarkedEvents = async () => {
      try {
        if (loggedInUserID !== null) {
          const response = await axios.get(
            `${serverlessapi}/saveevents/${loggedInUserID}`
          );
          setBookmarkedEvents(response.data.rows);

          const isEventBookmarked = response.data.rows.some(
            (savedEvent) => savedEvent.eventid === eventid
          );
          setIsBookmarked(isEventBookmarked);
        } else {
          setIsBookmarked(false);
        }
      } catch (error) {
        console.error("Error fetching bookmarked events:", error);
      }
    };

    fetchBookmarkedEvents();
  }, [eventid, loggedInUserID]);

  const saveevent = async (e) => {
    if (loggedInUserID !== null) {
      e.stopPropagation();

      try {
        const response = await axios.post(`${serverlessapi}/saveevent`, {
          uid: loggedInUserID,
          eventid: eventid,
        });

        setIsBookmarked(true);
      } catch (error) {
        console.error("Error adding event:", error);
        alert("please login");
      }
    }
  };

  const deletesave = async (eventid, e) => {
    e.stopPropagation();

    try {
      const response = await axios.delete(
        `${serverlessapi}/delevent/${loggedInUserID}`,
        {
          data: { eventid: eventid },
        }
      );
      setIsBookmarked(false);
    } catch (error) {
      console.error("Error deleting event:", error);
    }
  };

  const limitWords = (str, limit) => {
    const words = str.split(" ");
    return (
      words.slice(0, limit).join(" ") + (words.length > limit ? "..." : "")
    );
  };

  const limitedDescription = limitWords(description, 5);
   // Convert the formattedDate string to a Date object
   const eventDate = new Date(formattedDate);

  
 
   return (
     <>
       <div className="m-2">
        <div
          className={`relative h-full mx-auto max-w-sm bg-white border border-gray-200 rounded-md shadow cursor-pointer transition duration-300 ease-in-out ${
            isEventPassed ? "filter grayscale opacity-50" : "hover:scale-105"
          }`}
          onClick={onClick}
        >
           <AdvancedImage
             className="rounded-t-md object-contain w-96 h-36"
             cldImg={cld.image(publicId || image)}
             plugins={[responsive(), placeholder()]}
           />
           <div className="p-3">
             <div className="flex justify-between items-center">
               <h5 className="mb-2 text-2xl font-bold text-gray-900">
                 {title}
               </h5>
               {loggedInUserID !== null && (
                 <div className="flex flex-col items-end">
                   {isBookmarked ? (
                     <IoBookmark
                       onClick={(e) => deletesave(eventid, e)}
                       size={24}
                       color="#293262"
                       className="ml-2"
                     />
                   ) : (
                     <IoBookmarkOutline
                       onClick={saveevent}
                       size={24}
                       color="#293262"
                       className="ml-2"
                     />
                   )}
                 </div>
               )}
             </div>
             <p className="mb-3 font-normal text-gray-700 underline underline-offset-4">
               {limitedDescription}
             </p>
             <div className="flex justify-end">
               <div className="bg-[#9a4c68] text-white rounded-full mr-0.5 py-1 md:py-1.5 px-2.5 h-6 sm:h-10 lg:h-8">
                 <p className="text-xs md:text-sm">At {location}</p>
               </div>
               <div className="bg-[#293262] text-white rounded-full mr-0.5 py-1 md:py-1.5 px-2.5 h-6 sm:h-10 lg:h-8">
                 <p className="text-xs md:text-sm">{formattedDate}</p>
               </div>
               <div className="bg-[#487572] text-white rounded-full py-1 md:py-1.5 px-2.5 h-6 sm:h-10 lg:h-8">
                 <p className="text-xs md:text-sm">
                   {startTime} - {endTime}
                 </p>
               </div>
             </div>
             <a href={"viewevent?eventid=" + eventid} />
           </div>
         </div>
       </div>
     </>
   );
 };

 const FilterBar = ({ currentCategory, setCurrentCategory }) => {
  return (
    <div className="overflow-x-auto">
    <div className="flex justify-start md:justify-center space-x-2 mt-4 ml-4">
      <div className="flex-shrink-0 flex-grow-0 flex-no-shrink max-w-xs">
        <button
          className={`mx-1 px-2 py-1 text-sm ${
            currentCategory === "All"
              ? "text-violet-950 transition border-b-2 border-violet-900 shadow-none"
              : "shadow-none"
          }`}
          onClick={() => setCurrentCategory("All")}
        >
          All
        </button>
      </div>
      <div className="border-l border-gray-300 h-auto"></div>
      <div className="flex-shrink-0 flex-grow-0 flex-no-shrink max-w-xs">
        <button
          className={`mx-1 px-2 py-1 text-sm ${
            currentCategory === "Ongoing"
              ? "text-violet-950 transition border-b-2 border-violet-900 shadow-none"
              : "shadow-none"
          }`}
          onClick={() => setCurrentCategory("Ongoing")}
        >
          Ongoing
        </button>
      </div>
      <div className="border-l border-gray-300 h-auto"></div>
      <div className="flex-shrink-0 flex-grow-0 flex-no-shrink max-w-xs">
        <button
          className={`mx-1 px-2 py-1 text-sm ${
            currentCategory === "Saved"
              ? "text-violet-950 transition border-b-2 border-violet-900 shadow-none"
              : "shadow-none"
          }`}
          onClick={() => setCurrentCategory("Saved")}
        >
          <span className="text-sm">Saved</span>
        </button>
      </div>
      <div className="border-l border-gray-300 h-auto"></div>
      <div className="flex-shrink-0 flex-grow-0 flex-no-shrink max-w-xs">
        <button
          className={`mx-1 px-2 py-1 text-sm ${
            currentCategory === "24 Sep"
              ? "text-violet-950 transition border-b-2 border-violet-900 shadow-none"
              : "shadow-none"
          }`}
          onClick={() => setCurrentCategory("24 Sep")}
        >
          <span className="text-sm">24 Sep</span>
        </button>
      </div>
      <div className="border-l border-gray-300 h-auto"></div>
      <div className="flex-shrink-0 flex-grow-0 flex-no-shrink max-w-xs">
        <button
          className={`mx-1 px-2 py-1 text-sm ${
            currentCategory === "25 Sep"
              ? "text-violet-950 transition border-b-2 border-violet-900 shadow-none"
              : "shadow-none"
          }`}
          onClick={() => setCurrentCategory("25 Sep")}
        >
          <span className="text-sm">25 Sep</span>
        </button>
      </div>
      <div className="border-l border-gray-300 h-auto"></div>
      <div className="flex-shrink-0 flex-grow-0 flex-no-shrink max-w-xs">
        <button
          className={`mx-1 px-2 py-1 text-sm ${
            currentCategory === "26 Sep"
              ? "text-violet-950 transition border-b-2 border-violet-900 shadow-none"
              : "shadow-none"
          }`}
          onClick={() => setCurrentCategory("26 Sep")}
        >
          <span className="text-sm">26 Sep</span>
        </button>
      </div>
      <div className="border-l border-gray-300 h-auto"></div>
      <div className="flex-shrink-0 flex-grow-0 flex-no-shrink max-w-xs">
        <button
          className={`mx-1 px-2 py-1 text-sm ${
            currentCategory === "27 Sep"
              ? "text-violet-950 transition border-b-2 border-violet-900 shadow-none"
              : "shadow-none"
          }`}
          onClick={() => setCurrentCategory("27 Sep")}
        >
          <span className="text-sm">27 Sep</span>
        </button>
      </div>
    </div>
    </div>
  );
};



const EventsList = () => {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [savedEvents, setSavedEvents] = useState([]);
  const [currentCategory, setCurrentCategory] = useState("All");
  const { googleSignIn, user } = UserAuth();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const localhostapi = "http://localhost:5000";
  const serverlessapi = "https://adminilftest-4tmd.onrender.com";

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);

        const response = await axios.get(`${serverlessapi}/events`);
        setEvents(response.data);

        // Filter events based on the current category
        let filtered = [];
        if (currentCategory === "Ongoing") {
          // Filter ongoing events
          const currentDate = new Date().toISOString();
          filtered = response.data.filter((eventItem) => {
            const startTime = new Date(eventItem.time_start);
            const endTime = new Date(eventItem.time_end);
            const currentTime = new Date(currentDate);
            return startTime <= currentTime && currentTime <= endTime;
          });
        } else if (currentCategory === "Saved") {
          // Filter saved events
          const loggedInUserID = localStorage.getItem("loggedInUserID");
          if (loggedInUserID) {
            const savedResponse = await axios.get(
              `${serverlessapi}/saveevents/${loggedInUserID}`
            );
            const savedEventIds = savedResponse.data.rows.map(
              (savedEvent) => savedEvent.eventid
            );
            filtered = response.data.filter((eventItem) =>
              savedEventIds.includes(eventItem.eventid)
            );
          }
        } else if (
          currentCategory === "24 Sep" ||
          currentCategory === "25 Sep" ||
          currentCategory === "26 Sep" ||
          currentCategory === "27 Sep"
        ) {
          // Filter events based on the selected date
          const selectedDate = new Date(currentCategory + " 2024"); // Adjust the year as needed
          filtered = response.data.filter((eventItem) => {
            const eventDate = new Date(eventItem.time_start);
            return eventDate.toDateString() === selectedDate.toDateString();
          });
        } else {
          // All events
          filtered = response.data;
        }

        // Sort events - greyed out cards for events that have passed are displayed at the bottom
filtered.sort((a, b) => {
  const startDateA = new Date(a.time_start);
  const endDateA = new Date(a.time_end);
  const startDateB = new Date(b.time_start);
  const endDateB = new Date(b.time_end);
  const currentDate = new Date();

  // Check if both start and end times of the events are before the current time
  const isEventPassedA = endDateA < currentDate;
  const isEventPassedB = endDateB < currentDate;

  // Sort events based on whether both events have passed or not
  if (isEventPassedA && !isEventPassedB) return 1; // Event A has passed, so it should come after Event B
  if (!isEventPassedA && isEventPassedB) return -1; // Event B has passed, so it should come after Event A
  return 0; // Otherwise, maintain the original order
});


        setFilteredEvents(filtered);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching events:", error);
        setLoading(false);
      }
    };

    fetchEvents();
  }, [currentCategory]);

  const rows = [];
  const cardsPerRow = 3;

  for (let i = 0; i < filteredEvents.length; i += cardsPerRow) {
    const row = filteredEvents.slice(i, i + cardsPerRow);

    rows.push(
      <div key={i / cardsPerRow} className="sm:flex justify-center">
        {row.map((eventItem, index) => {
          const startDate = new Date(eventItem.time_start);
          const formattedDate = startDate.toLocaleDateString("en-US", {
            weekday: "short",
            month: "short",
            day: "numeric",
            timeZone: "Asia/Singapore",
          });

          const startTime = startDate.toLocaleTimeString("en-US", {
            hour: "numeric",
            minute: "numeric",
            timeZone: "Asia/Singapore",
          });

          const endDate = new Date(eventItem.time_end);
          const endTime = endDate.toLocaleTimeString("en-US", {
            hour: "numeric",
            minute: "numeric",
            timeZone: "Asia/Singapore",
          });

          // Check if the event date has passed the current date
          const eventEndDate = new Date(eventItem.time_end);
          const isEventPassed = eventEndDate < new Date();

          return (
            <Home
              key={index}
              title={eventItem.title}
              description={eventItem.description}
              image={eventItem.image_banner}
              event_start={eventItem.time_start}
              event_end={eventItem.time_end}
              formattedDate={formattedDate}
              startTime={startTime}
              endTime={endTime}
              {...eventItem}
              isEventPassed={isEventPassed}
              onClick={() => handleViewEventClick(eventItem.eventid)}
            />
          );
        })}
      </div>
    );
  }
  const handleViewEventClick = (eventid) => {
    navigate(`/viewevent/${eventid}`);
  };

  const loggedInUserID = localStorage.getItem("loggedInUserID");
  return (
    <>
      <FilterBar
        currentCategory={currentCategory}
        setCurrentCategory={setCurrentCategory}
      />
       <div className="mt-4">
      {loading ? (
        <div className="loader-container">
          <div className="spinner"></div>
        </div>
      ) : (
        <>
          {loggedInUserID === null && currentCategory === "Saved" ? (
            <div className="flex flex-col items-center justify-center mx-4">
            <h1 className="text-center mb-3 text-xl font-bold text-gray-900 md:text-xl mt-4">
              Save Your Favourite Event!
            </h1>
            <div className="flex flex-col items-center w-full max-w-sm bg-white border border-gray-200 rounded-lg m-3 shadow outline-dashed outline-2 outline-offset-2 outline-blue-700">
              <h2 className="rounded-tl-lg rounded-tr-lg bg-[#4B558A] w-full text-white p-2 text-center text-xl font-semibold mb-2">
                Recommended!
              </h2>
              <img src={LinkedInLogo} alt="LinkedIn Logo" className="w-1/2 mb-2 mt-4" />
              <p className="flex flex-col items-center text-center text-sm font-normal text-gray-500 my-2 p-4">
                  Sign in to effortlessly save and track the events that you are interested in with LinkedIn!
              </p>
              <div className="flex items-center justify-center mt-3 pb-4">
                <LinkedIn />
              </div>
            </div>
    
            <p className="flex flex-col items-center text-center text-sm font-normal text-gray-500 m-3">
              or
            </p>
    
            <div className="flex flex-col items-center w-full max-w-sm p-4 bg-white border border-gray-200 rounded-lg shadow sm:p-6 mt-4">
              <img src={GoogleLogo} alt="Google Logo" className="w-1/2 mb-2 mt-4" />
              <p className="flex flex-col items-center text-center text-sm font-normal text-gray-500 my-2">
                Sign in to effortlessly save and track the events that you are interested in with Google!
              </p>
              <div className="flex items-center justify-center mt-3">
                <GoogleButton onClick={googleSignIn} />
              </div>
            </div>
          </div>
          ) : (
            rows
          )}
        </>
      )}
      </div>
    </>
  );
};

export default EventsList;

{/* <div className="flex items-center justify-center mt-5">
              <div className="flex flex-col items-center w-full max-w-sm p-4 bg-white border border-gray-200 rounded-lg shadow sm:p-6 ">
                <h5 className="mb-3 text-xl font-semibold text-gray-900 md:text-xl">
                  Save Your Favourite Event!
                </h5>
                <p className="flex flex-col items-center text-center text-md font-normal text-gray-500">
                  Log in to effortlessly save and track the events that you are
                  interested in.
                </p>
                <div className="flex items-center justify-center mt-3">
                  <GoogleButton onClick={googleSignIn} />
                </div>
              </div>
            </div> */}