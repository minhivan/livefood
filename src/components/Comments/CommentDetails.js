import React, {useState} from "react";
import Avatar from "@material-ui/core/Avatar";
import dayjs from "dayjs";
import {Link} from "react-router-dom";
import {Rating} from "@material-ui/lab";
import IconButton from "@material-ui/core/IconButton";
import MoreHorizRoundedIcon from '@material-ui/icons/MoreHorizRounded';
import {makeStyles} from "@material-ui/core/styles";
import {useDocument} from "react-firebase-hooks/firestore";
import {db} from "../../firebase";
import FavoriteBorderRoundedIcon from '@material-ui/icons/FavoriteBorderRounded';
import CommentUtil from "../Popup/CommentUtil";


const useStyles = makeStyles((theme) => ({
    more: {
        marginLeft: "auto",
        position: "absolute",
        padding: "5px",
        top: "-5px",
        right: 0
    },
    captionText: {
        whiteSpace: "pre-line",
        lineHeight: "26px"
    },
}));



function PostComment (props) {
    const {comment, isPopup, postId, postUid, commentId, userLogged} =  props
    const classes = useStyles();

    const [postAuthor] = useDocument(comment.uid && db.collection('users').doc(comment.uid))
    const commentAuthor = postAuthor?.data();

    const [isReadMore, setIsReadMore] = useState(true);
    const toggleReadMore = () => {
        setIsReadMore(!isReadMore);
    };

    const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };


    return (
        <div className="commentDetails">
            <Avatar alt={commentAuthor?.displayName} src={commentAuthor?.photoURL}/>
            <div className="comment__content">
                <div className="comment__block">
                    <div className={`comment__sub ${isPopup && "comment__sub-popup"}`}>
                        <Link to={`/profile/${commentAuthor?.uid}`}>{commentAuthor?.displayName}</Link>
                        {
                            comment.timestamp ? (
                                <div style={{display: "flex"}}>
                                    {
                                        comment.rating ? (
                                            <Rating style={{paddingRight: "5px", display: "inline-flex"}} name="read-only" value={comment.rating} readOnly />
                                        ) : null
                                    }
                                    <span style={{color: "#546e7a", fontSize: "12px", }}>{dayjs(new Date(comment.timestamp.seconds * 1000).toLocaleString()).fromNow()}</span>

                                </div>
                            ) : null
                        }
                        <IconButton className={classes.more} aria-label="Util" onClick={handleClickOpen}>
                            <MoreHorizRoundedIcon />
                        </IconButton>
                    </div>
                    <div className="comment__caption">
                        {
                            comment.text.length > 100 ? (
                                <p>
                                    {isReadMore ? comment.text.slice(0, 100) : comment.text}
                                    <span onClick={toggleReadMore} style={{fontWeight: "bold", cursor: "pointer", color: "#8e8e8e"}}>
                                        {isReadMore ? "...read more" : null}
                                    </span>
                                 </p>
                            ) : (<p>{comment.text}</p>)
                        }

                    </div>
                </div>
            </div>
            <CommentUtil open={open} handleClose={handleClose} postId={postId} postUid={postUid} commentId={commentId} commentUid={comment.uid} userLogged={userLogged}/>
        </div>
    )

}

export default PostComment;