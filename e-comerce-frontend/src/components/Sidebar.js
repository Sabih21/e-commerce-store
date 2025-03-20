import React from "react";
import { Link } from "react-router-dom";

const Sidebar = () => {
  return (
    <div style={sidebarStyle}>
      <ul>
        <li><Link to="/" style={linkStyle}>Dashboard</Link></li>
        {/* <li><Link to="/reviews" style={linkStyle}>All Reviews</Link></li> */}
        <li><Link to="/flagged" style={linkStyle}>Flagged Reviews</Link></li>
        <li><Link to="/approved" style={linkStyle}>Approved Reviews</Link></li>

      </ul>
    </div>
  );
};

const sidebarStyle = {
  width: "250px",
  height: "100vh",
  backgroundColor: "#333",
  color: "#fff",
  padding: "20px",
};

const linkStyle = {
  color: "#fff",
  textDecoration: "none",
  padding: "10px 0",
  display: "block",
};

export default Sidebar;
