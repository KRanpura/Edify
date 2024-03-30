'use client';
import React, { useState, useEffect } from 'react';
import { withPageAuthRequired, useUser } from '@auth0/nextjs-auth0/client';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebase.js';

export default withPageAuthRequired(function CSRPage() {
  const { user, isLoading } = useUser();
  const [newItem, setNewItem] = useState({
    firstName: '',
    lastName: '',
    email: '',
    careerPath: '',
    interests: '', 
    blurb: ''
  });

  useEffect(() => {
    console.log("User object:", user); // Log user object to check if email property exists
    if (!isLoading && user) {
      setNewItem({
        firstName: user.given_name || '',
        lastName: user.family_name || '',
        email: user.nickname ? `${user.nickname}@gmail.com` : '', // Use nickname as email or fallback to empty string
        careerPath: '',
        interests: '',
        blurb: ''
      });
    }
  }, [user, isLoading]);

  const addItem = async (e) => {
    e.preventDefault();
    if (
      newItem.firstName !== '' &&
      newItem.lastName !== '' &&
      newItem.email !== '' &&
      newItem.careerPath !== '' &&
      newItem.blurb !== '' &&
      newItem.interests.trim() !== '' 
    ) {
      await addDoc(collection(db, 'users'), {
        firstName: newItem.firstName,
        lastName: newItem.lastName,
        email: newItem.email,
        interests: newItem.interests,
        careerPath: newItem.careerPath,
        blurb: newItem.blurb,
      });
    }
  };

  const handleChange = (e) => {
    setNewItem({
      ...newItem,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    addItem(e);
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="max-w-md w-full">
        <h1 className="text-center mb-4 text-xl font-semibold">Update Profile</h1>
        <div className="border border-gray-300 rounded-lg p-6">
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="firstName" className="block">First Name:</label>
              <input
                value={newItem.firstName}
                type="text"
                id="firstName"
                name="firstName"
                onChange={handleChange}
                className="input"
                disabled
              />
            </div>
            <div className="mb-4">
              <label htmlFor="lastName" className="block">Last Name:</label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={newItem.lastName}
                onChange={handleChange}
                className="input"
                disabled
              />
            </div>
            <div className="mb-4">
              <label htmlFor="email" className="block">Email:</label>
              <input
                type="email"
                id="email"
                name="email"
                value={newItem.email}
                onChange={handleChange}
                className="input"
                disabled
              />
            </div>
            <div className="mb-4">
              <label htmlFor="careerPath" className="block">Select one main career path:</label>
              <select
                id="careerPath"
                name="careerPath"
                value={newItem.careerPath}
                onChange={handleChange}
                className="input"
              >
                <option value="path0">Select</option>
                <option value="All">Open to all</option>
                <option value="Computer Science">Computer Science</option>
                <option value="Medicine">Medicine</option>
                <option value="Finance">Finance</option>
                <option value="Writing">Writing</option>
              </select>
            </div>
            <div className="mb-4">
              <label htmlFor="interests" className="block">Interests:</label>
              <input
                id="interests"
                name="interests"
                value={newItem.interests}
                onChange={handleChange}
                className="input"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="blurb" className="block">A short blurb about yourself:</label>
              <textarea
                id="blurb"
                name="blurb"
                value={newItem.blurb}
                onChange={handleChange}
                className="input"
              />
            </div>
            <button type="submit" className="btn">Submit</button>
          </form>
        </div>
      </div>
    </div>
  );
});