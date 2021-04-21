import firebase from "firebase";
import {db} from "../firebase";

const handleUserUnfollow = (uid, id) => {
    // Remove
    db.collection('users').doc(uid).update({
        following: firebase.firestore.FieldValue.arrayRemove(id)
    });
    // Update opponent follower
    db.collection('users').doc(id).update({
        follower: firebase.firestore.FieldValue.arrayRemove(uid)
    });
}

export default handleUserUnfollow;