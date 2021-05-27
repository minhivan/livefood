import React, {useEffect, useState} from "react";
import Avatar from "@material-ui/core/Avatar";
import dayjs from "dayjs";
import {Link} from "react-router-dom";
import {Rating, ToggleButton} from "@material-ui/lab";
import IconButton from "@material-ui/core/IconButton";
import MoreHorizRoundedIcon from '@material-ui/icons/MoreHorizRounded';
import {makeStyles} from "@material-ui/core/styles";
import {useDocument} from "react-firebase-hooks/firestore";
import {db} from "../../firebase";
import CommentUtil from "../Popup/CommentUtil";
import {Tooltip} from "@material-ui/core";
import FavoriteRoundedIcon from "@material-ui/icons/FavoriteRounded";
import FavoriteBorderTwoToneIcon from "@material-ui/icons/FavoriteBorderTwoTone";
import ReplyCommentDetails from "./ReplyCommentDetails";
import Subcomments from "./ReplyComment";
import {handleLikeComment, handleUnlikeComment} from "../../hooks/services";


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
    actionButton: {
        border: "0",
        backgroundColor: "none",
        borderRadius: "50%",
        color: "rgba(0, 0, 0, 0.54)",
        '&:hover': {
            color: 'black',
        }
    },
    selected: {
        backgroundColor: "unset !important"
    },
    reply: {
        color: "rgb(84, 110, 122)",
        fontSize: "12px !important",
        fontWeight: 'bold',
        "&:hover": {
            color: "rgb(46,61,68)",
            transform: "0,2s all ease",
        },
    },
    customDivider:{
        border: "none",
        height: "1px",
        margin: 0,
        width: "50px",
        flexShrink: 0,
        backgroundColor: "rgba(0, 0, 0, 0.12)",
    }
}));



function PostComment (props) {
    const {comment, isPopup, postId, postUid, commentId, userLogged, handleReplying} =  props
    const classes = useStyles();

    const [postAuthor] = useDocument(comment.uid && db.collection('users').doc(comment.uid))
    const commentAuthor = postAuthor?.data();

    const [isReadMore, setIsReadMore] = useState(true);
    const [seeMore, setSeeMore] = useState(0);
    const [like, setLike] = useState(false);


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

    const handleSeeMore = () => {
        if(comment.commentsReplyCount > seeMore){
            setSeeMore(prevState => prevState + 3);
        }
    }

    const handleLike = () => {
        setLike(true);
        const data = {
            commentId: commentId,
            postId: postId,
            user: userLogged.uid,
            type: "comment",
        }
        handleLikeComment(data);
    }

    const handleUnlike = () => {
        setLike(false);
        const data = {
            commentId: commentId,
            postId: postId,
            user: userLogged.uid,
            type: "comment",
        }
        handleUnlikeComment(data);
    }

    useEffect(() => {
        if(typeof comment?.likeBy !== 'undefined' && comment?.likeBy?.includes(userLogged.uid)){
            setLike(true);
        }

    }, [comment?.likeBy, userLogged.uid])


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
                    <div className="comment__action">
                        <div className="comment__action-like">
                            <Tooltip title="Like" arrow>
                                <ToggleButton
                                    size="small"
                                    value="like"
                                    selected={like}
                                    // className={classes.likeButton}
                                    classes={{
                                        root: classes.actionButton,
                                        selected: classes.selected,
                                    }}
                                    onClick={() => {
                                        if(!like) handleLike();
                                        else handleUnlike();
                                    }}
                                >
                                    {
                                        like ? <FavoriteRoundedIcon style={{color: "red"}} fontSize="inherit"/> : <FavoriteBorderTwoToneIcon fontSize="inherit"/>
                                    }
                                </ToggleButton>
                            </Tooltip>
                            {
                                comment?.likeCount > 0 ? (
                                    <span className={classes.reply}>{comment?.likeCount} {comment?.likeCount === 1 ? 'Like' : 'Likes'}</span>
                                ) : null
                            }
                        </div>
                        <span className={classes.reply}
                              onClick={() => handleReplying(
                                  {
                                      authorName: commentAuthor?.displayName,
                                      commentId: commentId,
                                      postId: postId,
                                      authorId: comment.uid,
                                  })
                              }
                        >Reply</span>
                    </div>

                    {
                        comment.commentsReplyCount > 0 ? (
                            <>
                                {
                                    seeMore >= comment.commentsReplyCount ? null : (
                                        <div className="comment__view-more">
                                            <div className="comment__view-more-container">
                                                <div className={classes.customDivider} />
                                                <p className={classes.reply} onClick={() => handleSeeMore()}>View replies ({comment.commentsReplyCount - seeMore})</p>
                                            </div>
                                        </div>
                                    )
                                }
                                <Subcomments commentId={commentId} userLogged={userLogged} postId={postId} seeMore={seeMore}/>
                            </>
                        ) : null
                    }
                </div>
            </div>
            {
                userLogged ? (
                    <CommentUtil open={open} handleClose={handleClose} postId={postId} postUid={postUid} commentId={commentId} commentUid={comment.uid} userLogged={userLogged}/>
                ) : null
            }
        </div>
    )

}

export default PostComment;