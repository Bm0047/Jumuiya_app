// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
export const firebaseConfig = {
  apiKey: "AIzaSyAd6JdzXFNeElGphAtJ3r2AJxSRPkgaUTo",
  authDomain: "studio-707970235-81c54.firebaseapp.com",
  projectId: "studio-707970235-81c54",
  storageBucket: "studio-707970235-81c54.firebasestorage.app",
  messagingSenderId: "849362009183",
  appId: "1:849362009183:web:1552d78ce0994729062fea"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);
