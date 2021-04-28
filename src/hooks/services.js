import firebase from "firebase";
import {db} from "../firebase";

export function handleLikePost(postId, uid) {
    db.collection('posts').doc(postId).update({
        likeBy: firebase.firestore.FieldValue.arrayUnion(uid)
    })
}


export function handleDislikePost(postId, uid) {
    db.collection('posts').doc(postId).update({
        likeBy: firebase.firestore.FieldValue.arrayRemove(uid)
    });
}


export const handleSavePost = (postId, uid) => {
    db.collection('posts').doc(postId).update({
        saveBy: firebase.firestore.FieldValue.arrayUnion(uid)
    });

    db.collection('users').doc(uid).update({
        postSave: firebase.firestore.FieldValue.arrayUnion(postId)
    })
}

export const handleUnSavedPost = (postId, uid) => {
    db.collection('posts').doc(postId).update({
        saveBy: firebase.firestore.FieldValue.arrayRemove(uid)
    });

    db.collection('users').doc(uid).update({
        postSave: firebase.firestore.FieldValue.arrayRemove(postId)
    })
}

export const handleUserFollow = (uid, id) => {
    // Add opponent to following array
    db.collection('users').doc(uid).update({
        following: firebase.firestore.FieldValue.arrayUnion(id)
    });
    // Add your id to opponent follower array
    db.collection('users').doc(id).update({
        follower: firebase.firestore.FieldValue.arrayUnion(uid)
    });
}

export const handleUserUnfollow = (uid, id) => {
    // Remove
    db.collection('users').doc(uid).update({
        following: firebase.firestore.FieldValue.arrayRemove(id)
    });
    // Update opponent follower
    db.collection('users').doc(id).update({
        follower: firebase.firestore.FieldValue.arrayRemove(uid)
    });
}

