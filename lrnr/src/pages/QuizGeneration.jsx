import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../components/QuizGeneration.css";

const QuizGeneration = ({ setQuiz }) => {
  // State variables to store form input and status
  const [topic, setTopic] = useState(""); // Selected topic for the quiz
  const [expertise, setExpertise] = useState(""); // Selected expertise level
  const [numberOfQuestions, setNumberOfQuestions] = useState("1"); // Number of questions in the quiz
  const [style, setStyle] = useState(""); // Style of the quiz
  const [error, setError] = useState(null); // Error message if something goes wrong
  const [loading, setLoading] = useState(false); // Loading state to show spinner or disable button
  const navigate = useNavigate(); // Hook to programmatically navigate

  // Function to handle form submission
  const handleSubmit = async () => {
    // Validate required fields
    if (!topic || !expertise || !style) {
      setError("Please fill out all required fields.");
      return;
    }
  
    setError(null); // Clear any previous errors
    setLoading(true); // Set loading state to true
  
    try {
      // Send form data to the server
      const response = await fetch("http://localhost:3000/generate-quiz", {
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
  
      // Check if the response is okay
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to generate quiz: ${errorText}`);
      }
  
      // Parse the response JSON and set the quiz data
      const quiz = await response.json();
      setQuiz(quiz);
      navigate("/quiz", { state: { quiz } }); // Navigate to the quiz page with quiz data
    } catch (error) {
      // Handle any errors that occur during the fetch
      setError("An error occurred. Please try again.");
      console.error("Error generating quiz:", error);
    } finally {
      setLoading(false); // Reset loading state
    }
  };

  return (
    <div className="quiz-container">
      <h1>Quiz Generation Options</h1>
      <p>
        Please choose your preferences below to generate your own personalized
        quiz.
      </p>
      <div className="form-group">
        <label>Topic</label>
        <select
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          className="form-control"
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
        <label>Expertise Level</label>
        <select
          value={expertise}
          onChange={(e) => setExpertise(e.target.value)}
          className="form-control"
        >
          <option value="">Select Expertise Level</option>
          <option value="Novice">Novice</option>
          <option value="Intermediate">Intermediate</option>
          <option value="Expert">Expert</option>
        </select>
      </div>
      <div className="form-group">
        <label>Number of Questions</label>
        <select
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
        <label>Style</label>
        <select
          value={style}
          onChange={(e) => setStyle(e.target.value)}
          className="form-control"
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
      <button className="submit-btn" onClick={handleSubmit} disabled={loading}>
        {loading ? "Generating..." : "SUBMIT"}
      </button>
      {error && <p className="error-message">{error}</p>}
    </div>
  );
};

export default QuizGeneration;