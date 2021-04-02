import React, {useState} from "react";
import {Avatar, Badge, Button, CircularProgress, IconButton, Modal, TextField} from "@material-ui/core";
import CancelTwoToneIcon from "@material-ui/icons/CancelTwoTone";
import CardHeader from "@material-ui/core/CardHeader";
import {makeStyles} from "@material-ui/core/styles";
import PhotoCameraTwoToneIcon from "@material-ui/icons/PhotoCameraTwoTone";
import VideoCallTwoToneIcon from "@material-ui/icons/VideoCallTwoTone";
import GroupAddTwoToneIcon from "@material-ui/icons/GroupAddTwoTone";
import {auth, db, storage} from "../../firebase";
import firebase from "firebase";
import {useAuthState} from "react-firebase-hooks/auth";
import {green} from "@material-ui/core/colors";
import {useCollection} from "react-firebase-hooks/firestore";

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
        borderRadius: "8px",
        maxHeight: "740px",
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
        borderRadius: "10px",
        boxShadow: "0px 0px 2px 0px rgba(21,12,12,0.9)"
    },
    inputText: {
        width: "100%",
        padding: "10px 0",
        minHeight: "100px",
        fontFamily: "'Quicksand', sans-serif"
    },
    buttonProgress: {
        color: green[500],
        position: 'absolute',
        top: '50%',
        left: '50%',
        marginTop: -12,
        marginLeft: -12,
    },
}));



function Popup(props){
    const [user] = useAuthState(auth);
    const classes = useStyles();
    const [modalStyle] = useState(getModalStyle);
    const [caption, setCaption] = useState('');
    const [progress, setProgress] = useState('');
    const [loading, setLoading] = useState(false);

    // const handleUpload = () => {
    //
    // }

    // const [post] = useCollection()

    const handleUpload = () => {
        const uploadTask = storage.ref(`images/${props.image.name}`).put(props.image);
        uploadTask.on(
            "state_changed",
            (snapshot => {
                const progressData = Math.round(
                    (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                );
                setProgress(progressData);
                setLoading(true);
            }),
            (error => {
                console.log(error);
            }),
            () => {
                storage
                    .ref("images")
                    .child(props.image.name)
                    .getDownloadURL()
                    .then(url => {
                        db.collection("posts").add({
                            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                            hasImage: true,
                            caption: caption,
                            mediaUrl: url,
                            user: db.doc('users/' + user.uid),
                            mediaType: props.image.type,
                            uid: user.uid
                        })
                            .then(function(docRef) {
                                console.log("Document written with ID: ", docRef.id);

                            })
                            .catch(function(error) {
                                console.error("Error adding document: ", error);
                            });
                        props.setOpenSnack(true);
                        props.setImage(null);
                        props.handleClose(true);
                        setProgress('0');
                        setCaption("");
                        setLoading(false);
                    })
            }
        )
    }

    return (
        <Modal
            open={props.open}
            onClose={props.handleClose}
            aria-labelledby="simple-modal-title"
            aria-describedby="simple-modal-description"
        >
            <div style={modalStyle} className={classes.paper}>
                <div className={classes.modalHeader}>
                    <h2>What's on your mind ?</h2>
                    <div className={classes.buttonClose}>
                        <IconButton aria-label="Cancel" color="inherit" onClick={props.handleClose} >
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
                            placeholder="What's on your mind ... "
                            value={caption}
                            onChange={event => setCaption(event.target.value)}
                            InputProps={{ disableUnderline: true, style : {fontSize: "18px", fontFamily: "'Quicksand', sans-serif"}}}
                        />
                    </div>
                    {
                        props.image ? (
                            <div className="popup__review">
                                <img className={classes.reviewImg} src={URL.createObjectURL(props.image)} alt="" />
                                {/*<div className={classes.buttonClose}>*/}
                                {/*    <IconButton aria-label="Cancel" color="inherit" >*/}
                                {/*        <CancelTwoToneIcon />*/}
                                {/*    </IconButton>*/}
                                {/*</div>*/}
                            </div>
                        ) : null
                    }

                </div>
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
                <div className="upload__button">
                    <Button
                        onClick={handleUpload}
                        disabled={loading}
                    >
                        Create
                    </Button>
                    {loading && <CircularProgress size={24} value={parseInt(progress)} className={classes.buttonProgress} /> }
                </div>

            </div>
        </Modal>
    )
}
export default Popup