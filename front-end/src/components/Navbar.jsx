import React from "react";
import { Link, useParams } from "react-router-dom";
import "../styles/Navbar.css";
import { useLocation } from "react-router-dom";
import calendar from "../images/calendar.png";
import group from "../images/group.png";
import home from "../images/home.png";
import person from "../images/person.png";
import { jwtDecode } from "jwt-decode";

const Navbar = ({ isDarkMode }) => {
  const location = useLocation();
  const pathName = location.pathname;

  // extract userId for link to User Page
  const token = localStorage.getItem("token");
  if (!token) {
    console.error("No token found");
    console.error("Plese login in view pages");
    return null;
  }
  const decoded = jwtDecode(token);
  const userId = decoded.id;

  //changed up the events route and removed contact page
  return (
    <nav className={`navbar ${isDarkMode ? "dark-mode" : ""}`}>
      <ul>
        <li className={pathName === "/home" ? "active" : "normal"}>
          <img
            src={home}
            alt="User Icon"
            style={{ width: "30px", height: "30px" }}
            className="user-image"
          />
          <Link to="/home" className="pl-2">
            {" "}
            Home{" "}
          </Link>
        </li>
        <li className={pathName === "/events" ? "active " : "normal"}>
          <img
            src={calendar}
            alt="User Icon"
            style={{ width: "30px", height: "30px" }}
            className="user-image"
          />
          <Link to="/events">Events</Link>
        </li>
        <li className={pathName === "/friends" ? "active" : "normal"}>
          <img
            src={group}
            alt="User Icon"
            style={{ width: "30px", height: "30px" }}
            className="user-image"
          />
          <Link to="/friends">Friends</Link>
        </li>
        <li className={pathName === "/user-info" ? "active" : "normal"}>
          <img
            src={person}
            alt="User Icon"
            style={{ width: "30px", height: "30px" }}
            className="user-image"
          />
          <Link to={"/user-info"} className="pl-2">
            User
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
