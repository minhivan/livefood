import React from "react";
import Avatar from "@material-ui/core/Avatar";
import {makeStyles} from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
    chat: {
        color: "#262626",
        overflowWrap: "break-word",
        whiteSpace: "pre-wrap",
        fontSize: "14px",
    },
    chatTime: {
        marginLeft: 20,
        fontSize: "12px",
        color: "#484848",
    }
}));

const Message = ({uid, message, timestamp, userLogged, recipient}) => {
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