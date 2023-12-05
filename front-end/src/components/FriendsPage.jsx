import axios from "axios";
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../styles/FriendsPage.css";
import AddFriendModal from "./AddFriendModal";
import Navbar from "./Navbar";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";

function FriendsPage({ isDarkMode }) {
  const [userData, setUserData] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const navigate = useNavigate();

  const handleButtonClick = () => {
    navigate("/");
  };

  // useEffect for dark mode
  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add("body-dark-mode");
    } else {
      document.body.classList.remove("body-dark-mode");
    }
    // Cleanup function to remove dark mode class
    return () => {
      document.body.classList.remove("body-dark-mode");
    };
  }, [isDarkMode]); // Depend on isDarkMode prop

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.error("No token found");
          console.error("Plese login in view pages");
          setIsLoggedIn(false);
          return;
        }
        const currentUser = jwtDecode(token);
        const userId = currentUser.id;
        const result = await axios.get(
          `http://localhost:3001/friends/${userId}`
        );
        setUserData(result.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, []);

  const [settlements, setSettlements] = useState([]);
  const fetchSettlementsForFriends = async () => {
    if (!userData || !userData.friends) return;

    let settlements = [];
    for (const friend of userData.friends) {
      try {
        const fromUserToFriend = await axios.get(
          `http://localhost:3001/settlement/from/${userData._id}/to/${friend._id}`
        );
        const fromFriendToUser = await axios.get(
          `http://localhost:3001/settlement/from/${friend._id}/to/${userData._id}`
        );

        settlements.push({
          friend: friend,
          fromUserToFriend: fromUserToFriend.data,
          fromFriendToUser: fromFriendToUser.data,
        });
      } catch (error) {
        console.error(
          "Error fetching settlements for friend:",
          friend._id,
          error
        );
        settlements.push({
          friend: friend,
          fromUserToFriend: [],
          fromFriendToUser: [],
        });
      }
    }
    setSettlements(settlements);
  };

  useEffect(() => {
    fetchSettlementsForFriends();
  }, [userData]);

  const calculateBalances = (items) => {
    return items.map((item) => {
      const balance =
        item.fromUserToFriend.reduce(
          (acc, settlement) =>
            acc - (settlement.status === false ? settlement.amount : 0),
          0
        ) +
        item.fromFriendToUser.reduce(
          (acc, settlement) =>
            acc + (settlement.status === false ? settlement.amount : 0),
          0
        );

      const settlementIds = [
        ...item.fromUserToFriend
          .filter((settlement) => settlement.status === false)
          .map((settlement) => settlement._id),
        ...item.fromFriendToUser
          .filter((settlement) => settlement.status === false)
          .map((settlement) => settlement._id),
      ];

      return {
        ...item.friend,
        balance: balance,
        settlementIds: settlementIds,
      };
    });
  };

  let totalOwed = 0;
  let totalOwing = 0;
  const balances = calculateBalances(settlements);
  balances.forEach((friend) => {
    if (friend.balance < 0) {
      totalOwed += Math.abs(friend.balance);
    } else {
      totalOwing += friend.balance;
    }
  });

  if (!isLoggedIn)
    return (
      <div>
        <div className="text-center">Please log in to view pages!</div>
        <button onClick={handleButtonClick} className="login-button">
          Click here to log in
        </button>
      </div>
    );
  if (!userData) return <div>Loading...</div>;

  return (
    <div className="friends-page">
      <h1 className="page-title">Friends</h1>
      <div className="balance-section">
        <img src={userData.avatar} alt="User Avatar" className="user-avatar" />
        <div>
          <div className="balance-title">Total balance</div>
          <div className="balance-details">
            {totalOwed > 0 && <div>You owe ${totalOwed.toFixed(2)}</div>}
            {totalOwing > 0 && <div>You are owed ${totalOwing.toFixed(2)}</div>}
            {totalOwed === 0 && totalOwing === 0 && (
              <div>All Balances are Settled!</div>
            )}
          </div>
        </div>
      </div>

      <div className="friends-list">
        <ul className="p-6 divide-y divide-slate-200">
          {calculateBalances(settlements).map((friend) => (
            <li key={friend._id} className="friend-item">
              <span>
                <Link to={`/friend/${friend._id}`} className="item-name-avatar">
                  <img
                    src={friend.avatar}
                    alt={`${friend.username}'s avatar`}
                    className="friend-avatar"
                  />
                  <span>{friend.username}</span>
                </Link>
              </span>
              <span
                className={
                  friend.balance < 0 ? "negative-balance" : "positive-balance"
                }
              >
                {friend.balance === 0
                  ? "Settled"
                  : `$${friend.balance.toFixed(2)}`}
              </span>
            </li>
          ))}
        </ul>
      </div>

      <div className="add-friends-btn-div">
        <button className="add-friends-btn" onClick={() => setShowModal(true)}>
          Add Friends
        </button>
      </div>

      <div className="space-to-scroll"></div>

      {showModal && (
        <AddFriendModal
          showModal={showModal}
          onClose={() => {
            setShowModal(false);
            window.location.reload();
          }}
        />
      )}

      <Navbar />
    </div>
  );
}

export default FriendsPage;
