import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/database';

/**
 * PickleTown 6200 — Firebase Configuration
 */
const firebaseConfig = {
  apiKey:            "AIzaSyDdAOu8gUrGrqHEcPR-bGBSRivIJzYRz2U",
  authDomain:        "dumapicklecourtfinder.firebaseapp.com",
  databaseURL:       "https://dumapicklecourtfinder-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId:         "dumapicklecourtfinder",
  storageBucket:     "dumapicklecourtfinder.firebasestorage.app",
  messagingSenderId: "382392528490",
  appId:             "1:382392528490:web:b901cf5caba092d845a413",
  measurementId:     "G-1FL4S553VL"
};

// Initialize Firebase
const app = firebase.apps.length === 0 ? firebase.initializeApp(firebaseConfig) : firebase.app();

// Expose globals used across the application
export const db = app.database();
export const auth = app.auth();

// Auth providers
export const googleProvider = new firebase.auth.GoogleAuthProvider();
export const facebookProvider = new firebase.auth.FacebookAuthProvider();

export default firebase;
