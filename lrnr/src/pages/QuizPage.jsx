import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../components/QuizPage.css";

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
      const apiKey = process.env.REACT_APP_OPENAI_API_KEY;
      if (!apiKey) {
        throw new Error("API key is missing from environment variables.");
      }

      const question = quiz.questions[currentQuestionIndex].question;
      const userAnswer = userAnswers[currentQuestionIndex];

      const response = await fetch(
        "https://api.openai.com/v1/chat/completions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model: "gpt-3.5-turbo",
            messages: [
              { role: "system", content: "You are a quiz evaluator." },
              {
                role: "user",
                content: `The question is: "${question}". The user's answer is: "${userAnswer}". Determine if this answer is correct or incorrect. Format your response with the first line as "Correct" or "Incorrect", followed by an explanation of why the answer is correct or incorrect.`,
              },
            ],
            temperature: 0,
          }),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to check answer: ${errorText}`);
      }

      const data = await response.json();
      const feedback = data.choices[0].message.content.trim();

      // Log the entire feedback for debugging purposes
      console.log("API Feedback:", feedback);

      // Extract the first line for correctness and the rest for explanation
      const lines = feedback.split("\n");
      const correctness = lines[0].toLowerCase().trim();
      const explanation = lines.slice(1).join("\n").trim();

      // Check if the response indicates correctness
      const isAnswerCorrect = correctness === "correct";

      setIsCorrect(isAnswerCorrect ? "Correct" : "Incorrect");
      setEvaluation(explanation);

      if (isAnswerCorrect) {
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

  const handleSubmitQuiz = () => {
    setShowResults(true);
  };

  const calculateResults = () => {
    return quiz.questions.map((question, index) => ({
      question: question.question,
      userAnswer: userAnswers[index] || "No answer provided",
      correctAnswer: question.answer || "No answer available",
    }));
  };

  const handleTryAnotherQuiz = () => {
    navigate("/quiz-selection"); // Update with the correct path for quiz selection
  };

  if (!quiz || quiz.questions.length === 0) {
    return (
      <div className="loading-message">
        <p>Loading quiz...</p>
      </div>
    );
  }

  const currentQuestion = quiz.questions[currentQuestionIndex];
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
