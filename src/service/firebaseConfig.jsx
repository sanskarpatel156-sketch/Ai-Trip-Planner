import { initializeApp } from "firebase/app"
import { getFirestore } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "ai-trip-planner-51d2e.firebaseapp.com",
  projectId: "ai-trip-planner-51d2e",
  storageBucket: "ai-trip-planner-51d2e.firebasestorage.app",
  messagingSenderId: "254099893894",
  appId: "1:254099893894:web:c272f2bf11af9b0c8f2b07",
  measurementId: "G-4D9W12BQ2C"
}

export const app = initializeApp(firebaseConfig)
export const db = getFirestore(app)
export const auth = getAuth(app)