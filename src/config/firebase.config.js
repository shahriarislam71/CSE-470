// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA079CQpEwgs_4WG1xN766F8-rZMIoNj6c",
  authDomain: "education-and-communication.firebaseapp.com",
  projectId: "education-and-communication",
  storageBucket: "education-and-communication.firebasestorage.app",
  messagingSenderId: "22632876910",
  appId: "1:22632876910:web:8da2898c5d7d44fb0a0f7f",
  measurementId: "G-XFK9QDGE4S"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export default app