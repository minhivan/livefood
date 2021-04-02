import React, {useState} from "react";
import SentimentSatisfiedRoundedIcon from "@material-ui/icons/SentimentSatisfiedRounded";
import {auth, db} from "../../firebase";
import firebase from "firebase";
import {useAuthState} from "react-firebase-hooks/auth";


const ChatInput = ({roomID, chatRef}) => {



    const [input, setInput] = useState('');
    const [user] = useAuthState(auth);


    const sendMessage = (event) => {
        event.preventDefault();
        db.collection("chats").doc(roomID).collection("messages").add({
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            uid: user.uid,
            message: input
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
                />
                <SentimentSatisfiedRoundedIcon />
            </form>
        </div>
    )
}

export default ChatInput