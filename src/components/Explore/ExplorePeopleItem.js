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
import {Tooltip} from "@material-ui/core";
import CheckCircleTwoToneIcon from "@material-ui/icons/CheckCircleTwoTone";

const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
        backgroundColor: theme.palette.background.paper,
        marginLeft: "10px",
        borderRadius: "8px",
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
    const {userLogged, query} = props;
    const userRef = userLogged && db.collection('users').doc(userLogged.uid);
    const [userSnapshot] = useDocument(userRef);
    const [userLoggedData, setUserLoggedData] = useState({});
    let userFollowingList = userSnapshot?.data()?.following;


    useEffect(() => {
        if(userLogged){
            setUserLoggedData({
                uid: userLogged.uid,
                photoURL: userLogged.photoURL,
                displayName: userLogged.displayName
            })
        }
    }, [userLogged])


    // List user
    useEffect(() => {
        if(query){
            return db.collection("users")
                .where('uid' ,'!=' , userLogged.uid )
                .orderBy('uid', 'desc')
                .orderBy('accountType', 'desc')
                .limit(30)
                .get().then(snapshot => {
                    let data = [];
                    snapshot.forEach(doc => {
                        if(doc.data()?.displayName?.toLowerCase().includes(query)){
                            data.push({id: doc.id, user: doc.data()})
                        }
                    })
                    setUsers(data);
                }).catch(error => console.log(error));
        }
        else{
            return db.collection("users")
                .orderBy('accountType', 'asc')
                .orderBy('displayName', 'asc')

                .limit(20)
                .get().then(snapshot => {
                    let data = [];
                    snapshot.forEach(function(doc) {
                        // doc.data() is never undefined for query doc snapshots
                        if(!doc.data()?.follower?.includes(userLogged.uid) && doc.id !== userLogged.uid){
                            data.push({id: doc.id, user: doc.data()})
                        }
                    });
                    setUsers(data);
                })


        }
    }, [userLogged, query])


    console.log(users)


    // check if user followed
    // const checkFollowed = (userFollowingList, uid) => {
    //     let rs = false;
    //     if(typeof userFollowingList !== 'undefined' ){
    //         rs = userFollowingList.includes(uid);
    //     }
    //     return rs;
    // }


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
                                    <h4 style={{display: "flex", alignItems: "center"}}>
                                        <Link to={`/profile/${user?.uid}`} className={classes.name}>{user?.displayName}</Link>
                                        {
                                            user?.accountVerified ? (
                                                <Tooltip title="Verified" arrow>
                                                    <CheckCircleTwoToneIcon style={{ color: blue[700], marginLeft: "5px"}} fontSize={"small"}/>
                                                </Tooltip>
                                            ) : null
                                        }
                                    </h4>
                                    }
                                secondary={
                                    <Typography
                                        component="span"
                                        variant="body2"
                                        className={classes.inline}
                                        color="textPrimary"
                                    >
                                        Full name
                                        -   {user?.following?.includes(userLogged.uid) ? "Follow you" : " Suggested for you"}
                                    </Typography>
                                }
                            />

                            {
                                userFollowingList?.includes(id) ? (
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
                                        onClick={() => handleUserFollow(userLoggedData, id)}
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