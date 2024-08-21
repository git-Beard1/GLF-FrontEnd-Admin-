import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/App.css";

const Announcement = ({
  announcementid,
  title,
  description,
  announcement_posted,
  announcement_updated,
  onClick,
}) => {
  // Function to limit words in a string
  const limitWords = (str, limit) => {
    const words = str.split(" ");
    return (
      words.slice(0, limit).join(" ") + (words.length > limit ? "..." : "")
    );
  };

  const limitedDescription = limitWords(description, 10);

  return (
    <div
      className="flex-1 block m-2 max-w-sm p-4 md:p-6 bg-white border border-gray-200 rounded-md shadow cursor-pointer transition duration-300 ease-in-out transform hover:scale-105"
      onClick={onClick}
    >
      <h5 className="mb-2 text-xl md:text-2xl font-bold tracking-tight text-black">
        {title}
      </h5>
      <p className="font-normal text-sm md:text-base text-gray-500 mb-4">
        {limitedDescription}
      </p>
      <div className="bg-teal-700 text-white rounded-full py-1 px-2 absolute bottom-2 right-2 h-6 md:h-8">
        <p className="text-xs md:text-sm">
          {announcement_posted === announcement_updated
            ? `${announcement_posted}`
            : `${announcement_updated}`}
        </p>
      </div>
    </div>
  );
};

const AnnouncementList = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(false);
  const localhostapi = "http://localhost:5000";
  const serverlessapi = "https://adminilftest-4tmd.onrender.com";

  const navigate = useNavigate();
  useEffect(() => {
    const fetchAnnouncements = async () => {
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
              navigate("/login");
            }
          })
          .catch(function (response) {
            //Handle error
            console.dir(response);
          });
        const response = await axios.get(`${serverlessapi}/announcements`);
        setAnnouncements(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching announcements:", error);
      }
    };

    fetchAnnouncements();
  }, []);
  const handleEditAnnouncementClick = (id) => {
    setLoading(true);
    navigate(`/editannouncement/${id}`); // Redirect to the specified route
  };

  const handleAddAnnouncementClick = () => {
    setLoading(true);
    navigate("/addannouncement"); // Redirect to the specified route
  };
  const rows = [];
  const cardsPerRow = 3;

  for (let i = 0; i < announcements.length; i += cardsPerRow) {
    const row = announcements.slice(i, i + cardsPerRow);
    rows.push(
      <div
        key={i / cardsPerRow}
        className="sm:flex sm:flex-wrap justify-center"
      >
        {row.map((announcement, index) => (
          <Announcement
            key={index}
            title={announcement.title}
            description={announcement.description}
            announcement_posted={announcement.created_on}
            announcement_updated={announcement.updated_on}
            onClick={() =>
              handleEditAnnouncementClick(announcement.announcementid)
            }
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
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded-md m-2 hover:bg-blue-600"
          onClick={handleAddAnnouncementClick}
        >
          Add Announcement
        </button>
      )}
      {rows}
    </div>
  );
};

export default AnnouncementList;
