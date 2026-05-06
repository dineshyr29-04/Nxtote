import { useState, useEffect } from "react";
import "./Navbar.css";
import { Link } from "react-router-dom";

const navbarlinks = [
  { name: "Home", path: "/home" },
  { name: "About", path: "/about" },
  { name: "Contact", path: "/contact" },
];
function Navbar() {
  return (
    <>
      <div className="navbar-container">
        <div classname="navbar-logo">
          <link to="/">
            <img src="../assets/react.svg" alt="logo" classname="navbar-logo" />
          </link>
        </div>
        <div classname="navbar-menu">
          <ul classname="navbar-links">
            {navbarlinks.map((link, index) => (
              <li key={index} classname="navbar-link">
                <Link to={link.path}>{link.name}</Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}
export default Navbar;