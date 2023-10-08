// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBGd7o_xlBtSombgjkS_bxJsV5RNTKIS_k",
  authDomain: "app-taxi-8fb2b.firebaseapp.com",
  projectId: "app-taxi-8fb2b",
  storageBucket: "app-taxi-8fb2b.appspot.com",
  messagingSenderId: "904057851710",
  appId: "1:904057851710:web:86784623193cba8a22666f",
  measurementId: "G-VMMMQQEP3P"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
export default app;
export { auth };