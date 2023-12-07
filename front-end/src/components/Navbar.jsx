import React from "react";
import { Link } from "react-router-dom";
import "../styles/Navbar.css";
import { useLocation } from "react-router-dom";
import calendar from "../images/calendar.png";
import group from "../images/group.png";
import home from "../images/home.png";
import person from "../images/person.png";

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

  //changed up the events route and removed contact page
  return (
    <nav className={`navbar ${isDarkMode ? "dark-mode" : ""}`}>
      <ul>
        <li className={pathName === "/home" ? "active" : "normal"}>
          <Link to="/home" className="pl-2">
            <img
              src={home}
              alt="User Icon"
              style={{ width: "28px", height: "32px" }}
              className="user-image-home"
            />{" "}
          </Link>
          Home{" "}
        </li>
        <li className={pathName === "/events" ? "active " : "normal"}>
          <Link to="/events">
            {" "}
            <img
              src={calendar}
              alt="User Icon"
              style={{ width: "30px", height: "30px" }}
              className="user-image"
            />
            Events
          </Link>
        </li>
        <li className={pathName === "/friends" ? "active" : "normal"}>
          <Link to="/friends">
            {" "}
            <img
              src={group}
              alt="User Icon"
              style={{ width: "30px", height: "30px" }}
              className="user-image"
            />
            Friends
          </Link>
        </li>
        <li className={pathName === "/user-info" ? "active" : "normal"}>
          <Link to={"/user-info"} className="pl-4">
            <img
              src={person}
              alt="User Icon"
              style={{ width: "30", height: "32px" }}
              className="user-image-user"
            />
          </Link>
          User
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
