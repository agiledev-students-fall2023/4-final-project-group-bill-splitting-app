import React from "react";
import { useNavigate } from "react-router-dom";

const Logout = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Remove the token from local storage
    localStorage.removeItem("token");
    // Redirect the user to the home page
    navigate("/");
  };

  return <button onClick={handleLogout}>Logout</button>;
};

export default Logout;
