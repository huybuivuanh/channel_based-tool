import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/LogIn";
import Registration from "./pages/Registration";
import Profile from "./components/user/Profile";
import ChannelPage from "./pages/ChannelPage";
import MessagePage from "./pages/MessagePage";
import UserPage from "./pages/UserPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" exact element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Registration />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/channelpage" element={<ChannelPage />} />
        <Route path="/messagepage" element={<MessagePage />} />
        <Route path="/userpage" element={<UserPage />} />
      </Routes>
    </Router>
  );
}

export default App;
