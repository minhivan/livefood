import firebase from "firebase";

// Your firebase key here

const db  = firebaseApp.firestore();
const auth = firebase.auth();
const storage = firebaseApp.storage();

export {db, auth, storage};


