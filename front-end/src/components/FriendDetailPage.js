import React, { useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { Link, useParams } from "react-router-dom";
import Navbar from "./Navbar";
import "../styles/FriendDetailPage.css";

function FriendDetailPage({ isDarkMode }) {
  const [settlements, setSettlements] = useState({
    fromUserToFriend: [],
    fromFriendToUser: [],
  });
  const [friend, setFriend] = useState(null);
  const { friendId } = useParams();
  const token = localStorage.getItem("token");
  const currentUser = jwtDecode(token);
  const userId = currentUser.id;

  useEffect(() => {
    const fetchSettlements = async () => {
      try {
        const friendInfo = await axios.get(
          `${process.env.REACT_APP_BACKEND}/search-user-info/${friendId}`
        );
        const fromUserToFriend = await axios.get(
          `${process.env.REACT_APP_BACKEND}/settlement/from/${userId}/to/${friendId}`
        );
        const fromFriendToUser = await axios.get(
          `${process.env.REACT_APP_BACKEND}/settlement/from/${friendId}/to/${userId}`
        );
        setFriend(friendInfo.data);
        setSettlements({
          fromUserToFriend: fromUserToFriend.data,
          fromFriendToUser: fromFriendToUser.data,
        });
      } catch (error) {
        console.error("Error fetching friend and settlements:", error);
      }
    };

    fetchSettlements();
  }, [friendId, userId]);

  /* useEffect for controlling DarkMode of the margin around the page */
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

  const settleExpenses = async (settlementId, newStatus) => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND}/expenseStatus/${settlementId}`,
        { status: newStatus }
      );
    } catch (error) {
      console.error("Error updating settlements:", error);
    }
  };

  const handleSettlementChange = async (e, settlementId) => {
    const newStatus = e.target.checked;
    await settleExpenses(settlementId, newStatus);
    setSettlements((prevSettlements) => {
      const updateSettlements = (settlements) => {
        return settlements.map((settlement) => {
          if (settlement._id === settlementId) {
            return { ...settlement, status: newStatus };
          }
          return settlement;
        });
      };
      return {
        fromUserToFriend: updateSettlements(prevSettlements.fromUserToFriend),
        fromFriendToUser: updateSettlements(prevSettlements.fromFriendToUser),
      };
    });
  };

  const renderSettlements = (settlementList, isFromUser) => {
    const sortedSettlements = [...settlementList].sort((a, b) => {
      if (a.status === b.status) {
        return 0;
      }
      return a.status ? 1 : -1;
    });

    return sortedSettlements.map((settlement, index) => {
      const expenseName = settlement.expense?.name || "Unknown";
      return (
        <div key={index} className="settlement-item">
          <span className="settlement-label">
            {settlement.event.name}|{expenseName}
          </span>
          <span className={isFromUser ? "negative" : "positive"}>
            {isFromUser ? "-" : "+"}${Math.abs(settlement.amount).toFixed(2)}
          </span>
          <div className="checkbox">
            <input
              type="checkbox"
              name={settlement._id}
              checked={settlement.status}
              onChange={(e) => handleSettlementChange(e, settlement._id)}
            />
          </div>
        </div>
      );
    });
  };

  const [amountYouOwe, setAmountYouOwe] = useState(0);
  const [amountFriendOwesYou, setAmountFriendOwesYou] = useState(0);

  useEffect(() => {
    const calculatedAmountYouOwe = settlements.fromUserToFriend.reduce(
      (total, settlement) => {
        return !settlement.status ? total + settlement.amount : total;
      },
      0
    );

    const calculatedAmountFriendOwesYou = settlements.fromFriendToUser.reduce(
      (total, settlement) => {
        return !settlement.status ? total + settlement.amount : total;
      },
      0
    );

    setAmountYouOwe(calculatedAmountYouOwe);
    setAmountFriendOwesYou(calculatedAmountFriendOwesYou);
  }, [settlements]);

  const handleSettleAllClick = async () => {
    const updateSettlements = (settlements) =>
      settlements.map((settlement) => ({ ...settlement, status: true }));

    setSettlements({
      fromUserToFriend: updateSettlements(settlements.fromUserToFriend),
      fromFriendToUser: updateSettlements(settlements.fromFriendToUser),
    });

    await updateSettlementsInBackend(true);
  };

  const updateSettlementsInBackend = async (newStatus) => {
    const settlementIds = [
      ...settlements.fromUserToFriend.map((s) => s._id),
      ...settlements.fromFriendToUser.map((s) => s._id),
    ];

    try {
      await axios.post(`${process.env.REACT_APP_BACKEND}/expenseStatus/all`, {
        settlementIds,
        status: newStatus,
      });
      console.log("All settlements updated");
    } catch (error) {
      console.error("Error updating all settlements:", error);
    }
  };

  // Check if friend is not null before rendering
  if (!friend) {
    return <div>Loading...</div>;
  }

  return (
    <div id="friend-detail-page">
      <header>
        <h2>
          <Link to="/friends">Friends</Link>|{friend.username}
        </h2>
      </header>

      <section className="balance">
        <img src={friend.avatar} alt="Friend Avatar" className="user-avatar" />
        <div>
          <div className="balance-title">Balance Overview</div>
          <div className="balance-amounts">
            {amountYouOwe === 0 && amountFriendOwesYou === 0 ? (
              <div className="balance-settled">Your balances are settled!</div>
            ) : (
              <>
                <div className="amount-you-owe">
                  You owe: ${amountYouOwe.toFixed(2)}
                </div>
                <div className="amount-friend-owes-you">
                  {friend.username} owes: ${amountFriendOwesYou.toFixed(2)}
                </div>
              </>
            )}
          </div>
        </div>
      </section>

      <div className="settle-all-section">
        <button id="settle-all-btn" onClick={handleSettleAllClick}>
          Settle All
        </button>
      </div>

      <div className="settlements-section">
        <h3>Amount You Owe {friend.username}</h3>
        {renderSettlements(settlements.fromUserToFriend, true)}
      </div>
      <div className="settlements-section">
        <h3>Amount {friend.username} Owes You</h3>
        {renderSettlements(settlements.fromFriendToUser, false)}
      </div>
      <div className="space-to-scroll"></div>
      <Navbar />
    </div>
  );
}

export default FriendDetailPage;
