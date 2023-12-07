import React, { useState, useEffect } from "react";
import "../styles/Login.css";
import userImage from "../images/user.png";
import { Navigate } from "react-router-dom";
import axios from "axios";
import { useLocation } from "react-router-dom";

const Login = ({ onLoginSuccess }) => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const location = useLocation();
  const showAlert = location.state?.showAlert;
  const [showNotification, setShowNotification] = useState(showAlert);

  useEffect(() => {
    if (showAlert) {
      setShowNotification(true);
      setTimeout(() => {
        setShowNotification(false);
      }, 3000);
    }
  }, [showAlert]);

  const [response, setResponse] = useState({});
  const [errorMessage, setErrorMessage] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  useEffect(() => {
    if (response.success && response.token) {
      console.log(`User successfully logged in: ${response.username}`);
      localStorage.setItem("token", response.token);
      onLoginSuccess(); // reset isDarkMode to be false when login
    }
  }, [response, onLoginSuccess]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND}/`,
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log(`Server response: ${JSON.stringify(response.data, null, 0)}`);
      setResponse(response.data);
    } catch (error) {
      setErrorMessage("You entered invalid credentials.  Try harder!");
    }
  };

  if (!response.success)
    return (
      <div className="login-container">
        <div className="login-form">
          <h2 className="login-title">Login</h2>
          {showNotification && (
            <div className="notification">
              {/* <p>You have been successfully registered. Please log in.</p> */}
              <p>Please log in again!</p>
            </div>
          )}
          {errorMessage ? <p className="error">{errorMessage}</p> : ""}

          <div className="flex justify-center">
            <img
              src={userImage}
              alt="User Icon"
              style={{ width: "150px", height: "150px" }}
              className="user-image"
            />
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <label htmlFor="username" className="login-label">
              Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              required
              className="login-input"
            />

            <label htmlFor="password" className="login-label">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              required
              className="login-input"
            />

            <button type="submit" className="login-button">
              Login
            </button>
          </form>

          <div className="mt-4">
            <a href="/signup" className="login-link">
              Sign Up
            </a>
            <span className="mx-2"> | </span>
            <a href="/forgot-password" className="login-link">
              Reset Password
            </a>
          </div>
        </div>
      </div>
    );
  else return <Navigate to="/home" />;
};

export default Login;
