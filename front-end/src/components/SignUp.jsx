import React, { useState, useEffect } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import axios from "axios";
import "../styles/SignUp.css";

const Signup = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [response, setResponse] = useState({});
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  useEffect(() => {
    if (response.success && response.token) {
      console.log(`User successfully logged in: ${response.username}`);
      localStorage.setItem("token", response.token);
    }
  }, [response]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND}/signup`,
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log(`Server response: ${JSON.stringify(response.data, null, 0)}`);
      setResponse(response.data);

      if (!response.data.success) {
        setErrorMessage(response.data.message);
      } else {
        navigate("/", { state: { showAlert: true } });
      }
    } catch (error) {
      setErrorMessage(
        "Email or Username has already been taken, please try a different one!"
      );
    }
  };
  if (!response.success)
    return (
      <div className="signup-container">
        <div className="signup-form">
          <h2 className="signup-title">Sign Up</h2>
          {errorMessage ? <p className="error">{errorMessage}</p> : ""}
          <form onSubmit={handleSubmit} className="space-y-4">
            <label htmlFor="email" className="signup-label">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              className="signup-input"
            />
            <label htmlFor="username" className="signup-label">
              Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              required
              className="signup-input"
            />

            <label htmlFor="password" className="signup-label">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              required
              className="signup-input"
            />

            <button type="submit" className="signup-button">
              Sign Up
            </button>
          </form>

          <div className="mt-4">
            <p>
              Already have an account?{" "}
              <a href="/" className="signup-link">
                Login
              </a>
            </p>
          </div>
        </div>
      </div>
    );
  else return <Navigate to="/" />;
};

export default Signup;
