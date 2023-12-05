import React, { useState, useEffect } from "react";
import "../styles/Events.css";
import Navbar from "./Navbar";
import { Link } from "react-router-dom";
import axios from "axios";
import AddEvent from "./AddEvent";
import EventsFilter from "../images/filter.png";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";

function Events({ isDarkMode }) {
  const [eventData, setEventData] = useState([]);
  const [addEvent, setaddEvent] = useState(false);
  const [settlements, setSettlements] = useState([]);
  const [amountOwed, setAmountOwed] = useState(0);
  const [amountOwedBy, setAmountOwedBy] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  //const[showFilter, setShowFilter] = useState(false);
  //const[selectedFilter, setSelectedFilter] = useState('all');
  //const[filteredEvents, setFilteredEvents] = useState([]);

  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const navigate = useNavigate();
  const [decode, setDecode] = useState(0); // Declare decode at the top level

  const handleButtonClick = () => {
    navigate("/");
  };

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

  useEffect(() => {
    async function check() {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.error("No token found");
          console.error("Please log in to view pages");
          setIsLoggedIn(false);
          return;
        }
        const decodedToken = jwtDecode(token);
        setDecode(decodedToken);
      } catch (error) {
        console.error("There was an error fetching the data:", error);
      }
    }
    check();
  }, []);

  useEffect(() => {
    //fetch mock data about a user's events list
    async function dataFetch() {
      try {
        if (!decode.id) {
          console.error("No current user found in local storage.");
          return;
        } else {
          console.log(decode.id);
        }
        //requesting data from the mock API endpoint
        const response = await axios.get(
          `http://localhost:3001/events/for/${decode.id}`
        );
        console.log(response);
        //return the data
        setEventData(response.data);
      } catch (error) {
        console.error("There was an error fetching the data:", error);
      }
    }
    dataFetch();
  }, [decode]);

  useEffect(() => {
    console.log(decode.id);
    const fetchSettlements = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3001/settlement/from/${decode.id}`
        );
        console.log("Settlements:", response.data);
        setSettlements(response.data);
        // Process and use the fetched settlements here
      } catch (error) {
        console.error("Error fetching settlements:", error.response);
      }
    };

    fetchSettlements();
  }, [decode]);

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
      // Now you can use amountOwed and amountOwedBy in your component
      console.log(
        `Amount Owed: ${amountOwed}, Amount Owed By: ${amountOwedBy}`
      );
    }
  }, [settlements, decode.id]);

  function EventClick(eventId) {
    console.log(`Event ${eventId} was clicked`);
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
