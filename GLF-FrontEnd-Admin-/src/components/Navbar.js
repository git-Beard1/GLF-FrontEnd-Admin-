import React, { useState } from 'react';
import { AiOutlineClose, AiOutlineMenu, AiOutlineInfoCircle } from 'react-icons/ai';
import isate from "../images/isate2024-logo.png"
import { Link, useNavigate } from 'react-router-dom';

import '../styles/navbar.css'

const Navbar = () => {
  const [nav, setNav] = useState(false);
  const navigate = useNavigate();

  const handleNav = () => {
    setNav(!nav);
  };

  const user = localStorage.getItem("username");
  console.log('username',user)

  const handleSignOut = async () => {
    localStorage.removeItem("username")
    localStorage.removeItem("token")
    navigate('../login')
  }

  return (
    
    <div className='bg-[#000] flex justify-between items-center h-20 mt-auto px-4 text-black z-10'>
        <div onClick={handleNav} className='block md:hidden'>
          {nav ? <AiOutlineClose size={20}/> : <AiOutlineMenu size={20} />}
        </div>
        <div className='md:hidden pt-2'>
            <Link to="/importantinfo"><AiOutlineInfoCircle className='text-black' size={25}/></Link>
        </div>

        


      <div className='hidden md:flex ml-10'>
        
          <h4 className='w-full font-bold text-[#FFFFFF] mt-2 mr-3'>{user}</h4>
          { user !=null ? (<button className='text-white bg-[#C20F02] font-medium rounded-md text-sm px-5 hover:bg-[#4D0702] hover:drop-shadow-xl' 
          onClick={handleSignOut}>Logout</button>) 
          : <button className='text-white bg-[#4B558A] font-medium rounded-md text-sm px-5 hover:bg-[#3A426C] hover:drop-shadow-xl'>
            <Link to="../login" style={{ textDecoration: 'none', color: 'inherit' }}>Login</Link></button>}
    
      </div>

      <ul className='hidden md:flex mr-20 pt-3'>
        
        <li className='p-4'><Link to="/" className='no-underline text-white hover:underline' onClick={handleNav}>Events</Link></li>
          <li className='p-4'><Link to="/viewannouncements" className='no-underline text-white hover:underline' onClick={handleNav}>Announcements</Link></li>
          <li className='p-4 '><Link to="/userlist" className='no-underline text-white hover:underline' onClick={handleNav}>User List</Link></li>
          <li className='p-4'><Link to="/mapadding" className='no-underline text-white hover:underline' onClick={handleNav}>Map Editing</Link></li>
          <li className='p-4'><Link to="/viewimportantinfo" className='no-underline text-white hover:underline' onClick={handleNav}>Important Info</Link></li>
          <li className='p-4'><Link to="/viewhelp" className='no-underline text-white hover:underline' onClick={handleNav}>Contact us info</Link></li>
      </ul>
    </div>
  );
};

export default Navbar;
