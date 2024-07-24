import React from "react";
import { Link } from "react-router-dom";
import "../styles/Navigation.css";
import { useAuth } from "../authentication/AuthContext";

function Navigation() {
  const { dispatch } = useAuth();
  function handleLogout() {
    dispatch({
      type: "LOGOUT",
    });
  }
  return (
    <nav className="navbar">
      <ul className="nav-list">
        <li className="nav-item">
          <Link to="/" className="nav-link">
            About Us
          </Link>
        </li>
        <li className="nav-item">
          <Link to="/channelpage" className="nav-link">
            Channels
          </Link>
        </li>
        <li className="nav-item">
          <Link to="/userpage" className="nav-link">
            Users
          </Link>
        </li>
        <li className="nav-item">
          <Link to="/profile" className="nav-link">
            Profile
          </Link>
        </li>
        <li className="nav-item">
          <button onClick={handleLogout} className="nav-link">
            Log out
          </button>
        </li>
      </ul>
    </nav>
  );
}

export default Navigation;
