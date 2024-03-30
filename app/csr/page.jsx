'use client';

import React, { useState } from 'react';
import { withPageAuthRequired } from '@auth0/nextjs-auth0/client';

export default withPageAuthRequired(function CSRPage() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    careerPath: '',
    goals: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission here
    console.log(formData);
  };

  return (
    <>
      <div className="mb-5" data-testid="csr">
        <h1 data-testid="csr-title">Update Profile</h1>
        <div data-testid="csr-text">
          <form onSubmit={handleSubmit}>
            <div>
              <label htmlFor="firstName">First Name:</label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="lastName">Last Name:</label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="email">Email:</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="careerPath">Select one main career path:</label>
              <select
                id="careerPath"
                name="careerPath"
                value={formData.careerPath}
                onChange={handleChange}
              >
                <option value="path0">Select </option>
                <option value="path1">Unsure </option>
                <option value="path2">Computer Science</option>
                <option value="path3">Medicine</option>
                <option value="path4">Finance</option>
                <option value="path5">Writing</option>

              </select>
            </div>
            <div>
              <label htmlFor="goals">Blurb about your goals and interests:</label>
              <textarea
                id="goals"
                name="goals"
                value={formData.goals}
                onChange={handleChange}
              />
            </div>
            <button type="submit">Submit</button>
          </form>
        </div>
      </div>
    </>
  );
});