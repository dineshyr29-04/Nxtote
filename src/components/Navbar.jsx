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
        <div className="navbar-logo">
          <Link to="/">
            <img src="/image.png" alt="logo" className="navbar-logo" />
          </Link>
        </div>
        <div className="navbar-menu">
          <ul className="navbar-links">
            {navbarlinks.map((link, index) => (
              <li key={index} className="navbar-link">
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
