import React from "react";
import { NavLink } from "react-router-dom";
import "./Navbar.css";

const Navbar = () => {
  const navLinkStyles = ({ isActive }) =>
    isActive
      ? "bg-blue-600 text-white font-bold py-2 px-4 rounded"
      : "text-blue-600 bg-white font-semibold py-2 px-4 rounded hover:bg-gray-200 transition duration-200";

  return (
    <nav className="bg-white shadow px-6 py-4 flex items-center justify-between">
      <h1 className="text-xl font-semibold text-blue-700">STUDENT PORTAL</h1>
      <div className="space-x-6">
        <NavLink to="/" className={navLinkStyles}>
          <button className="btn">Dashboard</button>
        </NavLink>
        <NavLink to="/profile" className={navLinkStyles}>
          <button className="btn">Profile</button>
        </NavLink>
        <NavLink to="/unit-registration" className={navLinkStyles}>
          <button className="btn">Units</button>
        </NavLink>
        <NavLink to="/accommodation" className={navLinkStyles}>
          <button className="btn">Accommodation</button>
        </NavLink>
        <NavLink to="/fees" className={navLinkStyles}>
          <button className="btn">Fees</button>
        </NavLink>
        <NavLink to="/clearance" className={navLinkStyles}>
          <button className="btn">Clearance</button>
        </NavLink>
        <NavLink to="/documents" className={navLinkStyles}>
          <button className="btn">Documents</button>
        </NavLink>
        <NavLink to="/grades" className={navLinkStyles}>
          <button className="btn">Grades</button>
        </NavLink>
      </div>
    </nav>
  );
};

export default Navbar;
