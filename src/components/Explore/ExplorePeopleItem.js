import React, {useEffect, useState} from "react";
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Divider from '@material-ui/core/Divider';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import {auth, db} from "../../firebase";
import Button from "@material-ui/core/Button";
import {useAuthState} from "react-firebase-hooks/auth";
import firebase from "firebase";
import { useDocument} from "react-firebase-hooks/firestore";
import {Link} from "react-router-dom";

const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
        backgroundColor: theme.palette.background.paper,
    },
    inline: {
        display: 'inline',
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


export default function ExplorePeopleItem() {
    const classes = useStyles();
    const [users, setUsers] = useState([])
    const [userData] = useAuthState(auth);

    const userRef = db.collection('users').doc(userData.uid);
    const [userSnapshot] = useDocument(userRef);

    let userFollowingList = userSnapshot?.data()?.following;
    let userFollowerList = userSnapshot?.data()?.follower;

    // List user
    useEffect(() => {
        var followingList;

        if(typeof userSnapshot?.data()?.following !== 'undefined' && userSnapshot?.data()?.following.length >= 0){
            followingList = userSnapshot.data().following
            followingList.push(userData.uid);
            return db.collection("users")
                .where('uid' ,'not-in' , followingList )
                .get().then(snapshot => {
                    setUsers(snapshot.docs.map(doc => ({
                        id: doc.id,
                        user: doc.data(),
                    })));
            })
        }
    }, [userSnapshot])


    // check if user followed
    const checkFollowed = (userFollowingList, uid) => {
        let rs = false;
        if(typeof userFollowingList !== 'undefined' ){
            rs = userFollowingList.includes(uid);
        }
        return rs;
    }

    const handleFollowClick = (id, uid) => {
        // Update user following
        userRef.update({
            following: firebase.firestore.FieldValue.arrayUnion(id)
        });
        // Update opponent follower
        db.collection('users').doc(id).update({
            follower: firebase.firestore.FieldValue.arrayUnion(uid)
        });
    }

    const handleUnfollowClick = (id, uid) => {
        userRef.update({
            following: firebase.firestore.FieldValue.arrayRemove(id)
        });
        // Update opponent follower
        db.collection('users').doc(id).update({
            follower: firebase.firestore.FieldValue.arrayRemove(uid)
        });
    }


    const checkOpponentFollowYou = (userFollowerList, uid) => {
        let rs = false;
        if(typeof userFollowerList !== 'undefined' ){
            rs = userFollowerList.includes(uid);
        }
        return rs;
    }

    return (
        <div className="explore__container">
            <List className={classes.root}>
                {
                    users?.map(({id, user}) => (
                        <ListItem key={id} alignItems="flex-start">
                            <ListItemAvatar>
                                <Avatar alt={user.displayName} src={user.photoURL} />
                            </ListItemAvatar>
                            <ListItemText
                                primary={
                                    <Link to={`/profile/${user?.uid}`} className={classes.name}>{user?.displayName}</Link>
                                    }
                                secondary={
                                    <Typography
                                        component="span"
                                        variant="body2"
                                        className={classes.inline}
                                        color="textPrimary"
                                    >
                                        Full name
                                        -   {checkOpponentFollowYou(userFollowerList, id) ? "Follow you" : " Suggested for you"}
                                    </Typography>
                                }
                            />

                            {
                                checkFollowed(userFollowingList, id) ? (
                                    <Button
                                        variant="outlined"
                                        style={{textTransform: "capitalize"}}
                                        className={classes.buttonUnfollow}
                                        onClick={() => handleUnfollowClick(id, userData.uid)}
                                    >
                                        Unfollow
                                    </Button>
                                ) : (
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        style={{textTransform: "capitalize"}}
                                        className={classes.button}
                                        onClick={() => handleFollowClick(id, userData.uid)}
                                    >
                                        Follow
                                    </Button>
                                )
                            }
                        </ListItem>
                    ))
                }

            </List>
        </div>
    );
}