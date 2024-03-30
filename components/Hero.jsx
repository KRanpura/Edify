import React from 'react';

import Logo from './Logo';

const Hero = () => (
  <div className="hero my-5 text-center" data-testid="hero">
    {/* <Logo testId="hero-logo" /> */}
    <h1 className="mb-4" data-testid="hero-title">
    Wisepath
    </h1>

    <p className="lead" data-testid="hero-lead">
    A personalized way to connect with mentors who can
          help you achieve your learning goals.
    </p>
  </div>
);

export default Hero;
