import React from "react";

const Dashboard = () => {
  return (
    <div style={contentStyle}>
      <h4>Welcome to your Dashboard</h4>
      <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
        <div style={cardStyle}>
          <h5>Total Users</h5>
          <p>1,250</p>
        </div>
        <div style={cardStyle}>
          <h5>Sales</h5>
          <p>$32,000</p>
        </div>
        <div style={cardStyle}>
          <h5>Orders</h5>
          <p>450</p>
        </div>
      </div>
    </div>
  );
};

const contentStyle = {
  marginLeft: "270px",
  padding: "20px",
};

const cardStyle = {
  border: "1px solid #ddd",
  padding: "20px",
  width: "30%",
  textAlign: "center",
  borderRadius: "8px",
  boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
  marginBottom: "20px",
};

export default Dashboard;
