// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBIFDXuEKWrykBXKB7sGtc9oQA9a8nvazM",
  authDomain: "oauth-ilf.firebaseapp.com",
  projectId: "oauth-ilf",
  storageBucket: "oauth-ilf.appspot.com",
  messagingSenderId: "858497295593",
  appId: "1:858497295593:web:f9d83a87303a5555f63c78"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
