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

import handleUserFollow from "../../utils/handleUserFollow";
import handleUserUnfollow from "../../utils/handleUserUnfollow";

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import { blue } from '@material-ui/core/colors';
import firebase from "firebase";
import {DialogContent} from "@material-ui/core";
import Divider from "@material-ui/core/Divider";



const useStyles = makeStyles((theme) => ({
    avatar: {
        backgroundColor: blue[100],
        color: blue[600],
    },
    userPhoto: {
        width: "120px",
        height: "120px",
        backgroundColor: blue[100],
        color: blue[600],
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
    },
    dialog: {
        maxWidth: "600px",
        width: "390px",
    }
}));



function SimpleDialog(props) {
    const classes = useStyles();
    const { handleClose, type, open, users , auth} = props;


    return (
        <Dialog onClose={handleClose} aria-labelledby="simple-dialog-title" open={open} >
            {
                type === '1' ? (
                    <DialogTitle id="simple-dialog-title" style={{textAlign: "center"}}>Following</DialogTitle>
                ) : (
                    <DialogTitle id="simple-dialog-title" style={{textAlign: "center"}}>Follower</DialogTitle>
                )
            }
            <Divider />
            <DialogContent className={classes.dialog}>
                <List>
                        {
                            users ? (users.map(({id, data}) => (
                                <ListItem key={id}>
                                    <>
                                        <ListItemAvatar>
                                            <Avatar className={classes.avatar} src={data?.photoURL} />
                                        </ListItemAvatar>
                                        <ListItemText onClick={handleClose}>
                                            <Link to={`/profile/${id}`}>{data?.displayName}</Link>
                                        </ListItemText>

                                    </>
                                    {
                                        type === '1' ? (
                                            <Button variant="contained" color="primary" onClick={() => handleUserUnfollow(auth, id)}>Following</Button>
                                        ) : (
                                            <Button variant="contained" color="primary" onClick={() => handleUserFollow(auth, id)}>Follow</Button>
                                        )
                                    }
                                </ListItem>
                            ))) : null
                        }
                </List>
            </DialogContent>
        </Dialog>
    );
}




const ProfileHeader = ({isAuthProfile, user, count,  ...rest}) => {
    const [userFollowing, setUserFollowing] = useState([]);
    const [userFollower, setUserFollower] = useState([]);


    const [openFollowing, setOpenFollowing] = useState(false);
    const [openFollower, setOpenFollower] = useState(false);


    const handleClickOpenFollowing = () => {
        setOpenFollowing(true);
    };

    const handleCloseFollowing = (value) => {
        setOpenFollowing(false);
    };

    const handleClickOpenFollower = () => {
        setOpenFollower(true);
    };

    const handleCloseFollower = (value) => {
        setOpenFollower(false);
    };


    // Your data
    const [authUser] = useAuthState(auth);

    useEffect(() => {
        if(typeof user?.follower !== 'undefined'){
            db.collection("users")
                .where(firebase.firestore.FieldPath.documentId(), 'in', user.follower)
                .get().then(snapshot => {
                    setUserFollower(
                        snapshot.docs.map((doc => ({
                            id: doc.id,
                            data: doc.data(),
                        })))
                    );
                })
        }
        if(typeof user?.following !== 'undefined'){
            db.collection("users")
                .where(firebase.firestore.FieldPath.documentId(), 'in', user.following)
                .get().then(snapshot => {
                setUserFollowing(
                    snapshot.docs.map((doc => ({
                        id: doc.id,
                        data: doc.data(),
                    })))
                );
            })
        }

    }, [user])


    // const checkOpponentFollowYou = (userFollowing, uid) => {
    //     let rs = false;
    //     if(typeof userFollowing !== 'undefined' ){
    //         rs = userFollowing.includes(uid);
    //     }
    //     return rs;
    // }


    // Check opponent follower to find you
    const checkFollowed = (userFollowerList, uid) => {
        let rs = false;
        if(typeof userFollowerList !== 'undefined' ){
            rs = userFollowerList.some(person => person.id === uid)
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
                                                    onClick={() => handleUserUnfollow(authUser.uid, user.uid)}
                                                >
                                                    Unfollow
                                                </Button>
                                            ) : (
                                                    <Button
                                                        variant="contained"
                                                        className={classes.button}
                                                        onClick={() => handleUserFollow(authUser.uid, user.uid)}
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
                            <div className="number"><strong title="Following">{userFollowing.length}</strong><a className="unit" onClick={handleClickOpenFollowing}>Following</a></div>
                            <div className="number"><strong title="Followers">{userFollower.length}</strong><a className="unit" onClick={handleClickOpenFollower}>Follower</a></div>
                        </h2>
                    </div>
                </div>

            </div>
            <SimpleDialog open={openFollowing} handleClose={handleCloseFollowing} users={userFollowing} type={`1`} auth={user?.uid} />
            <SimpleDialog open={openFollower} handleClose={handleCloseFollower} users={userFollower} type={`2`} auth={user?.uid}/>
        </div>
    )
}

export default ProfileHeader