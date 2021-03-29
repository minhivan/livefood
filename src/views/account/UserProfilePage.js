import React from "react";
import Page from "../../components/Page";
import {useAuthState} from "react-firebase-hooks/auth";
import {auth, db} from "../../firebase";
import ProfileHeader from "../../components/Profile/ProfileHeader";
import {useParams} from "react-router";
import { useCollection } from "react-firebase-hooks/firestore";


const UserProfilePage = () => {
    const [currentUser] = useAuthState(auth);
    let { id } = useParams();
    let isAuthProfile = false;

    if(id === currentUser?.uid){
        isAuthProfile = true;
    }

    const [userData] = useCollection(db.collection('users').where('uid', '==', id))
    const user = userData?.docs?.[0].data();


    return(
        <Page
            title={currentUser?.displayName + ` | LiveFood`}
            className="app__bodyContainer"
        >
            <div className="profile">
                {/* User profile */}
                <ProfileHeader isAuthProfile={isAuthProfile} user={user} />
                {/*  User content  */}
                {/*<UserContent user={user} />*/}

            </div>
        </Page>
    )
}

export default UserProfilePage