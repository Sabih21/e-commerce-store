import React from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import Dashboard from "../components/Dashboard";

const Home = () => {
  return (
    <div>
      {/* <Navbar /> */}
      <Sidebar />
      <Dashboard />
    </div>
  );
};

export default Home;
