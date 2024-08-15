import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../components/QuizPage.css";

const QuizPage = () => {
  const location = useLocation(); // Hook to get location object
  const navigate = useNavigate(); // Hook to programmatically navigate
  const { quiz } = location.state || {}; // Extract quiz data from location state
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0); // Index of the current question
  const [userAnswers, setUserAnswers] = useState([]); // User's answers to the quiz questions
  const [showResults, setShowResults] = useState(false); // State to show quiz results
  const [loading, setLoading] = useState(false); // State to manage loading status
  const [error, setError] = useState(null); // State to store error messages
  const [evaluation, setEvaluation] = useState(""); // Feedback from the evaluation
  const [isCorrect, setIsCorrect] = useState(""); // Whether the user's answer is correct or not
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false); // State to manage answer submission
  const [correctAnswersCount, setCorrectAnswersCount] = useState(0); // Count of correct answers

  // Initialize userAnswers state based on the number of questions in the quiz
  useEffect(() => {
    if (quiz && quiz.numberOfQuestions) {
      setUserAnswers(new Array(quiz.numberOfQuestions).fill(""));
    }
  }, [quiz]);

  // Handle changes to the user's answer
  const handleAnswerChange = (event) => {
    const newAnswers = [...userAnswers];
    newAnswers[currentQuestionIndex] = event.target.value; // Update the answer for the current question
    setUserAnswers(newAnswers);
  };

  // Submit the current answer for evaluation.
  const handleSubmitAnswer = async () => {
    setLoading(true);
    setError(null);
    setEvaluation("");
    setIsCorrect("");
    setIsAnswerSubmitted(true);

    try {
      const question = quiz.questions[currentQuestionIndex].question;
      const userAnswer = userAnswers[currentQuestionIndex];

      const response = await fetch("http://localhost:3000/evaluate-answer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          question,
          userAnswer,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to check answer: ${errorText}`);
      }

      const data = await response.json();
      setIsCorrect(data.isCorrect ? "Correct" : "Incorrect");
      setEvaluation(data.explanation);

      if (data.isCorrect) {
        setCorrectAnswersCount((prevCount) => prevCount + 1);
      }
    } catch (error) {
      setError(
        "An error occurred while checking your answer. Please try again."
      );
      console.error("Error checking answer:", error);
    } finally {
      setLoading(false);
    }
  };

  // Move to the next question or show results if it's the last question
  const handleNextQuestion = () => {
    if (currentQuestionIndex < quiz.numberOfQuestions - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setEvaluation("");
      setIsCorrect("");
      setIsAnswerSubmitted(false); // Hide evaluation and next button
    } else {
      setShowResults(true);
    }
  };

  // Submit the entire quiz for evaluation
  const handleSubmitQuiz = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("http://localhost:3000/submit-quiz", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          quizId: quiz.id, // Assuming your quiz object has an ID
          userAnswers,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to submit quiz: ${errorText}`);
      }

      const data = await response.json();
      // Assuming the server returns the evaluated results and score
      setEvaluation(data.results);
      setCorrectAnswersCount(data.score);
      setShowResults(true);
    } catch (error) {
      setError(
        "An error occurred while submitting your quiz. Please try again."
      );
      console.error("Error submitting quiz:", error);
    } finally {
      setLoading(false);
    }
  };

  // Generate results based on user's answers and correct answers
  const calculateResults = () => {
    return quiz.questions.map((question, index) => ({
      question: question.question,
      userAnswer: userAnswers[index] || "No answer provided",
      correctAnswer: question.answer || "No answer available",
    }));
  };

  // Navigate to quiz selection page
  const handleTryAnotherQuiz = () => {
    navigate("/quiz-generation");
  };

  // Display a loading message if quiz data is not available
  if (!quiz || quiz.questions.length === 0) {
    return (
      <div className="loading-message">
        <p>Loading quiz...</p>
      </div>
    );
  }

  const currentQuestion = quiz.questions[currentQuestionIndex];
  const results = calculateResults();

  // Format question text for display
  const formatQuestion = (text) => {
    const questionText = text
      .replace(/^Question \d+: \w\) /, "")
      .replace(/\?$/, "");
    return questionText.endsWith("?") ? questionText : `${questionText}?`;
  };

  return (
    <div className="quiz-page">
      {showResults ? (
        <div className="quiz-results">
          <h1>LRNR RESULTS</h1>
          <p className="results-summary">
            Questions right: {correctAnswersCount}
          </p>
          {results.map((result, index) => (
            <div key={index} className="result-item">
              <h2>{result.question}</h2>
              <p>Your Answer: {result.userAnswer}</p>
              <p>Correct Answer: {result.correctAnswer}</p>
            </div>
          ))}
          <button
            className="try-another-quiz-button"
            onClick={handleTryAnotherQuiz}
          >
            Try Another Quiz
          </button>
        </div>
      ) : (
        <div className="quiz-question-container">
          <h2>{`Question ${currentQuestionIndex + 1} of ${
            quiz.numberOfQuestions
          }`}</h2>
          <h3 className="quiz-question-text">
            {formatQuestion(currentQuestion.question)}
          </h3>
          <label className="custom-label">Your Answer</label>
          <input
            type="text"
            value={userAnswers[currentQuestionIndex] || ""}
            onChange={handleAnswerChange}
            className="quiz-answer-input"
            placeholder="Type your answer here"
          />
          <div className="quiz-buttons">
            <button
              className="quiz-submit-answer-button"
              onClick={handleSubmitAnswer}
              disabled={loading}
            >
              {loading ? "Checking..." : "Submit Answer"}
            </button>
            {currentQuestionIndex === quiz.numberOfQuestions - 1 && (
              <button className="quiz-submit-button" onClick={handleSubmitQuiz}>
                Finish Quiz
              </button>
            )}
          </div>
          {error && <p className="error-message">{error}</p>}
          {isAnswerSubmitted && (
            <div className="evaluation-container">
              <h4 className="evaluation-title">Verner's Evaluation</h4>
              <div className="evaluation-feedback">
                <div className="evaluation-status">
                  <p className={`status-text ${isCorrect.toLowerCase()}`}>
                    {isCorrect}
                  </p>
                </div>
                <div className="evaluation-details">
                  <p>{evaluation}</p>
                </div>
              </div>
              {currentQuestionIndex < quiz.numberOfQuestions - 1 && (
                <div className="next-button-container">
                  <button
                    className="quiz-next-button"
                    onClick={handleNextQuestion}
                  >
                    Next
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default QuizPage;
