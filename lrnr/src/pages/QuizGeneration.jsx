import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../Styles/QuizGeneration.css";

const QuizGeneration = ({ setQuiz }) => {
  const [topic, setTopic] = useState("");
  const [expertise, setExpertise] = useState("");
  const [numberOfQuestions, setNumberOfQuestions] = useState("1");
  const [style, setStyle] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async () => {
    if (!topic || !expertise || !style) {
      setError("Please fill out all required fields.");
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const response = await fetch("/generate-quiz", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          topic,
          expertise,
          numberOfQuestions,
          style,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to generate quiz: ${errorText}`);
      }

      const quiz = await response.json();
      setQuiz(quiz);
      navigate("/quiz", { state: { quiz } });
    } catch (error) {
      setError("An error occurred. Please try again.");
      console.error("Error generating quiz:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="quiz-container">
      <h1 id="heading">Quiz Generation Options</h1>
      <p>
        Please choose your preferences below to generate your own personalized
        quiz.
      </p>
      <form
        aria-labelledby="quiz-options"
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
      >
        <div className="form-group">
          <label htmlFor="topic-select">Topic</label>
          <select
            id="topic-select"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            className="form-control"
            aria-required="true"
          >
            <option value="">Select Topic</option>
            <option value="Golang">Golang</option>
            <option value="AWS">AWS</option>
            <option value="Javascript">Javascript</option>
            <option value="CI/CD">CI/CD</option>
            <option value="Home Gardens">Home Gardens</option>
            <option value="Coffee">Coffee</option>
            <option value="Finger Foods">Finger Foods</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="expertise-select">Expertise Level</label>
          <select
            id="expertise-select"
            value={expertise}
            onChange={(e) => setExpertise(e.target.value)}
            className="form-control"
            aria-required="true"
          >
            <option value="">Select Expertise Level</option>
            <option value="Novice">Novice</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Expert">Expert</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="questions-select">Number of Questions</label>
          <select
            id="questions-select"
            value={numberOfQuestions}
            onChange={(e) => setNumberOfQuestions(e.target.value)}
            className="form-control"
          >
            {[...Array(15).keys()].map((num) => (
              <option key={num + 1} value={num + 1}>
                {num + 1}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="style-select">Style</label>
          <select
            id="style-select"
            value={style}
            onChange={(e) => setStyle(e.target.value)}
            className="form-control"
            aria-required="true"
          >
            <option value="">Select Style</option>
            <option value="Master Oogway">Master Oogway</option>
            <option value="1940's Gangster">1940's Gangster</option>
            <option value="Like an 8 year old">Like an 8 year old</option>
            <option value="Normal">Normal</option>
            <option value="Jedi">Jedi</option>
            <option value="Captain Jack Sparrow">Captain Jack Sparrow</option>
            <option value="Matthew Mcconaughey">Matthew Mcconaughey</option>
          </select>
        </div>
        <button
          type="submit"
          className="submit-btn"
          disabled={loading}
          aria-busy={loading}
        >
          {loading ? "Generating..." : "SUBMIT"}
        </button>
      </form>
      {error && (
        <p className="error-message" aria-live="assertive">
          {error}
        </p>
      )}
    </div>
  );
};

export default QuizGeneration;
