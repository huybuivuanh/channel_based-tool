import React from "react";
import { useRequireAuth } from "../authentication/AuthCheck";
import UserList from "../components/user/UserList";
import Navigation from "../components/Navigation";

function UserPage() {
  const isAuthenticated = useRequireAuth();

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div>
      <Navigation></Navigation>
      <UserList></UserList>
    </div>
  );
}

export default UserPage;
