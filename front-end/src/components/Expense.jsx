/* Expense.jsx - components of Expense Page */

import React, { useState, useEffect } from "react";
import "../styles/Expense.css";
import axios from "axios";
import Navbar from "./Navbar";
import { useNavigate, useParams } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

function Expense({ isDarkMode }) {
  const [expensesData, setExpensesData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const navigate = useNavigate();
  const { expenseId } = useParams();

  
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
    const year = date.getUTCFullYear();

    return `${monthName} ${day} ${year}`;
  }


  const fetchData = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND}/expense/ExpenseDetail/${expenseId}`
      );
      const processedData = processExpenses(response.data, currentuserId);
      setExpensesData(response.data);
      setFilteredData(processedData);
    } catch (error) {
      console.error("There was an error fetching the data:", error);
    }
  };

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

  useEffect(() => {
    // Toggle the 'body-dark-mode' class on the body element
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
    fetchData();
  }, []);

  const token = localStorage.getItem("token");
  const currentUser = jwtDecode(token);
  const currentuserId = currentUser.id;

  const processExpenses = (expensesData, userId) => {
    const isParticipant = expensesData.splitDetails.some(
      (split) => split.user._id === userId
    );

    let filteredExpenses = [];

    if (expensesData.paidBy._id === userId) {
      if (!isParticipant) {
        // If currentUser is not a participant, then the amount will be positive (owed by others)
        filteredExpenses = expensesData.splitDetails.map(split => ({
          ...split,
          displayName: split.user.username,
          amount: split.settlement.amount
        }));
      } else {
        // If currentUser is also a participant
        filteredExpenses = expensesData.splitDetails.filter(split => split.user._id !== userId).map(split => ({
          ...split,
          displayName: split.user.username,
          amount: split.settlement.amount
        }));
      }
    } else if (isParticipant) {
      // When currentUser is not the one who paid but is a participant
      filteredExpenses = expensesData.splitDetails.filter(split => split.user._id === userId && expensesData.paidBy !== userId).map(split => ({
        ...split,
        displayName: expensesData.paidBy.username,
        amount: -split.settlement.amount
      }));
    }else{
      filteredExpenses = [];
    }
    return filteredExpenses;
  };

  const handleTitleClick = () => {
    navigate(-1);
  };

  const handleSettlementChange = async (e, settlementId) => {
    const newStatus = e.target.checked;
    await settleExpenses(settlementId, newStatus);
    fetchData();
  };

  return (
    <div className="expense">
      <h1 className="page-title" onClick={handleTitleClick}>
        {expensesData.event ? expensesData.event.name : "Loading..."}|
        {expensesData.name ? expensesData.name : "Loading..."}
      </h1>
      <div className="summary">
        <div>• Date: {reformatDate(expensesData.date)}</div>
        <div>
          • Total{" "}
          {expensesData.splitDetails
            ? expensesData.splitDetails.length
            : "Loading..."}{" "}
          people
        </div>
      </div>
      <div className="expense-container">
        {expensesData && (
          <div className="expense-list">
            {filteredData &&
              filteredData
                .sort((a, b) =>
                  a.settlement.status === b.settlement.status
                    ? 0
                    : a.settlement.status
                    ? 1
                    : -1
                )
                .map((split) => (
                  <div className="expense-item" key={split.settlement._id}>
                    <span>{split.displayName}</span>
                    <span
                      className={parseFloat(split.amount) > 0 ? 'positive' : 'negative'}>{split.amount.toFixed(2)}
                    </span>
                    <div className="checkbox">
                      <input
                        type="checkbox"
                        name={split.settlement._id}
                        checked={split.settlement.isChecked}
                        onChange={(e) =>
                          handleSettlementChange(e, split.settlement._id)
                        }
                        defaultChecked={split.settlement.status}
                      />
                    </div>
                  </div>
                ))}
          </div>
        )}
      </div>
      <Navbar />
    </div>
  );
}

export default Expense;
