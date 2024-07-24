import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import "../../styles/Message.css";
import { useAuth } from "../../authentication/AuthContext";
import Message from "./Message";
import AddMessage from "./AddMessage";
import MessageseSearchBar from "./MessageSearchBar";
import { useNavigate } from "react-router-dom";

function MessageList() {
  const [messageTree, setMessageTree] = useState([]);
  const [messages, setMessages] = useState([]);
  const [showAddMessages, setShowAddMessages] = useState(false);
  const { authState } = useAuth();
  const { token } = authState;
  const channelID = localStorage.getItem("channelID");
  const [searchQuery, setSearchQuery] = useState("");

  const navigate = useNavigate();

  // Function to fetch messages
  const fetchMessages = useCallback(async () => {
    try {
      const response = await axios.post(
        "http://localhost:8080/getmessages",
        { channelID },
        {
          headers: {
            Authorization: `${token}`,
          },
        }
      );

      const { tree, flatTree } = response.data;

      if (!tree) {
        setMessageTree([]);
        setMessages([]);
      } else {
        setMessageTree(tree);
        setMessages(flatTree);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }, [token, channelID]);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  async function handleMessageDeletion(message) {
    const root = [message];
    try {
      await axios.post(
        "http://localhost:8080/deletemessage",
        { root },
        {
          headers: {
            Authorization: `${token}`,
          },
        }
      );
      fetchMessages();
    } catch (error) {
      console.error("Error deleting message:", error);
    }
  }

  function handleAddMessageClick() {
    setShowAddMessages(true);
  }

  function handleAddMessageClose() {
    setShowAddMessages(false);
    fetchMessages();
  }

  const handleUpdateCount = async (
    messageID,
    likeCount,
    dislikeCount,
    userID,
    reaction
  ) => {
    try {
      await axios.patch(
        "http://localhost:8080/updatecount",
        { messageID, likeCount, dislikeCount, userID, reaction },
        {
          headers: {
            Authorization: `${token}`,
          },
        }
      );
      fetchMessages();
    } catch (error) {
      console.error("Error updating count:", error);
    }
  };

  const handleSubmitReply = async (data) => {
    try {
      await axios.post("http://localhost:8080/addmessage", data, {
        headers: {
          Authorization: token,
          "Content-Type": "multipart/form-data",
        },
      });
      fetchMessages();
    } catch (err) {
      console.log("Form submission failed: " + err);
    }
  };

  function handleSearch(searchQuery) {
    setSearchQuery(searchQuery);
  }

  function handleBackToChannels() {
    navigate("/channelpage");
  }

  return (
    <div>
      <br></br>
      <MessageseSearchBar
        onSearch={handleSearch}
        messages={messages}
        onReply={handleSubmitReply}
        onDelete={handleMessageDeletion}
        upDateCount={handleUpdateCount}
      ></MessageseSearchBar>
      {searchQuery === "" && (
        <div>
          <button onClick={handleBackToChannels} className="add-message-button">
            Back To Channels
          </button>
          <button
            onClick={handleAddMessageClick}
            className="add-message-button"
          >
            Add Message
          </button>
          {showAddMessages && (
            <AddMessage
              close={handleAddMessageClose}
              onClose={handleAddMessageClose}
              onSubmit={handleSubmitReply}
            />
          )}
          {messages.length !== 0 ? (
            <div className="container">
              {messageTree.map((message) => (
                <div key={message.id}>
                  <Message
                    message={message} // message object
                    updateCount={handleUpdateCount}
                    onReply={handleSubmitReply}
                    onDelete={handleMessageDeletion}
                  />
                  <br></br>
                </div>
              ))}
            </div>
          ) : (
            <h2 style={{ textAlign: "center" }}>
              No messages are created yet!
            </h2>
          )}
        </div>
      )}
    </div>
  );
}

export default MessageList;
