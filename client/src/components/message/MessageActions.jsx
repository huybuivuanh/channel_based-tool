import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import "../../styles/Message.css";
import { useAuth } from "../../authentication/AuthContext";

function MessageActions({ onReply, onDelete, updateCount, message }) {
  const [showReplyBox, setShowReplyBox] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [reaction, setReaction] = useState(0);
  const [selectedImage, setSelectedImage] = useState(null);
  const { authState } = useAuth();
  const { user, token } = authState;
  const userID = user.id;
  const messageID = message.id;

  // Function to fetch reaction
  const fetchReaction = useCallback(async () => {
    try {
      const response = await axios.post(
        "http://localhost:8080/getreaction",
        { userID, messageID },
        {
          headers: {
            Authorization: `${token}`,
          },
        }
      );
      if (response.data !== "No reaction found for this message") {
        setReaction(response.data.reaction);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }, [token, userID, messageID]);

  useEffect(() => {
    fetchReaction();
  }, [fetchReaction]);

  function handleReply() {
    setShowReplyBox(!showReplyBox);
  }

  function handleReplyChange(event) {
    setReplyText(event.target.value);
  }

  function handleImageChange(event) {
    const image = event.target.files[0];
    setSelectedImage(image);
  }

  async function onLike() {
    var newLikes;
    var newDislikes = message.dislikes;
    var newReaction = 1;
    if (reaction === 0) {
      newLikes = message.likes + 1;
    } else if (reaction === -1) {
      newLikes = message.likes + 1;
      newDislikes = message.dislikes - 1;
    } else {
      newLikes = message.likes - 1;
      newReaction = 0;
    }

    try {
      await updateCount(messageID, newLikes, newDislikes, userID, newReaction);
      await fetchReaction();
    } catch (error) {
      console.error("Error:", error);
    }
  }

  async function onDislike() {
    var newLikes = message.likes;
    var newDislikes;
    var newReaction = -1;
    if (reaction === 0) {
      newDislikes = message.dislikes + 1;
    } else if (reaction === 1) {
      newDislikes = message.dislikes + 1;
      newLikes = message.likes - 1;
    } else {
      newDislikes = message.dislikes - 1;
      newReaction = 0;
    }
    try {
      await updateCount(messageID, newLikes, newDislikes, userID, newReaction);
      await fetchReaction();
    } catch (error) {
      console.error("Error:", error);
    }
  }

  function handleReplySubmit() {
    const message = replyText;
    const channelID = localStorage.getItem("channelID");

    // Create a FormData object
    const data = new FormData();
    data.append("message", message);
    data.append("image", selectedImage);
    data.append("userID", userID);
    data.append("channelID", channelID);
    data.append("parentID", messageID);
    onReply(data);
    handleCancelReply();
  }

  function handleCancelReply() {
    setShowReplyBox(false);
    setReplyText("");
    setSelectedImage(null);
  }

  function handleDelete() {
    onDelete(message);
  }

  return (
    <div>
      <div className="message-actions">
        <button onClick={onLike}>Like</button>
        <p>{message.likes}</p>
        <button onClick={onDislike}>Dislike</button>
        <p>{message.dislikes}</p>
        <button onClick={handleReply}>Reply</button>
        {user.role === "admin" && (
          <button onClick={handleDelete}>Delete</button>
        )}
      </div>
      {showReplyBox && (
        <div className="reply-textfield">
          <input
            type="text"
            value={replyText}
            onChange={handleReplyChange}
            placeholder="Type your reply..."
          />
          <input
            type="file"
            id="image"
            name="image"
            onChange={handleImageChange}
          />
          <div className="message-actions-2">
            <button onClick={handleReplySubmit}>Submit</button>
            <button onClick={handleCancelReply}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default MessageActions;
