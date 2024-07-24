import React, { useState } from "react";
import "../../styles/Message.css";
import SearchedMessage from "./SearchedMessage";

function MessageSearchBar({
  messages,
  onReply,
  onDelete,
  upDateCount,
  onSearch,
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [byAuthor, setByAuthor] = useState(false);
  const [placeHolder, setPlaceHolder] = useState("Search by content");

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    onSearch(e.target.value);
  };

  const handleDropdownChange = (event) => {
    const selectedOption = event.target.value;
    const selectedOptionText =
      event.target.options[event.target.selectedIndex].text;
    setPlaceHolder(selectedOptionText);
    setByAuthor(selectedOption === "by-author");
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
          className="message-search-dropdown"
          onChange={handleDropdownChange}
        >
          <option value="by-content">Search by content</option>
          <option value="by-author">Search by author</option>
        </select>
      </div>
      {searchQuery !== "" && byAuthor && (
        <div>
          <h2 style={{ textAlign: "center" }}>Search Results</h2>
          <div className="container">
            {messages
              .filter((message) =>
                message.author.toLowerCase().includes(searchQuery.toLowerCase())
              )
              .map((message, index) => (
                <SearchedMessage
                  key={index}
                  message={message}
                  onReply={onReply}
                  updateCount={upDateCount}
                  onDelte={onDelete}
                />
              ))}
          </div>
        </div>
      )}
      {searchQuery !== "" && !byAuthor && (
        <div>
          <h2 style={{ textAlign: "center" }}>Search Results</h2>
          <div className="container">
            {messages
              .filter((message) =>
                message.content
                  .toLowerCase()
                  .includes(searchQuery.toLowerCase())
              )
              .map((message, index) => (
                <SearchedMessage
                  key={index}
                  message={message}
                  onReply={onReply}
                  updateCount={upDateCount}
                  onDelte={onDelete}
                />
              ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default MessageSearchBar;
