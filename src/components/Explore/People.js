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


export default function People() {
    const classes = useStyles();
    const [users, setUsers] = useState([])
    const [user] = useAuthState(auth);
    const userRef = db.collection('users').doc(user.uid);
    const [userSnapshot, loading] = useDocument(userRef);

    let userFollowingList = userSnapshot?.data().following;

    // List user
    useEffect(() => {
        db.collection("users")
            .where('uid' ,'!=' , user.uid)
            .get().then(snapshot => {

            setUsers(snapshot.docs.map(doc => ({
                id: doc.id,
                user: doc.data(),
            })));
        })

    }, [user.uid])

    // check if user followed
    const checkFollowed = (userFollowingList, uid) => {
        let rs = false;
        if(typeof userFollowingList !== 'undefined' ){
            rs = userFollowingList.includes(uid);
        }
        return rs;
    }


    const handleFollowClick = (uid) => {
        userRef.update({
            following: firebase.firestore.FieldValue.arrayUnion(uid)
        });
    }

    const handleUnfollowClick = (uid) => {
        userRef.update({
            following: firebase.firestore.FieldValue.arrayRemove(uid)
        });
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
                                primary={user.displayName}
                                secondary={
                                    <Typography
                                        component="span"
                                        variant="body2"
                                        className={classes.inline}
                                        color="textPrimary"
                                    >
                                        Full name - Suggested for you
                                    </Typography>
                                }
                            />

                            {
                                checkFollowed(userFollowingList, id) ? (
                                    <Button
                                        variant="outlined"
                                        style={{textTransform: "capitalize"}}
                                        className={classes.buttonUnfollow}
                                        onClick={() => handleUnfollowClick(id)}
                                    >
                                        Unfollow
                                    </Button>
                                ) : (
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        style={{textTransform: "capitalize"}}
                                        className={classes.button}
                                        onClick={() => handleFollowClick(id)}
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