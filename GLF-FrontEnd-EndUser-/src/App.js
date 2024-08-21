import React from "react";


import { Routes, Route } from "react-router-dom";

//Importing Navbar
import Navbar from "./components/Navbar";

//Importing Screens

import Home from "./screens/Home";
import ViewEvent from "./screens/Event";
import Map from "./screens/Map";
import Announcement from "./screens/Announcement";
import ViewAnnouncement from "./screens/AnnouncementScreen";
import Connect from "./screens/Connect";
import Help from "./screens/Help";
import ImportantInfo from "./screens/ImportantInfo";
import SignIn from "./screens/SignIn";
import EditProfile from "./screens/EditProfile";
import QRCodeGenerator from "./screens/QrCodeGenerator";
import QRCodeScanner from "./screens/QrCodeScanner";
import UserList from "./screens/AllUsersList";
import { AuthContextProvider } from "./context/AuthContext";
import { LinkedinAuthContextProvider } from "./context/LinkedinAuthContext";
import LinkedInRedirectHandler from "./components/LinkedinRedirectHandler";

class App extends React.Component {
  render() {
    return (
      <div className="body">
        <AuthContextProvider>
          <LinkedinAuthContextProvider>
            <Navbar />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/viewevent/:eventid" element={<ViewEvent />} />
              <Route path="/map" element={<Map />} />
              <Route path="/announcement" element={<Announcement />} />
              <Route
                path="/viewannouncement/:announcementid"
                element={<ViewAnnouncement />}
              />
              <Route path="/connect" element={<Connect />} />
              <Route path="/help" element={<Help />} />
              <Route path="/importantinfo" element={<ImportantInfo />} />
              <Route path="/signin" element={<SignIn />} />
              <Route path="/editprofile/:uid" element={<EditProfile />} />
              <Route path="/qrcode/:uid" element={<QRCodeGenerator />} />
              <Route path="/scan" element={<QRCodeScanner />} />
              <Route path="/allusers" element={<UserList />} />
              <Route
                path="/linkedin/redirect"
                element={<LinkedInRedirectHandler />}
              />
            </Routes>
          </LinkedinAuthContextProvider>
        </AuthContextProvider>
      </div>
    );
  }
}

export default App;
