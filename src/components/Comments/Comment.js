import React, { useState } from "react";
import Avatar from "@material-ui/core/Avatar";
import dayjs from "dayjs";
import {Link} from "react-router-dom";


function PostComment (props) {
    const [commentAuthor, setCommentAuthor] = useState([]);

    props.cmtAuthor.then((data) => {
        setCommentAuthor(data);
    })

    return (
        <div className="commentDetails" key={props.comment.id}>
            <Avatar alt={commentAuthor.displayName} src={commentAuthor.photoURL}/>
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