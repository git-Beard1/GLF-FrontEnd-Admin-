import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaPencilAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "../styles/App.css";

const ImportantInfoCard = ({ infoid, title, subtitle, onClick }) => {
  return (
    <div
      className="flex-1 block m-2 max-w-sm p-4 md:p-6 bg-white border border-gray-200 rounded-md shadow cursor-pointer transition duration-300 ease-in-out transform hover:scale-105"
      onClick={onClick}
    >
      <h5 className="mb-2 text-2xl font-bold tracking-tight text-black">
        {title}
      </h5>
      <p className="text-xs text-gray-500">{subtitle}</p>
      <FaPencilAlt className="absolute right-2 top-2 text-gray-500 cursor-pointer" />
      <a href={"editimportantinfo?infoid=" + infoid} />
    </div>
  );
};

const ImportantInfoList = () => {
  const [importantInformation, setImportantInformation] = useState([]);
  const [selectedInfo, setSelectedInfo] = useState(null);
  const navigate = useNavigate(); // Add this line
  const [loading, setLoading] = useState(false);
  const localhostapi = "http://localhost:5000";
  const serverlessapi = "https://adminilftest-4tmd.onrender.com";

  useEffect(() => {
    const fetchImportantInformation = async () => {
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
        const response = await axios.get(
          `${serverlessapi}/importantInformation`
        );
        setImportantInformation(response.data);
        setLoading(false);

        console.log("info", response.data);
      } catch (error) {
        console.error("Error fetching announcements:", error);
      }
    };

    fetchImportantInformation();
  }, []);

  const handleEditInformationClick = (ImportantInfoCard) => {
    navigate(`/editimportantinfo/${ImportantInfoCard}`);
    console.log("indidcheck", ImportantInfoCard.infoid); // Redirect to the specified route
  };

  const handleAddInformationClick = () => {
    navigate("/addimportantinfo"); // Redirect to the specified route
  };

  const rows = [];
  const cardsPerRow = 4;

  for (let i = 0; i < importantInformation.length; i += cardsPerRow) {
    const row = importantInformation.slice(i, i + cardsPerRow);
    rows.push(
      <div
        key={i / cardsPerRow}
        className="sm:flex sm:flex-wrap justify-center"
      >
        {row.map((info, index) => (
          <ImportantInfoCard
            key={index}
            {...info}
            onClick={() => handleEditInformationClick(info.infoid)}
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
          className="bg-blue-500 text-white px-4 py-2 rounded-md mb-4 focus:outline-none hover:bg-blue-600"
          onClick={handleAddInformationClick}
        >
          Add Information
        </button>
      )}

      {rows}
    </div>
  );
};

export default ImportantInfoList;
