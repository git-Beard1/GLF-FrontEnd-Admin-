import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import "../styles/App.css";

const Home = ({ title, description, event_posted, eventid }) => {
  const navigate = useNavigate();

  const limitWords = (str, limit) => {
    const words = str.split(" ");
    return (
      words.slice(0, limit).join(" ") + (words.length > limit ? "..." : "")
    );
  };

  const limitedDescription = limitWords(description, 10);

  const handleItemClick = () => {
    navigate(`/editprogram/${eventid}`);
    console.log("eventIdCheck", eventid);
  };

  return (
    <div
      onClick={handleItemClick}
      className="flex-1 block m-2 max-w-sm p-4 md:p-6 bg-white border border-gray-200 rounded-md shadow cursor-pointer transition duration-300 ease-in-out transform hover:scale-105"
    >
      <h5 className="mb-2 text-xl md:text-2xl font-bold tracking-tight text-black">
        {title}
      </h5>
      <p className="font-normal text-sm md:text-base text-gray-500 mb-4">
        {limitedDescription}
      </p>
      <div className="bg-teal-700 text-white rounded-full py-1 px-2 absolute bottom-2 right-2 h-6 md:h-8">
        <p className="text-xs md:text-sm">{event_posted}</p>
        <a href={"editprogram?eventid=" + eventid} />
      </div>
    </div>
  );
};

const EventsList = () => {
  const [events, setEvents] = useState([]);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const localhostapi= "http://localhost:5000"
  const serverlessapi = "https://adminilftest-4tmd.onrender.com";

  useEffect(() => {
    const fetchEvents = async () => {
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
              //window.location.replace("../login");
              navigate('/login')
            }
          })
          .catch(function (response) {
            //Handle error
            console.dir(response);
          });
        const response = await axios.get(`${serverlessapi}/events`);
        setEvents(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };

    fetchEvents();
  }, []);

  const rows = [];
  const cardsPerRow = 4;

  for (let i = 0; i < events.length; i += cardsPerRow) {
    const row = events.slice(i, i + cardsPerRow);
    rows.push(
      <div
        key={i / cardsPerRow}
        className="sm:flex sm:flex-wrap justify-center"
      >
        {row.map((event, index) => (
          <Home
            key={index}
            id={event.eventid}
            title={event.title}
            description={event.description}
            event_posted={event.time_start}
            eventid={event.eventid}
          />
        ))}
      </div>
    );
  }

  return (
    <div>
      {loading ? (
        <div className="loader-container">
          <div className="spinner"></div>
        </div>
      ) : (
        <Link to="/addprogram">
          <button className="bg-green-500 text-white px-4 py-2 rounded-md m-2 hover:bg-green-600">
            Add Event
          </button>
        </Link>
      )}
      {rows}
    </div>
  );
};

export default EventsList;
