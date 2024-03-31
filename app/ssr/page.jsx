"use client"

import { useState, useEffect } from 'react';
import { collection, getDocs, query, where, updateDoc, doc } from 'firebase/firestore';
import { db } from '../firebase.js';
import { getIntersectSet, calculateJaccard, fetchNameFromFirestore, separateInterests } from '../exports.js';

async function getAllDocumentIds(collectionName) {
  try {
    const querySnapshot = await getDocs(collection(db, collectionName));
    const documentIds = querySnapshot.docs.map(doc => doc.id);
    return documentIds;
  } catch (error) {
    console.error('Error getting document IDs:', error);
    return [];
  }
}

async function addFieldToAllDocuments(collectionName, fieldName, fieldValue) {
  try {
    const querySnapshot = await getDocs(collection(db, 'users'));
    querySnapshot.forEach(async (document) => {
      const docRef = doc(db, 'users', document.id); // Correct usage of doc function
      await updateDoc(docRef, {
        [fieldName]: fieldValue
      });
    });
  } catch (error) {
    console.error('Error adding field to documents:', error);
  }
}

async function updateFieldInDocument(collectionName, docId, fieldName, newValue) {
  try {
    // Get the document reference
    const docRef = doc(db, collectionName, docId);

    // Update the document with the new field value
    await updateDoc(docRef, {
      [fieldName]: newValue
    });

    console.log(`Field '${fieldName}' updated successfully in document with ID: ${docId}`);
  } catch (error) {
    console.error('Error updating field in document:', error);
  }
}

export default function FindMentor() {
  const [users, setUsers] = useState([]);
  const [selectedCareerPath, setSelectedCareerPath] = useState('');
  const [userDocID, setUserDocID] = useState(null); // State to store user document ID
  const userEmail = "ranpurakhushi@gmail.com"; // Replace with actual user email NEED TO PULL FROM AUTH??
  const docIDS = getAllDocumentIds(users);

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

  useEffect(() => {
    const fetchUserDocID = async () => {
      try {
        // Fetch user document ID from Firestore
        const docID = await getDocumentIdFromFirestore('email', userEmail);
        setUserDocID(docID);
      } catch (error) {
        console.error('Error fetching user document ID:', error);
      }
    };
  
    const matchPercent = 'matchPercent';

    addFieldToAllDocuments('users', matchPercent, '');

    fetchUserDocID();
  }, [userEmail]);

  for (let i = 0; i < docIDS.length; i++) {
    const intersectArray = getIntersectSet(separateInterests(fetchNameFromFirestore(userDocID)), separateInterests(fetchNameFromFirestore(docIDS[i])));
    let percentage = calculateJaccard(separateInterests(fetchNameFromFirestore(userDocID)), separateInterests(fetchNameFromFirestore(docIDS[i])), intersectArray);
    updateFieldInDocument('users', docIDS[i], matchPercent, percentage);
  }

  const handleCareerPathChange = (e) => {
    setSelectedCareerPath(e.target.value);
  };

  const handleMatchMeClick = () => {
    // Implement matching logic here
  };

  const filteredUsers = selectedCareerPath === '' ? users : users.filter(user => user.careerPath === selectedCareerPath);

  const handleChatClick = () => {
    window.location.href = '/external';
  };

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
              <button onClick={handleChatClick}>Chat</button>
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

/*(Stage lights up. Dave Chappelle walks onto the stage, microphone in hand, greeted by applause.)

Dave Chappelle: "Hey, hey, hey! What's up, everybody? Y'all ready to talk about some JavaScript tonight?"

(Audience cheers.)

Dave Chappelle: "You know, JavaScript is like that friend who always shows up uninvited to the party, but you can't ignore them because they're just so darn useful. I mean, you can't have a website without JavaScript. It's like trying to have a sandwich without bread. It just doesn't work!"

(Audience chuckles.)

Dave Chappelle: "But let me tell you, JavaScript has some quirks, man. Like, have you ever tried to compare two things in JavaScript? It's like trying to compare apples and oranges, but instead of getting a simple 'true' or 'false', you get a whole existential crisis!"

(Audience laughs.)

Dave Chappelle: "And what's the deal with callbacks? I mean, who came up with that idea? 'Hey, let me just pass this function as an argument to another function, and then... wait for it... wait for it... maybe it'll get called!' It's like playing Russian roulette with your code!"

(Audience roars with laughter.)

Dave Chappelle: "But you know what? Despite all its quirks and surprises, JavaScript keeps us on our toes. It's like that crazy ex-girlfriend who you just can't get rid of, but deep down, you kinda love her anyway."

(Audience erupts in laughter and applause.)

Dave Chappelle: "So here's to JavaScript, the wild ride that keeps us coding late into the night and Googling 'how to fix undefined is not a function' at 3 AM. Cheers!"

(Audience cheers and applause as Dave Chappelle exits the stage.)*/