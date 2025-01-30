import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyDcjFez7Tq5LT9VfU5UEwl92hSXo0L1bwg",
    authDomain: "convite-f06d7.firebaseapp.com",
    projectId: "convite-f06d7",
    storageBucket: "convite-f06d7.firebasestorage.app",
    messagingSenderId: "213151034619",
    appId: "1:213151034619:web:1ede3e2cbcfb2a008f545e",
    measurementId: "G-8294VFJESM"
};
  
const app = firebase.initializeApp(firebaseConfig)
const auth = firebase.auth()
const storage =  getStorage(app)

export {firebase, auth, app, storage} 