'use client';
import React, { useState, useEffect } from 'react';
import { withPageAuthRequired, useUser } from '@auth0/nextjs-auth0/client';
import { collection, updateDoc,deleteDoc, addDoc, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase.js';

export default withPageAuthRequired(function CSRPage() {
  const { user, isLoading } = useUser();
  const [existingUser, setExistingUser] = useState(null);
  const [newItem, setNewItem] = useState({
    firstName: '',
    lastName: '',
    email: '',
    status: '',
    careerPath: '',
    interests: '', 
    blurb: ''
  });

  useEffect(() => {
    if (!isLoading && user) {
      // Check if user exists in the database based on their email
      const checkUserExists = async () => {
        const q = query(collection(db, 'users'), where('email', '==', user.email));
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
          // User exists, set existing user data
          const userData = querySnapshot.docs[0].data();
          setExistingUser(userData);
          setNewItem({
            firstName: userData.firstName || '',
            lastName: userData.lastName || '',
            email: userData.email || '',
            status: userData.status || '',
            careerPath: userData.careerPath || '',
            interests: userData.interests || '',
            blurb: userData.blurb || ''
          });
        }
      };
      checkUserExists();
    }
  }, [user, isLoading]);

  const addItem = async (e) => {
    e.preventDefault();
  
    try {
      // Check if the user already exists based on their email
      const q = query(collection(db, 'users'), where('email', '==', newItem.email));
      const querySnapshot = await getDocs(q);
  
      if (!querySnapshot.empty) {
        // User exists, update their information
        const userDocRef = querySnapshot.docs[0].ref; // Obtain reference to the document
        const userData = querySnapshot.docs[0].data(); // Retrieve current user data
        const updatedData = { // Merge current data with new data
          firstName: newItem.firstName || userData.firstName,
          lastName: newItem.lastName || userData.lastName,
          status: newItem.status !== undefined ? newItem.status : 'Mentor', // Set default value to 'Mentor'
          careerPath: newItem.careerPath || userData.careerPath,
          interests: newItem.interests || userData.interests,
          blurb: newItem.blurb || userData.blurb,
        };
        await updateDoc(userDocRef, updatedData); // Update document with merged data
        setExistingUser(updatedData); // Update existingUser state with the updated data
      } else {
        // User doesn't exist, create a new document
        await addDoc(collection(db, 'users'), {
          firstName: newItem.firstName,
          lastName: newItem.lastName,
          email: newItem.email,
          status: newItem.status || 'Mentor', // Set default value to 'Mentor'
          interests: newItem.interests,
          careerPath: newItem.careerPath,
          blurb: newItem.blurb,
        });
      }
    } catch (error) {
      console.error('Error in addItem:', error);
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
          {existingUser ? ( // If user exists, display existing information
            <div>
              <h2 className="text-lg font-semibold mb-2">Existing Information:</h2>
              <p><strong>First Name:</strong> {existingUser.firstName}</p>
              <p><strong>Last Name:</strong> {existingUser.lastName}</p>
              <p><strong>Email:</strong> {existingUser.email}</p>
              <p><strong>Status:</strong> {existingUser.status}</p>
              <p><strong>Career Path:</strong> {existingUser.careerPath}</p>
              <p><strong>Interests:</strong> {existingUser.interests}</p>
              <p><strong>Blurb:</strong> {existingUser.blurb}</p>
              <button className="btn" onClick={() => setExistingUser(null)}>Edit</button>
            </div>
          ) : (
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
                <label htmlFor="status" className="block">Select Status:</label>
                <select
                  id="status"
                  name="status"
                  value={newItem.status}
                  onChange={handleChange}
                  className="input"
                >
                  <option value="path0">Mentor</option>
                  <option value="path1">Mentee</option>
                </select>
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
          )}
        </div>
      </div>
    </div>
  );
});