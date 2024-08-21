import React, { useState, useEffect } from "react";
import {
  AiOutlineClose,
  AiOutlineMenu,
  AiOutlineInfoCircle,
} from "react-icons/ai";
import { Link , useNavigate} from "react-router-dom";
import { UserAuth } from "../context/AuthContext";
import "../styles/navbar.css";
import isate2024Logo from "../images/isate2024-logo.png";
import QRCodeGenerator from "../screens/QrCodeGenerator";
import { useParams } from "react-router-dom";
import axios from "axios";

const Navbar = () => {
  const localhostapi = "http://localhost:5000";
  const serverlessapi = "https://adminilftest-4tmd.onrender.com";
  const [nav, setNav] = useState(false);
  const [showImportantInfo, setShowImportantInfo] = useState(false);
  const [userData, setUserData] = useState(null);
  const [user2, setUser2] = useState();
  const loggedInUserID = localStorage.getItem("loggedInUserID");
  const navigate = useNavigate();
  const { user, logout } = UserAuth();

  const handleNav = () => {
    setNav(!nav);
    setShowImportantInfo(false);
  };

  const handleImportantInfoClick = () => {
    setShowImportantInfo(true);
    setNav(false);
  };

  const handleSignOut = async () => {
    try {
      await logout();
    } catch (error) {
      console.log(error);
    }
  };
  console.log('User2', user2)

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (loggedInUserID) {
          console.log("UID:", loggedInUserID); // Log the uid to check if it's correct
          const response = await axios.get(
            `${serverlessapi}/useruid/${loggedInUserID}`
          );
          console.log("API Response:", response.data);
          setUser2(response.data);
        }
      } catch (error) {
        console.error("Error fetching user information:", error);
      }
    };

    fetchData();
  }, []);

  const handleLogoClick = () => {
    navigate("/");
  };

  const handleEditProfileClick = () => {
    const userId = user?.uid || user2?.uid;
    if (userId) {
      navigate(`/editprofile/${userId}`);
      setNav(false); // Close the navbar
    }
  };

  return (
    <div className="bg-[#FFF] flex justify-between items-center h-20 mt-auto px-4 text-black z-100">
      <div onClick={handleNav} className="block md:hidden">
        {nav ? <AiOutlineClose size={20} /> : <AiOutlineMenu size={20} />}
      </div>
      <img src={isate2024Logo} alt="Logo" className="w-1/2 md:hidden pt-2 mx-auto" onClick={handleLogoClick}/>
      {/* <div className="md:hidden pt-2">
        <Link to="/importantinfo">
          <AiOutlineInfoCircle
            className="text-black"
            size={25}
            onClick={handleImportantInfoClick}
          />
        </Link>
      </div> */}
      <ul
        className={
          nav
            ? "fixed left-0 top-20 w-[70%] h-full bg-[#EDF1F4] ease-in-out duration-500 z-20"
            : "ease-in-out fixed left-[-100%] z-20"
        }
      >
        <div>
        <h3 className="w-full font-bold text-[#000] mt-10 ml-14 mb-3">
          {(user?.displayName && user?.displayName) ||
            (user2?.first_name && user2?.last_name
              ? `${user2.first_name} ${user2.last_name}`
              : null)}
        </h3>
        {(user || user2) && (
          <button
            className="text-white bg-[#487572] font-medium rounded-md text-sm px-9 py-2.5 mx-14 mb-2 hover:bg-[#487585] hover:drop-shadow-xl"
            onClick={handleEditProfileClick}
          >
            Edit Profile
          </button>
        )}
        </div>
        {(user || user2) && (
          <button
            className="text-white bg-[#4B558A] font-medium rounded-md text-sm px-12 py-2.5 mx-14 hover:bg-[#3A426C] hover:drop-shadow-xl"
            onClick={handleSignOut}
          >
            Logout
          </button>
        )}
        {!user && !user2 && (
          <button
            onClick={handleNav}
            className="text-white bg-[#4B558A] font-medium rounded-md text-sm px-12 py-2.5 mx-14 hover:bg-[#3A426C] hover:drop-shadow-xl"
          >
            <Link
              to="/signin"
              style={{ textDecoration: "none", color: "inherit" }}
            >
              Login
            </Link>
          </button>
        )}
        <li className="m-14">
          <Link to="/" className="no-underline text-black" onClick={handleNav}>
            Home
          </Link>
        </li>
        <li className="m-14">
          <Link
            to="/announcement"
            className="no-underline text-black"
            onClick={handleNav}
          >
            Announcements
          </Link>
        </li>
        <li className="m-14">
          <Link
            to="/map"
            className="no-underline text-black"
            onClick={handleNav}
          >
            Getting Around
          </Link>
        </li>
        <li className="m-14">
          <Link
            to="/connect"
            className="no-underline text-black"
            onClick={handleNav}
          >
            Connect with Others
          </Link>
        </li>
        <li className="m-14">
          <Link 
            to="/importantinfo" 
            className="no-underline text-black"
            onClick={handleNav}
            >
            Useful Information
          </Link>
        </li>
        <li className="m-14">
          <Link
            to="/help"
            className="no-underline text-black"
            onClick={handleNav}
          >
            Contact Us
          </Link>
        </li>
      </ul>

      <div className="hidden md:flex ml-10">
        <h4 className="w-full font-bold text-[#000] mt-2 mr-3">
          {(user?.displayName && user?.displayName) ||
            (user2?.first_name && user2?.last_name
              ? `${user2.first_name} ${user2.last_name}`
              : null)}
        </h4>
        {(user || user2) && (
          <button
            className="text-white bg-[#487572] font-medium rounded-md text-sm px-8 py-2.5 mx-5 hover:bg-[#487585] hover:drop-shadow-xl whitespace-nowrap"
            onClick={handleEditProfileClick}
          >
            Edit Profile
          </button>
        )}
        {(user || user2) && (
          <button
            className="text-white bg-[#4B558A] font-medium rounded-md text-sm px-12 py-2.5 mx-1 hover:bg-[#3A426C] hover:drop-shadow-xl"
            onClick={handleSignOut}
          >
            Logout
          </button>
        )}
        {!user && !user2 && (
          <button className="text-white bg-[#4B558A] font-medium rounded-md text-sm px-12 py-2.5 mx-5 hover:bg-[#3A426C] hover:drop-shadow-xl">
            <Link
              to="/signin"
              style={{ textDecoration: "none", color: "inherit" }}
            >
              Login
            </Link>
          </button>
        )}
      </div>

      <ul className="hidden md:flex mr-20 pt-3">
        <li className="p-4" href="/">
          <Link to="/" className="no-underline text-black hover:underline">
            Home
          </Link>
        </li>
        <li className="p-4">
          <Link
            to="/announcement"
            className="no-underline text-black hover:underline"
          >
            Announcements
          </Link>
        </li>
        <li className="p-4">
          <Link to="/map" className="no-underline text-black hover:underline">
            Getting Around
          </Link>
        </li>
        <li className="p-4">
          <Link
            to="/connect"
            className="no-underline text-black hover:underline"
          >
            Connect with Others
          </Link>
        </li>
        <li className="p-4">
          <Link to="/importantinfo" className="no-underline text-black hover:underline">
            Useful Information
          </Link>
        </li>
        <li className="p-4">
          <Link to="/help" className="no-underline text-black hover:underline">
            Contact Us
          </Link>
        </li>
        {/* <li className="p-4">
          <Link to="/importantinfo" className="no-underline text-black">
            <AiOutlineInfoCircle size={25} />
          </Link>
        </li> */}
      </ul>
    </div>
  );
};

export default Navbar;
