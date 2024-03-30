'use client';
import React, { useState } from 'react';
import { withPageAuthRequired } from '@auth0/nextjs-auth0/client';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebase.js';

export default withPageAuthRequired(function CSRPage() {
  const [newItem, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    stat: '',
    careerPath: '',
    interests: '', // Interests stored as a string
    blurb: ''
  });

  const addItem = async (e) => {
    e.preventDefault();
    if (
      newItem.firstName !== '' &&
      newItem.lastName !== '' &&
      newItem.email !== '' &&
      newItem.stat !== '' &&
      newItem.careerPath !== '' &&
      newItem.blurb !== '' &&
      newItem.interests.trim() !== '' // Check if interests is not empty or just whitespace
    ) {
      await addDoc(collection(db, 'users'), {
        firstName: newItem.firstName,
        lastName: newItem.lastName,
        email: newItem.email,
        stat: newItem.stat,
        interests: newItem.interests,
        careerPath: newItem.careerPath,
        blurb: newItem.blurb,
      });
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...newItem,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    addItem(e);
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
                value={newItem.firstName} 
                type="text"
                id="firstName"
                name="firstName"
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="lastName">Last Name:</label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={newItem.lastName}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="email">Email:</label>
              <input
                type="email"
                id="email"
                name="email"
                value={newItem.email}
                onChange={handleChange}
              />
            </div>
            {/* <div>
              <label htmlFor="stat">Select stat:</label>
              <select
                id="stat"
                name="stat"
                value={newItem.stat}
                onChange={handleChange}
              >
                <option value="mentor">Mentor</option>
                <option value="mentee">Mentee</option>
              </select>
            </div> */}

            <div>
              <label htmlFor="stat">Select stat:</label>
              <select
                id="stat"
                name="stat"
                value={newItem.stat}
                onChange={handleChange}
              >
                <option value="path1">Mentor</option>
                <option value="path2">Mentee</option>
              </select>
            </div>

            <div>
              <label htmlFor="careerPath">Select one main career path:</label>
              <select
                id="careerPath"
                name="careerPath"
                value={newItem.careerPath}
                onChange={handleChange}
              >
                <option value="path0">Select</option>
                <option value="All">Open to all</option>
                <option value="Computer Science">Computer Science</option>
                <option value="Medicine">Medicine</option>
                <option value="Finance">Finance</option>
                <option value="Writing">Writing</option>
              </select>
            </div>
            <div>
              <label htmlFor="interests">Interests:</label>
              <input
                id="interests"
                name="interests"
                value={newItem.interests}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="blurb">A short blurb about yourself:</label>
              <textarea
                id="blurb"
                name="blurb"
                value={newItem.blurb}
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