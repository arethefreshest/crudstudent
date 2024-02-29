// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyC31hb6NDFbny1rZj5TfpOvalhnGPiGnDY",
    authDomain: "crud-student-management.firebaseapp.com",
    projectId: "crud-student-management",
    storageBucket: "crud-student-management.appspot.com",
    messagingSenderId: "533723340092",
    appId: "1:533723340092:web:de06dea5fcc9fa1d0dd239",
    measurementId: "G-CYK9BENWYG"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Analytics
const analytics = getAnalytics(app);

// Authentication
const auth = getAuth(app);

// Initialize Firestore
const db = getFirestore(app);


// Export any objects needed elsewhere in the app
export { app, auth, db };