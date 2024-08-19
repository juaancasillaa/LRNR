import React from "react";
import "../Styles/Footer.css";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="page-footer" aria-labelledby="footer-heading">
      <div className="container">
        <div className="row">
          <div className="col l6 s12">
            <p className="grey-text text-lighten-4">
              Embrace the power of our app. Unlock the secrets of the universe,
              one quiz at a time. As I always say, "Yesterday is history,
              tomorrow is a mystery, but today is a gift. That is why it is
              called the present."
            </p>
          </div>
          <div className="col l4 offset-l2 s12">
            <h5 id="footer-links" className="white-text">
              Links
            </h5>
            <ul>
              <li>
                <Link
                  to="/"
                  className="grey-text text-lighten-3"
                  aria-label="Home"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/quiz-generation"
                  className="grey-text text-lighten-3"
                  aria-label="Quiz"
                >
                  Quiz
                </Link>
              </li>
              <li>
                <Link
                  to="/account"
                  className="grey-text text-lighten-3"
                  aria-label="Account"
                >
                  Account
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="footer-copyright">
        <div className="container">
          Made by Materialize
          <a
            className="grey-text text-lighten-4 right"
            href="#!"
            aria-label="Additional links"
          ></a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
