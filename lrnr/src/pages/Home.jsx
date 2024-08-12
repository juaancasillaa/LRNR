// src/pages/Home.jsx
import React from "react";
import "../components/Home.css"; // Import CSS for styling
import lrnrImage from "../components/image-removebg-preview.png"; // Import the image

const Home = () => {
  return (
    <div className="home-container">
      <img
        src={lrnrImage} // Use the imported image
        alt="Centered"
        className="home-image"
      />
      <h2 className="home-text">
        Your guided path to programming enlightenment
      </h2>
      <button className="home-button">Begin journey</button>
      <div className="home-features">
        <div className="feature">
          <i className="fas fa-bolt icon"></i> {/* Lightning icon */}
          <p className="heading-tag">Personalized Quizzes</p>
          <p className="feature-description">
            Greetings, young padawan. Are you ready to embark on a journey of
            personalized enlightenment through the art of coding? Our app, can
            create custom quizzes that align with your coding skills and
            interests. Whether you are a novice or a master, our system can
            generate questions that will test your proficiency in programming
            languages, tools, and concepts
          </p>
        </div>
        <div className="feature">
          <i className="fas fa-dollar-sign icon"></i> {/* Cash icon */}
          <p className="heading-tag">Rewarding</p>
          <p className="feature-description">
            Our app is designed to be both challenging and rewarding, so you can
            learn new concepts while enjoying the process. With our personalized
            quiz app, you can track your progress, compete with your peers, and
            discover new areas of expertise. The journey of a thousand lines of
            code begins with a single keystroke
          </p>
        </div>
        <div className="feature">
          <i className="fas fa-user icon"></i> {/* Profile icon */}
          <p className="heading-tag">Personal SME</p>
          <p className="feature-description">
            Welcome to the path of knowledge. Our app is like having a personal
            subject matter expert at your side, guiding you on your journey
            towards wisdom
          </p>
        </div>
      </div>
    </div>
  );
};

export default Home;
