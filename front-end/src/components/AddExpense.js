import axios from "axios";
import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Navbar from "./Navbar";
import SplitModal from "./SplitModal";
import "../styles/AddExpense.css";

const AddExpense = (props) => {
  const navigate = useNavigate();
  const isDarkMode = props.isDarkMode;
  const { eventId } = useParams();
  const [showModal, setShowModal] = useState(false);
  const [splitMethod, setSplitMethod] = useState("Choose Split Method");
  const [formData, setFormData] = useState({
    name: "",
    amount: "",
    date: "",
    personPaid: "",
    splitMethod: "",
  });

  const [validationMessages, setValidationMessages] = useState({
    name: "",
    amount: "",
    date: "",
    personPaid: "",
    selectedPeople: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "selectedPeople" && e.target.multiple) {
      const selectedOptions = [...e.target.options]
        .filter((o) => o.selected)
        .map((o) => o.value);

      setFormData((prevFormData) => ({
        ...prevFormData,
        selectedPeople: selectedOptions,
      }));

      if (selectedOptions.length > 0) {
        setValidationMessages((prevMessages) => {
          return { ...prevMessages, selectedPeople: "" };
        });
      }
    } else {
      setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: value,
      }));
    }

    // Validation logic
    let message = "";
    if (name === "name") {
      message = value.length < 3 ? "<3 characters" : "";
    } else if (name === "amount") {
      const number = parseFloat(value);
      setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: isNaN(number) ? "" : number,
      }));
      if (isNaN(number)) {
        message = "Invalid entry";
      } else if (number <= 0) {
        message = "Invalid amount";
      }
    } else if (name === "date") {
      if (!value) {
        message = " Enter a date";
      } else if (new Date(value) > new Date()) {
        message = "Invalid date";
      }
    } else if (name === "personPaid") {
      if (!value) {
        message = " Selection required";
      }
    } else if (name === "selectedPeople") {
      if (value.length === 0) {
        message = " Selection required";
      }
    }

    setValidationMessages((prevMessages) => ({
      ...prevMessages,
      [name]: message,
    }));
  };

  const handleMethodChange = (method) => {
    setSplitMethod(method);
    setFormData((prevFormData) => ({
      ...prevFormData,
      splitMethod: method,
    }));
    setShowModal(false);
  };

  const [individualAmounts, setIndividualAmounts] = useState({});

  const handleAmountsChange = (amounts) => {
    setIndividualAmounts(amounts);

    // Check all amounts are valid now
    let allAmountsValid = true;
    for (const amount of Object.values(amounts)) {
      if (typeof amount !== "number" || isNaN(amount) || amount <= 0) {
        allAmountsValid = false;
        break;
      }
    }

    // Clear the error message if all amounts are valid
    if (allAmountsValid) {
      setValidationMessages((prevMessages) => ({
        ...prevMessages,
        individualAmounts: "",
      }));
    }
  };

  const handleAddExpense = async () => {
    let newValidationMessages = {
      name: "",
      amount: "",
      date: "",
      personPaid: "",
      selectedPeople: "",
    };

    let isValid = true;
    let invalidAmounts = false;

    if (formData.name.length < 3) {
      newValidationMessages.name = " <3 characters";
      isValid = false;
    }

    if (!(typeof formData.amount === "number") || isNaN(formData.amount)) {
      newValidationMessages.amount = " Invalid entry";
      isValid = false;
    } else if (formData.amount <= 0) {
      newValidationMessages.amount = " Invalid amount";
      isValid = false;
    }

    if (!formData.date) {
      newValidationMessages.date = " Enter a date";
      isValid = false;
    } else if (new Date(formData.date) > new Date()) {
      newValidationMessages.date = " Invalid date";
      isValid = false;
    }

    if (!formData.personPaid) {
      newValidationMessages.personPaid = " Selection required";
      isValid = false;
    }

    if (selectedPeople.length === 0) {
      newValidationMessages.selectedPeople = "Selection required";
      isValid = false;
    }

    const amountNumber = parseFloat(formData.amount);

    let allAmountsValid = true;

    const peopleSplit = Array.isArray(selectedPeople)
      ? selectedPeople.map((person) => {
          const amount = individualAmounts[person._id];
          if (typeof amount !== "number" || isNaN(amount) || amount <= 0) {
            invalidAmounts = true; // Found an invalid amount
            allAmountsValid = false; // Set the flag to false as we found an invalid amount
          }
          return {
            user: person,
            amount: amount,
          };
        })
      : [];

    if (invalidAmounts) {
      newValidationMessages.individualAmounts =
        "Invalid amount(s) in split details";
    } else {
      // If all amounts are valid, clear the error message
      newValidationMessages.individualAmounts = "";
    }

    isValid = !invalidAmounts;

    setValidationMessages(newValidationMessages);

    if (!isValid) {
      return;
    }

    const submissionData = {
      name: formData.name,
      totalAmount: amountNumber,
      date: new Date(formData.date),
      paidBy: formData.personPaid,
      peopleSplit: peopleSplit,
      event: eventId, // make sure it is not "undefined"
    };
    console.log(submissionData);
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND}/add-expense`,
        submissionData
      );
      // after adding an expense, navigate back to the event
      window.location.href = `/event/${eventId}`;
    } catch (error) {
      if (error.response) {
        console.error("Validation errors:", error.response.data.errors);
        // Log each error message
        error.response.data.errors.forEach((err) => {
          console.error(`${err.param}: ${err.msg}`);
        });
      } else {
        // Handle other types of errors (network issue, request canceled, etc.)
        console.error("Error submitting expense:", error);
      }
    }
  };

  const [people, setPeople] = useState([]);

  useEffect(() => {
    const fetchPeople = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BACKEND}/addExpensePayer/EventMember/${eventId}`
        );
        setPeople(
          Array.isArray(response.data) ? response.data : [response.data]
        );
      } catch (error) {
        console.error("Failed to fetch people:", error);
      }
    };
    fetchPeople();
  }, []);

  const handlePaidByChange = (event) => {
    const selectedUserId = event.target.value;
    setFormData({ ...formData, personPaid: selectedUserId });

    if (selectedUserId) {
      setValidationMessages((prevMessages) => ({
        ...prevMessages,
        personPaid: "",
      }));
    }
  };

  const [selectedPeople, setSelectedPeople] = useState([]);
  const [availablePeople, setAvailablePeople] = useState([]);

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

  useEffect(() => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      selectedPeople: selectedPeople,
    }));
  }, [selectedPeople]);

  useEffect(() => {
    const fetchAvailablePeople = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BACKEND}/addExpensePayer/EventMember/${eventId}`
        );
        setAvailablePeople(response.data);
      } catch (error) {
        console.error("Failed to fetch people:", error);
      }
    };
    fetchAvailablePeople();
  }, []);

  const handleSelectPerson = (personId) => {
    const person = availablePeople.find((p) => p._id === personId);
    if (person) {
      setAvailablePeople(availablePeople.filter((p) => p._id !== personId));
      const updatedSelectedPeople = [...selectedPeople, person];
      setSelectedPeople(updatedSelectedPeople);

      if (updatedSelectedPeople.length > 0) {
        setValidationMessages((prevMessages) => ({
          ...prevMessages,
          selectedPeople: "",
        }));
      }
    }
  };

  const handleRemovePerson = (personId) => {
    const person = selectedPeople.find((p) => p._id === personId);
    if (person) {
      const updatedSelectedPeople = selectedPeople.filter(
        (p) => p._id !== personId
      );
      setSelectedPeople(updatedSelectedPeople);

      if (!availablePeople.some((p) => p.id === personId)) {
        setAvailablePeople([...availablePeople, person]);
      }
    }
  };

  const [amountError, setAmountError] = useState("");
  const isValidAmount = () => {
    const amount = parseFloat(formData.amount);
    return !isNaN(amount) && amount > 0;
  };
  const handleSplitMethodClick = (e) => {
    e.preventDefault();
    if (isValidAmount()) {
      setShowModal(true);
      setAmountError("");
    } else {
      setAmountError("Please enter a valid amount.");
    }
  };
  /* Click Handler Function for button Select All  */
  const handleSelectAll = () => {
    setSelectedPeople([...selectedPeople, ...availablePeople]);
    setAvailablePeople([]);
    setValidationMessages((prevMessages) => ({
      ...prevMessages,
      selectedPeople: "",
    }));
  };

  return (
    <div className="add-expense-page-container">
      {" "}
      {/* add this container to control the dark mode between the outtermost backgroud and the section box*/}
      <header>
        <h2>
          <Link to={`/event/${eventId}`}>Event</Link>|Add New Expense
        </h2>
      </header>
      <div id="addExpense">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleAddExpense();
          }}
        >
          <div id="nameInput">
            <label>Name:</label>
            {validationMessages.name && (
              <span style={{ color: "red" }}>{validationMessages.name}</span>
            )}
            <br />
            <input
              name="name"
              placeholder="Enter a name"
              value={formData.name}
              onChange={handleInputChange}
            />
          </div>
          <div id="amountInput">
            <label>Amount:</label>
            {validationMessages.amount && (
              <span style={{ color: "red" }}>{validationMessages.amount}</span>
            )}
            <br />
            <input
              type="number"
              name="amount"
              placeholder="Enter the amount"
              value={formData.amount}
              onChange={handleInputChange}
            />
          </div>
          <div id="dateInput">
            <label>Date:</label>
            {validationMessages.date && (
              <span style={{ color: "red" }}>{validationMessages.date}</span>
            )}
            <br />
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleInputChange}
            />
          </div>
          <div id="paid">
            <label>Payer:</label>
            <br />
            {validationMessages.personPaid && (
              <span style={{ color: "red" }}>
                {validationMessages.personPaid}
              </span>
            )}
            <br />
            <select
              name="personPaid"
              value={formData.personPaid}
              onChange={handlePaidByChange}
            >
              <option value="">Select who paid</option>
              {Array.isArray(people) &&
                people.map((person) => (
                  <option key={person._id} value={person._id}>
                    {person.username}
                  </option>
                ))}
            </select>
          </div>
          <div id="split">
            <label>Available People:</label>
            {validationMessages.selectedPeople && (
              <span style={{ color: "red" }}>
                {validationMessages.selectedPeople}
              </span>
            )}
            <br />
            <div>
              <select id="available-container" size="5">
                {Array.isArray(availablePeople) &&
                  availablePeople.map((person) => (
                    <option
                      key={person._id}
                      onClick={() => handleSelectPerson(person._id)}
                    >
                      {person.username}
                    </option>
                  ))}
              </select>
              <button type="button" onClick={handleSelectAll}>
                Select All
              </button>
            </div>
          </div>
          <div>
            <label>Selected People:</label>
            <br />
            <div id="selected-container">
              {selectedPeople.map((person) => (
                <div
                  key={person._id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    margin: "5px",
                  }}
                >
                  <img
                    src={person.avatar}
                    alt={person.username}
                    style={{
                      width: "30px",
                      height: "30px",
                      marginRight: "10px",
                    }}
                  />
                  <span>{person.username}</span>
                  <button
                    className="remove-button"
                    onClick={() => handleRemovePerson(person._id)}
                  >
                    {" "}
                    x{" "}
                  </button>
                </div>
              ))}
            </div>
          </div>
          {validationMessages.individualAmounts && (
            <span style={{ color: "red" }}>
              {validationMessages.individualAmounts}
            </span>
          )}
          <div className="splitMethods">
            <button onClick={handleSplitMethodClick}>
              {splitMethod === "equally" ? "Equally" : "By " + splitMethod}
            </button>
            {amountError && <div style={{ color: "red" }}>{amountError}</div>}
          </div>
          <div className="submitBtn">
            <button type="submit">Done</button>
          </div>
          <div className="space-to-scroll"></div>
        </form>
      </div>
      <SplitModal
        onMethodChange={handleMethodChange}
        onAmountsChange={handleAmountsChange}
        showModal={showModal}
        totalAmount={formData.amount}
        participants={formData.selectedPeople}
        onClose={() => setShowModal(false)}
      />
      <Navbar />
    </div>
  );
};

export default AddExpense;
