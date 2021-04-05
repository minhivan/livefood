import React, {useState} from "react";
import SentimentSatisfiedRoundedIcon from "@material-ui/icons/SentimentSatisfiedRounded";
import {auth, db} from "../../firebase";
import firebase from "firebase";
import {useAuthState} from "react-firebase-hooks/auth";
import {useDocument} from "react-firebase-hooks/firestore";


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


    const sendMessage = (event) => {
        event.preventDefault();
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


    return(
        <div className="chat__input" >
            <form autoComplete="off" onSubmit={sendMessage}>
                <input
                    className="chat__text"
                    id="outlined-basic"
                    placeholder="Message ... "
                    type="text"
                    value={input}
                    onChange={event => setInput(event.target.value)}
                    onClick={event => checkingRead()}
                />
                <SentimentSatisfiedRoundedIcon />
            </form>
        </div>
    )
}

export default ChatInput