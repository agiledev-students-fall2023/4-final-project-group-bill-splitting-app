import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Event from "./components/Event";
import "./index.css";
import "./App.css";
import Login from "./components/Login";
import Home from "./components/Home";
import FriendsPage from "./components/FriendsPage";
import Events from "./components/Events"
import Expense from "./components/Expense"; 
import UserInfo from "./components/UserInfo"; 
import AddExpense from "./components/AddExpense";


function App() {
  // used to keep track of which specific event the user choose to see
  const [event, setEvent] = useState({});
  const [isDarkMode, setIsDarkMode] = useState(false);
  const toggleDarkMode = () => setIsDarkMode(prevMode => !prevMode);

  return (
    <div className={`container ${isDarkMode ? 'dark-mode' : ''}`}>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/home" element={<Home isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />} />
          <Route path="/event" element={<Event event={event} />} />
          <Route path="/friends" element={<FriendsPage />} />
          <Route path="/events" element={<Events />} />
          <Route path="/expense/" element={<Expense />} />
          <Route path="/user-info" element={<UserInfo isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />} />
          <Route path="/add-expense" element={<AddExpense />} />
          

        </Routes>
      </Router>
    </div>
  );
}

export default App;