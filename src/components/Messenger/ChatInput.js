import React, {useState} from "react";
import {auth, db} from "../../firebase";
import firebase from "firebase";
import {useAuthState} from "react-firebase-hooks/auth";
import {useDocument} from "react-firebase-hooks/firestore";

import SentimentSatisfiedRoundedIcon from "@material-ui/icons/SentimentSatisfiedRounded";
import {Popover, TextField} from "@material-ui/core";
import IconButton from "@material-ui/core/IconButton";

import 'emoji-mart/css/emoji-mart.css'
import { Picker } from 'emoji-mart'



const ChatInput = ({roomID, chatRef, userLogged}) => {
    const [input, setInput] = useState('');
    const conversationRef = roomID && db.collection("conversations").doc(roomID);
    const messageRef = roomID && db.collection("chats").doc(roomID).collection("messages")
    const [conversationData] = useDocument(conversationRef)
    const [anchorElPicker, setAnchorElPicker] = useState(null);



    const open = Boolean(anchorElPicker);
    const id = open ? 'simple-popover-picker' : undefined;

    const handleClick = (event) => {
        setAnchorElPicker(event.currentTarget);
    }
    const handleClose = () => {
        setAnchorElPicker(null);
    };
    const addEmoji = (event) => {
        let emoji = event.native;
        setInput(input + emoji);
    }


    const checkingRead = () => {
        if(conversationData?.data()?.lastSend !== userLogged.email && !conversationData?.data()?.isSeen){
            conversationRef.update({
                lastUpdate: firebase.firestore.FieldValue.serverTimestamp(),
                isSeen: true
            }).catch((error) => {
                console.log("Update chat error: " + error)
            })
        }
    }

    const checkingKeypress = (event) => {
        if(event.key === "Enter"){
            if(!event.shiftKey){
                sendMessage(event)
            }
        }
    }

    const sendMessage = (event) => {
        event.preventDefault();

        if(input !== '' && (!/^\s+$/.test(input))){
            messageRef.add({
                timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                uid: userLogged.uid,
                message: input
            }).catch((error) => {
                console.log("message error : " + error)
            })

            conversationRef.update({
                lastUpdate: firebase.firestore.FieldValue.serverTimestamp(),
                lastSend: userLogged.email,
                isSeen: false,
                lastMessage: input,
            }).catch((error) => {
                console.log("Update chat error: " + error)
            })

            chatRef?.current?.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });

            setInput('')
        }
    }

    return(
        <div className="chat__input" >
            <form autoComplete="off">
                {/*<div className="chat__button-left">*/}
                {/*    <IconButton  aria-label="Add ">*/}
                {/*        <AddCircleTwoToneIcon />*/}
                {/*    </IconButton>*/}
                {/*    <IconButton  aria-label="Add ">*/}
                {/*        <AddPhotoAlternateTwoToneIcon />*/}
                {/*    </IconButton>*/}
                {/*    <IconButton aria-label="Add ">*/}
                {/*        <RoomTwoToneIcon />*/}
                {/*    </IconButton>*/}
                {/*</div>*/}
                <div className="chat__holder">
                    <TextField
                        rowsMax={4}
                        className="chat__text"
                        multiline
                        placeholder="Message ... "
                        value={input}
                        onChange={event => setInput(event.target.value)}
                        onClick={checkingRead}
                        onKeyPress={(event) => checkingKeypress(event)}
                        InputProps={{ disableUnderline: true}}
                        autoFocus
                    />

                    <IconButton className="chat__iconPicker" aria-label="Add " onClick={handleClick}>
                        <SentimentSatisfiedRoundedIcon />
                    </IconButton>
                    {
                        open ? (
                            <Popover
                                disableScrollLock
                                id={id}
                                open={open}
                                anchorEl={anchorElPicker}
                                onClose={handleClose}
                                anchorOrigin={{
                                    vertical: 'top',
                                    horizontal: 'left',
                                }}
                                transformOrigin={{
                                    vertical: 'bottom',
                                    horizontal: 'center',
                                }}
                            >
                                <Picker
                                    onSelect={addEmoji}
                                    title="Livefood"
                                />
                            </Popover>
                        ) : null
                    }


                </div>
            </form>
        </div>
    )
}

export default ChatInput