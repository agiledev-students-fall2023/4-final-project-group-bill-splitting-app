import React, { useState, useEffect } from "react";
import "../styles/Events.css";
import Navbar from "./Navbar";
import { Link } from "react-router-dom";
import axios from "axios";
import AddEvent from "./AddEvent";
import { jwtDecode } from "jwt-decode";

function Events({ isDarkMode }) {
  const [eventData, setEventData] = useState([]);
  const [addEvent, setaddEvent] = useState(false);
  const [settlements, setSettlements] = useState([]);
  const [amountOwed, setAmountOwed] = useState(0);
  const [amountOwedBy, setAmountOwedBy] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");

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

    // Create a new Date object in local time zone
    const date = new Date(dateStr);

    // Convert it back to UTC
    date.setMinutes(date.getMinutes() + date.getTimezoneOffset());

    const monthName = months[date.getUTCMonth()];
    const day = date.getUTCDate();
    const year = date.getUTCFullYear();

    return `${monthName} ${day} ${year}`;
  }

  // Toggle the 'body-dark-mode' class on the body element
  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add("body-dark-mode");
    } else {
      document.body.classList.remove("body-dark-mode");
    }

    // Clean up function to remove the class when the component unmounts or when dark mode is turned off
    return () => {
      document.body.classList.remove("body-dark-mode");
    };
  }, [isDarkMode]);

  const token = localStorage.getItem("token");
  const decode = jwtDecode(token);

  useEffect(() => {
    //fetch mock data about a user's events list
    async function dataFetch() {
      try {
        if (!decode.id) {
          console.error("No current user found in local storage.");
          return;
        }
        //requesting data from the mock API endpoint
        const response = await axios.get(
          `${process.env.REACT_APP_BACKEND}/events/for/${decode.id}`
        );
        //return the data
        setEventData(response.data);
      } catch (error) {
        console.error("There was an error fetching the data:", error);
      }
    }
    dataFetch();
  }, [decode.id]);

  useEffect(() => {
    const fetchSettlements = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BACKEND}/settlement/from/${decode.id}`
        );
        setSettlements(response.data);
        // Process and use the fetched settlements here
      } catch (error) {
        console.error("Error fetching settlements:", error.response);
      }
    };

    fetchSettlements();
  }, [decode.id]);

  function calculateAmounts(expenses, currentUserId) {
    let amountOwed = 0; // Amount the current user owes to others
    let amountOwedBy = 0; // Amount owed to the current user by others

    expenses.forEach((expense) => {
      if (expense.settleTo._id !== currentUserId && !expense.status) {
        // If the current user is not the one who paid and the status is false (unsettled)
        amountOwed += expense.amount;
      }
      if (expense.settleTo._id === currentUserId && !expense.status) {
        // If the current user is the one who paid and the status is false (unsettled)
        amountOwedBy += expense.amount;
      }
    });

    return { amountOwed, amountOwedBy };
  }

  useEffect(() => {
    if (settlements.length > 0) {
      const { amountOwed, amountOwedBy } = calculateAmounts(
        settlements,
        decode.id
      );
      setAmountOwed(amountOwed);
      setAmountOwedBy(amountOwedBy);
    }
  }, [settlements, decode.id]);

  function EventClick(eventId) {
    console.log(`Event ${eventId} was clicked`);
  }

  return (
    <div className="Events">
      <h1 className="title">Events</h1>
      <button className="add_events_button" onClick={() => setaddEvent(true)}>
        Add Events
      </button>

      <div className="Total_Balance_Section">
        <img
          src={eventData.avatar}
          alt="User's Avatar"
          className="Total_Balance_avatar"
        ></img>
        <div>
          <div className="Total_Balance_title">Total Balance</div>
          <div className="balance_details">
            {<div> You owe ${Math.abs(amountOwed).toFixed(2)}</div>}
            {<div> You are owed ${amountOwedBy.toFixed(2)}</div>}
            {amountOwed === 0 && amountOwedBy === 0 && (
              <div> All Balances are Settled!</div>
            )}
          </div>
        </div>
      </div>

      <input
        type="text"
        placeholder="Search for an event..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mt-4 search-input"
      />

      <div className="events-list">
        <ul>
          {eventData.events && eventData.events.length > 0 ? (
            eventData.events
              .filter((event) =>
                event.name.toLowerCase().includes(searchTerm.toLowerCase())
              )
              .map((event) => (
                <li key={event._id} className="event-list">
                  <div className="Event-date">{reformatDate(event.date)}</div>
                  <div className="Event-name" style={{ marginBottom: "5px" }}>
                    <span>{event.name}</span>
                  </div>
                  <Link to={`/event/${event._id}`}>
                    <button onClick={() => EventClick(event.id)}>
                      View Event
                    </button>
                  </Link>
                </li>
              ))
          ) : (
            <div className="no-events-message">
              Please add your first event!
            </div>
          )}
        </ul>
      </div>

      {addEvent && (
        <AddEvent
          addEvent={addEvent}
          onClose={() => {
            setaddEvent(false);
            window.location.reload();
          }}
        />
      )}
      <div className="navbar-placeholder" style={{ height: "4rem" }}></div>
      <div className="mt-6">
        <Navbar />
      </div>
    </div>
  );
}

export default Events;
