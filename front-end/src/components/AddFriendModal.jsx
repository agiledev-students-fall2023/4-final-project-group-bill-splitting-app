import React, { useState, useEffect } from "react";
import addFriendButton from "../images/plus-button.png";
import { jwtDecode } from "jwt-decode";

function AddFriendModal({ showModal, onClose }) {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSearchClick() {
    setUserData(null);
    setError("");
    setLoading(true);
    const username = document.querySelector(".input-content").value;
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND}/searchFriend?username=${username}`
      );
      if (!response.ok) {
        if (response.status === 404) {
          setError("User not found.");
        } else {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
      } else {
        const data = await response.json();
        setUserData(data);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setError("Failed to fetch data. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  function addFriend(friendUserId) {
    const token = localStorage.getItem("token");
    const currentUser = jwtDecode(token);

    if (!currentUser || !currentUser.id) {
      console.error("No current user found in local storage.");
      return;
    }

    if (currentUser.id === friendUserId) {
      setError("You cannot add yourself as a friend.");
      return;
    }

    fetch(`${process.env.REACT_APP_BACKEND}/addFriends`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        currentUserId: currentUser.id,
        friendUserId: friendUserId,
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Could not add friend");
        }
        return response.text();
      })
      .then((message) => {
        setError(message);
      })
      .catch((error) => {
        console.error("Error adding friend:", error);
        setError("Failed to add friend. Please try again.");
      });
  }

  return (
    <div className="modal">
      <div className="modal-content">
        <span className="close" onClick={onClose}>
          &times;
        </span>
        <h2>Add a new friend</h2>
        <input
          type="text"
          placeholder="Enter username"
          className="input-content"
        />
        <button onClick={handleSearchClick}>Search</button>
        {loading && <div>Loading...</div>}
        {userData && (
          <div className="add-friend-item">
            <img
              src={userData.avatar}
              alt={`avatar`}
              className="friend-avatar"
            />
            <span className="add-friend-name">{userData.username}</span>
            <img
              src={addFriendButton}
              alt="Add friend"
              className="add-friend-button"
              style={{ width: "50px", height: "50px" }}
              onClick={() => addFriend(userData._id)}
            />
          </div>
        )}
        {error && <div className="error-message">{error}</div>}
      </div>
    </div>
  );
}

export default AddFriendModal;
