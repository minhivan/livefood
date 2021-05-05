import React, {useState} from "react";
import {Box, TextField} from "@material-ui/core";
import Avatar from "@material-ui/core/Avatar";
import {db} from "../../firebase";
import firebase from "firebase";
import Button from "@material-ui/core/Button";
import {Rating} from "@material-ui/lab";
import {makeStyles} from "@material-ui/core/styles";
import {useDocument} from "react-firebase-hooks/firestore";

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
    }
});

export default function CommentInput({user, id, type, path}){
    const classes = useStyles();
    const [value, setValue] = React.useState(null);
    const [hover, setHover] = React.useState(-1);
    const [comment, setComment] = useState('');
    const postRef = db.collection('posts').doc(id);
    const [postSnapshot] = useDocument(postRef);
    let rating = postSnapshot?.data()?.rating

    const checkEmpty = (string) => {
        let rs = true
        if(string.length > 0 && !/^\s+$/.test(string)){
            rs=false
        }
        return rs;
    }


    const postComment = (event) => {
        event.preventDefault();
        if(comment){
            if(value){
                if(typeof rating == 'undefined'){
                    db.collection("posts").doc(id).update({
                        rating: value
                    })
                }
                else{
                    let avg = parseFloat((parseFloat(rating) + parseFloat(value)) / 2);
                    db.collection("posts").doc(id).update({
                        rating: avg
                    })
                }

                db.collection("posts").doc(id).collection("comments").add({
                    text: comment,
                    user: db.doc('users/' + user.uid),
                    uid: user.uid,
                    timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                    rating: value
                });
            }
            else {
                db.collection("posts").doc(id).collection("comments").add({
                    text: comment,
                    user: db.doc('users/' + user.uid),
                    uid: user.uid,
                    timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                });
            }
        }
        setComment('');
    }

    return(
        <>

            <div className={`commentContainer ${path === "preview" && "commentViewer"}`}>
                {
                    path === "preview" ? null : <Avatar alt={user?.displayName} src={user?.photoURL} />
                }
                <div className={classes.root}>
                    {
                        type==='recipe' && comment ? (
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
                            className="comment__input"
                            placeholder="Leave a comment ... "
                            value={comment}
                            onChange={event => setComment(event.target.value)}
                            InputProps={{ disableUnderline: true}}

                        />
                        <Button variant="contained" disabled={checkEmpty(comment)} onClick={postComment}>
                            Post
                        </Button>
                    </form>
                </div>

            </div>
        </>
    )
}

