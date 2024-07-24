import React from "react";
import Navigation from "../Navigation";
import { useRequireAuth } from "../../authentication/AuthCheck";
import "../../styles/User.css";
import { useAuth } from "../../authentication/AuthContext";

function Profile() {
  const isAuthenticated = useRequireAuth();
  const { authState } = useAuth();
  const { user } = authState;

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div>
      <Navigation></Navigation>
      <div className="profile-container">
        <div className="profile-header">
          {!user.imgPath ? (
            <img
              src="http://localhost:8080/default_profile_picture.jpg"
              alt="profile pic"
              className="profile-picture"
            />
          ) : (
            <img
              src={"http://localhost:8080/" + user.imgPath}
              alt="Zoro"
              className="profile-picture"
            />
          )}

          <h1 className="profile-name">
            {user.fName} {user.lName}
          </h1>
        </div>
        <div className="profile-info">
          <div className="info-container">
            <h2>User ID:</h2>
            <p>{user.id}</p>
          </div>
          <div className="info-container">
            <h2>First Name:</h2>
            <p>{user.fName}</p>
          </div>
          <div className="info-container">
            <h2>Last Name:</h2>
            <p>{user.lName}</p>
          </div>
          <div className="info-container">
            <h2>Date Of Birth:</h2>
            <p>{new Date(user.DOB).toLocaleDateString()}</p>
          </div>
          <div className="info-container">
            <h2>Email:</h2>
            <p>{user.email}</p>
          </div>
          <div className="info-container">
            <h2>Posts:</h2>
            <p>{user.postNum}</p>
          </div>
          <div className="info-container">
            <h2>Joined:</h2>
            <p>{new Date(user.created).toLocaleDateString()}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
