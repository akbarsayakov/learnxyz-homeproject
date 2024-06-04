// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getDatabase } from 'firebase/database'
import { getFirestore } from 'firebase/firestore'

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyCzX7Da61kpmAWKGtvZC87ZxX8sk03KXjs',
  authDomain: 'ttt-learnxyz.firebaseapp.com',
  projectId: 'ttt-learnxyz',
  storageBucket: 'ttt-learnxyz.appspot.com',
  messagingSenderId: '668958455502',
  appId: '1:668958455502:web:5311bae5646a398882c29f',
  measurementId: 'G-HTCGHX0D8M',
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
export const database = getDatabase(app)
export const auth = getAuth(app)
export const firestore = getFirestore(app)
