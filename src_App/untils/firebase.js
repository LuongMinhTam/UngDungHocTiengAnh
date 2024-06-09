import { getAuth } from "firebase/auth";
import { initializeApp } from "firebase/app";
import {getDatabase, onValue} from 'firebase/database'
import {getStorage, ref as storageRef, uploadString, getDownloadURL} from 'firebase/storage'


const firebaseConfig = {
  apiKey: "AIzaSyAZ_p9GIpx-zKqGD9fRJL6JFO4WtnwcECo",
  authDomain: "app-hoctienganh-android.firebaseapp.com",
  databaseURL: "https://app-hoctienganh-android-default-rtdb.firebaseio.com",
  projectId: "app-hoctienganh-android",
  storageBucket: "app-hoctienganh-android.appspot.com",
  messagingSenderId: "973663036489",
  appId: "1:973663036489:web:c76263595f158213f50b98",
  measurementId: "G-QMHBVGQQ5R"
};

// Initialize Firebase

const FIREBASE_APP = initializeApp(firebaseConfig);
const FIREBASE_AUTH = getAuth(FIREBASE_APP);
const FIREBASE_DB = getDatabase(FIREBASE_APP);
const FIREBASE_STORAGE = getStorage(FIREBASE_APP);

export { FIREBASE_APP, FIREBASE_AUTH, FIREBASE_DB, FIREBASE_STORAGE, storageRef };