// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "@firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA3bRFcVim7ZWMj_P31REyRR_hCAXkvMnU",
  authDomain: "exchange-8bbd7.firebaseapp.com",
  projectId: "exchange-8bbd7",
  storageBucket: "exchange-8bbd7.appspot.com",
  messagingSenderId: "792332515273",
  appId: "1:792332515273:web:55a4cf526eff3a611cda18",
  measurementId: "G-GQCNLSMR2H"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
//const analytics = getAnalytics(app);
export const db = getFirestore(app);