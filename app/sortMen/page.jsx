'use client';
import { useState, useEffect } from 'react';
import { collection, getDocs, updateDoc, doc } from 'firebase/firestore';
import { db } from '../firebase.js';
import { useUser } from '@auth0/nextjs-auth0/client';
import Fuse from 'fuse.js';



export default function FindMentor() {
  const { user } = useUser(); // Initialize the user object using useAuth0 hook
  const [usersDataArr, setUsersData] = useState([]);            //array to store all users
  const [currentUserData, setCurrentUserData] = useState([]);
  const [userResults, setUserResults] = useState([]);       //information for the current user used to compare



  useEffect(() => {
    const fetchData = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'users'));       //this fetches and stores all the users into the userDataArr array
        const usersDataArr = querySnapshot.docs.map(doc => doc.data());
        setUsersData(usersDataArr);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

    useEffect(() => {
    if (user) {
        const fetchCurrentUser = async () => {
            try {
              const currUserEmail = user.email;
              const querySnapshot = await getDocs(collection(db, 'users'));
              querySnapshot.forEach(doc => {
                const userData = doc.data();
                if (userData.email === currUserEmail) {
                  setCurrentUserData(userData); // Update state with fetched user data
                }
              });
            } catch (error) {
              console.error('Error fetching current user data:', error);
            }
          };
      fetchCurrentUser();
    }
  }, [user]);


  const fuseUsers = new Fuse(usersDataArr, {      //uses fuse to declare and call the array to check its keys and compare to the users
    keys: [
        'interests',
    ],
    includeScore: true,
  });
  
  useEffect(() => {
    if (usersDataArr.length > 0 && currentUserData) {
        const fuseOptions = {
            keys: ['interests'],
            includeScore: true,
          };

          const results = new Fuse(usersDataArr, fuseOptions).search("java");
          const userResults = results.map(result => result.item);
          setUserResults(userResults);
    }
  }, [usersDataArr, currentUserData, user])
        
    

  const handleChatClick = () => {
    window.location.href = '/external';
  };

  return (
    <div>
      <h3>Mentors Reccomended For You</h3>
      <div className="mentor-container">
        {userResults.map(user => (
          <div className="mentor-card" key={user.email}>
            <div className="card-content">
              <h3>{user.firstName} {user.lastName}</h3>
              <p>Email: {user.email}</p>
              {user.careerPath && <p>Career Path: {user.careerPath}</p>}
              {user.interests && <p>Interests: {user.interests}</p>}
              {user.blurb && <p>Blurb: {user.blurb}</p>}
              <button onClick={handleChatClick}>Chat</button>
            </div>
          </div>
        ))}
      </div>
      <style jsx>{`
        .mentor-container {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(100px, 100p));
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