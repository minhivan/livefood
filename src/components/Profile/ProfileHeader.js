import React, {useEffect, useState} from "react";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import {makeStyles} from "@material-ui/core/styles";
import Skeleton from '@material-ui/lab/Skeleton';
import {Link} from "react-router-dom";
// import IconButton from "@material-ui/core/IconButton";
// import {Badge} from "@material-ui/core";
// import ExploreTwoToneIcon from "@material-ui/icons/ExploreTwoTone";
// import {useCollection, useDocument} from "react-firebase-hooks/firestore";
import {auth, db} from "../../firebase";
import {useAuthState} from "react-firebase-hooks/auth";
import firebase from "firebase";


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
    },
    buttonUnfollow: {
        overflow: "hidden",
        textOverflow: "ellipsis",
        position: "relative",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minWidth: "150px",
        color: "#454444",
        // "&:hover": {
        //     backgroundColor: "#c3d6fa",
        // },
        marginRight: "15px",
        textTransform: "capitalize"
    }
}));


const ProfileHeader = ({isAuthProfile,user, count,  ...rest}) => {
    const [userFollowing, setUserFollowing] = useState([]);
    const [userFollower, setUserFollower] = useState([]);

    // Your data
    const [authUser] = useAuthState(auth);
    const userRef = authUser && db.collection('users').doc(authUser?.uid);


    useEffect(() => {
        if(typeof user?.follower !== 'undefined'){
            setUserFollower(user.follower);
        }
        if(typeof user?.following !== 'undefined'){
            setUserFollowing(user.following);
        }
    }, [user])

    // const checkOpponentFollowYou = (userFollowing, uid) => {
    //     let rs = false;
    //     if(typeof userFollowing !== 'undefined' ){
    //         rs = userFollowing.includes(uid);
    //     }
    //     return rs;
    // }

    // check if user followed opponents

    const handleFollowClick = (opponentID, uid) => {
        // Update user following
        userRef.update({
            following: firebase.firestore.FieldValue.arrayUnion(opponentID)
        });
        // Update opponent follower
        db.collection('users').doc(opponentID).update({
            follower: firebase.firestore.FieldValue.arrayUnion(uid)
        });
    }

    const handleUnfollowClick = (opponentID, uid) => {
        userRef.update({
            following: firebase.firestore.FieldValue.arrayRemove(opponentID)
        });
        // Update opponent follower
        db.collection('users').doc(opponentID).update({
            follower: firebase.firestore.FieldValue.arrayRemove(uid)
        });
    }

    // Check opponent follower to find you
    const checkFollowed = (userFollowerList, uid) => {
        let rs = false;
        if(typeof userFollowerList !== 'undefined' ){
            rs = userFollowerList.includes(uid);
        }
        return rs;
    }


    const classes = useStyles();
    return (
        <div className="profile__header">
            <div className="profile__bio">
                <div className={classes.bioAvt}>
                    {
                        user? (
                                <Avatar alt={user?.displayName} src={user?.photoURL} className={classes.userPhoto}/>
                        ): (
                            <Skeleton animation="wave" variant="circle" width={120} height={120} />
                        )
                    }

                </div>
                <div className={classes.bioDetails}>
                    <div className="share-title-container">
                        {/* User bio */}
                        <h2 className="share-title">{user?.displayName}</h2>
                        <h1 className="share-sub-title">{user?.fullName ?? ''}</h1>
                        {
                            isAuthProfile ? (
                                <div className="share-follow-container">
                                    {/* Checking if followed */}
                                    <Link to="/account/edit">
                                        <Button
                                            variant="contained"
                                            className={classes.button}
                                        >
                                            Edit profile
                                        </Button>
                                    </Link>
                                </div>
                            ) : (
                                authUser ? (
                                    <div className="share-follow-container">
                                        {/* Checking if followed */}
                                        {
                                            checkFollowed(userFollower, authUser.uid) ? (
                                                <Button
                                                    variant="outlined"
                                                    className={classes.buttonUnfollow}
                                                    onClick={() => handleUnfollowClick(user.uid, authUser.uid)}
                                                >
                                                    Unfollow
                                                </Button>
                                            ) : (
                                                    <Button
                                                        variant="contained"
                                                        className={classes.button}
                                                        onClick={() => handleFollowClick(user.uid, authUser.uid)}
                                                    >
                                                        Follow
                                                    </Button>
                                                )

                                        }
                                        <Button
                                            variant="contained"
                                            className={classes.button}
                                        >
                                            Message
                                        </Button>
                                    </div>
                                ) : null
                            )
                        }

                        {
                            user?.bio ? (
                                <h2 className="share-desc mt10">
                                    {user.bio}
                                </h2>
                            ) : null
                        }

                        {
                            user?.profileLink ? (
                                    <div className="share-links">
                                        <a href={user.profileLink}>{user.profileLink}</a>
                                    </div>
                            ) : null
                        }

                        {/* Count info */}
                        <h2 className="count-infos">
                            <div className="number"><strong title="Likes">{ count ?? '0'}</strong><span
                                className="unit">Post</span></div>
                            <div className="number"><strong title="Following">{userFollowing.length}</strong><span
                                className="unit">Following</span></div>
                            <div className="number"><strong title="Followers">{userFollower.length}</strong><span
                                className="unit">Followers</span></div>
                        </h2>
                    </div>
                </div>

            </div>

        </div>
    )
}

export default ProfileHeader