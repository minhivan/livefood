import React from "react";
import Page from "../../components/Page";
import {db} from "../../firebase";
import ProfileHeader from "../../components/Profile/ProfileHeader";
import {useParams} from "react-router";
import {useDocument} from "react-firebase-hooks/firestore";
import ProfileVideo from "../../components/Profile/Content/ProfileVideo";
import ProfileNavBar from "../../components/Profile/ProfileNavBar";
import {Divider} from "@material-ui/core";

import ProfileFeed from "../../components/Profile/Content/ProfileFeed";
import ProfileSaved from "../../components/Profile/Content/ProfileSaved";
import ProfileMenuList from "../../components/Profile/Content/ProfileMenuList";
import pic from "../../images/Background/undraw_page_not_found_su7k.svg";
import {makeStyles} from "@material-ui/core/styles";
import CircularProgress from "@material-ui/core/CircularProgress";
import Backdrop from "@material-ui/core/Backdrop";
import ProfileVoteRating from "../../components/Profile/Content/ProfileVoteRating";
import ProfileAbout from "../../components/Profile/Content/ProfileAbout";


function content(action, id, userLogged, userSnapshot){
    switch (action){
        case "feed":
            return <ProfileFeed uid={id} userLogged={userLogged} type="post"/>
        case "channel":
            return <ProfileVideo uid={id} userLogged={userLogged} type="video"/>
        case "saved":
            return <ProfileSaved uid={id} userLogged={userLogged} type="saved"/>
        case "dishes":
            return <ProfileMenuList uid={id} userLogged={userLogged} userSnapshot={userSnapshot} type="dishes"/>
        case "vote":
            return <ProfileVoteRating uid={id} userLogged={userLogged} userSnapshot={userSnapshot} type="vote"/>
        case "about":
            return <ProfileAbout uid={id} userLogged={userLogged} userSnapshot={userSnapshot}/>
        default:
            return <></>
    }
}

const useStyles = makeStyles((theme) => ({

    wrapper: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        maxHeight: "300px",
        width: "100%"
    },
    redirect: {
        display: "flex",
        flexDirection: "column",
        textAlign: "center",
        paddingTop: "20px"
    },
    details: {
        padding: "20px 0"
    },

    img: {
        width: "320px",
        display: "inline-block",
        maxWidth: "100%",
        marginTop: "50px"
    },
    imgHolder: {
        textAlign: "center"
    },
    backdrop: {
        zIndex: theme.zIndex.drawer + 1,
        color: '#fff',
    },
}));

const UserProfilePage = (props) => {
    const {userLogged} = props;
    let { id } = useParams();
    const classes = useStyles();
    const [userData, loading] = useDocument(id && db.collection('users').doc(id));
    const userSnapshot = userData?.data();

    console.log(userSnapshot)

    return(

        <Page
            title={`${userSnapshot?.displayName} | LiveFood`}
            className="app__bodyContainer"
        >
            {
                loading ? (
                    <Backdrop className={classes.backdrop} open={loading} >
                        <CircularProgress color="inherit" />
                    </Backdrop>
                ) : (
                    userSnapshot ? (
                        <div className="profile">
                            {/* User profile */}
                            <ProfileHeader userSnapshot={userSnapshot} count={userData?.data()?.post?.length} userLogged={userLogged}/>
                            {/*  User content  */}
                            <Divider />
                            <ProfileNavBar userSnapshot={userSnapshot}/>
                            <Divider />
                            {content(props.pagePath, id, userLogged, userSnapshot)}
                        </div>
                    ) : (
                        <>
                            <div className={classes.wrapper}>
                                <div className={classes.imgHolder}>
                                    <img src={pic} alt="404" className={classes.img}/>
                                </div>
                                <div className={classes.details}>
                                    <h1>This page doesn’t exist</h1>
                                    <p>Please check your URL or return to LiveFood home.</p>
                                </div>
                            </div>
                        </>
                    )
                )

            }

        </Page>
    )
}

export default UserProfilePage