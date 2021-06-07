import React, {useEffect, useRef, useState} from "react";
import IconButton from "@material-ui/core/IconButton";
import {makeStyles} from "@material-ui/core/styles";
import InfoRoundedIcon from '@material-ui/icons/InfoRounded';

import {MessageCircle as MessageIcon} from "react-feather";
import {db} from "../../firebase";
import Message from "./Message";
import ChatInput from "./ChatInput";
import {useParams} from "react-router";
import MessengerUtil from "../Popup/MessengerUtil";

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



function Chat({userLogged, recipientData, setOpenSnack}){
    const { id } = useParams();
    // const recipient = useSelector(selectChatRecipient);
    const classes = useStyles();
    const chatRef = useRef(null);
    const [recipientUser, setRecipientUser] = useState('');
    const [openUtil, setOpenUtil] = useState(false);

    const handleOpenUtil = () => {
        setOpenUtil(true);
    }

    const handleCloseUtil = () => {
        setOpenUtil(false);
    }

    useEffect(() => {
        if(recipientData)  setRecipientUser(recipientData)
        else{
            console.log("sadadasdasdsa");
        }
    }, [recipientData])

    const [chatMessages, setChatMessage] = useState([]);

    useEffect(() => {
        const unsubscribe = db.collection("chats")
            .doc(id)
            .collection("messages")
            .orderBy("timestamp", "asc")
            .limit(30)
            .onSnapshot((doc) => {
                setChatMessage(doc.docs.map((doc) => ({
                    id: doc.id,
                    data: doc.data()
                })))
            })

        return () => {
            // realtime on page
            unsubscribe();
        }
    }, [id])

    useEffect(() => {
        chatRef.current?.scrollIntoView({
            behavior: "auto",
            block: "nearest",
        });
    }, [chatMessages])


    if(!id){
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
                    <h2 className={classes.header}>{recipientUser.displayName}</h2>
                    <span className={classes.lastSeen}>{chatMessages?.[chatMessages?.length - 1]?.data?.timestamp?.toDate().toLocaleString()}</span>
                </div>

                <IconButton aria-label="comment" onClick={handleOpenUtil}>
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
                        userLogged={userLogged}
                        recipient={recipientUser}
                    />
                ))}
                <div ref={chatRef} className={classes.bottom}  />
            </div>

            <ChatInput
                roomID={id}
                chatRef={chatRef}
                userLogged={userLogged}
            />

            {
                openUtil ? (
                    <MessengerUtil open={openUtil} handleClose={handleCloseUtil} roomId={id} setOpenSnack={setOpenSnack} recipient={recipientUser}/>
                ) : null
            }

        </div>
    )
}


export default Chat;