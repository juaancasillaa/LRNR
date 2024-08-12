// import React from "react";
// import { Link } from "react-router-dom";
// import "./Footer.css";

// const Footer = () => {
//   return (
//     <footer className="footer">
//       <div className="footer-left">
//         <p>
//           Embrace the power of our app and unlock the secrets of the universe,
//           one quiz at a time.
//         </p>
//         <p>
//           As I always say, "Yesterday is history, tomorrow is a mystery, but
//           today is a gift. That is why it is called the present."
//         </p>
//       </div>
//       <div className="footer-right">
//         <p className="footer-links-title">Links</p>
//         <ul className="footer-links">
//           <li>
//             <Link to="/">Home</Link>
//           </li>
//           <li>
//             <Link to="/quiz-generator">Quiz Generator</Link>
//           </li>
//           <li>
//             <Link to="/account">Account</Link>
//           </li>
//         </ul>
//       </div>
//     </footer>
//   );
// };

// export default Footer;

import React from "react";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="page-footer">
      <div className="container">
        <div className="row">
          <div className="col l6 s12">
            <p className="grey-text text-lighten-4">
              Embrace the power of our app Unlock the secrets of the universe,
              one quiz at a time. As I always say, "Yesterday is history,
              tomorrow is a mystery, but today is a gift. That is why it is
              called the present."
            </p>
          </div>
          <div className="col l4 offset-l2 s12">
            <h5 className="white-text">Links</h5>
            <ul>
              <li>
                <a className="grey-text text-lighten-3" href="/">
                  Home
                </a>
              </li>
              <li>
                <a className="grey-text text-lighten-3" href="/quiz-generation">
                  Quiz Generator
                </a>
              </li>
              <li>
                <a className="grey-text text-lighten-3" href="/account">
                  Account
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="footer-copyright">
        <div className="container">
          Made by Materialize
          <a className="grey-text text-lighten-4 right" href="#!"></a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
