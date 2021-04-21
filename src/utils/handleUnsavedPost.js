import firebase from "firebase";

const handleUnsavedPost = (postReference, userReference, uid, pid) => {
    postReference.update({
        saveBy: firebase.firestore.FieldValue.arrayRemove(uid)
    })
    userReference.update({
        postSave: firebase.firestore.FieldValue.arrayRemove(pid)
    })
}

export default handleUnsavedPost;