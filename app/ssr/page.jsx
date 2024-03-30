//this should be an explore page, display all mentors 
//do not display the logged in user themselves

'use client';
import { getSession, withPageAuthRequired } from '@auth0/nextjs-auth0/client'; // Import from client package
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase.js';

import React, { useEffect, useState } from 'react';

export default function FindMentor() {
  const [users, setUsers] = useState([]);
  const [selectedCareerPath, setSelectedCareerPath] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'users'));
        const usersData = querySnapshot.docs.map(doc => doc.data());
        setUsers(usersData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const handleCareerPathChange = (e) => {
    setSelectedCareerPath(e.target.value);
  };

  const handleMatchMeClick = () => {
    // Implement matching logic here
  };

  const filteredUsers = selectedCareerPath === '' ? users : users.filter(user => user.careerPath === selectedCareerPath);

  return (
    <div>
      <h2>Meet our current mentors!</h2>
      <p>Filter by career path:</p>
      <select value={selectedCareerPath} onChange={handleCareerPathChange}>
        <option value="">All</option>
        <option value="Computer Science">Computer Science</option>
        <option value="Medicine">Medicine</option>
        <option value="Finance">Finance</option>
        <option value="Writing">Writing</option>
      </select>
      <button onClick={handleMatchMeClick} style={{ marginTop: '10px' }}>Match me</button>
      <div className="mentor-container">
        {filteredUsers.map(user => (
          <div className="mentor-card" key={user.email}>
            <div className="card-content">
              <h3>{user.firstName} {user.lastName}</h3>
              <p>Email: {user.email}</p>
              {/* Check if user.careerPath and user.blurb exist before rendering */}
              {user.careerPath && <p>Career Path: {user.careerPath}</p>}
              {user.blurb && <p>Blurb: {user.blurb}</p>}
            </div>
          </div>
        ))}
      </div>
      <style jsx>{`
        .mentor-container {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); /* Adjust minmax values as needed */
          gap: 20px; /* Adjust gap between cards */
        }
  
        .mentor-card {
          border: 1px solid #ccc; /* Border for each card */
          border-radius: 5px; /* Rounded corners for each card */
          overflow: hidden; /* Ensure content doesn't overflow */
        }
  
        .card-content {
          padding: 20px; /* Padding for content within each card */
        }
      `}</style>
    </div>
  );
}