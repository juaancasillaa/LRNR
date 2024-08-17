import React, { useState } from "react";
import "../Styles/Navbar.css";
import { Link } from "react-router-dom";
import { FaBars } from "react-icons/fa";
import { ImCross } from "react-icons/im";

const Navbar = () => {
  const [mobile, setMobile] = useState(false);

  return (
    <nav className="navbar" role="navigation">
      <Link to="/" className="logo" aria-label="Home">
        <h1 className="logo-h1">lrnr</h1>
      </Link>
      <ul
        className={mobile ? "nav-links-mobile" : "nav-links"}
        onClick={() => setMobile(false)}
        role="menubar"
      >
        <li role="none">
          <Link
            to="/quiz-generation"
            className="nav-link"
            role="menuitem"
            aria-label="Quiz Page"
          >
            Quiz
          </Link>
        </li>
        <li role="none">
          <Link
            to="/account"
            className="nav-link"
            role="menuitem"
            aria-label="Account Page"
          >
            Account
          </Link>
        </li>
      </ul>
      <button
        className="mobile-menu-icon"
        onClick={() => setMobile(!mobile)}
        aria-label={mobile ? "Close menu" : "Open menu"}
        aria-expanded={mobile}
      >
        {mobile ? (
          <ImCross aria-hidden="true" />
        ) : (
          <FaBars aria-hidden="true" />
        )}
      </button>
    </nav>
  );
};

export default Navbar;
