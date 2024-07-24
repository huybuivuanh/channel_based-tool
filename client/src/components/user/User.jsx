import React from "react";
import "../../styles/User.css";
import { useAuth } from "../../authentication/AuthContext";

function User({ user, onDelete }) {
  const { authState } = useAuth();
  return (
    <div className="user-card">
      <div className="user-card-container">
        <div className="user-card-top">
          <h2 className="user-card-name">{`${user.fName} ${user.lName}`}</h2>
        </div>
        {!user.imgPath ? (
          <div className="profile-picture-container">
            <img
              src={"http://localhost:8080/default_profile_picture.jpg"}
              alt="User Avatar"
            />
          </div>
        ) : (
          <div className="profile-picture-container">
            <img
              src={"http://localhost:8080/" + user.imgPath}
              alt="User Avatar"
            />
          </div>
        )}

        <div className="user-card-bottom">
          <p className="user-card-info">
            <strong>Role: </strong>
            {user.role}
          </p>
          {/* <p className="user-card-info">
            <strong>User ID: </strong>
            {user.id}
          </p> */}
          <p className="user-card-info" style={{ marginBottom: "0" }}>
            <strong>Email: </strong>
          </p>
          <p style={{ padding: "0 0 0 0", margin: "0 0 3px 0" }}>
            {user.email}
          </p>
          <p className="user-card-info">
            <strong>Posts: </strong>
            {user.postNum}
          </p>
          {user.rating !== -1 ? (
            <p className="user-card-info">
              <strong>Rating: </strong>
              {user.rating}/10
            </p>
          ) : (
            <p className="user-card-info">
              <strong>Rating: </strong>No rating
            </p>
          )}
          {user.classification === 1 && (
            <p className="user-card-info">
              <strong>Classification: </strong>Beginner
            </p>
          )}
          {user.classification === 2 && (
            <p className="user-card-info">
              <strong>Classification: </strong>Intermediate
            </p>
          )}
          {user.classification === 3 && (
            <p className="user-card-info">
              <strong>Classification: </strong>Expert
            </p>
          )}
          {/* <p className="user-card-info">
            <strong>Date Of Birth: </strong>
            {new Date(user.DOB).toLocaleDateString()}
          </p> */}
          <p className="user-card-info">
            <strong>Joined: </strong>
            {new Date(user.created).toLocaleDateString()}
          </p>
          {user.role !== "admin" && authState.user.role === "admin" && (
            <div className="user-card-buttons">
              <button
                className="user-card-button"
                onClick={() => onDelete(user.id)}
              >
                Delete
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default User;
