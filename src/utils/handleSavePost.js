import firebase from "firebase";

const handleSavePost = (postRef, userRef, uid, pid) => {
    postRef.update({
        saveBy: firebase.firestore.FieldValue.arrayUnion(uid)
    })
    userRef.update({
        postSave: firebase.firestore.FieldValue.arrayUnion(pid)
    })
}

export default handleSavePost;