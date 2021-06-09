import React, {useEffect, useState} from "react";
import Avatar from "@material-ui/core/Avatar";
import {Link} from "react-router-dom";
import { ToggleButton} from "@material-ui/lab";
import dayjs from "dayjs";
import IconButton from "@material-ui/core/IconButton";
import MoreHorizRoundedIcon from "@material-ui/icons/MoreHorizRounded";
import {Tooltip} from "@material-ui/core";
import FavoriteRoundedIcon from "@material-ui/icons/FavoriteRounded";
import FavoriteBorderTwoToneIcon from "@material-ui/icons/FavoriteBorderTwoTone";
import CommentUtil from "../Popup/CommentUtil";
import {makeStyles} from "@material-ui/core/styles";
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
export default function ReplyCommentDetails(props) {
    const {userLogged, commentId, postId, data, replyId, isPopup, handleReplying, commentInfo, setOpenSnack} = props;
    const classes = useStyles();
    const [isReadMore, setIsReadMore] = useState(true);
    const [like, setLike] = useState(false);

    const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };


    const toggleReadMore = () => {
        setIsReadMore(!isReadMore);
    };

    const handleLike = () => {
        setLike(true);
        const data = {
            commentId: commentId,
            postId: postId,
            user: userLogged.uid,
            type: "reply",
            replyId: replyId
        }
        handleLikeComment(data);
    }

    const handleUnlike = () => {
        setLike(false);
        const data = {
            commentId: commentId,
            postId: postId,
            user: userLogged.uid,
            type: "reply",
            replyId: replyId
        }
        handleUnlikeComment(data);
    }

    useEffect(() => {
        if(userLogged){
            if(typeof data?.likeBy !== 'undefined' && data?.likeBy?.includes(userLogged.uid)){
                setLike(true);
            }
        }
    }, [data?.likeBy, userLogged])


    return(
        <div className={`sub-comment-details ${isPopup ? "sub-comment-popup-details" : ""}`}>
            <Avatar alt={data?.replyFrom} src={data?.replyFromAvt}/>
            <div className="comment__content">
                <div className="comment__block">
                    <div className={`comment__sub ${isPopup ? "comment__sub-popup" : ""}`}>
                        <Link to={`/profile/${data?.replyFromUid}`}>{data?.replyFrom}</Link>
                        <IconButton className={classes.more} aria-label="Util" onClick={handleClickOpen}>
                            <MoreHorizRoundedIcon />
                        </IconButton>
                    </div>
                    <div className="comment__caption">

                        {
                            data?.text.length > 100 ? (
                                <p>
                                    {
                                        data?.replyToUid === data?.replyFromUid ? null : (
                                            <>
                                                <Link to={`/profile/${data?.replyToUid}`} style={{marginRight: 5}}>{data?.replyTo}</Link>
                                            </>
                                        )
                                    }
                                    {isReadMore ? data?.text.slice(0, 100) : data?.text}
                                    <span onClick={toggleReadMore} style={{fontWeight: "bold", cursor: "pointer", color: "#8e8e8e"}}>
                                        {isReadMore ? "...read more" : null}
                                    </span>
                                </p>
                            ) : (
                                <p>
                                    {
                                        data?.replyToUid === data?.replyFromUid ? null : (
                                            <>
                                                <Link to={`/profile/${data?.replyToUid}`} style={{marginRight: 5}}>{data?.replyTo}</Link>
                                            </>
                                        )
                                    }
                                    {data?.text}
                                </p>
                            )
                        }
                    </div>
                    {
                        userLogged ? (
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
                                        data?.likeCount > 0 ? (
                                            <span className={classes.reply}>{data?.likeCount} {data?.likeCount === 1 ? 'Like' : 'Likes'}</span>
                                        ) : null
                                    }

                                </div>
                                <span className={classes.reply}
                                      onClick={() => handleReplying(
                                          {
                                              authorName: data?.replyFrom,
                                              commentId: commentId,
                                              postId: postId,
                                              authorId: data?.replyFromUid,
                                          })
                                      }
                                >Reply</span>
                                <span style={{color: "#546e7a", fontSize: "12px", }}>{dayjs(new Date(data?.timestamp?.seconds * 1000).toLocaleString()).fromNow()}</span>

                            </div>
                        ) : null
                    }
                </div>
            </div>
            {
                userLogged && open ? (
                    <CommentUtil open={open} handleClose={handleClose} postId={postId} commentId={commentId} commentUid={data.replyFromUid} userLogged={userLogged} setOpenSnack={setOpenSnack}/>
                ) : null
            }
        </div>
    )
}