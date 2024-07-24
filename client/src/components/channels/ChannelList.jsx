import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import Channel from "./Channel";
import AddChannel from "./AddChannel";
import "../../styles/Channel.css";
import { useAuth } from "../../authentication/AuthContext";
import ChannelSearchBar from "./ChannelSearchBar";

function ChannelList() {
  const [channels, setChannels] = useState([]);
  const [showAddChannel, setShowAddChannel] = useState(false);
  const { authState } = useAuth();
  const { token } = authState;

  const [searchQuery, setSearchQuery] = useState("");

  const fetchChannels = useCallback(async () => {
    try {
      const response = await axios.get("http://localhost:8080/getchannels", {
        headers: {
          Authorization: `${token}`,
        },
      });

      if (response.data === "0 channels are created yet!") {
        setChannels([]);
      } else {
        setChannels(response.data);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }, [token]);

  useEffect(() => {
    fetchChannels(); // Initial data fetch when the component mounts
  }, [fetchChannels]);

  async function handleChannelDeletion(channelID) {
    try {
      await axios.delete(`http://localhost:8080/deletechannel/${channelID}`, {
        headers: {
          Authorization: `${token}`,
        },
      });
      fetchChannels();
    } catch (error) {
      console.error("Channel deleting user:", error);
    }
  }

  function handleAddChannelClick() {
    setShowAddChannel(true);
  }

  function handleAddChannelClose() {
    setShowAddChannel(false);
    fetchChannels();
  }

  const handleSubmit = async (data) => {
    try {
      await axios.post("http://localhost:8080/addchannel", data, {
        headers: {
          Authorization: `${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      fetchChannels();
    } catch (err) {
      console.log("Form submission failed: " + err);
    }
  };

  function handleSearch(searchQuery) {
    setSearchQuery(searchQuery);
  }

  return (
    <div>
      <br></br>
      <ChannelSearchBar
        onSearch={handleSearch}
        channels={channels}
        onDelete={handleChannelDeletion}
      />
      {showAddChannel && (
        <AddChannel onSubmit={handleSubmit} onClose={handleAddChannelClose} />
      )}
      {searchQuery === "" && (
        <div>
          <button
            onClick={handleAddChannelClick}
            className="add-channel-button"
          >
            Add Channel
          </button>
          {channels.length !== 0 ? (
            <div className="channel-list">
              {channels.map((channel, index) => (
                <Channel
                  key={index}
                  channel={channel}
                  onDelete={handleChannelDeletion}
                />
              ))}
            </div>
          ) : (
            <h2 style={{ textAlign: "center" }}>
              No channels are created yet!
            </h2>
          )}
        </div>
      )}
    </div>
  );
}

export default ChannelList;
