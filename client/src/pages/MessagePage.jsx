import { React } from "react";
import Navigation from "../components/Navigation";
import MessageList from "../components/message/MessageList";
import { useRequireAuth } from "../authentication/AuthCheck";

function MessagePage() {
  const isAuthenticated = useRequireAuth();

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div>
      <Navigation></Navigation>
      <MessageList></MessageList>
    </div>
  );
}

export default MessagePage;
