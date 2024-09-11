import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { Cloudinary } from "@cloudinary/url-gen";
import { AdvancedImage, responsive, placeholder } from "@cloudinary/react"; 
import "../styles/App.css";

const AnnouncementScreen = () => {
  const [announcementdata, setAnnouncementdata] = useState([]);
  const { announcementid } = useParams();
  const [publicId, setPublicId] = useState("");
  const [cloudName] = useState("dxkozpx6g");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const cld = new Cloudinary({
    cloud: {
      cloudName
    }
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/announcements/${announcementid}`);
        setAnnouncementdata(response.data);
      } catch (error) {
        console.error('Error fetching information:', error);
      }
    };

    fetchData();
  }, [announcementid]);

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div>
      <div className='mx-auto px-4'>
        <FontAwesomeIcon
          icon={faArrowLeft}
          onClick={handleGoBack}
          className="text-grey hover:text-[#4B558A] cursor-pointer text-2xl mb-4"
        />
      </div>
      
        <div className="container mx-auto p-4">
          <h1 className="text-2xl font-bold mb-4">{announcementdata.title}</h1>
          <div className='inline-block bg-teal-700 text-white rounded-full py-1 px-2 right-2 h-6 md:h-8'>
            <p className='text-xs md:text-sm'>
              {announcementdata.created_at === announcementdata.updated_at
                ? `${announcementdata.created_on}`
                : `${announcementdata.updated_on}`}
            </p>
          </div>
          <AdvancedImage
            className={`w-full h-72 my-2 object-contain ${!announcementdata.image && 'hidden'}`}
            cldImg={cld.image(publicId || announcementdata.image)}
            plugins={[responsive(), placeholder()]}
          />
          <p className='text-xs md:text-sm my-4'>{announcementdata.description}</p>
        </div>
      
    </div>
  );
};

export default AnnouncementScreen;
