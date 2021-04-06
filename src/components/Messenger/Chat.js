import React, {useEffect, useRef, useState} from "react";
import IconButton from "@material-ui/core/IconButton";
import {makeStyles} from "@material-ui/core/styles";
import InfoRoundedIcon from '@material-ui/icons/InfoRounded';

import {MessageCircle as MessageIcon} from "react-feather";
import {db} from "../../firebase";
import Message from "./Message";
import {useSelector} from "react-redux";
import {selectChatID, selectChatRecipient} from "../../features/chatSlice";
import {useCollection} from "react-firebase-hooks/firestore";
import ChatInput from "./ChatInput";


const useStyles = makeStyles((theme) => ({
    header:{
        paddingLeft: "5px"
    },
    chat: {
        color: "#262626",
        overflowWrap: "break-word",
        whiteSpace: "normal",
        fontSize: "14px",
    },
    chatTime: {
        marginLeft: 20,
        fontSize: "12px",
        color: "#484848",
        float: "right"
    },
    icon: {
        color: "#050505",
    },
    wrapper: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        width: "100%",
        height: "100%"
    },
    none: {
        width: "100px",
        height: "100px",
        borderColor: "#262626",
        borderWidth: "2px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        borderStyle: "solid",
        borderRadius: "50%",
        marginBottom: 20
    },
    bottom: {
        paddingBottom: 200
    },
    chatName: {
        display: "flex",
        alignItems: "center"
    },
    lastSeen: {
        fontSize: 14,
        paddingLeft: "20px"
    }
}));



function Chat({id}){
    const recipient = useSelector(selectChatRecipient);
    const classes = useStyles();
    const roomID =  useSelector(selectChatID);
    const chatRef = useRef(null);

    // const [recipientUserSnapshot] = useCollection(recipient && db.collection('users').where('uid' ,'==', recipient.uid));
    // const lastActive = recipientUserSnapshot?.docs?.[0]?.data()?.lastActive;

    const [chatMessages, setChatMessage] = useState([]);

    const [test, loading] = useCollection(
        id &&
                db.collection("chats")
                    .doc(id)
                    .collection("messages")
                    .orderBy("timestamp", "asc")
    );


    useEffect(() => {

        id && db.collection("chats")
            .doc(id)
            .collection("messages")
            .orderBy("timestamp", "asc")
            .onSnapshot((doc) => {

                chatRef?.current?.scrollIntoView({
                    behavior: "auto",
                    block: "start"
                });

                setChatMessage(doc.docs.map((doc) => ({
                    id: doc.id,
                    data: doc.data()
                })))
            })
        // realtime on page


        chatRef?.current?.scrollIntoView({
            behavior: "auto",
            block: "start"
        });


    }, [loading])


    if(!roomID ){
        return (
            <div className="messenger__chat">
                <div className={classes.wrapper}>
                    <div className={classes.none}>
                        <MessageIcon
                            className={classes.icon}
                            size="40"
                        />
                    </div>
                    <h3>Your Messages</h3>
                    <h5>Send private photos and messages to a friend or group.</h5>
                </div>
            </div>
        )
    }

    return (
        <div className="messenger__chat">
            <div className="navigation__header padding-10-20 messenger__header">
                <div className={classes.chatName}>
                    <h2 className={classes.header}>{recipient?.displayName}</h2>
                    <span className={classes.lastSeen}>{
                        test?.docs?.[test?.docs?.length -1]?.data()?.timestamp ? (
                            test?.docs?.[test?.docs?.length -1]?.data()?.timestamp?.toDate().toLocaleString()
                        ) : "Loading"
                    }</span>
                </div>

                <IconButton aria-label="comment" >
                    <InfoRoundedIcon />
                </IconButton>
            </div>

            <div className="chat__container">
                {chatMessages.map(({id, data}) => (
                    <Message
                        key={id}
                        message={data.message}
                        timestamp={data.timestamp}
                        uid={data.uid}
                    />
                ))}
                <div ref={chatRef} className={classes.bottom}  />
            </div>

            <ChatInput
                roomID={roomID}
                chatRef={chatRef}
            />
        </div>
    )
}


export default Chat