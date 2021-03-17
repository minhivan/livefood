import firebase from "firebase";

const firebaseApp = firebase.initializeApp({
    apiKey: "AIzaSyDlZn21g8sGNMymkMzHffD0Oc2lPe1LT74",
    authDomain: "instagram-clone-43b17.firebaseapp.com",
    databaseURL: "https://instagram-clone-43b17-default-rtdb.firebaseio.com",
    projectId: "instagram-clone-43b17",
    storageBucket: "instagram-clone-43b17.appspot.com",
    messagingSenderId: "36751790983",
    appId: "1:36751790983:web:dbe426431a870a283bb922",
    measurementId: "G-E7TX0H5G4W"
});

const db  = firebaseApp.firestore();
const auth = firebase.auth();
const storage = firebaseApp.storage();
const provider = new firebase.auth.GoogleAuthProvider();

export {db, auth, storage, provider};


