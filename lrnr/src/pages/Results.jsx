// import React from "react";
// import { useLocation } from "react-router-dom";
// import "../components/Results.css";

// const Results = () => {
//   const location = useLocation();
//   const { correctAnswersCount, results } = location.state || {};

//   return (
//     <div className="results-page">
//       <h1>Quiz Results</h1>
//       <p className="results-summary">
//         You got {correctAnswersCount} out of {results.length} questions correct!
//       </p>
//       {results.map((result, index) => (
//         <div key={index} className="result-item">
//           <h2>{result.question}</h2>
//           <p>Your Answer: {result.userAnswer}</p>
//           <p>Correct Answer: {result.correctAnswer}</p>
//         </div>
//       ))}
//     </div>
//   );
// };

// export default Results;

import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../Styles/Results.css";

const Results = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { correctAnswersCount, results } = location.state || {};

  const handleTryAnotherQuiz = () => {
    navigate("/quiz-generation");
  };

  return (
    <div className="results-page">
      <header className="results-header">
        <h1>LRNR Results</h1>
        <p className="results-summary">
          You got <span className="highlight">{correctAnswersCount}</span> out
          of <span className="highlight">{results.length}</span> questions
          correct!
        </p>
      </header>
      <section className="results-content">
        {results.map((result, index) => (
          <div key={index} className="result-item">
            <h2 className="result-question">{result.question}</h2>
            <p className="result-answer">
              <strong>Your Answer:</strong> {result.userAnswer}
            </p>
          </div>
        ))}
      </section>
      <footer className="results-footer">
        <button
          className="try-another-quiz-button"
          onClick={handleTryAnotherQuiz}
        >
          TRY ANOTHER QUIZ
        </button>
      </footer>
    </div>
  );
};

export default Results;
