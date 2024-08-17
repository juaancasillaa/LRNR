import { useLocation } from "react-router-dom";

const ResultsPage = () => {
  const location = useLocation();
  const { correctAnswersCount, results } = location.state || {};

  if (!results) {
    return <div>No results available.</div>;
  }

  return (
    <div>
      <h1>Quiz Results</h1>
      <p>Score: {correctAnswersCount}</p>
      <ul>
        {results.map((result, index) => (
          <li key={index}>
            <strong>Question:</strong> {result.question}<br />
            <strong>Your Answer:</strong> {result.userAnswer}<br />
            <strong>Correct Answer:</strong> {result.correctAnswer}<br />
            <strong>Correct:</strong> {result.isCorrect ? "Yes" : "No"}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ResultsPage;