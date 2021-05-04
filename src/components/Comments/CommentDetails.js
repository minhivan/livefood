import React, {useEffect, useState} from "react";
import Avatar from "@material-ui/core/Avatar";
import dayjs from "dayjs";
import {Link} from "react-router-dom";
import {Rating} from "@material-ui/lab";
import IconButton from "@material-ui/core/IconButton";
import MoreHorizRoundedIcon from '@material-ui/icons/MoreHorizRounded';
import {makeStyles} from "@material-ui/core/styles";



const useStyles = makeStyles((theme) => ({
    more: {
        marginLeft: "auto",
        position: "absolute",
        padding: "5px",
        top: "-5px",
        right: 0
    }
}));



function PostComment (props) {
    const {comment, cmtAuthor} =  props
    const [commentAuthor, setCommentAuthor] = useState([]);
    const classes = useStyles();

    useEffect(() => {
        cmtAuthor.then(data => {setCommentAuthor(data)}).catch(error => console.log(error.message));
    }, [cmtAuthor])


    return (
        <div className="commentDetails" key={comment.id}>
            <Avatar alt={commentAuthor.displayName} src={commentAuthor.photoURL}/>
            <div className="comment__content">
                <div className="comment__block">
                    <div className="comment__sub">
                        <Link to={`profile/${commentAuthor.uid}`}>{commentAuthor.displayName}</Link>
                        {
                            comment.timestamp ? (
                                <>
                                    {
                                        comment.rating ? (
                                            <Rating style={{paddingRight: "5px"}} name="read-only" value={comment.rating} readOnly />
                                        ) : null
                                    }
                                    <span style={{color: "#546e7a", fontSize: "12px"}}>{dayjs(new Date(comment.timestamp.seconds * 1000).toLocaleString()).fromNow()}</span>

                                </>
                            ) : null
                        }
                        <IconButton className={classes.more} aria-label="delete">
                            <MoreHorizRoundedIcon />
                        </IconButton>
                    </div>
                    <div className="comment__caption">
                        <p>{comment.text}</p>
                    </div>
                </div>
            </div>

        </div>
    )

}

export default PostComment;