// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB2rclZ0WCSQaqFmODYFieunveGIcZm1g4",
  authDomain: "wisepath-33f36.firebaseapp.com",
  projectId: "wisepath-33f36",
  storageBucket: "wisepath-33f36.appspot.com",
  messagingSenderId: "434800676599",
  appId: "1:434800676599:web:5fce364a34b00f36314df2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);