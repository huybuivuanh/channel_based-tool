import React, { useCallback, useEffect, useState } from "react";
import "../../styles/User.css";
import { useAuth } from "../../authentication/AuthContext";
import axios from "axios";
import User from "./User";
import UserSearchBar from "./UserSearchBar";

function UserList() {
  const { authState } = useAuth();
  const { token } = authState;
  const [users, setUsers] = useState([]);

  const [searchQuery, setSearchQuery] = useState("");
  const [sortQuery, setSortQuery] = useState("most-post");

  const fetchUsers = useCallback(async () => {
    try {
      const response = await axios.get("http://localhost:8080/getusers", {
        headers: {
          Authorization: `${token}`,
        },
      });
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users");
    }
  }, [token]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  async function handleDeleteUser(userID) {
    try {
      await axios.delete(`http://localhost:8080/deleteuser/${userID}`, {
        headers: {
          Authorization: `${token}`,
        },
      });
      fetchUsers();
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  }

  function handleSearch(searchQuery) {
    setSearchQuery(searchQuery);
  }

  const handleDropdownChange = (event) => {
    const selectedOption = event.target.value;
    setSortQuery(selectedOption);
  };

  return (
    <div>
      <br></br>
      <UserSearchBar
        onSearch={handleSearch}
        onDelete={handleDeleteUser}
        users={users}
      />
      {searchQuery === "" && (
        <select className="user-sort-dropdown" onChange={handleDropdownChange}>
          <option value="most-post">Sort by most posts</option>
          <option value="least-post">Sort by least posts</option>
          <option value="highest-rating">Sort by highest rating</option>
          <option value="lowest-rating">Sort by lowest rating</option>
          <option value="expert">Sort by expert</option>
          <option value="beginner">Sort by beginner</option>
        </select>
      )}
      <br></br>
      <br></br>
      {searchQuery === "" && sortQuery === "most-post" && (
        <div className="user-list">
          {users
            .slice()
            .sort((a, b) => b.postNum - a.postNum)
            .map((user, index) => (
              <User key={index} user={user} onDelete={handleDeleteUser} />
            ))}
        </div>
      )}
      {searchQuery === "" && sortQuery === "least-post" && (
        <div className="user-list">
          {users
            .slice()
            .sort((a, b) => a.postNum - b.postNum)
            .map((user, index) => (
              <User key={index} user={user} onDelete={handleDeleteUser} />
            ))}
        </div>
      )}
      {searchQuery === "" && sortQuery === "highest-rating" && (
        <div className="user-list">
          {users
            .slice()
            .sort((a, b) => b.rating - a.rating)
            .map((user, index) => (
              <User key={index} user={user} onDelete={handleDeleteUser} />
            ))}
        </div>
      )}

      {searchQuery === "" && sortQuery === "lowest-rating" && (
        <div className="user-list">
          {users
            .slice()
            .sort((a, b) => a.rating - b.rating)
            .map((user, index) => (
              <User key={index} user={user} onDelete={handleDeleteUser} />
            ))}
        </div>
      )}

      {searchQuery === "" && sortQuery === "expert" && (
        <div className="user-list">
          {users
            .slice()
            .sort((a, b) => b.classification - a.classification)
            .map((user, index) => (
              <User key={index} user={user} onDelete={handleDeleteUser} />
            ))}
        </div>
      )}
      {searchQuery === "" && sortQuery === "beginner" && (
        <div className="user-list">
          {users
            .slice()
            .sort((a, b) => a.classification - b.classification)
            .map((user, index) => (
              <User key={index} user={user} onDelete={handleDeleteUser} />
            ))}
        </div>
      )}
    </div>
  );
}

export default UserList;
