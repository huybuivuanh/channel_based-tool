import React, { useState } from "react";
import "../../styles/Channel.css";
import Channel from "./Channel";

function ChannelSearchBar({ onSearch, onDelete, channels }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchType, setSearchType] = useState("by-name");
  const [placeHolder, setPlaceHolder] = useState("Search by channel name");

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    onSearch(e.target.value);
  };

  const handleDropdownChange = (event) => {
    const selectedOption = event.target.value;
    const selectedOptionText =
      event.target.options[event.target.selectedIndex].text;
    setPlaceHolder(selectedOptionText);
    setSearchType(selectedOption);
  };

  return (
    <div>
      <div className="search-bar-container">
        <input
          type="search"
          className="search-input"
          placeholder={placeHolder}
          value={searchQuery}
          onChange={handleSearchChange}
        />
        <select
          className="channel-search-dropdown"
          onChange={handleDropdownChange}
        >
          <option value="by-name">Search by channel name</option>
          <option value="by-description">Search by description</option>
          <option value="by-creator">Search by creator</option>
        </select>
      </div>

      {searchQuery !== "" && searchType === "by-name" && (
        <div>
          <h2 style={{ textAlign: "center" }}>Search Results</h2>
          <div className="channel-list">
            {channels
              .filter((channel) =>
                channel.name.toLowerCase().includes(searchQuery.toLowerCase())
              )
              .map((channel, index) => (
                <Channel key={index} channel={channel} onDelete={onDelete} />
              ))}
          </div>
        </div>
      )}

      {searchQuery !== "" && searchType === "by-description" && (
        <div>
          <h2 style={{ textAlign: "center" }}>Search Results</h2>
          <div className="channel-list">
            {channels
              .filter((channel) =>
                channel.description
                  .toLowerCase()
                  .includes(searchQuery.toLowerCase())
              )
              .map((channel, index) => (
                <Channel key={index} channel={channel} onDelete={onDelete} />
              ))}
          </div>
        </div>
      )}
      {searchQuery !== "" && searchType === "by-creator" && (
        <div>
          <h2 style={{ textAlign: "center" }}>Search Results</h2>
          <div className="channel-list">
            {channels
              .filter((channel) =>
                channel.userName
                  .toLowerCase()
                  .includes(searchQuery.toLowerCase())
              )
              .map((channel, index) => (
                <Channel key={index} channel={channel} onDelete={onDelete} />
              ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default ChannelSearchBar;
