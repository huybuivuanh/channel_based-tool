import "../../styles/Channel.css";
import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../authentication/AuthContext";

function Channel({ channel, onDelete }) {
  const navigate = useNavigate();
  const { authState } = useAuth();
  const { user } = authState;

  function handleGoToChannel() {
    localStorage.setItem("channelID", channel.id);
    navigate("/messagepage");
  }

  return (
    <div className="channel-card">
      <div className="channel-card-container">
        <div className="channel-card-top">
          <h2 className="channel-card-name">{channel.name}</h2>
        </div>
        {channel.imgPath ? (
          <img
            src={"http://localhost:8080/" + channel.imgPath}
            alt="Channel Avatar"
          />
        ) : (
          <img
            src={"http://localhost:8080/default_channel_image.jpg"}
            alt="Channel Avatar"
          />
        )}
        <div className="channel-card-bottom">
          <p className="channel-card-info">
            <strong>Description: </strong>
            {channel.description}
          </p>
          <p className="channel-card-info">
            <strong>Creator: </strong>
            {channel.userName}
          </p>
          <p className="channel-card-info">
            <strong>Created: </strong>
            {new Date(channel.created).toLocaleDateString()}
          </p>
          <div className="channel-card-buttons">
            <button className="channel-card-button" onClick={handleGoToChannel}>
              Go To Channel
            </button>
            {user.role === "admin" && (
              <button
                className="delete-card-button"
                onClick={() => onDelete(channel.id)}
              >
                Delete
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Channel;
