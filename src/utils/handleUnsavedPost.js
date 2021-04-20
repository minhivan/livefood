import firebase from "firebase";

const handleUnsavedPost = (postRef, userRef, uid, pid) => {
    postRef.update({
        saveBy: firebase.firestore.FieldValue.arrayRemove(uid)
    })
    userRef.update({
        postSave: firebase.firestore.FieldValue.arrayRemove(pid)
    })
}

export default handleUnsavedPost;