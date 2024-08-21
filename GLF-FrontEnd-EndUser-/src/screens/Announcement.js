import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import "../styles/App.css";

const Announcement = ({ announcementid, title, description, announcement_posted, announcement_updated, onClick }) => {
  const [loading, setLoading] = useState(false);

  // Function to limit words in a string
  const limitWords = (str, limit) => {
    const words = str.split(' ');
    return words.slice(0, limit).join(' ') + (words.length > limit ? '...' : '');
  };

  const limitedDescription = limitWords(description, 10);

  // Date and time formatting
  const startDate = new Date(announcement_posted);
  const formattedDate = startDate.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    timeZone: 'Asia/Singapore',
  });

  const startTime = startDate.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: 'numeric',
    timeZone: 'Asia/Singapore',
  });

  return (
    <>
    <div className='m-2'>
        <div
            className='flex-1 m-auto w-[22.5rem] h-full max-w-sm bg-white border border-gray-200 rounded-md shadow cursor-pointer transition duration-300 ease-in-out transform hover:scale-105'
            onClick={onClick}
        >
            <div className="announcement-header bg-[#293262] text-white rounded-t-md mb-2 p-2">
              <h3 className='text-xl md:text-2xl font-bold tracking-tight text-center'>Announcement</h3>
            </div>
            <h5 className='mb-2 text-xl md:text-2xl font-bold tracking-tight text-black px-4 pt-3'>{title}</h5>
            <p className='font-normal text-sm md:text-base text-gray-500 mb-4 px-4 pb-4 overflow-hidden mb-8'>{limitedDescription}</p>
            <div className='bg-teal-700 text-white rounded-full py-1 px-2 absolute bottom-2 right-2 h-6 md:h-8'>
                <p className='text-xs md:text-sm'>{formattedDate} {startTime}</p>
            </div>
        </div>
    </div>
  </>


  );
};

const AnnouncementList = () => {
  const [announcements, setAnnouncements] = useState([]);
  const navigate = useNavigate();
  const localhostapi= "http://localhost:5000"
  const serverlessapi ="https://adminilftest-4tmd.onrender.com" 

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const response = await axios.get(`${serverlessapi}/announcements`);
        console.log(response)
        setAnnouncements(response.data);
      } catch (error) {
        console.error('Error fetching announcements:', error);
      }
    };

    fetchAnnouncements();
  }, []); 

  const handleViewAnnouncementClick = (announcementid) => {
    navigate(`/viewannouncement/${announcementid}`); 
    console.log('indidcheck', announcementid)
  };
  
  const rows = [];
  const cardsPerRow = 3;

  for (let i = 0; i < announcements.length; i += cardsPerRow) {
    const row = announcements.slice(i, i + cardsPerRow);
    rows.push(
      <div key={i / cardsPerRow} className='sm:flex justify-center'>
        {row.map((announcementItem, index) => (
          <Announcement
            key={index}
            title={announcementItem.title}
            description={announcementItem.description}
            announcement_posted={announcementItem.created_on}
            announcement_updated={announcementItem.updated_on}
            {...announcementItem}
            onClick={ ()=> handleViewAnnouncementClick(announcementItem.announcementid) }
          />
        ))}
      </div>
    );
  }

  return <>{rows}</>;
};

export default AnnouncementList;
