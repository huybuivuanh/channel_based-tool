import React, { useState } from "react";
import "../../styles/User.css";
import User from "./User";

function UserSearchBar({ onSearch, onDelete, users }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchType, setSearchType] = useState("by-first");
  const [placeHolder, setPlaceHolder] = useState("Search by first name");

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
          className="user-search-dropdown"
          onChange={handleDropdownChange}
        >
          <option value="by-first">Search by first name</option>
          <option value="by-last">Search by last name</option>
          <option value="by-email">Search by email</option>
        </select>
      </div>

      {searchQuery !== "" && searchType === "by-first" && (
        <div>
          <h2 style={{ textAlign: "center" }}>Search Results</h2>
          <div className="user-list">
            {users
              .filter((user) =>
                user.fName.toLowerCase().includes(searchQuery.toLowerCase())
              )
              .map((user, index) => (
                <User key={index} user={user} onDelete={onDelete} />
              ))}
          </div>
        </div>
      )}

      {searchQuery !== "" && searchType === "by-last" && (
        <div>
          <h2 style={{ textAlign: "center" }}>Search Results</h2>
          <div className="user-list">
            {users
              .filter((user) =>
                user.lName.toLowerCase().includes(searchQuery.toLowerCase())
              )
              .map((user, index) => (
                <User key={index} user={user} onDelete={onDelete} />
              ))}
          </div>
        </div>
      )}

      {searchQuery !== "" && searchType === "by-email" && (
        <div>
          <h2 style={{ textAlign: "center" }}>Search Results</h2>
          <div className="user-list">
            {users
              .filter((user) =>
                user.email.toLowerCase().includes(searchQuery.toLowerCase())
              )
              .map((user, index) => (
                <User key={index} user={user} onDelete={onDelete} />
              ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default UserSearchBar;
