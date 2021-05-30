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
            }).catch((error) => {
                console.error("Error ", error);
            });
        }
    }).catch((error) => {
        console.error("Error ", error);
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
        }).catch((error) => {
            console.error("Error ", error);
        });
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
        }).catch((error) => {
            console.error("Error ", error);
        });
    }).catch((error) => {
        console.error("Error ", error);
    });

}


export const handleRatingPost = (postId, value) => {
    db.collection("posts").doc(postId).update({
        rating: value
    }).catch((error) => {
        console.error("Error ", error);
    });
}

export const handleDeletePost = (id, uid) => {
    // Remove
    db.collection("posts").doc(id).delete().then(() => {
        console.log("Document successfully deleted!");
        db.collection("users").doc(uid).update({
            post: firebase.firestore.FieldValue.arrayRemove(id)
        }).catch((error) => {
            console.error("Error removing document: ", error);
        });
    }).catch((error) => {
        console.error("Error removing document: ", error);
    });
}

// Report (Spam, violence + dangerous, Nudity or sexual activity)
export const handleReportPost = (uid, id) => {
    db.collection('posts').doc(id).update({
        reportBy: firebase.firestore.FieldValue.arrayUnion(uid),
        reportCount: firebase.firestore.FieldValue.increment(1)
    }).catch((error) => {
        console.error("Error ", error);
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

export const commentOnPost = (data) => {
    db.collection("posts").doc(data.postId).collection("comments").add({
        text: data.text,
        userRef: db.doc('users/' + data.uid),
        commentFromUser: data.from,
        commentFromUserAvt: data.avatar,
        commentFromUid: data.uid,
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    }).then(() => {
        db.collection('posts').doc(data.postId).update({
            commentsCount: firebase.firestore.FieldValue.increment(1)
        }).catch((error) => {
            console.error("Error ", error);
        });
    });
}


export const commentWithRating = (data) => {
    db.collection("posts").doc(data.postId).collection("comments").add({
        text: data.text,
        userRef: db.doc('users/' + data.uid),
        commentFromUser: data.from,
        commentFromUserAvt: data.avatar,
        commentFromUid: data.uid,
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        rating: data.rating,
    }).then(() => {
        db.collection('posts').doc(data.postId).update({
            commentsCount: firebase.firestore.FieldValue.increment(1)
        }).catch((error) => {
            console.error("Error ", error);
        });
    })
}


export const replyToComment = (data) => {
    db.collection("posts").doc(data.postId).collection("comments").doc(data.commentId).collection('reply').add({
        text: data.text,
        replyFromRef: db.doc('users/' + data.uid),
        replyFromAvt: data.userAvt,
        replyFrom: data.userDisplayName,
        replyFromUid: data.uid,
        replyToUid: data.replyToUid,
        replyTo: data.replyTo,
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    }).then(() => {
        db.collection('posts').doc(data.postId).collection("comments").doc(data.commentId).update({
            commentsReplyCount: firebase.firestore.FieldValue.increment(1),
        }).catch((error) => {
            console.error("Error ", error);
        });
    }).catch((error) => {
        console.error("Error ", error);
    });
}


export const handleLikeComment = (data) => {
    // if reply or just a comment
    if (data.type === "comment"){
        db.collection('posts').doc(data.postId).collection("comments").doc(data.commentId).update({
            likeBy: firebase.firestore.FieldValue.arrayUnion(data.user),
            likeCount: firebase.firestore.FieldValue.increment(1)
        }).catch((error) => {
            console.error("Error ", error);
        });
    }
    if (data.type === "reply"){
        db.collection('posts').doc(data.postId).collection("comments").doc(data.commentId)
            .collection("reply").doc(data.replyId).update({
                likeBy: firebase.firestore.FieldValue.arrayUnion(data.user),
                likeCount: firebase.firestore.FieldValue.increment(1)
            }).catch((error) => {
            console.error("Error ", error);
        });
    }
}

export const handleUnlikeComment = (data) => {
    if (data.type === "comment"){
        db.collection('posts').doc(data.postId).collection("comments").doc(data.commentId).update({
            likeBy: firebase.firestore.FieldValue.arrayRemove(data.user),
            likeCount: firebase.firestore.FieldValue.increment(-1)
        }).catch((error) => {
            console.error("Error ", error);
        });
    }
    if (data.type === "reply"){
        db.collection('posts').doc(data.postId).collection("comments").doc(data.commentId)
            .collection("reply").doc(data.replyId).update({
            likeBy: firebase.firestore.FieldValue.arrayRemove(data.user),
            likeCount: firebase.firestore.FieldValue.increment(-1)
        }).catch((error) => {
            console.error("Error ", error);
        });
    }
}


export const handleDeleteComment = (postId, commentId) => {
    db.collection("posts").doc(postId).collection("comments").doc(commentId).delete().then(() => {
        db.collection("posts").doc(postId).update({
            commentsCount: firebase.firestore.FieldValue.increment(-1)
        }).catch((error) => {
            console.error("Error : ", error);
        });
        console.log("Document successfully deleted!");
    }).catch((error) => {
        console.error("Error: ", error);
    });
}


export function checkSignInWithGoogle(authUser){
    const docRef = db.collection("users").doc(authUser.uid);
    docRef.get().then((doc) => {
        if(!doc.exists){
            docRef.set({
                email: authUser.email,
                emailVerified: authUser.emailVerified,
                phoneNumber: authUser.phoneNumber,
                displayName: authUser.displayName,
                photoURL: authUser.photoURL,
                uid: authUser.uid,
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            }).then(() => {
                console.log("Updated")
            })
        }
    }).catch((error) => {
        console.error("Error ", error);
    });
}


export const checkFirebaseAuth = (authUser) => {
    db.collection("users").doc(authUser.uid).set({
        email: authUser.email,
        emailVerified: authUser.emailVerified,
        phoneNumber: authUser.phoneNumber,
        displayName: authUser.displayName,
        photoURL: authUser.photoURL,
        uid: authUser.uid,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
    }).catch((error) => {
        console.error("Error ", error);
    });
}

export const pushUserNotification = (data) => {
    switch (data.type){
        case "reply":
            Object.assign(data, {message: "has replying your comment"});
            break;
        case "comment":
            Object.assign(data, {message: "commented on your post"});
            break;
        case "like":
            Object.assign(data, {message: "love your post"});
            break;
        case "follow":
            Object.assign(data, {message: "started to follow you"});
            break;
        default:
            return null
    }

    db.collection('users').doc(data.postAuthor).collection("notifications").add({
        reference: data.reference,
        type : data.type,
        message: data.message,
        from : data.from,
        avatar: data.avatar,
        opponentId: data.opponentId,
        path : "/p/" + data.postId,
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        status: "unread"
    }).catch((error) => {
        console.error("Error ", error);
    });
}

export const handleSeenNotification = (uid, notificationId) => {
    db.collection('users').doc(uid).collection("notifications").doc(notificationId).update({
        status: "read"
    }).catch((error) => {
        console.error("Error ", error);
    });
}


export const handleCreateChat = (opponentEmail, userEmail) => {
    if(opponentEmail && opponentEmail!== userEmail){
        if(!isConversationExists(opponentEmail, userEmail)){
            db.collection("conversations").add({
                users: [userEmail, opponentEmail],
                lastUpdate: firebase.firestore.FieldValue.serverTimestamp(),
                isSeen: firebase.firestore.FieldValue.serverTimestamp(),
                lastSend: userEmail
            }).then(function(docRef) {
                return docRef.id;
            }).catch((error) => {
                console.error("Error ", error);
            });
        }
        else{
            return getConversationRoom(opponentEmail, userEmail);
        }
    }
}


export const isConversationExists = (opponentEmail, userEmail) => {
    return db.collection("conversations")
        .where('users', 'array-contains', userEmail)
        .get().then((doc) => {
            return doc.docs.find((chat) =>
                chat.data().users.find((user) =>
                    user === opponentEmail)?.length > 0)
    });
}


export const getConversationRoom = (opponentEmail, userEmail) => {
    return db.collection("conversations")
        .where('users', 'array-contains', userEmail)
        .get().then((doc) => {
            const rs = doc.docs.find((chat) =>
                chat.data().users.find((user) =>
                    user === opponentEmail))
            return rs.id;
    });

}
