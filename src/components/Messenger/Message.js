import React from "react";
import Avatar from "@material-ui/core/Avatar";
import {makeStyles} from "@material-ui/core/styles";
import {useAuthState} from "react-firebase-hooks/auth";
import {auth} from "../../firebase";
import {useSelector} from "react-redux";
import {selectChatRecipient} from "../../features/chatSlice";
import TimeAgo from "timeago-react";


const useStyles = makeStyles((theme) => ({
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
    }
}));

const Message = ({uid, message, timestamp}) => {
    const recipient = useSelector(selectChatRecipient);
    const [userLogged] = useAuthState(auth);

    const classes = useStyles();

    return (
        <div className="chat__content">
            {/* Retrieve */}
            <div className={`chat__message ${userLogged.uid === uid && "sender"}`}>
                {
                    userLogged.uid !== uid && (
                        <Avatar alt={recipient?.displayName} src={recipient?.photoURL} />
                    )
                }

                <div className="chat__details">
                    <span className={classes.chat}>
                        {message}
                    </span>
                    {
                        timestamp? (
                            <span className={classes.chatTime}>
                                {timestamp?.toDate().toLocaleString()}
                            </span>
                        ) : (
                            <span className={classes.chatTime}>Loading</span>
                        )
                    }

                </div>
            </div>

        </div>
    )
}

export default Message