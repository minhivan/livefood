import firebase from "firebase";
import {db} from "../firebase";

const handleUserFollow = (uid, id) => {

    // Add opponent to following array
    db.collection('users').doc(uid).update({
        following: firebase.firestore.FieldValue.arrayUnion(id)
    });
    // Add your id to opponent follower array
    db.collection('users').doc(id).update({
        follower: firebase.firestore.FieldValue.arrayUnion(uid)
    });
}

export default handleUserFollow;