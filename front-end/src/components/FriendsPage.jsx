import axios from "axios";
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../styles/FriendsPage.css";
import AddFriendModal from "./AddFriendModal";
import Navbar from "./Navbar";
import { jwtDecode } from "jwt-decode";

function FriendsPage({ isDarkMode }) {
  const [userData, setUserData] = useState(null);
  const [showModal, setShowModal] = useState(false);

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

  const [searchTerm, setSearchTerm] = useState("");

  const filteredSettlements = searchTerm
    ? settlements.filter((settlement) =>
        settlement.friend.username
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
      )
    : settlements;

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

      <input
        type="text"
        placeholder="Search for a friend..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mt-4 search-input"
      />

      <div className="friends-list">
        <ul className="p-6 divide-y divide-slate-200">
          {filteredSettlements.map((settlement) => {
            // Calculate balance for each friend
            const balance =
              settlement.fromUserToFriend.reduce(
                (acc, transaction) =>
                  acc - (transaction.status === false ? transaction.amount : 0),
                0
              ) +
              settlement.fromFriendToUser.reduce(
                (acc, transaction) =>
                  acc + (transaction.status === false ? transaction.amount : 0),
                0
              );

            return (
              <li key={settlement.friend._id} className="friend-item">
                <span>
                  <Link
                    to={`/friend/${settlement.friend._id}`}
                    className="item-name-avatar"
                  >
                    <img
                      src={settlement.friend.avatar}
                      alt={`${settlement.friend.username}'s avatar`}
                      className="friend-avatar"
                    />
                    <span>{settlement.friend.username}</span>
                  </Link>
                </span>
                <span
                  className={
                    balance < 0 ? "negative-balance" : "positive-balance"
                  }
                >
                  {balance === 0 ? "Settled" : `$${balance.toFixed(2)}`}
                </span>
              </li>
            );
          })}
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
