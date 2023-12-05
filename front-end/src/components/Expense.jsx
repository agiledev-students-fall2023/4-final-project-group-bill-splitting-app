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
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const date = new Date(dateStr);
  
    const monthName = months[date.getMonth()];
    const day = date.getDate();
    const year = date.getFullYear();

    return `${monthName} ${day} ${year}`;
}

  const fetchData = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND}/expense/ExpenseDetail/${expenseId}`
      );
      console.log("Fetched Data:", response.data); // Debug
      const processedData = processExpenses(response.data, currentuserId);
      setExpensesData(response.data);
      setFilteredData(processedData);
      console.log(":", processedData);
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
      console.log("Settlements updated:", response.data);
    } catch (error) {
      console.error("Error updating settlements:", error);
      console.log(error.response.data);
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

    if (!isParticipant) {
      // If not a participant, return an empty array or another appropriate value
      return [];
    }

    let filteredExpenses = [];

    if (expensesData.paidBy._id === userId) {
      filteredExpenses = expensesData.splitDetails
        .filter((split) => split.user._id !== userId)
        .map((split) => ({ ...split, displayName: split.user.username }));
    } else {
      filteredExpenses = expensesData.splitDetails
        .filter(
          (split) => split.user._id === userId && expensesData.paidBy !== userId
        )
        .map((split) => ({
          ...split,
          displayName: expensesData.paidBy.username,
        }));
    }
    return filteredExpenses;
  };

  {
    /* navigates to the previous page */
  }
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
                      className={
                        parseFloat(split.settlement.amount) > 0
                          ? "positive"
                          : "negative"
                      }
                    >
                      {split.settlement.amount.toFixed(2)}
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
