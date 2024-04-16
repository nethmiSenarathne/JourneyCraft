import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Map from "./pages/map";
import Chat from "./pages/chat";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Map />} />
        <Route path="/chat" element={<Chat />} />
      </Routes>
    </Router>
  );
}

export default App;