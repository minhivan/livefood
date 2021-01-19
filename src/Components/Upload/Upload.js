import React, {useState} from "react";
import './Upload.css';


import {Avatar, Button, IconButton, Modal, TextField} from "@material-ui/core";
import {storage, db } from "../../firebase";
import firebase from "firebase";
import {makeStyles} from "@material-ui/core/styles";
import CircularProgress from '@material-ui/core/CircularProgress';
import {PhotoCamera} from "@material-ui/icons";
import CancelTwoToneIcon from '@material-ui/icons/CancelTwoTone';
import {Link} from "react-router-dom";
import DraftsTwoToneIcon from "@material-ui/icons/DraftsTwoTone";
import CreateTwoToneIcon from '@material-ui/icons/CreateTwoTone';
import dayjs from "dayjs";
import CardHeader from "@material-ui/core/CardHeader";
import avt1 from "../../images/Avatar/avatar1.png";


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
        paddingLeft: "10px"
    },
    paper: {
        position: 'absolute',
        width: 600,
        backgroundColor: theme.palette.background.paper,
        boxShadow: theme.shadows[5],
        padding: theme.spacing(2, 4, 3),
        borderRadius: "8px",
        minHeight: "500px",
        "&:focus": {
            outline: "none"
        },
        display: "flex",
        flexDirection: "column"
    },
    modalHeader: {
        display: "flex",
        justifyContent: "center",
        padding: "10px 0 20px 0",
        borderBottom: "1px solid #39CCCC"
    },
    buttonClose: {
        position: "fixed",
        right: "20px",
        top: "17px"
    },
    username: {
        fontSize: "16px",
        fontWeight: "bold"
    },
    avatar: {
        width: 50,
        height: 50
    },
    cardHeader: {
        padding: "16px 0"
    },
    reviewImg: {
        width: "100%",
        objectFit: "contain",
        padding: "15px 0"
    },
    inputText: {
        width: "100%",
        padding: "10px 0",
        minHeight: "200px",
        maxHeight: "400px",
    }
}));


function Upload({username}) {
    const [open, setOpen] = useState(false);
    const classes = useStyles();
    const [caption, setCaption] = useState('');
    const [image, setImage] = useState('');
    const [progress, setProgress] = useState('');
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
                        setOpen(false);
                    })
            }
        )
    }
    return(
        <div className="upload">
            <div className="upload__container">
                <div className="upload__caption_test">
                    <div className="caption__holder" onClick={handleOpen}>
                        <CreateTwoToneIcon />
                        <span>
                            What's on your mind ?
                        </span>
                    </div>
                </div>

                <div className="upload__picker">
                    <div className="upload__pickerImage">
                        <input accept="image/*" type="file" onChange={handleChange} id="icon-button-file" className={classes.input}/>
                        <label htmlFor="icon-button-file" className="upload__pickerButton">
                            <Button variant="contained" color="primary" component="span">
                                <PhotoCamera /> <span className={classes.label}>Image</span>
                            </Button>
                        </label>
                    </div>
                    <div className="upload__pickButton">
                        <Button onClick={handleOpen}>Open Modal</Button>
                    </div>
                    <div className="upload__pickButton">
                        <Button onClick={handleUpload}>Create</Button>
                    </div>

                </div>
                <div className="">
                    <CircularProgress variant="determinate" value={Number(progress)} />
                </div>
            </div>

            <Modal
                open={open}
                aria-labelledby="simple-modal-title"
                aria-describedby="simple-modal-description"
            >
                <div style={modalStyle} className={classes.paper}>
                    <div className={classes.modalHeader}>
                        <h2>What's on your mind ?</h2>
                        <div className={classes.buttonClose}>
                            <IconButton aria-label="Cancel" color="inherit" onClick={handleClose} >
                                <CancelTwoToneIcon />
                            </IconButton>
                        </div>
                    </div>
                    <div className="upload__caption">
                        <CardHeader
                            avatar={
                                <Avatar aria-label="recipe" className={classes.avatar} src={avt1}/>
                            }
                            title={
                                <span className={classes.username}>{username}</span>
                            }
                            subheader={
                                <span>Test</span>
                            }
                            className={classes.cardHeader}
                        />

                        <div className="caption__text">
                                <TextField
                                    className={classes.inputText}
                                    multiline
                                    placeholder="What's on your mind ... "
                                    value={caption}
                                    onChange={event => setCaption(event.target.value)}
                                    InputProps={{ disableUnderline: true }}
                                />
                        </div>

                        {
                            image ? (
                                <div className="upload__review">
                                    <img className={classes.reviewImg} src={URL.createObjectURL(image)} alt="Picture" />
                                    {/*<div className={classes.buttonClose}>*/}
                                    {/*    <IconButton aria-label="Cancel" color="inherit" onClick={handleClose} >*/}
                                    {/*        <CancelTwoToneIcon />*/}
                                    {/*    </IconButton>*/}
                                    {/*</div>*/}
                                </div>
                            ) : null
                        }

                    </div>

                    <div className="upload__button">
                        <Button onClick={handleUpload}>Create</Button>
                    </div>

                </div>
            </Modal>
        </div>
    )
}

export default Upload