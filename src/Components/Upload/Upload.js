import React, {useState} from "react";
import './Upload.css';


import {Avatar, Badge, Button, IconButton, Modal, TextField} from "@material-ui/core";
import {storage, db } from "../../firebase";
import firebase from "firebase";
import {makeStyles} from "@material-ui/core/styles";
import CircularProgress from '@material-ui/core/CircularProgress';
import PhotoCameraTwoToneIcon from '@material-ui/icons/PhotoCameraTwoTone';
import CancelTwoToneIcon from '@material-ui/icons/CancelTwoTone';
import CreateTwoToneIcon from '@material-ui/icons/CreateTwoTone';
import CardHeader from "@material-ui/core/CardHeader";
import avt1 from "../../images/Avatar/avatar1.png";
import VideoCallTwoToneIcon from '@material-ui/icons/VideoCallTwoTone';
import GroupAddTwoToneIcon from '@material-ui/icons/GroupAddTwoTone';
import InsertPhotoTwoToneIcon from '@material-ui/icons/InsertPhotoTwoTone';
import SentimentSatisfiedTwoToneIcon from '@material-ui/icons/SentimentSatisfiedTwoTone';
import EmojiObjectsTwoToneIcon from '@material-ui/icons/EmojiObjectsTwoTone';

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
        minHeight: "120px",
        maxHeight: "300px",
        overflow: "auto",
        fontSize: "16px"
    },
    popIcon: {
        height: "28px",
        width: "28px",
        color: "#00000099"
    },

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
            setOpen(true);
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
                            <InsertPhotoTwoToneIcon />
                            <span className={classes.label}>Photo</span>
                        </label>
                    </div>
                    <div className="upload__pickButton">
                        <Button onClick={handleOpen}>
                            <SentimentSatisfiedTwoToneIcon />
                            <span className={classes.label}>Felling</span>
                        </Button>
                    </div>
                    <div className="upload__pickButton">
                        <Button onClick={handleOpen}>
                            <EmojiObjectsTwoToneIcon />
                            <span className={classes.label}>Idea</span>
                        </Button>

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
                    <div className="popup__caption">
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

                        <div className="popup__text">
                                <TextField
                                    className={classes.inputText}
                                    multiline
                                    placeholder="What's on your mind ... "
                                    value={caption}
                                    onChange={event => setCaption(event.target.value)}
                                    InputProps={{ disableUnderline: true, style : {fontSize: "18px"}}}
                                />
                        </div>

                        {
                            image ? (
                                <div className="popup__review">
                                    <img className={classes.reviewImg} src={URL.createObjectURL(image)} alt="Picture" />
                                    {/*<div className={classes.buttonClose}>*/}
                                    {/*    <IconButton aria-label="Cancel" color="inherit" onClick={handleClose} >*/}
                                    {/*        <CancelTwoToneIcon />*/}
                                    {/*    </IconButton>*/}
                                    {/*</div>*/}
                                </div>
                            ) : null
                        }

                        <div className="popup__picker">
                            <h3>Add to this post </h3>
                            <div className="popup__iconPicker">
                                <div>
                                    <label htmlFor="icon-button-file" className="upload__pickerButton">
                                        <IconButton color="inherit" component="span" >
                                            <Badge color="secondary">
                                                <PhotoCameraTwoToneIcon className={classes.popIcon}/>
                                            </Badge>
                                        </IconButton>
                                    </label>
                                </div>
                                <div>
                                    <IconButton color="inherit" component="span" >
                                        <Badge color="secondary">
                                            <VideoCallTwoToneIcon className={classes.popIcon}/>
                                        </Badge>
                                    </IconButton>
                                </div>
                                <div>
                                    <IconButton color="inherit" component="span" >
                                        <Badge color="secondary">
                                            <GroupAddTwoToneIcon className={classes.popIcon}/>
                                        </Badge>
                                    </IconButton>
                                </div>
                            </div>
                        </div>
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