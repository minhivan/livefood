import firebase from "firebase";
import {db} from "../firebase";


export function handleLikePost(postId, userData, postAuthor) {
    db.collection('posts').doc(postId).update({
        likeBy: firebase.firestore.FieldValue.arrayUnion(userData.uid),
        likeCount: firebase.firestore.FieldValue.increment(1)
    }).then(() => {
        if(postAuthor !== userData.uid) {
            postAuthor && db.collection('users').doc(postAuthor).collection("notifications").add({
                reference: "post",
                type : "like",
                message: "love your post",
                from : userData.displayName,
                avatar: userData.photoURL,
                uid: userData.uid,
                path : "/p/" + postId,
                timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                status: "unread"
            })
        }
    });
}


export function handleDislikePost(postId, uid) {
    db.collection('posts').doc(postId).update({
        likeBy: firebase.firestore.FieldValue.arrayRemove(uid),
        likeCount: firebase.firestore.FieldValue.increment(-1)
    })
}


export const handleSavePost = (postId, uid) => {
    db.collection('posts').doc(postId).update({
        saveBy: firebase.firestore.FieldValue.arrayUnion(uid)
    }).then(() => {
        db.collection('users').doc(uid).update({
            postSave: firebase.firestore.FieldValue.arrayUnion(postId)
        })
    });
}

export const handleUnSavedPost = (postId, uid) => {
    db.collection('posts').doc(postId).update({
        saveBy: firebase.firestore.FieldValue.arrayRemove(uid)
    }).then(() => {
        db.collection('users').doc(uid).update({
            postSave: firebase.firestore.FieldValue.arrayRemove(postId)
        })
    });
}

export const handleUserFollow = (userData, id) => {
    // Add opponent to following array
    db.collection('users').doc(userData.uid).update({
        following: firebase.firestore.FieldValue.arrayUnion(id),
        followingCount: firebase.firestore.FieldValue.increment(1)
    }).then(() => {
        // Add your id to opponent follower array
        db.collection('users').doc(id).update({
            follower: firebase.firestore.FieldValue.arrayUnion(userData.uid),
            followerCount: firebase.firestore.FieldValue.increment(1)
        }).then(() => {
            db.collection('users').doc(id).collection("notifications").add({
                reference: "user",
                type : "follow",
                message: "started to follow you",
                from : userData.displayName,
                uid: userData.uid,
                avatar: userData.photoURL,
                path : "/profile/" + userData.uid,
                timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                status: "unread"
            })
        });
    });
}

export const handleUserUnfollow = (uid, id) => {
    // Update following
    db.collection('users').doc(uid).update({
        following: firebase.firestore.FieldValue.arrayRemove(id),
        followingCount: firebase.firestore.FieldValue.increment(-1)
    }).then(() => {
        // Update opponent follower
        db.collection('users').doc(id).update({
            follower: firebase.firestore.FieldValue.arrayRemove(uid),
            followerCount: firebase.firestore.FieldValue.increment(-1)
        }).then(() => {
            console.log("Success");
        });
    });

}


export const handleDeletePost = (id) => {
    // Remove
    db.collection("posts").doc(id).delete().then(() => {
        console.log("Document successfully deleted!");
    }).catch((error) => {
        console.error("Error removing document: ", error);
    });

}

export const handleReportPost = (uid, id) => {
    db.collection('posts').doc(id).update({
        reportBy: firebase.firestore.FieldValue.arrayUnion(uid)
    });
}

export const handleDeleteMenuItem = (uid, id) => {
    // Remove
    db.collection("users").doc(uid).collection("menu").doc(id).delete().then(() => {
        console.log("Document successfully deleted!");
        // Remove image from storage
    }).catch((error) => {
        console.error("Error removing document: ", error);
    });
}


export const checkMyFollowingList = (myFollowerList, oppID) => {
    let rs = false;
    if(typeof myFollowerList !== 'undefined' ){
        rs = myFollowerList.includes(oppID)
    }
    return rs;
}

export const handleDeleteComment = (postId, commentId) => {
    db.collection("posts").doc(postId).collection("comments").doc(commentId).delete().then(() => {
        console.log("Document successfully deleted!");
        // Remove image from storage
    }).catch((error) => {
        console.error("Error removing document: ", error);
    });
}


export function checkSignInWithGoogle(authUser){
    const docRef = db.collection("users").doc(authUser.uid);
    return docRef.get().then((doc) => {
        if(!doc.exists){
            docRef.set({
                email: authUser.email,
                emailVerified: authUser.emailVerified,
                phoneNumber: authUser.phoneNumber,
                displayName: authUser.displayName,
                photoURL: authUser.photoURL,
                uid: authUser.uid
            }).then(() => {
                console.log("Updated")
            })
        }
    })
}


export const checkFirebaseAuth = (authUser) => {
    db.collection("users").doc(authUser.uid).set({
        email: authUser.email,
        emailVerified: authUser.emailVerified,
        phoneNumber: authUser.phoneNumber,
        displayName: authUser.displayName,
        photoURL: authUser.photoURL,
        uid: authUser.uid
    }).then(() => {
        console.log('Successfully');
    });
}

// export const pushUserNotification = (userId, type, data) => {
//     return db.collection('users').doc(id).collection("notifications").add({
//         type : "follow",
//         from : uid,
//         path : "/profile/" + uid,
//         timestamp: firebase.firestore.FieldValue.serverTimestamp(),
//         status: "unread"
//     })
// }

export const handleSeenNotification = (uid, notiId) => {
    db.collection('users').doc(uid).collection("notifications").doc(notiId).update({
        status: "read"
    })
}

