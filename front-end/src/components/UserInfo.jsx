/* UserInfo.jsx - components of User Info(Account) Page */

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/UserInfo.css";
import Navbar from "./Navbar";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

function UserInfo({ isDarkMode, toggleDarkMode }) {
  const [data, setData] = useState([]);
  const [message, setMessage] = useState("");

  const [isLoggedIn, setIsLoggedIn] = useState(true);

  const navigate = useNavigate();

  const handleButtonClick = () => {
    navigate("/");
  };

  const redirectToForgotPassword = () => {
    navigate("/forgot-password");
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    const body = {
      user: data.name,
      message: message,
    };

    try {
      console.log("Submitting message:", body);
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND}/sendMessage`,
        body
      );
      console.log(`Message sent:`, response.data);
      window.location.reload();
    } catch (error) {
      console.error("Failed to send message:", error.response);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.error("No token found");
          setIsLoggedIn(false);
          return;
        }
        const decoded = jwtDecode(token);
        const userId = decoded.id;
        const result = await axios.get(
          `${process.env.REACT_APP_BACKEND}/user-info/${userId}`
        );
        setData({
          ...result.data,
          name: decoded.username, // override `name` from the response data with `userName` from the token
        });
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, []);

  // This effect runs when the `isDarkMode` value changes
  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add("body-dark-mode");
    } else {
      document.body.classList.remove("body-dark-mode");
    }
    // if not in dark mode, remove this effect
    return () => {
      document.body.classList.remove("body-dark-mode");
    };
  }, [isDarkMode]);

  if (!data) {
    return <div>Loading user data...</div>;
  }

  if (!isLoggedIn)
    return (
      <div>
        <div className="text-center">Please log in to view pages!</div>
        <button onClick={handleButtonClick} className="login-button">
          Click here to log in
        </button>
      </div>
    );

  return (
    <div className={`UserInfo-full-height ${isDarkMode ? "dark-mode" : ""}`}>
      <div className="UserInfo">
        <h1 className="page-title">Account</h1>

        <div className="user-detail-section">
          <img
            src={data.avatar} // the user may change the avatar
            alt="User's Avatar"
            className="avatar"
          />
          <div className="user-name-email">
            <div className="name">{data.name}</div>
            <div className="email">{data.email}</div>
          </div>
        </div>
        <div className="settings-list-general">
          <ul>
            <li className="setting-title">Settings</li>
            <li className="setting-item">
              Dark Mode
              <label className="switch">
                <input
                  type="checkbox"
                  id="darkModeToggle"
                  name="darkModeToggle"
                  checked={isDarkMode}
                  onChange={toggleDarkMode}
                />
                <span className="slider round"></span>
              </label>
            </li>
            <li
              className="setting-item"
              onClick={redirectToForgotPassword}
              style={{ cursor: "pointer" }}
            >
              {" "}
              Reset Password
            </li>
            <button onClick={handleLogout} className="logout">
              Logout
            </button>
            {/* Add additional settings here */}
          </ul>
        </div>
        <div className="settings-list-feedback">
          <ul>
            <li className="setting-title">Feedback</li>
            <li className="setting-item setting-item-feedback">
              <div className="contact-us-title">Contact us</div>
              <div className="chatbox-container">
                <form onSubmit={sendMessage}>
                  <input
                    type="text"
                    id="userMessage"
                    name="userMessage"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type your message here..."
                    className="chatbox-input"
                  />
                  <button type="submit" className="send-button">
                    Send
                  </button>
                </form>
              </div>
            </li>
          </ul>
        </div>
        <div className="navbar-placeholder" style={{ height: "4rem" }}></div>
        <Navbar isDarkMode={isDarkMode} />
      </div>
    </div>
  );
}

export default UserInfo;
