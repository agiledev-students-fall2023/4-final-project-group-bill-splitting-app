import React, { useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import axios from "axios";
import "../styles/ForgotPassword.css";

const ForgotPassword = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    newPassword: "",
  });

  const navigate = useNavigate();
  const [response, setResponse] = useState({});
  const [errorMessage, setErrorMessage] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:3001/forgot-password",
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
      setErrorMessage("something went wrong with forgot password!");
    }
  };

  if (!response.success)
    return (
      <div className="forgot-password-container">
        <div className="forgot-password-form">
          <h2 className="forgot-password-title">Forgot Password</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <label htmlFor="email" className="forgot-password-label">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              className="forgot-password-input"
            />
            <label htmlFor="username" className="forgot-password-label">
              Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              required
              className="forgot-password-input"
            />

            <label htmlFor="newPassword" className="forgot-password-label">
              New Password
            </label>
            <input
              type="password"
              id="newPassword"
              name="newPassword"
              value={formData.newPassword}
              onChange={handleInputChange}
              required
              className="forgot-password-input"
            />

            <button type="submit" className="forgot-password-button">
              Reset Password
            </button>
          </form>

          <div className="mt-4">
            <p>
              Remember your password?{" "}
              <a href="/" className="forgot-password-link">
                Login
              </a>
            </p>
          </div>
        </div>
      </div>
    );
  else return <Navigate to="/" />;
};

export default ForgotPassword;
