import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer"; // Ensure you have this component
import QuizGeneration from "./pages/QuizGeneration"; // Update as needed
import QuizPage from "./pages/QuizPage"; // Update as needed
import ResultsPage from "./pages/Results"; // Update as needed
import HomePage from "./pages/Home"; // Update as needed
import AccountPage from "./pages/AccountPage"; // Update as needed
import "materialize-css/dist/css/materialize.min.css";

// ParentComponent will handle quiz generation and display
const ParentComponent = () => {
  const [quiz, setQuiz] = useState(null);

  return (
    <Routes>
      <Route
        path="quiz-generation"
        element={<QuizGeneration setQuiz={setQuiz} />}
      />
      <Route path="quiz" element={<QuizPage quiz={quiz} />} />
      <Route path="results" element={<ResultsPage />} />
      <Route path="home" element={<HomePage />} />
      <Route path="account" element={<AccountPage />} />
      <Route index element={<HomePage />} />
    </Routes>
  );
};

function App() {
  return (
    <Router>
      <Navbar />
      <main>
        <ParentComponent />
      </main>
      <Footer /> {/* Ensure you have this component */}
    </Router>
  );
}

export default App;
