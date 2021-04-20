import firebase from "firebase";

const handleDislikePost = (postRef, uid) => {
    postRef.update({
        likeBy: firebase.firestore.FieldValue.arrayRemove(uid)
    });
}


export default handleDislikePost;