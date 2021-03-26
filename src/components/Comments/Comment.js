import React, { useState } from "react";
import Avatar from "@material-ui/core/Avatar";
import dayjs from "dayjs";
import {makeStyles} from "@material-ui/core/styles";
import {red} from "@material-ui/core/colors";
import {Link} from "react-router-dom";


const useStyles = makeStyles((theme) => ({

    avatar: {
        backgroundColor: red[500],
    },
    displayCmt: {
        padding: "10px 20px",
        textAlign: "right",
        color: "#8e8e8e"
    }

}));

function PostComment (props) {
    const classes = useStyles();
    const [commentAuthor, setCommentAuthor] = useState([]);

    props.cmtAuthor.then((data) => {
        setCommentAuthor(data);
    })

    return (
        <div className="commentDetails" key={props.comment.id}>
            <Avatar className={classes.avatar} alt={commentAuthor.displayName} src={commentAuthor.photoURL}/>
            <div className="comment__content">
                <div className="comment__block">
                    <div className="comment__sub">
                        <Link to={`profile/${commentAuthor.uid}`}>{commentAuthor.displayName}</Link>
                        {
                            props.comment.timestamp ? (
                                <span>{
                                    dayjs(new Date(props.comment.timestamp.seconds * 1000).toLocaleString()).fromNow()}</span>
                            ) : null
                        }

                        <p>{props.comment.text}</p>
                    </div>
                </div>
            </div>

        </div>
    )

}

export default PostComment;