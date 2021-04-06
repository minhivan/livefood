import React, {useState} from "react";
import SentimentSatisfiedRoundedIcon from "@material-ui/icons/SentimentSatisfiedRounded";
import {auth, db} from "../../firebase";
import firebase from "firebase";
import {useAuthState} from "react-firebase-hooks/auth";
import {useDocument} from "react-firebase-hooks/firestore";
import {TextField} from "@material-ui/core";
import SendRoundedIcon from '@material-ui/icons/SendRounded';
import IconButton from "@material-ui/core/IconButton";
import AddCircleTwoToneIcon from '@material-ui/icons/AddCircleTwoTone';
import AddPhotoAlternateTwoToneIcon from '@material-ui/icons/AddPhotoAlternateTwoTone';
import RoomTwoToneIcon from '@material-ui/icons/RoomTwoTone';


const ChatInput = ({roomID, chatRef}) => {

    const [input, setInput] = useState('');
    const [user] = useAuthState(auth);
    const conversationRef = db.collection("conversations").doc(roomID);
    const messageRef = db.collection("chats").doc(roomID).collection("messages")
    const [conversationData] = useDocument(conversationRef)

    const checkingRead = () => {
        if(conversationData?.data()?.lastSend !== user.email && !conversationData?.data()?.isSeen){
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
        if(input !== ''){
            messageRef.add({
                timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                uid: user.uid,
                message: input
            }).catch((error) => {
                console.log("message error : " + error)
            })

            conversationRef.update({
                lastUpdate: firebase.firestore.FieldValue.serverTimestamp(),
                lastSend: user.email,
                isSeen: false
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
                <div className="chat__button-left">
                    <IconButton  aria-label="Add ">
                        <AddCircleTwoToneIcon />
                    </IconButton>
                    <IconButton  aria-label="Add ">
                        <AddPhotoAlternateTwoToneIcon />
                    </IconButton>
                    <IconButton aria-label="Add ">
                        <RoomTwoToneIcon />
                    </IconButton>
                </div>
                <div className="chat__holder">
                    <TextField
                        rowsMax={4}
                        className="chat__text"
                        multiline
                        placeholder="Message ... "
                        value={input}
                        onChange={event => setInput(event.target.value)}
                        onClick={checkingRead}
                        onKeyPress={checkingKeypress}
                        InputProps={{ disableUnderline: true, style : { fontFamily: "'Quicksand', sans-serif"}}}
                    />
                    {/*<input*/}
                    {/*    className="chat__text"*/}
                    {/*    id="outlined-basic"*/}
                    {/*    placeholder="Message ... "*/}
                    {/*    type="text"*/}
                    {/*    value={input}*/}
                    {/*    onChange={event => setInput(event.target.value)}*/}
                    {/*    onClick={event => checkingRead()}*/}
                    {/*/>*/}
                    <SentimentSatisfiedRoundedIcon />
                </div>
            </form>
        </div>
    )
}

export default ChatInput