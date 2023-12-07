import axios from "axios";
import React, { useState, useEffect } from "react";
import "../styles/Event.css";
import { Link, useParams } from "react-router-dom";
import Navbar from "./Navbar";
import { jwtDecode } from "jwt-decode";

const Event = (props) => {
  const [data, setData] = useState([]);
  const [userExpenses, setUserExpenses] = useState([]);
  const isDarkMode = props.isDarkMode;
  const { eventId } = useParams();

  
  function reformatDate(dateStr) {

    const months = [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
    ];
  
    // Create a new Date object in local time zone
    const date = new Date(dateStr);
  
    // Convert it back to UTC
    date.setMinutes(date.getMinutes() + date.getTimezoneOffset());
  
    const monthName = months[date.getUTCMonth()];
    const day = date.getUTCDate();

    return `${monthName} ${day}`;
  }


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

  const processUserExpenses = (expenses, userId) => {
    const processedExpenses = expenses.map((expense) => {
      const isParticipant = expense.splitDetails.find(
        (detail) => detail.user === userId
      );
      let userBalance = 0;
  
      if (expense.paidBy === userId) {
        // Check if the currentUser is involved in the split
        if (isParticipant) {
          expense.splitDetails.forEach((split) => {
            if (!split.settlement.status) {
              userBalance += split.settlement.amount;
            }
          });
        } else {
          let totalSettledAmount = 0;
          expense.splitDetails.forEach((split) => {
            if (split && split.settlement && split.settlement.status) {
              totalSettledAmount += split.settlement.amount;
            }
          });
          userBalance = (expense.totalAmount ? expense.totalAmount : 0) - totalSettledAmount;
      }
      } else if (isParticipant) {
        // If currentUser is not the one who paid, but is involved in the split
        const user = expense.splitDetails.find(
          (split) => split.user === userId
        );
        if (user) {
          userBalance = user.settlement.status ? 0 : -user.settlement.amount;
        }
      } else {
        // User is neither the payer nor a participant in the split
        userBalance = 0;
      }

      return {
        expense: expense,
        settlement: userBalance,
      };
    });

    return processedExpenses;
  };

  useEffect(() => {
    // fetch some mock data about expense
    const fetchEvent = async () => {
      try {
        const result = await axios.get(
          `${process.env.REACT_APP_BACKEND}/event/${eventId}`
        );
        setData(result.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchEvent();
  }, [eventId]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const currentUser = jwtDecode(token);
    if (data.expenses && currentUser) {
      const processedExpenses = processUserExpenses(
        data.expenses,
        currentUser.id
      );
      setUserExpenses(processedExpenses);
    }
  }, [data]);

  return (
    <div className="event-page-container">
      {" "}
      {/* add this container to control the dark mode between the outtermost backgroud and the section box*/}
      <div id="event-page">
        <header>
          <h2>
            <Link to="/events">Events</Link>|{data.name}
          </h2>
        </header>

        <section className="description">
          <p>{data.description}</p>
        </section>

        <section className="summary">
          <div>• Date: {reformatDate(data.date)}</div>
          <div>
            • Total{" "}
            {data.participants ? data.participants.length : "Loading..."} people
          </div>
        </section>

        <section className="expenses">
          {userExpenses &&
            userExpenses.map((item) => (
              <div className="expenseItem" key={item.expense._id}>
                <div className="date">{reformatDate(item.expense.date)}</div>
                <div className="name">
                  <Link to={`/expense/${item.expense._id}`}>
                    <div>{item.expense.name}</div>
                  </Link>
                </div>
                <div className={`amount ${item.settlement < 0 ? 'negative' : 'positive'}`}>
                    {item.settlement.toFixed(2) === "0.00" ? 
                    <span className="settled">Settled</span> : 
                    `$${item.settlement.toFixed(2)}`}
                </div>
              </div>
            ))}
        </section>

        <div className="addExpenseBtnDiv">
          <Link to={`/add-expense/${eventId}`} className="btn addExpenseBtn">
            {" "}
            Add Expense
          </Link>
        </div>

        <div className="space-to-scroll"></div>

        <Navbar />
      </div>
    </div>
  );
};

export default Event;
