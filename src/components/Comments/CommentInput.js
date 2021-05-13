import React, {useState} from "react";
import {Box, Popover, TextField} from "@material-ui/core";
import Avatar from "@material-ui/core/Avatar";
import {db} from "../../firebase";
import firebase from "firebase";
import Button from "@material-ui/core/Button";
import {Rating} from "@material-ui/lab";
import {makeStyles} from "@material-ui/core/styles";
import {useDocument} from "react-firebase-hooks/firestore";
import SentimentSatisfiedRoundedIcon from "@material-ui/icons/SentimentSatisfiedRounded";
import IconButton from "@material-ui/core/IconButton";
import {Picker} from "emoji-mart";

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
        paddingLeft: "15px",
        alignItems: "center"
    },
});

export default function CommentInput({user, postId, type, path, refInput, postAuthor}){

    const classes = useStyles();
    const [value, setValue] = React.useState(null);
    const [hover, setHover] = React.useState(-1);
    const [comment, setComment] = useState('');
    const postRef = db.collection('posts').doc(postId);
    const [postSnapshot] = useDocument(postRef);
    let rating = postSnapshot?.data()?.rating

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



    const postComment = (event) => {
        event.preventDefault();
        if(comment){
            if(value){
                if(typeof rating == 'undefined'){
                    db.collection("posts").doc(postId).update({
                        rating: value
                    })
                }
                else{
                    let avg = parseFloat((parseFloat(rating) + parseFloat(value)) / 2);
                    db.collection("posts").doc(postId).update({
                        rating: avg
                    })
                }

                db.collection("posts").doc(postId).collection("comments").add({
                    text: comment,
                    user: db.doc('users/' + user.uid),
                    uid: user.uid,
                    timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                    rating: value
                }).then(() => {
                    db.collection('posts').doc(postId).update({
                        commentsCount: firebase.firestore.FieldValue.increment(1)
                    })
                    if(postAuthor !== user?.uid) {
                        postAuthor && db.collection('users').doc(postAuthor).collection("notifications").add({
                            reference: "post",
                            type : "comment",
                            message: "rating on your post",
                            from : user.displayName,
                            avatar: user.photoURL,
                            uid: user.uid,
                            path : "/p/" + postId,
                            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                            status: "unread"
                        })
                    }
                })
            }
            else {
                db.collection("posts").doc(postId).collection("comments").add({
                    text: comment,
                    user: db.doc('users/' + user.uid),
                    uid: user.uid,
                    timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                }).then(() => {
                    db.collection('posts').doc(postId).update({
                        commentsCount: firebase.firestore.FieldValue.increment(1)
                    })
                    if(postAuthor !== user?.uid) {
                        postAuthor && db.collection('users').doc(postAuthor).collection("notifications").add({
                            reference: "post",
                            type : "comment",
                            message: "commented on your post",
                            from : user.displayName,
                            avatar: user.photoURL,
                            opponentId: user.uid,
                            path : "/p/" + postId,
                            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                            status: "unread"
                        })
                    }
                });
            }
            setComment('');
        }
    }

    return(
        <>

            <div className={`commentContainer ${path === "preview" && "commentViewer"}`}>
                {
                    path === "preview" ? null : <Avatar alt={user?.displayName} src={user?.photoURL} />
                }
                <div className={classes.root}>
                    {
                        type ==='recipe' && comment && postAuthor !== user?.uid ? (
                            <div className={classes.rating}>
                                <Rating
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

                    <form onSubmit={postComment}>
                        <TextField
                            rowsMax={4}
                            multiline
                            ref={refInput}
                            className="comment__input"
                            placeholder="Leave a comment ... "
                            value={comment}
                            onChange={event => setComment(event.target.value)}
                            InputProps={{ disableUnderline: true}}
                        />
                        <IconButton className="chat__iconPicker" aria-label="Add " onClick={handleClickEmoji}>
                            <SentimentSatisfiedRoundedIcon />
                        </IconButton>
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

                        <Button variant="contained" disabled={checkEmpty(comment)} onClick={postComment}>
                            Post
                        </Button>
                    </form>
                </div>

            </div>
        </>
    )
}

