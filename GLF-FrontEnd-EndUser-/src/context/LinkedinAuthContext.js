// LinkedinAuthContext.js
import { useState, createContext, useContext, useEffect } from "react";

const LinkedinAuthContext = createContext();

export const LinkedinAuthContextProvider = ({ children }) => {
  const [user, setUser] = useState({});

  const linkedinSignIn = () => {
    // Implement your LinkedIn sign-in logic here
    // This may include opening a popup or redirecting to the LinkedIn authentication URL
    // Make sure to handle the response and update the user state accordingly
  };

  const logout = () => {
    // Implement logout logic if necessary
    setUser({});
    localStorage.removeItem("loggedInUserID");
    window.location.reload();
  };

  useEffect(() => {
    // You can fetch user information from your server or perform any initialization logic here
  }, []);

  return (
    <LinkedinAuthContext.Provider value={{ linkedinSignIn, logout, user }}>
      {children}
    </LinkedinAuthContext.Provider>
  );
};

export const useLinkedinAuth = () => {
  return useContext(LinkedinAuthContext);
};
