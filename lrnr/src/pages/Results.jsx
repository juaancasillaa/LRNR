import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../components/Results.css";

const ResultsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { correctAnswersCount, results } = location.state || {};

  const handleTryAnotherQuiz = () => {
    navigate("/quiz-generation");
  };

  return (
    <div className="results-container">
      <h1>lrnr</h1>
      <p>You got {correctAnswersCount} questions right!</p>
      {results &&
        results.map((result, index) => (
          <div key={index} className="result-item">
            <h2>{result.question}</h2>
            <p className="user-answer">Your Answer: {result.userAnswer}</p>
            <p className="correct-answer">
              Correct Answer: {result.correctAnswer}
            </p>
          </div>
        ))}

      <button className="try-again-button" onClick={handleTryAnotherQuiz}>
        Try Another Quiz
      </button>
    </div>
  );
};

export default ResultsPage;
