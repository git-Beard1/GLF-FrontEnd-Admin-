import React, { useState, useEffect } from 'react';
import axios from 'axios';
import MapDetail from '../components/mapdetail';
import { useParams, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { Cloudinary } from "@cloudinary/url-gen";
import { AdvancedImage, responsive, placeholder } from "@cloudinary/react"; 
import "../styles/App.css";

const ViewEvent = () => {
  const [eventdata, setEventdata] = useState([]);
  const [announcementsData, setAnnouncementsData] = useState([]);
  const [currentCategory, setCurrentCategory] = useState('Information');
  const { eventid } = useParams();
  const navigate = useNavigate();
  const [publicId, setPublicId] = useState("");
  const [cloudName] = useState("dxkozpx6g");
  const [loading, setLoading] = useState(false);

  const cld = new Cloudinary({
    cloud: {
      cloudName
    }
  });

  const handleViewAnnouncementClick = (announcementid) => {
    navigate(`/viewannouncement/${announcementid}`); 
    // console.log('indidcheck', announcementid)
  };

  const limitWords = (str, limit) => {
    const words = str.split(' ');
    return words.slice(0, limit).join(' ') + (words.length > limit ? '...' : '');
  };

  const localhostapi= "http://localhost:5000"
  const serverlessapi = "https://adminilftest-4tmd.onrender.com";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${serverlessapi}/events/${eventid}`);
        setEventdata(response.data);
          
      } catch (error) {
        console.error('Error fetching information:', error);
      }
    };

    fetchData();
  }, [eventid]);

  useEffect(() => {
    const fetchAnnouncementsData = async () => {
      try {
        const response = await axios.get(`${serverlessapi}/eventannouncements/${eventid}`);
        setAnnouncementsData(response.data);
        console.log(response.data);
      } catch (error) {
        console.error('Error fetching information:', error);
      }
    };

    fetchAnnouncementsData();
  }, [eventid]);

  const handleGoBack = () => {
    navigate(-1);
  };

  const FilterBar = () => {
    return (
      <div className="flex justify-center mt-4">
        <button
          className={`mx-2 px-4 py-2 ${
            currentCategory === 'Information' ? 'text-violet-950 transition border-b-2 border-violet-900 shadow-none' : 'shadow-none'
          }`}
          onClick={() => setCurrentCategory('Information')}
        >
          Information
        </button>
        <button
          className={`mx-2 px-4 py-2 ${
            currentCategory === 'Announcements' ? 'text-violet-950 transition border-b-2 border-violet-900 shadow-none' : 'shadow-none'
          }`}
          onClick={() => setCurrentCategory('Announcements')}
        >
          Announcements
        </button>
      </div>
    );
  };

  if (eventdata.length === 0) {
    return <div>Loading...</div>;
  }

  const startDate = new Date(eventdata[0].time_start);
  const endDate = new Date(eventdata[0].time_end);
  // const announcementTime = new Date(announcementsData[0].time_start);

  const formattedStartDate = startDate.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    timeZone: 'Asia/Singapore',
  });

  const formattedEndDate = endDate.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    timeZone: 'Asia/Singapore',
  });

  // const announcementDate = announcementTime.toLocaleDateString('en-US', {
  //   weekday: 'short',
  //   month: 'short',
  //   day: 'numeric',
  //   timeZone: 'Asia/Singapore',
  // });

  const startTime = startDate.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: 'numeric',
    timeZone: 'Asia/Singapore',
  });

  const endTime = endDate.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: 'numeric',
    timeZone: 'Asia/Singapore',
  });

  return (
    <div>
      <div className='mx-auto px-4'>
        <FontAwesomeIcon
          icon={faArrowLeft}
          onClick={handleGoBack}
          className="text-grey hover:text-[#4B558A] cursor-pointer text-2xl"
        />
      </div>

      <FilterBar /> 

      {currentCategory === 'Information' && (
        <div className="container mx-auto p-4">
          {eventdata.map((eventItem, index) => (
            <div key={index}>
              <AdvancedImage
                className="w-full h-72 my-2 object-contain"
                cldImg={cld.image(publicId || eventItem.image_banner)}
                plugins={[responsive(), placeholder()]}
              />
              <h1 className="text-2xl font-bold mb-4">{eventItem.title}</h1>
              <div className="border-b-2 border-violet-900 mb-4"></div>
              <h4 className="text-md font-bold mb-2">Date</h4>
              <p className="mb-3 font-normal text-gray-700">
                {formattedStartDate} at {startTime} - {formattedEndDate} at {endTime}
              </p>
              <h4 className="text-md font-bold mb-2">Location</h4>
              <p className="mb-3 font-normal text-gray-700">{eventItem.location}</p>
              <h4 className="text-md font-bold mb-2">Keynote Speaker</h4>
              <p className="mb-3 font-normal text-gray-700">{eventItem.keynote_speaker}</p>
              <h4 className="text-md font-bold mb-2">Description</h4>
              <p className="mb-3 font-normal text-gray-700">{eventItem.description}</p>
              {eventItem.survey_link && (
              <div className='text-center bg-gray-100 rounded-xl p-4'>
                <h1 className="text-2xl font-bold mb-4">We Need Your Feedback!</h1>
                <p className="mb-4 font-normal">
                  If you have attended this event, your feedback will be much appreciated
                </p>
                <a
                  href={eventItem.survey_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className='text-white bg-[#0077B5] font-medium rounded-md text-sm px-5 py-2.5 hover:bg-[#3A426C] hover:drop-shadow-xl'
                  style={{ textDecoration: 'none', color: 'white' }}
                >
                  Survey
                </a>
              </div>
            )}
            </div>
          ))}
          {/* <MapDetail className="md:h-12 h-8" /> */}
        </div>
      )}

     {currentCategory === 'Announcements' && (
      <div className="container p-2 mx-auto">
        {announcementsData.map((announcementItem, index) => (
          <div key={index}>
            <div
              className='flex-1 block m-2 md:p-6 bg-white border border-gray-200 rounded-md shadow cursor-pointer transition duration-300 ease-in-out transform hover:scale-105'
              onClick={() => handleViewAnnouncementClick(announcementItem.announcementid)}
            >
              <div className="announcement-header bg-[#293262] text-white rounded-t-md mb-2 p-2">
                <h3 className='text-xl md:text-2xl font-bold tracking-tight text-center'>Announcement</h3>
              </div>
              <h5 className='mb-2 text-xl md:text-2xl font-bold tracking-tight text-black px-4 pt-3'>{announcementItem.title}</h5>
              <p className='font-normal text-sm md:text-base text-left text-gray-500 mb-4 px-4 pb-4'>{limitWords(announcementItem.description, 10)}</p>
              <div className='flex justify-end'>
                <div className='bg-teal-700 text-white rounded-full py-1 px-2 absolute bottom-2 right-2 h-6 md:h-8'>
                  <p className='text-xs md:text-sm'>
                    {new Date(announcementItem.created_on).toLocaleDateString('en-US', {
                      weekday: 'short',
                      month: 'short',
                      day: 'numeric',
                      timeZone: 'Asia/Singapore',
                    })}{' '}
                    {new Date(announcementItem.created_on).toLocaleTimeString('en-US', {
                      hour: 'numeric',
                      minute: 'numeric',
                      timeZone: 'Asia/Singapore',
                    })}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    )}
    </div>
  );
};

export default ViewEvent;
