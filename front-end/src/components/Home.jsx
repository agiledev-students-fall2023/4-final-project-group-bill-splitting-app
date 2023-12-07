import React, { useState, useEffect } from "react";
import "../styles/Home.css";
import Navbar from "./Navbar";
import axios from "axios";
import { Link } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";

const Home = ({ isDarkMode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const navigate = useNavigate();

  const handleButtonClick = () => {
    navigate("/");
  };

  const [data, setData] = useState({
    userName: "",
    totalSpending: 0,
    expenses: [],
    friends: [],
    events: [],
  });
  const [expenseSummary, setExpenseSummary] = useState([]);

  function reformatDate(dateStr) {
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const date = new Date(dateStr);

    const monthName = months[date.getMonth()];
    const day = date.getDate();
    const year = date.getFullYear();

    return `${monthName} ${day} ${year}`;
  }

  function calculateExpenseSummary(expenses) {
    const summary = expenses.reduce((acc, expense) => {
      // If the event is already in the accumulator, add to its totalAmount
      if (acc[expense.event._id]) {
        acc[expense.event._id].totalAmount += expense.amount;
      } else {
        // Otherwise, create a new entry in the accumulator
        acc[expense.event._id] = {
          event: expense.event,
          totalAmount: expense.amount,
        };
      }
      return acc;
    }, {});
    // Convert the summary object back into an array
    return Object.values(summary);
  }

  useEffect(() => {
    const decodeToken = (token) => {
      try {
        const currentUser = jwtDecode(token);
        if (!currentUser || !currentUser.id) {
          console.error("No current user found in local storage.");
          return null;
        }
        return currentUser;
      } catch (error) {
        console.error("Error decoding token:", error);
        return null;
      }
    };

    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.error("No token found");
          console.error("Plese login in view pages");
          setIsLoggedIn(false);
          return;
        }
        const currentUser = decodeToken(token);

        if (currentUser) {
          const expenseRes = await axios.get(
            `${process.env.REACT_APP_BACKEND}/settlement/from/${currentUser.id}`
          );
          const newTotalSpending = calculateTotalSpending(expenseRes.data);
          const newExpenses = expenseRes.data.map((settlement) => {
            return {
              event: settlement.event,
              amount: settlement.amount,
            };
          });

          // Fetch events data
          const eventsRes = await axios.get(
            `${process.env.REACT_APP_BACKEND}/events/for/${currentUser.id}`
          );
          const events = eventsRes.data.events || [];

          // Fetch friends data
          const friendsRes = await axios.get(
            `${process.env.REACT_APP_BACKEND}/friends/${currentUser.id}`
          );
          const friends = friendsRes.data.friends || [];

          const userName = currentUser.username || "";

          setData({
            userName,
            totalSpending: newTotalSpending,
            expenses: newExpenses,
            friends,
            events,
          });
        } else {
          console.error("No valid user found.");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const newExpenseSummary = calculateExpenseSummary(data.expenses);
    setExpenseSummary(newExpenseSummary);
  }, [data.expenses]);

  function calculateTotalSpending(settlements) {
    let total = 0;
    settlements.forEach((settlement) => {
      total += settlement.amount;
    });
    return total;
  }

  /* For Friends summary */
  const [userData, setUserData] = useState(null);
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
          `${process.env.REACT_APP_BACKEND}/friends/${userId}`
        );
        setUserData(result.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, []);

  const [settlements, setSettlements] = useState([]);

  useEffect(() => {
    const fetchSettlementsForFriends = async () => {
      if (!userData || !userData.friends) return;

      let settlements = [];
      for (const friend of userData.friends) {
        try {
          const fromUserToFriend = await axios.get(
            `${process.env.REACT_APP_BACKEND}/settlement/from/${userData._id}/to/${friend._id}`
          );
          const fromFriendToUser = await axios.get(
            `${process.env.REACT_APP_BACKEND}/settlement/from/${friend._id}/to/${userData._id}`
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

  /* since spaces are limited, only display 3 event expenses/friends, the user can access the rest by clicking "view more" */
  const eventsPending = data.events ? data.events.slice(0, 3) : [];

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
    <div className="home-container">
      <div className="greeting">
        <h1>Welcome, {data.userName}</h1>
        <p className="total-spent">
          You have spent ${data.totalSpending.toFixed(2)} in total!
        </p>
      </div>
      <div className="dashboard">
        <div className="box events-pending">
          <h2>Expenses Summary</h2>
          {/* <p className="heading2 total-amount">${calculateTotalSpending(data.expenses || [])}</p> */}
          <ul className="home-list">
            {expenseSummary.map((item) => (
              <li key={item.event._id} className="small">
                <div className="center">
                  <p className="home-expense-text">{item.event.name}</p>
                  <p className="home-expense-amount">
                    ${item.totalAmount.toFixed(2)}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
        <div className="box events-summary">
          <h2 className="heading2">Events Summary</h2>
          <ul className="home-list">
            {eventsPending.length > 0 ? (
              eventsPending.map((event) => (
                <li key={event._id} className="small">
                  <div className="center">
                    <p className="home-expense-text">{event.name}</p>
                    <p className="home-expense-amount">
                      {reformatDate(event.date)}
                    </p>
                  </div>
                </li>
              ))
            ) : (
              <div>No Events Added Yet.</div>
            )}
          </ul>
          <Link to="/events" className="view-all">
            View All
          </Link>
        </div>
        <div className="box friends-pending">
          <h2 className="heading2">Friends Summary</h2>
          <ul className="home-list">
            {calculateBalances(settlements).map((friend) => (
              <li key={friend._id} className="small">
                <div className="center">
                  <p className="home-expense-text">{friend.username}</p>
                  <p className="home-expense-amount">
                    {friend.balance === 0
                      ? "Settled"
                      : `$${friend.balance.toFixed(2)}`}
                  </p>
                </div>
              </li>
            ))}
          </ul>
          <Link to="/friends" className="view-all">
            View All
          </Link>
        </div>
      </div>
      <div className="navbar-placeholder" style={{ height: "4rem" }}></div>
      <Navbar />
    </div>
  );
};

export default Home;
