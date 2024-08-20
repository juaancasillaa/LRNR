import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../Styles/QuizPage.css";

const QuizPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { quiz } = location.state || {};

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [evaluation, setEvaluation] = useState("");
  const [isCorrect, setIsCorrect] = useState("");
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [correctAnswersCount, setCorrectAnswersCount] = useState(0);

  useEffect(() => {
    if (quiz && quiz.numberOfQuestions) {
      setUserAnswers(new Array(quiz.numberOfQuestions).fill(""));
    }
  }, [quiz]);

  const handleAnswerChange = (event) => {
    const newAnswers = [...userAnswers];
    newAnswers[currentQuestionIndex] = event.target.value;
    setUserAnswers(newAnswers);
  };

  const handleSubmitAnswer = async () => {
    setLoading(true);
    setError(null);
    setEvaluation("");
    setIsCorrect("");
    setIsAnswerSubmitted(true);

    try {
      if (quiz && quiz.questions[currentQuestionIndex]) {
        const question = quiz.questions[currentQuestionIndex].question;
        const userAnswer = userAnswers[currentQuestionIndex];

        const response = await fetch("/evaluate-answer", {
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
      } else {
        throw new Error("Quiz or current question is not available");
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

  const handleSubmitQuiz = async () => {
    setLoading(true);
    setError(null);

    try {
      if (quiz) {
        const response = await fetch("/submit-quiz", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            quizId: quiz.id,
            userAnswers,
          }),
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Failed to submit quiz: ${errorText}`);
        }

        const data = await response.json();
        console.log("Quiz submission response:", data);

        navigate("/results", {
          state: {
            correctAnswersCount, // Pass the correctAnswersCount to the results page
            results: calculateResults(),
          },
        });
      } else {
        throw new Error("Quiz is not available for submission");
      }
    } catch (error) {
      setError(
        "An error occurred while submitting your quiz. Please try again."
      );
      console.error("Error submitting quiz:", error);
    } finally {
      setLoading(false);
    }
  };

  const calculateResults = () => {
    return quiz
      ? quiz.questions.map((question, index) => ({
          question: question.question,
          userAnswer: userAnswers[index] || "No answer provided",
          correctAnswer: question.answer || "No answer available",
        }))
      : [];
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < (quiz?.numberOfQuestions || 0) - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setEvaluation("");
      setIsCorrect("");
      setIsAnswerSubmitted(false);
    } else {
      setShowResults(true);
    }
  };

  const handleTryAnotherQuiz = () => {
    navigate("/quiz-generation");
  };

  if (!quiz || quiz.questions.length === 0) {
    return (
      <div className="loading-message">
        <p>Loading quiz...</p>
      </div>
    );
  }

  const currentQuestion = quiz.questions[currentQuestionIndex] || {};
  const results = calculateResults();
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
            {formatQuestion(
              currentQuestion.question || "No question available"
            )}
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
              <button
                className="quiz-submit-button"
                onClick={handleSubmitQuiz}
                disabled={loading}
              >
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
                    Next Question
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
