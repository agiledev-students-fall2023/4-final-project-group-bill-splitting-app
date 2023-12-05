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
      //let settlement;
      let userBalance = 0;

      if (isParticipant) {
        if (expense.paidBy === userId) {
          expense.splitDetails.forEach((split) => {
            if (!split.settlement.status) {
              userBalance += split.settlement.amount;
            }
          });
        } else {
          //user is not the one who paid, find what the user owe to the person who paid
          const user = expense.splitDetails.find(
            (split) => split.user === userId
          );
          if (user) {
            userBalance = user.settlement.status ? 0 : -user.settlement.amount;
          }
        }
      } else {
        // User is not a participant, create a settlement object with amount 0
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
    console.log("fetching the event");
    const fetchEvent = async () => {
      try {
        const result = await axios.get(
          `${process.env.REACT_APP_BACKEND}/event/${eventId}`
        );
        setData(result.data);
        console.log(result.data);
      } catch (err) {
        console.error(err);

        // make some backup fake data
        const backupData = {
          id: 2,
          name: "LA Road Trip",
          expenses: [
            {
              id: 1,
              name: "Lunch",
              amount: 358,
              creator: "Jane",
              date: "06/16/2023",
            },
            {
              id: 2,
              name: "Flights to LA",
              amount: 261,
              creator: "Tom",
              date: "01/21/2023",
            },
            {
              id: 3,
              name: "Hotels",
              amount: 170,
              creator: "David",
              date: "08/02/2023",
            },
          ],
          description: "Road trip with friends",
        };

        setData(backupData);
      }
    };
    fetchEvent();
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const currentUser = jwtDecode(token);
    //const currentUserId = currentUser.id;
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
                <div className="amount">
                  {item.settlement.toFixed(2) === "0.00" ? (
                    <span className="settled"> Settled </span>
                  ) : (
                    `$${item.settlement.toFixed(2)}`
                  )}
                </div>
              </div>
            ))}
        </section>

        <div className="addExpenseBtnDiv">
          <Link to={`/add-expense/${eventId}`} className="btn addExpenseBtn">
            {" "}
            {/* <Link to="/add-expense" className="btn addExpenseBtn"> */}
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
