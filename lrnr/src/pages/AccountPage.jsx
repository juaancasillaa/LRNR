import React from "react";
import { FaFire, FaList, FaUser } from "react-icons/fa"; // Import the new icons
import "../components/AccountPage.css";

const AccountPage = () => {
  // Generate a random LRNR level between 1 and 5
  const lrnrLevel = Math.floor(Math.random() * 5) + 1;

  // Mock quizzes
  const quizzes = ["JavaScript Basics", "React Essentials", "Advanced CSS"];

  return (
    <div className="account-page">
      <h1 className="account-title">Account</h1>
      <div className="account-info">
        <div className="account-row">
          <FaFire className="icon" />
          <div className="text-content">
            <h2>Streak</h2>
            <p>7 days</p>
          </div>
        </div>
        <div className="account-row">
          <FaList className="icon" />
          <div className="text-content">
            <h2>Platinum Quizzes</h2>
            <ul>
              {quizzes.slice(0, 3).map((quiz, index) => (
                <li key={index}>{quiz}</li>
              ))}
            </ul>
          </div>
        </div>
        <div className="account-row">
          <FaUser className="icon" />
          <div className="text-content">
            <h2>LRNR Level: {lrnrLevel}</h2>
            <p>150/200 xp</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountPage;
