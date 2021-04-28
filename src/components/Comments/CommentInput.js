import React, {useState} from "react";
import {Box, TextField} from "@material-ui/core";
import Avatar from "@material-ui/core/Avatar";
import {db} from "../../firebase";
import firebase from "firebase";
import Button from "@material-ui/core/Button";
import {Rating} from "@material-ui/lab";
import {makeStyles} from "@material-ui/core/styles";

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

export default function CommentInput({user, id}){
    const classes = useStyles();
    const [value, setValue] = React.useState(null);
    const [hover, setHover] = React.useState(-1);
    const [comment, setComment] = useState('');
    const postComment = (event) => {
        event.preventDefault();
        if(comment){
            if(value){
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

            <div className="commentContainer">
                <Avatar alt={user?.displayName} src={user?.photoURL} />
                <div className={classes.root}>
                    {
                        comment ? (
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
                        <Button variant="contained" disabled={!comment} onClick={postComment}>
                            Post
                        </Button>
                    </form>
                </div>

            </div>
        </>
    )
}

