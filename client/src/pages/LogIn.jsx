import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/LogIn.css";
import { useAuth } from "../authentication/AuthContext";
import { Link } from "react-router-dom";

function LogIn() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const { dispatch } = useAuth();

  const handleLogin = async (event) => {
    event.preventDefault();

    // Access the email and password from the formData state
    const { email, password } = formData;

    // Send a POST request to process login
    try {
      const response = await axios.post("http://localhost:8080/login", {
        email,
        password,
      });
      if (response.data.message === "Login successful!") {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.userInfo));
        dispatch({
          type: "LOGIN",
          user: response.data.userInfo,
          token: response.data.token,
        });
        navigate("/");
      }
    } catch (error) {
      console.error("Login failed: ", error);
    }
  };

  return (
    <div>
      <div className="login-container">
        <form method="post" className="login-form" onSubmit={handleLogin}>
          <h1>Login</h1>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="text"
              id="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleInputChange}
            ></input>
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleInputChange}
            ></input>
          </div>
          <input type="submit" value="Submit" className="submit-button"></input>
          <br></br>
          <br></br>
          <Link to="/register">Create New Account</Link>
        </form>
      </div>
    </div>
  );
}

export default LogIn;
