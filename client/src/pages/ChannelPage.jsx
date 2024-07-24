import React from "react";
import Navigation from "../components/Navigation";
import { useRequireAuth } from "../authentication/AuthCheck";
import ChannelList from "../components/channels/ChannelList";

function ChannelPage() {
  const isAuthenticated = useRequireAuth();

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div>
      <Navigation></Navigation>
      <ChannelList></ChannelList>
    </div>
  );
}

export default ChannelPage;
