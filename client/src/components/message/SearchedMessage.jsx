import React from "react";
import "../../styles/Message.css";
import MessageActions from "./MessageActions";

function SearchedMessage({ message, onReply, onDelte, updateCount }) {
  return (
    <div className="message-container">
      <div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            marginBottom: "10px",
          }}
        >
          {message.profilePic ? (
            <img
              className="author-img"
              src={"http://localhost:8080/" + message.profilePic}
              alt="profile pic"
            />
          ) : (
            <img
              className="author-img"
              src={"http://localhost:8080/default_profile_picture.jpg"}
              alt="profile pic"
            />
          )}
          <div>
            <h3 className="author" style={{ marginLeft: "10px" }}>
              {message.author}
            </h3>
          </div>
          <p className="time">{message.timestamp}</p>
        </div>
        <div className="message-image">
          <p className="message">{message.content}</p>
          {message.imgPath && (
            <img
              className="comment-image"
              src={"http://localhost:8080/" + message.imgPath}
              alt="messsage img"
            />
          )}
        </div>
        <MessageActions
          key={message.id}
          parentID={message.id}
          likes={message.likes}
          dislikes={message.dislikes}
          onReply={onReply}
          updateCount={updateCount}
          onDelete={onDelte}
          message={message}
        ></MessageActions>
      </div>
    </div>
  );
}

export default SearchedMessage;
