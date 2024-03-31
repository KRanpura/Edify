'use client';
import { useState, useEffect } from 'react';
import { collection, getDocs, updateDoc, doc } from 'firebase/firestore';
import { db } from '../firebase.js';
import { useAuth0 } from '@auth0/auth0-react';
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
    const querySnapshot = await getDocs(collection(db, collectionName));
    querySnapshot.forEach(async (document) => {
      const docRef = doc(db, collectionName, document.id);
      await updateDoc(docRef, {
        [fieldName]: fieldValue
      });
    });
  } catch (error) {
    console.error('Error adding field to documents:', error);
  }
}

async function updateMatchPercentage(userDocID, docIDS) {
  try {
    const userInterests = await fetchNameFromFirestore(userDocID);
    const updatePromises = docIDS.map(async docId => {
      const mentorInterests = await fetchNameFromFirestore(docId);
      const intersectArray = getIntersectSet(separateInterests(userInterests), separateInterests(mentorInterests));
      const percentage = calculateJaccard(separateInterests(userInterests), separateInterests(mentorInterests), intersectArray);
      await updateFieldInDocument('users', docId, 'matchPercent', percentage);
    });
    await Promise.all(updatePromises);
  } catch (error) {
    console.error('Error updating match percentage:', error);
  }
}

async function updateFieldInDocument(collectionName, docId, fieldName, newValue) {
  try {
    const docRef = doc(db, collectionName, docId);
    await updateDoc(docRef, {
      [fieldName]: newValue
    });
    console.log(`Field '${fieldName}' updated successfully in document with ID: ${docId}`);
  } catch (error) {
    console.error('Error updating field in document:', error);
  }
}

export default function FindMentor() {
  const { user } = useAuth0(); // Initialize the user object using useAuth0 hook
  const [users, setUsers] = useState([]);
  const [selectedCareerPath, setSelectedCareerPath] = useState('');
  const [userDocID, setUserDocID] = useState(null);
  const userEmail = "ranpurakhushi@gmail.com";
  const [docIDS, setDocIDS] = useState([]);

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
        const userEmail = user.email; 
        const querySnapshot = await getDocs(collection(db, 'users'));
        querySnapshot.forEach(doc => {
          const userData = doc.data();
          if (userData.email === userEmail) {
            setUserDocID(doc.id);
          }
        });
      } catch (error) {
        console.error('Error fetching user document ID:', error);
      }
    };
  
    const matchPercent = 'matchPercent';

    addFieldToAllDocuments('users', matchPercent, '');

    fetchUserDocID();
  }, [userEmail]);

  useEffect(() => {
    const fetchDocumentIds = async () => {
      const ids = await getAllDocumentIds('users');
      setDocIDS(ids);
    };

    fetchDocumentIds();
  }, []);

  useEffect(() => {
    if (userDocID && docIDS.length > 0) {
      updateMatchPercentage(userDocID, docIDS).then(() => {
        console.log('Match percentages updated successfully.');
      }).catch(error => {
        console.error('Error updating match percentages:', error);
      });
    }
  }, [userDocID, docIDS]);

  const handleCareerPathChange = (e) => {
    setSelectedCareerPath(e.target.value);
  };

  const filteredUsers = selectedCareerPath === '' ? users : users.filter(user => user.careerPath === selectedCareerPath);

  const handleChatClick = () => {
    window.location.href = '/chat';
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
      <div className="mentor-container">
        {filteredUsers.map(user => (
          <div className="mentor-card" key={user.email}>
            <div className="card-content">
              <h3>{user.firstName} {user.lastName}</h3>
              <p>Email: {user.email}</p>
              {user.careerPath && <p>Career Path: {user.careerPath}</p>}
              {user.interests && <p>Interests: {user.interests}</p>}
              {user.blurb && <p>Blurb: {user.blurb}</p>}
              {user.matchPercent && <p>Match Percentage: {user.matchPercent}</p>}
              <button onClick={handleChatClick}>Chat</button>
            </div>
          </div>
        ))}
      </div>
      <style jsx>{`
        .mentor-container {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 20px;
        }

        .mentor-card {
          border: 1px solid #ccc;
          border-radius: 5px;
          overflow: hidden;
        }

        .card-content {
          padding: 20px;
        }
      `}</style>
    </div>
  );
}