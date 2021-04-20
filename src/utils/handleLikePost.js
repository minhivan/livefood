import firebase from "firebase";

const handleLikePost = (postRef, uid) => {
    postRef.update({
        likeBy: firebase.firestore.FieldValue.arrayUnion(uid)
    });
}


export default handleLikePost;