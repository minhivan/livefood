import React from "react";
import Page from "../../components/Page";
import {useAuthState} from "react-firebase-hooks/auth";
import {auth, db} from "../../firebase";
import ProfileHeader from "../../components/Profile/ProfileHeader";
import {useParams} from "react-router";
import { useCollection } from "react-firebase-hooks/firestore";
import ProfileDetails from "../../components/Profile/Content/ProfileDetails";
import ProfileNavBar from "../../components/Profile/ProfileNavBar";
import {Divider} from "@material-ui/core";

import ProfileFeed from "../../components/Profile/Content/ProfileFeed";


function content(action, id){
    switch (action){
        case "profile_feed":
            return <ProfileFeed uid={id}/>
        case "profile_channel":
            return <ProfileDetails uid={id}/>
        default:
            return <></>
    }
}



const UserProfilePage = (props) => {
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
            title={`${user?.displayName} | LiveFood`}
            className="app__bodyContainer"
        >
            <div className="profile">
                {/* User profile */}
                <ProfileHeader isAuthProfile={isAuthProfile} user={user} />
                {/*  User content  */}
                <ProfileNavBar user={user}/>
                <Divider />
                {content(props.pagePath, id)}
            </div>
        </Page>
    )
}

export default UserProfilePage