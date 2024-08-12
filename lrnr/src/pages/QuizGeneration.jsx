import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../components/QuizGeneration.css";

const QuizGeneration = ({ setQuiz }) => {
  const [topic, setTopic] = useState("");
  const [expertise, setExpertise] = useState("");
  const [numberOfQuestions, setNumberOfQuestions] = useState("1");
  const [style, setStyle] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async () => {
    // Function to handle the quiz generation process when the user submits the form.
    if (!topic || !expertise || !style) {
      setError("Please fill out all required fields.");
      return;
    }

    setError(null);
    setLoading(true);

    try {
      // Retrieve the OpenAI API key from environment variables.
      const apiKey = process.env.REACT_APP_OPENAI_API_KEY;
      if (!apiKey) {
        throw new Error("API key is missing from environment variables.");
      }

      // Create a prompt string that specifies the quiz generation parameters.
      const prompt = `Generate a quiz with the following parameters:
        Topic: ${topic}
        Expertise Level: ${expertise}
        Number of Questions: ${numberOfQuestions}
        Style: ${style}

      Please provide each question in the following format:
      Question [number]: [Question text]
      a) Option 1
      b) Option 2
      c) Option 3
      d) Option 4`;

      // Make a POST request to the OpenAI API to generate the quiz.
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
            messages: [{ role: "user", content: prompt }],
            temperature: 0.7, // Set the temperature to control randomness in responses.
          }),
        }
      );

      // Check if the response is not successful.
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to generate quiz: ${errorText}`);
      }

      const data = await response.json();

      // Validate the response structure to ensure it contains the expected data.
      if (
        !data.choices ||
        !data.choices[0] ||
        !data.choices[0].message ||
        !data.choices[0].message.content
      ) {
        throw new Error("Unexpected response format from API.");
      }

      // Extract the quiz content from the response.
      const content = data.choices[0].message.content;
      const questions = content
        .split("\n\n") // Split the content into individual questions.
        .filter((section) => section.trim() !== ""); // Filter out empty sections.

      // Create a quiz object with the extracted questions and other details.
      const quiz = {
        title: `Quiz on ${topic}`,
        description: `Quiz on ${topic} with ${expertise} level questions in ${style} style.`,
        numberOfQuestions: parseInt(numberOfQuestions, 10),
        questions: questions.map((questionText) => {
          const lines = questionText
            .split("\n")
            .filter((line) => line.trim() !== "");
          const question = lines[0].replace(/Question \d+: /, "").trim();
          const options = lines
            .slice(1)
            .map((option) => option.replace(/^[a-d]\) /, "").trim());

          return {
            question,
            options,
          };
        }),
      };

      // Update the parent component's state with the generated quiz.
      setQuiz(quiz);
      navigate("/quiz", { state: { quiz } }); // Pass quiz data via state
    } catch (error) {
      setError("An error occurred. Please try again.");
      console.error("Error generating quiz:", error);
    } finally {
      setLoading(false);
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
