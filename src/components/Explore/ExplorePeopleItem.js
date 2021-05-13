import React, {useEffect, useState} from "react";
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import {db} from "../../firebase";
import Button from "@material-ui/core/Button";
import { useDocument} from "react-firebase-hooks/firestore";
import {Link, useLocation} from "react-router-dom";
import {handleUserFollow, handleUserUnfollow} from "../../hooks/services";
import {blue} from "@material-ui/core/colors";

const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
        backgroundColor: theme.palette.background.paper,
        marginLeft: "10px",
        borderRadius: "16px",
        padding: 0,
        boxShadow: "0px 0px 5px 0px #ddc4c4bf",
        overflow: "hidden"
    },
    inline: {
        display: 'inline',
    },
    listItem: {
        paddingTop: "15px",
        paddingBottom: "15px",
        borderBottom: "1px solid #0000001f",
        "&:hover": {
            backgroundColor: "rgba(38, 50, 56, 0.04)",
        },
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
        marginRight: "15px",
        textTransform: "capitalize",
    },
    avatar: {
        backgroundColor: blue[100],
        color: blue[600],
    },
    name: {
        fontWeight: "bold",
        "&:hover": {
            textDecoration: "underline"
        },
    },
    container: {
        display: "grid",
        gridTemplateColumns: "repeat(1, 1fr)",
        width: "100%",
        maxWidth: "990px",
        marginLeft: "16px"
    }
}));


export default function ExplorePeopleItem(props) {
    const classes = useStyles();
    const [users, setUsers] = useState([])
    const {userLogged} = props;

    const userRef = userLogged && db.collection('users').doc(userLogged.uid);
    const [userSnapshot] = useDocument(userRef);

    let userFollowingList = userSnapshot?.data()?.following;
    let userFollowerList = userSnapshot?.data()?.follower;

    let query = new URLSearchParams(useLocation().search).get("q");





    // List user
    useEffect(() => {
        if(typeof userFollowingList !== 'undefined' && userFollowingList?.length > 0){
            var followingList;
            followingList = userSnapshot.data().following
            userLogged.uid && followingList.push(userLogged.uid);
            return db.collection("users")
                .get().then(snapshot => {
                    let data = [];
                    snapshot.forEach(function(doc) {
                        // doc.data() is never undefined for query doc snapshots
                        if(!followingList.includes(doc.id)){
                            data.push({id: doc.id, user: doc.data()})
                        }
                    });
                    setUsers(data);
                })
        }
        else{
            return db.collection("users")
                .where('uid' ,'!=' , userLogged.uid )
                .get().then(snapshot => {
                    setUsers(snapshot.docs.map(doc => ({
                        id: doc.id,
                        user: doc.data(),
                    })));
                })
        }


    }, [userFollowingList?.length, query])


    // check if user followed
    const checkFollowed = (userFollowingList, uid) => {
        let rs = false;
        if(typeof userFollowingList !== 'undefined' ){
            rs = userFollowingList.includes(uid);
        }
        return rs;
    }


    const checkOpponentFollowYou = (userFollowerList, uid) => {
        let rs = false;
        if(typeof userFollowerList !== 'undefined' ){
            rs = userFollowerList.includes(uid);
        }
        return rs;
    }

    return (
        <div className={classes.container} >
            <List className={classes.root}>
                {
                    users?.map(({id, user}) => (
                        <ListItem key={id} alignItems="center" className={classes.listItem}>
                            <ListItemAvatar>
                                <Avatar className={classes.avatar} alt="" src={user.photoURL} />
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
                                        onClick={() => handleUserUnfollow(userLogged.uid, id)}
                                    >
                                        Unfollow
                                    </Button>
                                ) : (
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        style={{textTransform: "capitalize"}}
                                        className={classes.button}
                                        onClick={() => handleUserFollow(userLogged.uid, id)}
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