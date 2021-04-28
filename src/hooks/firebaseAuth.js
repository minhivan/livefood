import {db} from "../firebase";

function checkFirebaseAuth(authUser){
    var docRef = db.collection("users").doc(authUser.uid);

    docRef.get().then((doc) => {
        if(doc.exists){
            if(Object.keys(doc.data()).length === 0){
                docRef.set({
                    email: authUser.email,
                    emailVerified: authUser.emailVerified,
                    phoneNumber: authUser.phoneNumber,
                    displayName: authUser.displayName,
                    photoURL: authUser.photoURL,
                    uid: authUser.uid
                })
            }
        }
        else{
            docRef.set({
                email: authUser.email,
                emailVerified: authUser.emailVerified,
                phoneNumber: authUser.phoneNumber,
                displayName: authUser.displayName,
                photoURL: authUser.photoURL,
                uid: authUser.uid
            })
        }
    })
}


export default checkFirebaseAuth;