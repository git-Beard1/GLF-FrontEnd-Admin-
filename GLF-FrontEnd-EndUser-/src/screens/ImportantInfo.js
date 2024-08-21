import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Cloudinary } from "@cloudinary/url-gen";
import { AdvancedImage, responsive, placeholder } from "@cloudinary/react"; 
import "../styles/App.css";

const ImportantInfoCard = ({ infoid, title, subtitle, description, onClick }) => {
  return (
    <div className='m-1 mx-auto'>
    <div
      key={infoid}
      className='flex-1 p-4 h-40 w-[21.5rem] max-w-sm bg-white border border-gray-200 rounded-md shadow cursor-pointer transition duration-300 ease-in-out transform hover:scale-105'
      onClick={onClick}
    >
      <h5 className='mb-2 text-2xl font-bold tracking-tight text-black'>{title}</h5>
      <p className='text-xs text-gray-500'>{subtitle}</p>
    </div>
  </div>
  );
};

const PopupCard = ({ title, description, image, onClose }) => {
  const [publicId, setPublicId] = useState("");
  const [cloudName] = useState("dxkozpx6g");

  console.log("publicId:", publicId);
  console.log("image:", image);

  const cld = new Cloudinary({
    cloud: {
      cloudName
    }
  });

  return (
    <div className='fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50'>
      <div className='bg-white p-6 border border-gray-200 rounded-md shadow m-4'>
        <h5 className='mb-2 text-2xl font-bold tracking-tight text-black'>{title}</h5>
        {image && (
          <AdvancedImage
            className="object-contain w-96 h-36"
            cldImg={cld.image(publicId || image)}
            plugins={[responsive(), placeholder()]}
          />
        )}
        <div className="flex items-center">
          <p className='text-sm text-gray-500'>{description}</p>
          {/* <button
            onClick={handleCopyToClipboard}
            className='p-2 ml-2 bg-blue-500 text-white w-8 h-8 rounded-md'
          >
            <IoCopyOutline size={18} />
          </button> */}
        </div>
        <button onClick={onClose} className='mt-4 bg-[#4B558A] text-white px-4 py-2 rounded-md hover:bg-[#3A426C] hover:drop-shadow-xl'>
          Close
        </button>
      </div>
    </div>
  );
};

const ImportantInfoList = () => {
  const [importantInformation, setImportantInformation] = useState([]);
  const [selectedInfo, setSelectedInfo] = useState(null);
  const localhostapi = "http://localhost:5000";
  const serverlessapi = "https://adminilftest-4tmd.onrender.com";

  useEffect(() => {
    const fetchImportantInformation = async () => {
      try {
        const response = await axios.get(`${serverlessapi}/importantInformation`);
        const sortedData = response.data.sort((a, b) => a.infoid - b.infoid);
        setImportantInformation(sortedData);
        console.log(response.data);
      } catch (error) {
        console.error('Error fetching announcements:', error);
      }
    };

    fetchImportantInformation();
  }, []);

  const handleCardClick = (info) => {
    setSelectedInfo(info);
  };

  const handlePopupClose = () => {
    setSelectedInfo(null);
  };

  const rows = [];
  const cardsPerRow = 3;

  for (let i = 0; i < importantInformation.length; i += cardsPerRow) {
    const row = importantInformation.slice(i, i + cardsPerRow);
    rows.push(
      <div key={i} className='lg:flex justify-center'>
        {row.map((info, index) => (
          <div key={`${i}-${index}`} className='m-2 flex'>
            <ImportantInfoCard
              {...info}
              onClick={() => handleCardClick(info)}
            />
          </div>
        ))}
      </div>
    );
  }

  return (
    <>
      {rows}
      {selectedInfo && (
        <PopupCard {...selectedInfo} onClose={handlePopupClose} />
      )}
    </>
  );
};

export default ImportantInfoList;
