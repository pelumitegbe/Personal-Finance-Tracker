import React from "react";
import "./index.css";

const TopNavigation = () => {
  return (
    <div className="top-navigation">
      <div className="logo">Finance Tracker</div>
      <div className="nav-links">
        <a href="#about">About</a>
        <a href="/dashboard">Dashboard</a>
      </div>
      <div className="signup-button">
        <button>Sign Up</button>
      </div>
    </div>
  );
};

export default TopNavigation;
