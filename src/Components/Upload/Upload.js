import React, {useState} from "react";
import './Upload.css';
import {Avatar, Button, IconButton, Modal, TextField} from "@material-ui/core";
import {storage, db } from "../../firebase";
import firebase from "firebase";
import {makeStyles} from "@material-ui/core/styles";
import CircularProgress from '@material-ui/core/CircularProgress';
import {PhotoCamera} from "@material-ui/icons";

function getModalStyle() {
    const top = 50 ;
    const left = 50;

    return {
        top: `${top}%`,
        left: `${left}%`,
        transform: `translate(-${top}%, -${left}%)`,
    };
}


const useStyles = makeStyles((theme) => ({
    divider: {
        height: 1,
        width: "50%",
        background: "#39CCCC",
        margin: "15px auto"
    },
    input: {
        display: "none"
    },
    label: {

    },
    paper: {
        position: 'absolute',
        width: 600,
        backgroundColor: theme.palette.background.paper,
        boxShadow: theme.shadows[5],
        padding: theme.spacing(2, 4, 3),
        borderRadius: "8px",
        minHeight: "500px"
    },
}));


function Upload({username}) {
    const [open, setOpen] = useState(false);
    const classes = useStyles();
    const [caption, setCaption] = useState('');
    const [image, setImage] = useState('');
    const [progress, setProgress] = useState('');
    let letter = username.toString().charAt(0).toUpperCase();
    const [modalStyle] = useState(getModalStyle);
    const handleOpen = () => {
        setOpen(true);
    }

    const handleClose = () => {
        setOpen(false);
    };

    const handleChange = (event) => {
        if(event.target.files[0]){
            setImage(event.target.files[0]);
        }
    }

    const handleUpload = () => {
        const uploadTask = storage.ref(`images/${image.name}`).put(image);
        uploadTask.on(
            "state_changed",
            (snapshot => {
                const progress = Math.round(
                    (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                );
                setProgress(progress);
            }),
            (error => {
                console.log(error);
            }),
            () => {
                storage
                    .ref("images")
                    .child(image.name)
                    .getDownloadURL()
                    .then(url => {
                        db.collection("post").add({
                            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                            caption: caption,
                            imageUrl: url,
                            username: username
                        })
                            .then(function(docRef) {
                                console.log("Document written with ID: ", docRef.id);
                            })
                            .catch(function(error) {
                                console.error("Error adding document: ", error);
                            });
                        setProgress('0');
                        setCaption("");
                        setImage(null);
                    })
            }
        )
    }
    return(
        <div className="upload">
            <div className="upload__container">
                <div className="upload__caption">
                    <Avatar aria-label="recipe" className="upload__avatar">{letter}</Avatar>
                    <TextField
                        className="upload__input"
                        multiline
                        placeholder="What's on your mind ... "
                        value={caption}
                        onChange={event => setCaption(event.target.value)}
                    />
                    {/*<input type="text" placeholder="What's on your mind ... " value={caption} onChange={event => setCaption(event.target.value)}/>*/}
                </div>
                <div className="upload__picker">
                    <div className="upload__pickerImage">
                        <input accept="image/*" type="file" onChange={handleChange} id="icon-button-file" className={classes.input}/>
                        <label htmlFor="icon-button-file" className="upload__pickerButton">
                            <IconButton aria-label="upload picture" component="span">
                                <PhotoCamera />
                            </IconButton>
                            <span className={classes.label}>Image</span>
                        </label>
                    </div>
                    <Button onClick={handleOpen}>Open Modal</Button>
                    <Button onClick={handleUpload}>Create</Button>
                </div>
                <div className="">
                    <CircularProgress variant="determinate" value={Number(progress)} />
                </div>
            </div>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="simple-modal-title"
                aria-describedby="simple-modal-description"
            >
                <div style={modalStyle} className={classes.paper}>
                    <div className="upload__header">
                        <h2></h2>

                    </div>

                </div>
            </Modal>
        </div>
    )
}

export default Upload