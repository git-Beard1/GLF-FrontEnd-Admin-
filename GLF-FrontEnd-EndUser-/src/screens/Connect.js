import React, { useEffect, useState } from "react";
import AllUsersList from "./AllUsersList";
import QRCodeGenerator from "./QrCodeGenerator";
import QRCodeVerifier from "./QrCodeScanner";
import { useParams, useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import "../styles/App.css";
import qrcodeimg from "../assets/qr-code.png";
import scanimg from "../assets/scan.png";
import LinkedIn from "../components/Linkedin";
import LinkedInLogo from "../images/linkedin.png";

const Connect = () => {
  const [userData, setUserData] = useState(null);
  const loggedInUserID = localStorage.getItem("loggedInUserID");
  const [loading] = useState(false);
  const [currentCategory, setCurrentCategory] = useState("All");
  const { userid } = useParams();
  const rows = [];

  const MyQR = ({ loggedInUserID }) => {
    const [showQRCode, setShowQRCode] = useState(false);

    const handleQRButtonClick = () => {
      setShowQRCode(!showQRCode);
    };

    return (
      <div>
        {loggedInUserID !== null && (
          <>
            <a onClick={handleQRButtonClick}>
              <img
                src={qrcodeimg}
                className="object-contain h-12 w-20  md:object-scale-down"
              ></img>
            </a>

            {showQRCode && <QRCodeGenerator uid={loggedInUserID} />}
          </>
        )}
      </div>
    );
  };

  const QRScanner = ({ loggedInUserID }) => {
    return (
      <div>
        {loggedInUserID !== null && (
          <>
            <a>
              <img
                src={scanimg}
                className="object-contain h-12 w-20  md:object-scale-down"
              ></img>
            </a>
          </>
        )}
      </div>
    );
  };

  const UserList = ({ loggedInUserID }) => {
    return (
      <div className="mt-2">
        {loggedInUserID !== null && (
          <>
            <div className="flex flex-col items-center mb-4">
              <h2 className="text-2xl font-bold mb-4">Connect with Others</h2>
              <div className="flex justify-center">
              <button className="mt-4 bg-white text-black shadow-md px-4 py-2 rounded-md hover:drop-shadow-xl flex items-center mr-2">
                <p className="mr-2">Your QR</p>
                <Link to={`/qrcode/${userid}`} className="flex items-center">
                  <MyQR />
                </Link>
              </button>
              <button className="mt-4 bg-white text-black shadow-md px-4 py-2 rounded-md hover:drop-shadow-xl flex items-center">
                <p className="mr-2">Scan QR</p>
                  <Link to="/scan">
                    <QRScanner />
                  </Link>
                </button>
              </div>
            </div>
            <div>
              <AllUsersList />
            </div>
          </>
        )}
      </div>
    );
  };

  return (
    <>
      {loading ? (
        <div className="loader-container">
          <div className="spinner"></div>
        </div>
      ) : (
        <>
          {loggedInUserID === null ? (
            <div className="flex flex-col items-center justify-center mx-4">
            <h1 className="text-center mb-3 text-xl font-bold text-gray-900 md:text-xl mt-4">
            Connect With Others!
            </h1>
            <div className="flex flex-col items-center w-full max-w-sm bg-white border border-gray-200 rounded-lg m-3 shadow">
              <img src={LinkedInLogo} alt="LinkedIn Logo" className="w-1/2 my-2 mt-4" />
              <p className="flex flex-col items-center text-center text-sm font-normal text-gray-500 my-2">
                Network with guest speakers and other attendees of the International Learning Festival!
              </p>
              <div className="flex items-center justify-center mt-3 pb-4">
                <LinkedIn />
              </div>
            </div>
          </div>
          ) : (
            <UserList loggedInUserID={loggedInUserID} />
          )}
        </>
      )}
    </>
  );
};

export default Connect;

// div className="flex items-center justify-center mt-5">
//               <div className="flex flex-col items-center w-full max-w-sm p-4 bg-white border border-gray-200 rounded-lg shadow sm:p-6">
//                 <h5 className="mb-3 text-xl font-semibold text-gray-900 md:text-xl">
//                   Connect With Others
//                 </h5>
//                 <p className="flex flex-col items-center text-center text-sm font-normal text-gray-500">
//                   Network with guest speakers and other attendees of the
//                   International Learning Festival!
//                 </p>
//                 <div className="flex items-center justify-center mt-3">
//                   <LinkedIn></LinkedIn>
//                 </div>
//               </div>
//             </div>