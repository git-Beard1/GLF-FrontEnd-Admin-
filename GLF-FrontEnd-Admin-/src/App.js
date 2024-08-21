import React from 'react';
import {Cloudinary} from "@cloudinary/url-gen";

import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './screens/Home';
import AddImportantInfo from './screens/Addimportantinfo';
import EditImportantInfo from './screens/EditImportantinfo';
import AddManager from './screens/AddManager';
import AddProgram from './screens/AddProgram';
import EditProgram from './screens/EditProgram';
import LogIn from './screens/Login';
import ImportantInfo from './screens/ViewImportantInfo';
import AdminMap from './screens/mapadd';
import ViewAnnouncements from './screens/ViewAnnouncement'
import EditAnnouncement from './screens/EditAnnouncement'
import AddAnnouncement from './screens/AddAnnouncement'
import Helplist from './screens/viewhelp'
import EditHelpInformation from './screens/edithelp';
import AddHelpInformation from './screens/addhelp';


import UserList from './screens/UserList';
import AdminMapedit from './screens/mapedit';
class App extends React.Component {
  render() {
    return (
      <div className="body">
       
          <Navbar/>


          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/viewimportantinfo" element={<ImportantInfo />} />
            <Route path="/addimportantinfo" element={<AddImportantInfo />} />
            <Route path="/addprogram" element={<AddProgram />} />
            <Route path="/editprogram/:eventid" element={<EditProgram />} />
            <Route path="/viewannouncements" element={<ViewAnnouncements />} />
            <Route path="/editannouncement/:announcementid" element={<EditAnnouncement />} />
            <Route path="/addannouncement" element={<AddAnnouncement />} />
            {/* Include the following lines only if you decide to keep the EditProgram functionality */}
            {/* <Route path="/editprogram" element={<EditProgram />} /> */}
            {/* <Route path="/editprogram/:eventid" element={<EditProgram />} /> */}
            <Route path="/editimportantinfo" element={<EditImportantInfo />} />
            <Route path="/editimportantinfo/:infoid" element={<EditImportantInfo />} />
            <Route path="/addmanager" element={<AddManager />} />
            <Route path="/login" element={<LogIn />} />
            <Route path="/mapadding" element={<AdminMap />} />
            <Route path="/mapediting/:markerid" element={<AdminMapedit />} />
            <Route path="/userlist" element={<UserList />} />
            <Route path="/viewhelp" element={<Helplist />} />
            <Route path="/edithelp/:helpid" element={<EditHelpInformation />} />
            <Route path="/addhelp" element={<AddHelpInformation />} />
          </Routes>
       

      </div>
    );
  }
}

export default App;
