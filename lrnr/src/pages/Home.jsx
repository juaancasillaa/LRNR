// src/pages/Home.jsx
import React from "react";
import "../Styles/Home.css"; // Import CSS for styling
import lrnrImage from "../components/lrnr-bk.png"; // Import the image
import { Link } from "react-router-dom";
import { motion as m } from "framer-motion";
import "@fortawesome/fontawesome-free/css/all.min.css"; // Ensure Font Awesome is imported

export default function HomePage() {
  return (
    <m.div
      initial={{ y: "100%", opacity: 0 }}
      animate={{ y: "0%", opacity: 1 }}
      transition={{ duration: 0.75, ease: "easeOut" }}
    >
      <div className="home">
        <img src={lrnrImage} alt="LRNR logo" />
        <h1>
          Your guided path to{" "}
          <span id="hometext">programming enlightenment</span>
        </h1>
        <Link to="/quiz-generation">
          <button>BEGIN JOURNEY</button>
        </Link>
      </div>

      <div className="container">
        <m.div
          initial={{ scale: 0 }}
          animate={{ rotate: 360, scale: 1 }}
          transition={{
            type: "spring",
            stiffness: 260,
            damping: 20,
          }}
          className="box box-color1"
        >
          <i className="fa-solid fa-bolt-lightning fa-3x"></i>
          <h2>Personalized Quizzes</h2>
          <p>
            Greetings, young padawan. Are you ready to embark on a journey of
            personalized enlightenment through the art of coding? Our app can
            create custom quizzes that align with your coding skills and
            interests. Whether you are a novice or a master, our system can
            generate questions that will test your proficiency in programming
            languages, tools, and concepts!
          </p>
        </m.div>

        <m.div
          initial={{ scale: 0 }}
          animate={{ rotate: 360, scale: 1 }}
          transition={{
            type: "spring",
            stiffness: 260,
            damping: 20,
          }}
          className="box box-color2"
        >
          <i className="fa-solid fa-money-bills fa-3x"></i>
          <h2>Rewarding</h2>
          <p>
            Our app is designed to be both challenging and rewarding, so you can
            learn new concepts while enjoying the process. With our personalized
            quiz app, you can track your progress, compete with your peers, and
            discover new areas of expertise. The journey of a thousand lines of
            code begins with a single keystroke!
          </p>
        </m.div>

        <m.div
          initial={{ scale: 0 }}
          animate={{ rotate: 360, scale: 1 }}
          transition={{
            type: "spring",
            stiffness: 260,
            damping: 20,
          }}
          className="box box-color3"
        >
          <i className="fa-solid fa-user fa-3x"></i>
          <h2>Personal SME</h2>
          <p>
            Welcome to the path of knowledge. Our app is like having a personal
            subject matter expert at your side, guiding you on your journey
            towards wisdom!
          </p>
        </m.div>
      </div>
    </m.div>
  );
}
