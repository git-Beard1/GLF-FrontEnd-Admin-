import QRCode from "qrcode.react";
import React, { useEffect, useState } from "react";
import axios from "axios";
import blankprofilepicture from "../images/blank-profile-picture.png";
import { Cloudinary } from "@cloudinary/url-gen";
import { AdvancedImage, responsive, placeholder } from "@cloudinary/react";

const limitCharacters = (str, limit) => {
  return str.length > limit ? str.substring(0, limit) + "..." : str;
};

const QRCodePopupCard = ({ title, qrCodeValue, profilePic, linkedinUrl,jobtitle, company, onClose }) => {
  const [cloudName] = useState("dxkozpx6g");
  const cld = new Cloudinary({
    cloud: {
      cloudName,
    },
  });

  const handleLinkedInClick = () => {
    window.open(linkedinUrl, "_blank");
  };

  return (
    <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 border border-gray-200 rounded-md shadow m-4">
        <h5 className="mb-2 text-2xl font-normal tracking-tight text-black text-center">
          {title}
        </h5>
        {profilePic && (
          <div className="mb-4">
            <AdvancedImage
              className="object-contain w-32 h-32 rounded-full"
              cldImg={cld.image(profilePic)}
              plugins={[responsive(), placeholder()]}
            />
          </div>
        )}
        <div className="mt-6 flex justify-center items-center">
          <QRCode value={qrCodeValue} />
        </div>
        <div className="mt-4 text-center">
    <p className="mb-2">Company: {company}</p> {/* Display the user's company */}
    <p className="mb-4">Job Title: {jobtitle}</p> {/* Display the user's job title */}
    <button
            onClick={handleLinkedInClick}
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
          >
            Visit LinkedIn Profile
          </button>
        </div>
        <button
          onClick={onClose}
          className="mt-6 bg-[#4B558A] text-white px-4 py-2 rounded-md"
        >
          Close
        </button>
      </div>
    </div>
  );
};

const AllUsersList = () => {
  const [userData, setUserData] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const localhostapi = "http://localhost:5000";
  const serverlessapi = "https://adminilftest-4tmd.onrender.com";
  const [cloudName] = useState("dxkozpx6g");
  const cld = new Cloudinary({
    cloud: {
      cloudName,
    },
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`${serverlessapi}/userlist`);
        const sortedUserData = response.data.sort((a, b) => {
          // Move users with LinkedIn URLs to the front
          if (a.linkedinurl && !b.linkedinurl) return -1;
          if (!a.linkedinurl && b.linkedinurl) return 1;
          return 0;
        });
        setUserData(sortedUserData);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []);

  const handleCardClick = (user) => {
    if (user.linkedinurl !== null && user.linkedinurl !== undefined) {
      setSelectedUser(user);
    }
  };

  const handlePopupClose = () => {
    setSelectedUser(null);
  };

  return (
    <div className="max-w-screen-md mx-auto p-6">
      {userData && (
        <div className="flex flex-wrap">
          {userData.map((user, index) => (
            <div
              key={user.id || index}
              className="w-1/2 lg:w-1/2 xl:w-1/3 px-2 mb-4 h-64"
            >
              <div className="bg-white p-4 rounded-lg shadow h-[260px] overflow-hidden">
                {user.profile_pic ? (
                  <AdvancedImage
                    className="object-contain w-24 h-24 rounded-full mx-auto mb-2"
                    cldImg={cld.image(user.profile_pic)}
                    plugins={[responsive(), placeholder()]}
                  />
                ) : (
                  <img
                    className="object-contain w-24 h-24 rounded-full mx-auto mb-2"
                    src={blankprofilepicture}
                    alt={`${user.username || user.first_name || ""} ${
                      user.last_name || ""
                    }`}
                  />
                )}
                <p className="text-center mb-1 font-bold overflow-ellipsis whitespace-nowrap">{`${
                  user.username || user.first_name || ""
                } ${user.last_name || ""}`}</p>
                <p className="text-center mb-1 overflow-ellipsis whitespace-nowrap">{`${
                  limitCharacters(user.company || "", 16)
                }`}</p>
                {user.linkedinurl ? (
                  <div className="flex justify-center">
                    <button
                      className="mt-4 bg-[#4B558A] text-white px-4 py-2 rounded-md hover:bg-[#3A426C] hover:drop-shadow-xl"
                      onClick={() => handleCardClick(user)}
                    >
                      Connect
                    </button>
                  </div>
                ) : (
                  <div className="flex justify-center">
                    <p className="mt-4 bg-gray-400 text-white px-4 py-2 rounded-md">
                      Connect
                    </p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
      {selectedUser && (
          <QRCodePopupCard
          title={`Scan this QR Code to connect with ${
            selectedUser.username || selectedUser.first_name || ""
          } ${selectedUser.last_name || ""}`}
          qrCodeValue={selectedUser.linkedinurl}
          company={selectedUser.company} // Pass the user's company
          jobtitle={selectedUser.jobtitle} // Pass the user's job title
          linkedinUrl={selectedUser.linkedinurl}
          onClose={handlePopupClose}
        />
      )}
    </div>
  );
};

export default AllUsersList;
