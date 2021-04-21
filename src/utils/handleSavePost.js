import firebase from "firebase";

const handleSavePost = (postReference, userReference, uid, pid) => {
    postReference.update({
        saveBy: firebase.firestore.FieldValue.arrayUnion(uid)
    })
    userReference.update({
        postSave: firebase.firestore.FieldValue.arrayUnion(pid)
    })
}

export default handleSavePost;