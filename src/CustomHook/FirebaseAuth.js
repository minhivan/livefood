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
        }else{
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

// const useFirebaseAuthentication = (auth) => {
//     const [authUser, setAuthUser] = useState(null);
//
//     useEffect(() =>{
//         const unsubscribe = auth.onAuthStateChanged(
//             authUser => {
//                 authUser
//                     ? setAuthUser(authUser)
//                     : setAuthUser(null);
//             },
//         );
//         return () => {
//             unsubscribe();
//         }
//     });
//     return authUser
// }

export default checkFirebaseAuth;