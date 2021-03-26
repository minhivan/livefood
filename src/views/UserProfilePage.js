import React from "react";
import Page from "../components/Page";
import {useAuthState} from "react-firebase-hooks/auth";
import {auth} from "../firebase";
import {makeStyles} from "@material-ui/core/styles";
import UserProfile from "../components/Profile/UserProfile";
import {useParams} from "react-router";



const useStyles = makeStyles((theme) => ({
    userPhoto: {
        width: "120px",
        height: "120px"
    },
    bioDetails: {
        marginLeft: "50px",
        overflow: "hidden",
        textOverflow: "ellipsis",
        display: "flex",
        alignItems: "center"
    },
    bioAvt: {
        overflow: "hidden",
        textOverflow: "ellipsis",
        display: "flex",
        alignItems: "flex-start",
        paddingTop: "10px"
    },
    button: {
        overflow: "hidden",
        textOverflow: "ellipsis",
        position: "relative",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minWidth: "150px",
        color: "white",
        backgroundColor: "#0095f6",
        "&:hover": {
            backgroundColor: "#0186db",
        },
        marginRight: "15px",
        textTransform: "capitalize"
    }
}));


const UserProfilePage = () => {
    const [user] = useAuthState(auth);
    let { id } = useParams();
    let isAuthProfile = false;

    if(id === user.uid){
        isAuthProfile = true;
    }

    const classes = useStyles();

    return(
        <Page
            title={user?.displayName + ` | LiveFood`}
            className="app__bodyContainer"
        >
            <div className="profile">
                {/* User profile */}
                {
                    isAuthProfile ? (
                        <UserProfile isAuthProfile={isAuthProfile} user={user}/>
                    ) :  <UserProfile isAuthProfile={isAuthProfile} />
                }

            </div>
        </Page>
    )
}

export default UserProfilePage