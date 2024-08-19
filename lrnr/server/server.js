const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config(); // Load API keys from .env file
const path = require("path");

const app = express();
const port = 5050;
// Middleware to enable CORS and parse JSON bodies
app.use(cors());
app.use(bodyParser.json());
// Mock implementation of getCorrectAnswersForQuiz
const getCorrectAnswersForQuiz = (quizId) => {
  return [
    { question: "What is the capital of France?", answer: "Paris" },
    { question: "What is 2 + 2?", answer: "4" },
  ];
};

app.use(cors({
  origin: '*',
}));

// Route to generate a quiz based on the provided parameters
app.post("/generate-quiz", async (req, res) => {
  const { topic, expertise, numberOfQuestions, style } = req.body;
  // Validate that all required fields are provided
  if (!topic || !expertise || !style) {
    return res
      .status(400)
      .json({ error: "Please fill out all required fields." });
  }
  // Get API key from environment variables
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return res
      .status(500)
      .json({ error: "API key is missing from environment variables." });
  }
  // Create a prompt for generating the quiz
  const prompt = `Generate a quiz with the following parameters:
    Topic: ${topic}
    Expertise Level: ${expertise}
    Number of Questions: ${numberOfQuestions}
    Style: ${style}
    Please provide each question in the following format:
    Question [number]: [Question text]
  `;
  try {
    // Request quiz generation from OpenAI API
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
      }),
    });
    // Check if the response is okay
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to generate quiz: ${errorText}`);
    }
    // Parse the response data
    const data = await response.json();
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

// Route to evaluate a single answer against the correct answer
app.post("/evaluate-answer", async (req, res) => {
  const { question, userAnswer } = req.body;
  // Get API key from environment variables
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return res
      .status(500)
      .json({ error: "API key is missing from environment variables." });
  }
  try {
    // Request answer evaluation from OpenAI API
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
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
            content: `The question is: "${question}". The user's answer is: "${userAnswer}". Determine if this answer is correct or incorrect. Format your response with the first line as "Correct" or "Incorrect", followed by an explanation.`,
          },
        ],
        temperature: 0,
      }),
    });
    // Check if the response is okay
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
    res.json({ isCorrect, explanation });
  } catch (error) {
    // Handle errors and send error response
    console.error("Error evaluating answer:", error);
    res.status(500).json({ error: "Failed to evaluate answer." });
  }
});
// Route to handle quiz submission and scoring
app.post("/results", (req, res) => {
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
