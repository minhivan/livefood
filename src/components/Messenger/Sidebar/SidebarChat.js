import React, {useEffect} from "react";
import CardHeader from "@material-ui/core/CardHeader";
import Avatar from "@material-ui/core/Avatar";
import getRecipientUser from "../../../utils/getRecipientUser";
import {auth, db} from "../../../firebase";
import {useAuthState} from "react-firebase-hooks/auth";
import {useCollection} from "react-firebase-hooks/firestore";
import {Link, NavLink as RouterLink} from "react-router-dom";
import {Button, ListItem} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";
import {useDispatch} from "react-redux";
import { setChat} from "../../../features/chatSlice";
import {useParams} from "react-router";
import TimeAgo from "timeago-react";

const useStyles = makeStyles((theme) => ({
    item: {
        paddingTop: 0,
        paddingBottom: 0,
    },
    button: {
        color: theme.palette.text.secondary,
        fontWeight: theme.typography.fontWeightMedium,
        justifyContent: 'flex-start',
        letterSpacing: 0,
        padding: '0',
        textTransform: 'none',
        width: '100%',
    },
    title: {
        fontWeight: "500",
        fontSize: "1.1rem",
        paddingLeft: "15px",
        color: "#050505"
    },
    active: {
        color: "#262626",
        backgroundColor: "#efefef",
        '& $title': {
            fontWeight: 600,
            color: theme.palette.primary.main,
        },
        '& $icon': {
            color: theme.palette.primary.main,
        }
    },
    userInbox: {
        fontSize: "1rem",
    },
    lastSeen: {
        overflow: "hidden",
        height: "20px",
        textOverflow: "ellipsis"
    }

}));



function SidebarChat(props){
    const dispatch = useDispatch();
    const classes = useStyles();
    const [user] = useAuthState(auth);
    const recipientUser = getRecipientUser(props.users, user);
    const [recipientUserSnapshot] = useCollection(db.collection('users').where('email' ,'==', recipientUser));
    const recipient = recipientUserSnapshot?.docs?.[0]?.data();

    const [test] = useCollection(
        props.id &&
        db.collection("chats")
            .doc(props.id)
            .collection("messages")
            .orderBy("timestamp", "asc")
    );

    let isSender = false;
    if(test?.docs?.[test?.docs?.length -1]?.data()?.uid === user.uid){
        isSender = true;
    }

    const handleEnter = (roomID) => {
        if(roomID){
            dispatch(setChat({
                roomID: roomID,
                recipient: {
                    uid: recipient.uid,
                    displayName: recipient.displayName,
                    photoURL: recipient.photoURL,
                    email: recipient.email
                }
            }))
        }
    }

    return(
        <ListItem
            className={classes.item}
            disableGutters
        >
            <Button
                onClick={() => handleEnter(props.id)}
                activeClassName={classes.active}
                className={classes.button}
                component={RouterLink}
                to={`/messages/t/${props.id}`}
            >
                <div className="user__inbox  bottomDivider" >
                    {/*<Avatar alt={recipient?.displayName} src={recipient?.photoURL}/>*/}
                    {/*<span>{recipient?.displayName}</span>*/}
                    <CardHeader
                        className="suggest__user"
                        avatar={
                            <Avatar aria-label="recipe" className="" src={recipient?.photoURL}/>
                        }
                        title={
                            <span className={classes.userInbox}>{recipient?.displayName}</span>
                        }
                        subheader={
                            <p className={classes.lastSeen}>{
                                isSender ? (
                                     "You: " + test?.docs?.[test?.docs?.length -1]?.data().message
                                 ): (
                                    test?.docs?.[test?.docs?.length -1]?.data().message
                                )
                            }</p>

                        }
                    />
                </div>
            </Button>

        </ListItem>
    )
}

export default SidebarChat