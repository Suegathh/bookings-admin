import React from "react";
import { useNavigate } from "react-router-dom";
import "./Home.scss";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div id="home" className="home-container">
      {/* Hero Section */}
      <div className="hero">
        <div className="overlay"></div>
        <img src="./images/hotel1.jpeg" alt="Hotel" className="hero-image" />
        
        {/* Animated Text */}
        <div className="hero-content">
          <h1 className="animate-text">Welcome to Your Dream Stay</h1>
          <p className="animate-subtext">
            Experience luxury and comfort like never before.
          </p>

          {/* CTA Button */}
          <button className="cta-button" onClick={() => navigate("/rooms")}>
            Explore Rooms
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;
