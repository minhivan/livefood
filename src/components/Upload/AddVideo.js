import React, {useEffect, useState} from "react";
import {
    Avatar,
    Badge,
    Button,
    CircularProgress,
    IconButton,
    Modal, Popover,
    TextField,
    Tooltip
} from "@material-ui/core";
import CancelTwoToneIcon from "@material-ui/icons/CancelTwoTone";
import CardHeader from "@material-ui/core/CardHeader";
import {makeStyles} from "@material-ui/core/styles";
import PhotoCameraTwoToneIcon from "@material-ui/icons/PhotoCameraTwoTone";
// import VideoCallTwoToneIcon from "@material-ui/icons/VideoCallTwoTone";
import LocationOnTwoToneIcon from '@material-ui/icons/LocationOnTwoTone';
import {auth, db, storage} from "../../firebase";
import firebase from "firebase";
import {useAuthState} from "react-firebase-hooks/auth";
import {green} from "@material-ui/core/colors";
import {v4 as uuidv4} from "uuid";
// import {useCollection} from "react-firebase-hooks/firestore";
import MobileStepper from '@material-ui/core/MobileStepper';
// import Paper from '@material-ui/core/Paper';
// import Typography from '@material-ui/core/Typography';
import SentimentSatisfiedRoundedIcon from "@material-ui/icons/SentimentSatisfiedRounded";
import {Picker} from "emoji-mart";



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
        padding: theme.spacing(2, 3, 3),
        borderRadius: "16px",
        maxHeight: "calc(100vh - 70px)",
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
        boxShadow: "0px 0px 2px 0px rgba(21,12,12,0.9)",
        borderRadius: "max(0px, min(8px, calc((100vw - 4px - 100%) * 9999))) / 8px",
        maxHeight: "550px"
    },
    inputText: {
        width: "100%",
        minHeight: "100px",
    },
    buttonProgress: {
        color: green[500],
        position: 'absolute',
        top: '50%',
        left: '50%',
        marginTop: -12,
        marginLeft: -12,
    },
    buttonDisable: {
        color: "#bcc0c4 !important",
        backgroundColor : "#e4e6eb !important"
    },
    buttonRemove: {
        position: "absolute",
        top: "0px",
        right: "0"
    },
    header: {
        display: 'flex',
        alignItems: 'center',
        height: 50,
        paddingLeft: theme.spacing(4),
        backgroundColor: theme.palette.background.default,
    },
    img: {
        height: 255,
        maxWidth: 400,
        overflow: 'hidden',
        display: 'block',
        width: '100%',
    },
}));


function AddVideo(props){
    const {open, videoUpload, setVideoUpload, handleClose} = props;
    const [user] = useAuthState(auth);
    const classes = useStyles();
    const [modalStyle] = useState(getModalStyle);

    const [caption, setCaption] = useState('');
    const [progress, setProgress] = useState('');
    const [loading, setLoading] = useState(false);
    const [disable, setDisable] = useState(true);
    const [anchorElPicker, setAnchorElPicker] = useState(null);

    const openEmoji = Boolean(anchorElPicker);
    const id = openEmoji ? 'popup-emoji' : undefined;

    const handleClickEmoji = (event) => {
        setAnchorElPicker(event.currentTarget);
    }
    const handleCloseEmoji = () => {
        setAnchorElPicker(null);
    };
    const addEmoji = (event) => {
        let emoji = event.native;
        setCaption(caption + emoji);
    }

    const removeImage = () => {
        setVideoUpload('');
    }

    const handleReset = () => {
        handleClose(true);
        setProgress('0');
        setCaption("");
        setLoading(false);
        setVideoUpload("");
    }

    const handleUpload = () => {
        if(videoUpload) {
            const imageName = uuidv4();
            const uploadTask = storage.ref(`videos/${user.uid}/${imageName}`).put(videoUpload);
            uploadTask.on(
                "state_changed",
                (snapshot => {
                    const progressData = Math.round(
                        (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                    );
                    setProgress(progressData);
                    setLoading(true);
                    setDisable(true);
                }),
                (error => {
                    console.log(error);
                }),
                () => {
                    storage
                        .ref(`videos/${user.uid}/`)
                        .child(imageName)
                        .getDownloadURL()
                        .then(url => {
                            db.collection("posts").add({
                                timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                                caption: caption,
                                media: [{
                                    mediaPath: url,
                                    type: videoUpload.type
                                }],
                                type: "video",
                                user: db.doc('users/' + user.uid),
                                uid: user.uid
                            })
                                .then(function(docRef) {
                                    console.log("Document written with ID: ", docRef.id);
                                    db.collection("users").doc(user.uid).update({
                                        post: firebase.firestore.FieldValue.arrayUnion(docRef.id)
                                    })
                                    handleReset();
                                })
                                .catch(function(error) {
                                    console.error("Error adding document: ", error);
                                });
                        })
                }
            )
        }
    }

    useEffect(() => {
        if(caption.length > 0 && videoUpload){
            setDisable(false);
        }else {
            setDisable(true)
        }
    },[caption, caption.length, videoUpload])



    return (
        <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="simple-modal-title"
            aria-describedby="simple-modal-description"
        >
            <div style={modalStyle} className={classes.paper}>

                <div className={classes.modalHeader}>
                    <h2>Create your own video now  ?</h2>
                    <div className={classes.buttonClose}>
                        <IconButton aria-label="Cancel" color="inherit" onClick={handleClose} >
                            <CancelTwoToneIcon />
                        </IconButton>
                    </div>
                </div>
                <div className="popup__caption">
                    <CardHeader
                        avatar={
                            <Avatar aria-label="recipe" className={classes.avatar} src={user?.photoURL}/>
                        }
                        title={
                            <span className={classes.username}>{user?.displayName}</span>
                        }
                        subheader={
                            <span>Public</span>
                        }
                        className={classes.cardHeader}
                    />

                    <div className="popup__text">
                        <TextField
                            className={classes.inputText}
                            multiline
                            placeholder="What's on your mind ... ? "
                            value={caption}
                            onChange={event => setCaption(event.target.value)}
                            InputProps={{ disableUnderline: true, style : {fontSize: "1rem"}}}
                        />
                        <IconButton className="chat__iconPicker" aria-label="Add" onClick={handleClickEmoji}>
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

                    </div>
                    {
                        videoUpload ? (
                            <div className="popup__review">
                                <video controls className={classes.reviewImg} muted="muted">
                                    <source src={window.URL.createObjectURL(videoUpload)} type="video/mp4"/>
                                </video>
                                <div className={classes.buttonRemove}>
                                    <IconButton aria-label="Cancel" color="inherit" onClick={() => removeImage()} >
                                        <CancelTwoToneIcon />
                                    </IconButton>
                                </div>
                            </div>
                        ) : null
                    }

                </div>
                <div className="popup__picker">
                    <h3 style={{textTransform: "inherit", fontSize: "1rem", letterSpacing: "0"}}>Add to this post </h3>
                    <div className="popup__iconPicker">
                        <div>
                            <label htmlFor="video-upload" className="upload__pickerButton">
                                <IconButton color="inherit" component="span" >
                                    <Badge color="secondary">
                                        <PhotoCameraTwoToneIcon className={classes.popIcon}/>
                                    </Badge>
                                </IconButton>
                            </label>
                        </div>
                    </div>
                </div>
                <div className="upload__button">
                    <Button
                        classes={{
                            disabled: classes.buttonDisable
                        }}
                        type="submit"
                        onClick={handleUpload}
                        disabled={disable}
                    >
                        Create Now
                    </Button>
                    {loading && <CircularProgress size={24} value={progress} className={classes.buttonProgress} /> }
                </div>

            </div>
        </Modal>
    )
}
export default AddVideo