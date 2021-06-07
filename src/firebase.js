import firebase from "firebase";


// Backup
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

//
// const firebaseApp = firebase.initializeApp({
//     apiKey: "AIzaSyBdoe5rIleY0lqQEUSONza7VLE_IdlZZ10",
//     authDomain: "livefood-ca84b.firebaseapp.com",
//     projectId: "livefood-ca84b",
//     storageBucket: "livefood-ca84b.appspot.com",
//     messagingSenderId: "999671853542",
//     appId: "1:999671853542:web:58263d3f9cea99a668e627",
//     measurementId: "G-NWGR4V5CX4"
// });


const db  = firebaseApp.firestore();
const auth = firebase.auth();
const storage = firebaseApp.storage();
const provider = new firebase.auth.GoogleAuthProvider();
const database = firebase.database()
export {db, auth, storage, provider, database};


