
import React, { useEffect } from 'react';

const Hero = () => {
  useEffect(() => {
    const heroContainer = document.querySelector(".hero-container");
    heroContainer.classList.add("fade-in");
  }, []); // Empty dependency array ensures the effect runs only once after the component mounts

  return (
    <div className="hero-container my-5 text-left align-text-top gradient-text" data-testid="hero">
      {/* <Logo testId="hero-logo" /> */}
      <h1 className="mb-4" data-testid="hero-title">
        Edify
      </h1>
      <p className="lead" data-testid="hero-lead">
        A personalized way to connect with mentors who can help you achieve your learning goals.
      </p>
    </div>
  );
}

export default Hero;




