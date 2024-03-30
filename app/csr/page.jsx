/*'use client';
import { collection, addDoc } from "firebase/firestore"; 
//import {db} from './firebase'

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
  const [newItem, setNewItem] = useState({firstName: '', lastName: '',});

  const addItem = async (e) => {
    e.preventDefault();
    if (newItem.name !== '') {
      setusers([...users, newItem]);
      //await addDoc(collection(db, 'users'), {
      //  name: newItem.name.trim(), 
      //});
    }
  };

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
                value={newItem.firstName}
                onChange = {(e) => setFormData({ ...newItem, name: e.target.value })}
                type="text"
                id="firstName"
                name="firstName"
                // value={formData.firstName}
                // onChange={handleChange}
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
            <button 
            type="submit"
            onClick={addItem}
            >Submit</button>
          </form>
        </div>
      </div>
    </>
  );
});*/

'use client';
import { collection, addDoc } from "firebase/firestore"; 
import { db } from '../firebase.js';

import React, { useState } from 'react';
import { withPageAuthRequired } from '@auth0/nextjs-auth0/client';

export default withPageAuthRequired(function CSRPage() {

  const [newItem, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    careerPath: '',
    goals: ''
  });

  const addItem = async (e) => {
    e.preventDefault();
    if (newItem.firstName !== '' && newItem.lastName !== '' && newItem.email !== '' && newItem.careerPath !== '' && newItem.goals !== '') {
      await addDoc(collection(db, 'users'), {
        firstName: newItem.firstName, 
        lastName: newItem.lastName,
        email: newItem.email, 
        careerPath: newItem.careerPath,
        goals: newItem.goals, 
      });
    }
    /*if (newItem.lastName !== '') {
      await addDoc(collection(db, 'users'), {
        lastName: newItem.lastName, 
      });
    }
    if (newItem.email !== '') {
      await addDoc(collection(db, 'users'), {
        email: newItem.email, 
      });
    }
    if (newItem.careerPath !== '') {
      await addDoc(collection(db, 'users'), {
        careerPath: newItem.careerPath, 
      });
    }
    if (newItem.goals !== '') {
      await addDoc(collection(db, 'users'), {
        goals: newItem.goals, 
      });
    }*/
  };

  const handleChange = (e) => {
    setFormData({
      ...newItem,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission here
    console.log(newItem);
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
              <label htmlFor="lastName"
>Last Name:</label>
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
            <div>
              <label htmlFor="careerPath">Select one main career path:</label>
              <select
                id="careerPath"
                name="careerPath"
                value={newItem.careerPath}
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
                value={newItem.goals}
                onChange={handleChange}
              />
            </div>
            <button 
            type="submit"
            onClick={addItem}
            >Submit</button>
          </form>
        </div>
      </div>
    </>
  );
});