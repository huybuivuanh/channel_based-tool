import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/Registration.css";
import { useAuth } from "../authentication/AuthContext";

function Registration() {
  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState(null);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    dateOfBirth: "",
  });

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleImageChange = (event) => {
    const image = event.target.files[0];
    setSelectedImage(image);
  };

  const { dispatch } = useAuth();

  const handleSubmit = async (event) => {
    event.preventDefault();

    const {
      firstName,
      lastName,
      email,
      password,
      confirmPassword,
      dateOfBirth,
    } = formData;

    const data = new FormData();
    data.append("image", selectedImage);
    data.append("firstName", firstName);
    data.append("lastName", lastName);
    data.append("email", email);
    data.append("password", password);
    data.append("dateOfBirth", dateOfBirth);

    if (password !== confirmPassword) {
      console.error("Password does not match!");
      return;
    }

    // Send a POST request to register the user
    try {
      const response = await axios.post("http://localhost:8080/register", data);
      if (response.data.message === "Registered Sucessfull!") {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.userInfo));
        dispatch({
          type: "LOGIN", // Use string directly here, or import from authActions if defined
          user: response.data.userInfo,
          token: response.data.token,
        });
        navigate("/");
      }
    } catch (error) {
      // Handle any errors that occur during the request
      console.error("Registration failed: ", error);
    }
  };

  return (
    <div>
      <div className="register-container">
        <form method="post" className="register-form" onSubmit={handleSubmit}>
          <h1>Sign Up</h1>
          <div className="form-group">
            <label htmlFor="firstName">First Name</label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              placeholder="Enter your first name"
              value={formData.firstName}
              onChange={handleInputChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="lastName">Last Name</label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              placeholder="Enter your last name"
              value={formData.lastName}
              onChange={handleInputChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="dateOfBirth">Date of Birth</label>
            <input
              type="date"
              id="dateOfBirth"
              name="dateOfBirth"
              value={formData.dateOfBirth}
              onChange={handleInputChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="text"
              id="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleInputChange}
            />
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
            />
          </div>
          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              placeholder="Confirm your password"
              value={formData.confirmPassword}
              onChange={handleInputChange}
            />
          </div>
          <div className="form-group">
            <label>Profile Picture (optional)</label>
            <input
              type="file"
              id="image"
              name="image"
              onChange={handleImageChange}
            />
          </div>
          <input type="submit" value="Register" className="submit-button" />
          <br></br>
          <br></br>
          <Link to="/login">Already Have An Account?</Link>
        </form>
      </div>
    </div>
  );
}

export default Registration;
