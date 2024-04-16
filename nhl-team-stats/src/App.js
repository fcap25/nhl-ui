import React from "react";
import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import TeamSummary from "./TeamSummary";
import TeamDetails from "./TeamDetails";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<TeamSummary />} exact />
        <Route path="/:teamAbbreviation" element={<TeamDetails />} />
      </Routes>
    </Router>
  );
}

export default App;
