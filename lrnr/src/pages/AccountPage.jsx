import React from "react";
import { motion as m } from "framer-motion"; // Import Framer Motion
import "../Styles/AccountPage.css"; // Ensure this CSS file is updated if needed

const AccountPage = () => {
  // Generate a random LRNR level between 1 and 5
  const lrnrLevel = Math.floor(Math.random() * 5) + 1;

  // Mock quizzes
  const quizzes = ["JavaScript Basics", "React Essentials", "Advanced CSS"];

  return (
    <m.div
      className="account-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.75, ease: "easeOut" }}
      role="main" // Define the main content area
    >
      <m.h1
        className="account-title"
        initial={{ y: "-100%", opacity: 0 }}
        animate={{ y: "0%", opacity: 1 }}
        transition={{ duration: 0.75, ease: "easeOut" }}
        aria-level="1" // Use aria-level to provide heading level information
      >
        Account
      </m.h1>
      <div className="account-info">
        <m.div
          className="account-row"
          initial={{ x: "-100%", opacity: 0 }}
          animate={{ x: "0%", opacity: 1 }}
          transition={{ duration: 0.75, ease: "easeOut" }}
          aria-labelledby="streak"
          tabIndex="0" // Make the div focusable
        >
          <i
            className="fa-solid fa-fire-flame-curved fa-3x"
            aria-hidden="true"
          ></i>{" "}
          {/* Font Awesome icon for Fire */}
          <div className="text-content">
            <h2 id="streak">Streak</h2>
            <p>7 days</p>
          </div>
        </m.div>
        <m.div
          className="account-row"
          initial={{ x: "-100%", opacity: 0 }}
          animate={{ x: "0%", opacity: 1 }}
          transition={{ duration: 0.75, ease: "easeOut" }}
          aria-labelledby="platinum-quizzes"
          tabIndex="0" // Make the div focusable
        >
          <i className="fa-solid fa-table-list fa-3x" aria-hidden="true"></i>{" "}
          {/* Font Awesome icon for List */}
          <div className="text-content">
            <h2 id="platinum-quizzes">Platinum Quizzes</h2>
            <ul>
              {quizzes.slice(0, 3).map((quiz, index) => (
                <li key={index}>{quiz}</li>
              ))}
            </ul>
          </div>
        </m.div>
        <m.div
          className="account-row"
          initial={{ y: "100%", opacity: 0 }}
          animate={{ y: "0%", opacity: 1 }}
          transition={{ duration: 0.75, ease: "easeOut" }}
          aria-labelledby="lrnr-level"
          tabIndex="0" // Make the div focusable
        >
          <i className="fa-solid fa-user fa-3x" aria-hidden="true"></i>{" "}
          {/* Font Awesome icon for User */}
          <div className="text-content">
            <h2 id="lrnr-level">LRNR Level: {lrnrLevel}</h2>
            <p>150/200 xp</p>
          </div>
        </m.div>
      </div>
    </m.div>
  );
};

export default AccountPage;
