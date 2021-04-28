import React from "react";
import Page from "../../components/Page";
import {useAuthState} from "react-firebase-hooks/auth";
import {auth, db} from "../../firebase";
import ProfileHeader from "../../components/Profile/ProfileHeader";
import {useParams} from "react-router";
import {useCollection, useDocument} from "react-firebase-hooks/firestore";
import ProfileVids from "../../components/Profile/Content/ProfileVids";
import ProfileNavBar from "../../components/Profile/ProfileNavBar";
import {Divider} from "@material-ui/core";

import ProfileFeed from "../../components/Profile/Content/ProfileFeed";
import ProfileSaved from "../../components/Profile/Content/ProfileSaved";


function content(action, id){
    switch (action){
        case "feed":
            return <ProfileFeed uid={id} type="post"/>
        case "channel":
            return <ProfileVids uid={id} type="video"/>
        case "saved":
            return <ProfileSaved uid={id} type="saved"/>
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
    window.scroll({top: 0, left: 0, behavior: 'smooth' });

    const [userData] = useDocument(id && db.collection('users').doc(id));
    const userSnapshot = userData?.data()
    const [userPost] = useCollection(id && db.collection("posts").where("uid", '==', id));

    return(
        <Page
            title={`${userSnapshot?.displayName} | LiveFood`}
            className="app__bodyContainer"
        >
            <div className="profile">
                {/* User profile */}
                <ProfileHeader isAuthProfile={isAuthProfile} user={userSnapshot} count={userPost?.size}/>
                {/*  User content  */}
                <ProfileNavBar user={userSnapshot}/>
                <Divider />
                {content(props.pagePath, id)}
            </div>
        </Page>
    )
}

export default UserProfilePage