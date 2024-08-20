// Import necessary modules
const express = require("express"); // Import Express framework
const bodyParser = require("body-parser"); // Import middleware to parse JSON bodies
const cors = require("cors"); // Import middleware to enable Cross-Origin Resource Sharing
require("dotenv").config(); // Load environment variables from .env file

// Import additional Node.js module for handling file paths
const path = require("path");

// Initialize Express application
const app = express();

// Define the port number the server will listen on
const port = 5050;

// Enable CORS and parse JSON bodies using middleware
app.use(cors()); // Enable CORS
app.use(bodyParser.json()); // Parse JSON request bodies

// Mock function to simulate getting correct answers for a quiz
const getCorrectAnswersForQuiz = (quizId) => {
  // Returns a hardcoded array of questions and answers
  return [
    { question: "What is the capital of France?", answer: "Paris" },
    { question: "What is 2 + 2?", answer: "4" },
  ];
};

// Re-enable CORS with specific configuration
app.use(cors({
  origin: '*', // Allow any origin
}));

// Route to generate a quiz based on provided parameters
app.post("/generate-quiz", async (req, res) => {
  // Destructure request body to extract parameters
  const { topic, expertise, numberOfQuestions, style } = req.body;

  // Validate required fields
  if (!topic || !expertise || !style) {
    // Send error response if validation fails
    return res
      .status(400)
      .json({ error: "Please fill out all required fields." });
  }

  // Retrieve API key from environment variables
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    // Send error response if API key is missing
    return res
      .status(500)
      .json({ error: "API key is missing from environment variables." });
  }

  // Construct a prompt for generating the quiz
  const prompt = `Generate a quiz with the following parameters:
    Topic: ${topic}
    Expertise Level: ${expertise}
    Number of Questions: ${numberOfQuestions}
    Style: ${style}
    Please provide each question in the following format:
    Question [number]: [Question text]
  `;

  try {
    // Make a POST request to OpenAI API to generate the quiz
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`, // Include API key in authorization header
      },
      body: JSON.stringify({
        model: "gpt-4",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7, // Control the randomness of the generated responses
      }),
    });

    // Check if the response was successful
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to generate quiz: ${errorText}`);
    }

    // Parse the response data
    const data = await response.json();
    console.log(data);

    // Check if the expected data structure is present
    if (
      !data.choices ||
      !data.choices[0] ||
      !data.choices[0].message ||
      !data.choices[0].message.content
    ) {
      throw new Error("Unexpected response format from API.");
    }

    // Process and format the quiz questions
    const content = data.choices[0].message.content;
    const questions = content
      .split("\n\n")
      .filter((section) => section.trim() !== "");

    // Send the generated quiz as a JSON response
    res.json({
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
    });
  } catch (error) {
    // Handle errors and send error response
    res
      .status(500)
      .json({ error: "An error occurred while generating the quiz." });
  }
});

// Route to handle quiz submission and scoring
app.post("/submit-quiz", (req, res) => {
  // Destructure request body to extract quiz ID and user answers
  const { quizId, userAnswers } = req.body;

  // Get correct answers for the submitted quiz
  const correctAnswers = getCorrectAnswersForQuiz(quizId);

  // Calculate results and score
  const results = correctAnswers.map((correctAnswer, index) => ({
    question: correctAnswer.question,
    userAnswer: userAnswers[index],
    correctAnswer: correctAnswer.answer,
    isCorrect:
      userAnswers[index].toLowerCase() === correctAnswer.answer.toLowerCase(),
  }));
  const score = results.filter((result) => result.isCorrect).length;

  // Send the results and score as a JSON response
  res.json({ results, score });
});

// Route to evaluate a single answer against the correct answer
app.post("/evaluate-answer", async (req, res) => {
  // Destructure request body to extract question and user's answer
  const { question, userAnswer } = req.body;

  // Retrieve API key from environment variables
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    // Send error response if API key is missing
    return res
      .status(500)
      .json({ error: "API key is missing from environment variables." });
  }

  try {
    // Make a POST request to OpenAI API to evaluate the answer
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`, // Include API key in authorization header
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: "You are a quiz evaluator." },
          {
            role: "user",
            content: `The question is: "${question}". The user's answer is: "${userAnswer}". Determine if this answer is correct or incorrect. Format your response with the first line as "Correct" or "Incorrect", followed by an explanation.`,
          },
        ],
        temperature: 0, // Control the randomness of the generated responses
      }),
    });

    // Check if the response was successful
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to evaluate answer: ${errorText}`);
    }

    // Parse and process the evaluation feedback
    const data = await response.json();
    const feedback = data.choices[0].message.content.trim();

    // Extract correctness and explanation
    const lines = feedback.split("\n");
    const correctness = lines[0].toLowerCase().trim();
    const explanation = lines.slice(1).join("\n").trim();
    const isCorrect = correctness === "correct";

    // Send the evaluation result as a JSON response
    res.json({ isCorrect, explanation });
  } catch (error) {
    // Handle errors and send error response
    console.error("Error evaluating answer:", error);
    res.status(500).json({ error: "Failed to evaluate answer." });
  }
});

// Another route to handle quiz submission and scoring
app.post("/results", (req, res) => {
  // Similar logic as "/submit-quiz"
  const { quizId, userAnswers } = req.body;
  const correctAnswers = getCorrectAnswersForQuiz(quizId);
  const results = correctAnswers.map((correctAnswer, index) => ({
    question: correctAnswer.question,
    userAnswer: userAnswers[index],
    correctAnswer: correctAnswer.answer,
    isCorrect:
      userAnswers[index].toLowerCase() === correctAnswer.answer.toLowerCase(),
  }));
  const score = results.filter((result) => result.isCorrect).length;
  res.json({ results, score });
});

// Start the Express server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});