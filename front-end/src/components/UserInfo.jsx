/* UserInfo.jsx - components of User Info(Account) Page */

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/UserInfo.css";
import Navbar from "./Navbar";
import axios from "axios";

function UserInfo({ isDarkMode, toggleDarkMode }) {
  const [userData, setUserData] = useState(null);
  const [randomUser, setRandomUser] = useState(null);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const fileInputRef = React.createRef(); // the user will choose an image file to upload the avatar

  const sendMessage = () => {
    console.log(message);
    setMessage("");
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  // this will allow the user to change avatar by clicking the avatar
  const openFileDialog = () => {
    fileInputRef.current.click(); 
  };

  // to handle avatar upload
  const handleAvatarUpload = (event) => {
    const file = event.target.files[0];
    const formData = new FormData();
    formData.append('avatar', file);

    axios.post('http://localhost:3001/user-info/upload-avatar', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    .then(response => {
      // the avatar image will change based on successful upload, so the userData will be new avatar URL
      setUserData({ ...userData, avatar: URL.createObjectURL(file) });
    })
    .catch(error => {
      console.error("Error uploading file:", error);
    });
  };

  const backupData = {
    id: 1,
    name: "Bryn",
    email: "btaylot0@booking.com",
    avatar: "https://robohash.org/utetquibusdam.png?size=50x50\u0026set=set1",
    user: [
      {
        id: 5,
        name: "Jdavie",
        email: "jzecchinii0@yahoo.co.jp",
      },
      {
        id: 2,
        name: "Emmie",
        email: "esworder1@xinhuanet.com",
      },
    ],
  };

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

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get("http://localhost:3001/user-info");
        const data = response.data;
        setUserData(data);

        // handle potential undefined data.user
        const userArray = data.user || [];
        if (userArray.length > 0) {
          const randomIdx = Math.floor(Math.random() * userArray.length);
          setRandomUser(userArray[randomIdx]);
        } else {
          console.error("User data or user array is empty.");
          setRandomUser(null);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        setUserData(backupData);
        const randomIdx = Math.floor(Math.random() * backupData.user.length);
        setRandomUser(backupData.user[randomIdx]);
      }
    }
    fetchData();
  }, []);

  return (
    <div className={`UserInfo-full-height ${isDarkMode ? "dark-mode" : ""}`}>
      <div className="UserInfo">
        <h1 className="page-title">Account</h1>
        {randomUser && (
          <>
            <div className="user-detail-section" onClick={openFileDialog}>
              <img
                src={userData ? userData.avatar : backupData.avatar}
                alt="User's Avatar"
                className="avatar"
              />
              <input 
                type="file" 
                style={{ display: 'none' }} 
                ref={fileInputRef} 
                onChange={handleAvatarUpload} 
              />
              <div className="user-name-email">
                <div className="name">{randomUser.name}</div>
                <div className="email">{randomUser.email}</div>
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
                <li className="setting-item">Password</li>
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
                    <textarea
                      id="userMessage"
                      name="userMessage"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Type your message here..."
                      className="chatbox-input"
                    />
                    <button onClick={sendMessage} className="send-button">
                      Send
                    </button>
                  </div>
                </li>
              </ul>
            </div>
          </>
        )}
        <Navbar isDarkMode={isDarkMode} />
      </div>
    </div>
  );
}

export default UserInfo;
