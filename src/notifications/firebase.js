import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from 'firebase/messaging';

const firebaseConfig = {
  apiKey: "AIzaSyDYeEqHFP5NbCek5ygsInbA-PRBHwdnK5U",
  authDomain: "piqueentertainment-7e672.firebaseapp.com",
  projectId: "piqueentertainment-7e672",
  storageBucket: "piqueentertainment-7e672.firebasestorage.app",
  messagingSenderId: "1068929359199",
  appId: "1:1068929359199:web:9e40c97ef1afd66c9deaea",
  measurementId: "G-EMQ2FBNFJ9"
};

const app = initializeApp(firebaseConfig);
console.log("app",app)
const messaging = getMessaging(app);
console.log("messaging",messaging)
export { messaging, getToken, onMessage };