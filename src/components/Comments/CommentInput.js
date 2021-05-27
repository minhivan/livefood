import React, {useState} from "react";
import {Box, Popover, TextField} from "@material-ui/core";
import Avatar from "@material-ui/core/Avatar";
import {db} from "../../firebase";

import {Rating} from "@material-ui/lab";
import {makeStyles} from "@material-ui/core/styles";
import {useDocument} from "react-firebase-hooks/firestore";
import SentimentSatisfiedRoundedIcon from "@material-ui/icons/SentimentSatisfiedRounded";
import IconButton from "@material-ui/core/IconButton";
import {Picker} from "emoji-mart";
import {
    commentOnPost,
    commentWithRating,
    handleRatingPost,
    pushUserNotification,
    replyToComment
} from "../../hooks/services";

const labels = {
    1: 'Useless',
    2: 'Poor',
    3: 'Ok',
    4: 'Good',
    5: 'Excellent',
};

const useStyles = makeStyles({
    root: {
        display: 'flex',
        flexDirection: "column",
        width: "100%",
    },
    rating: {
        display: 'flex',
        paddingLeft: "10px",
        alignItems: "center",
    },
    resize: {
        fontSize: "14px",
        lineHeight: "22px",
    },
    iconPicker: {
        padding: "15px"
    },
    reply: {
        display: 'flex',
        paddingLeft: "10px",
        alignItems: "center",
    },
    replyText: {
        color: "rgb(84, 110, 122)",
        fontWeight: "bold"
    }
});

export default function CommentInput({user, postId, type, path, refInput, postAuthor, replyComment, handleRemoveReply}){
    const classes = useStyles();
    const [value, setValue] = React.useState(4);
    const [hover, setHover] = React.useState(-1);
    const [comment, setComment] = useState('');
    const postRef = db.collection('posts').doc(postId);
    const [postSnapshot] = useDocument(postRef);
    let rating = postSnapshot?.data()?.rating

    const data = {
        postId: postId,
        postAuthor: postAuthor,
        text: comment,
        uid: user.uid,
    }

    const dataPush = {
        postId: postId,
        postAuthor: postAuthor,
        from : user.displayName,
        avatar: user.photoURL,
        opponentId: user.uid,
    }

    const checkEmpty = (string) => {
        let rs = true
        if(string.length > 0 && !/^\s+$/.test(string)){
            rs=false
        }
        return rs;
    }

    const [anchorElPicker, setAnchorElPicker] = useState(null);

    const openEmoji = Boolean(anchorElPicker);
    const id = openEmoji ? 'simple-popover-picker' : undefined;

    const handleClickEmoji = (event) => {
        setAnchorElPicker(event.currentTarget);
    }
    const handleCloseEmoji = () => {
        setAnchorElPicker(null);
    };
    const addEmoji = (event) => {
        let emoji = event.native;
        setComment(comment + emoji);
    }

    const checkingKeypress = (event) => {
        if(event.key === "Enter"){
            if(!event.shiftKey){
                postComment(event)
            }
        }
    }


    const postComment = (event) => {
        event.preventDefault();
        if(comment && !checkEmpty(comment)){
            // if reply comment
            if(replyComment){
                const tempData = Object.assign(data, {
                    userAvt: user.photoURL,
                    userDisplayName: user.displayName,
                    commentId : replyComment.commentId
                });
                replyToComment(tempData);

                if(replyComment.authorId !== user?.uid) {
                    const tempDataPush = Object.assign(dataPush, {type: "reply", reference: "comment"});
                    tempDataPush.postAuthor = replyComment.authorId;
                    pushUserNotification(tempDataPush);
                }
                handleRemoveReply();
            }
            else{
                // If rating post
                if(value && postAuthor !== user?.uid && type === "recipe"){
                    // Check post rating
                    if(typeof rating == 'undefined') handleRatingPost(postId, value)
                    else{
                        let avg = parseFloat((parseFloat(rating) + parseFloat(value)) / 2);
                        handleRatingPost(postId, avg);
                    }
                    const tempData = Object.assign(data, {rating: value});
                    commentWithRating(tempData);
                }
                else commentOnPost(data);
                // Notification
                if(postAuthor !== user?.uid) {
                    const tempDataPush = Object.assign(dataPush, {type: "comment", reference: "post"});
                    postAuthor && pushUserNotification(tempDataPush);
                }
            }
            setComment('');
            setValue(4);
        }
    }

    return(
        <>
            {
                user ? (
                    <div className={`commentContainer ${path === "preview" ? "commentViewer" : ""} no-print`}>
                        {
                            path === "preview" ? null : <Avatar alt={user?.displayName} src={user?.photoURL} />
                        }

                        <div className={classes.root}>
                            {
                                type ==='recipe' && comment && postAuthor !== user?.uid && !replyComment ? (
                                    <div className={classes.rating}>
                                        <Rating
                                            size="small"
                                            name="hover-feedback"
                                            value={value}
                                            precision={1}
                                            onChange={(event, newValue) => {
                                                setValue(newValue);
                                            }}
                                            onChangeActive={(event, newHover) => {
                                                setHover(newHover);
                                            }}
                                        />
                                        {value !== null && <Box ml={2}>{labels[hover !== -1 ? hover : value]}</Box>}
                                    </div>
                                ) : null
                            }
                            {
                                replyComment ? (
                                    <div className={classes.reply}>
                                        <span className={classes.replyText}>Replying to {replyComment.authorName}</span>
                                    </div>
                                ) : null
                            }

                            <form onSubmit={postComment} autoComplete="off">
                                <TextField
                                    onKeyPress={event => checkingKeypress(event)}
                                    rowsMax={4}
                                    multiline
                                    ref={refInput}
                                    className="comment__input"
                                    placeholder="Leave a comment ... "
                                    value={comment}
                                    onChange={event => setComment(event.target.value)}
                                    InputProps={{
                                        disableUnderline: true,
                                        classes: {
                                            input: classes.resize,
                                        }}}
                                />
                                <IconButton className={classes.iconPicker} aria-label="Add " onClick={handleClickEmoji}>
                                    <SentimentSatisfiedRoundedIcon />
                                </IconButton>
                                {
                                    openEmoji ? (
                                        <Popover
                                            id={id}
                                            open={openEmoji}
                                            anchorEl={anchorElPicker}
                                            onClose={handleCloseEmoji}
                                            anchorOrigin={{
                                                vertical: 'top',
                                                horizontal: 'left',
                                            }}
                                            transformOrigin={{
                                                vertical: 'bottom',
                                                horizontal: 'center',
                                            }}
                                        >
                                            <Picker
                                                onSelect={addEmoji}
                                                title="Livefood"
                                            />
                                        </Popover>

                                    ) : null
                                }
                                {/*<Button variant="contained" disabled={checkEmpty(comment)} onClick={postComment} style={{textTransform: "capitalize"}}>*/}
                                {/*    Post*/}
                                {/*</Button>*/}
                            </form>
                        </div>

                    </div>
                ) : null
            }
        </>
    )
}

