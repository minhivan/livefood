import React, {useEffect, useState} from "react";
import {
    Avatar,
    Badge,
    Button,
    CircularProgress,
    IconButton,
    Modal,
    TextField,
    Tooltip,
    useTheme
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
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';



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
        borderRadius: "max(0px, min(8px, calc((100vw - 4px - 100%) * 9999))) / 8px"
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


function Popup(props){
    const {open, image, setImage, handleClose, setOpenSnack} = props;
    const [user] = useAuthState(auth);
    const classes = useStyles();
    const [modalStyle] = useState(getModalStyle);
    const theme = useTheme();

    const [caption, setCaption] = useState('');
    const [progress, setProgress] = useState('');
    const [loading, setLoading] = useState(false);
    const [disable, setDisable] = useState(true);
    const [activeStep, setActiveStep] = React.useState(0);
    const [maxSteps, setMaxSteps] = useState(image ? image.length : 0);


    const handleNext = () => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    // useEffect(() => {
    //     if(image.length){
    //         setMaxSteps(image.length);
    //     }
    // }, [image.length])

    const removeImage = (step) => {
        if(image.length === 1){
            setImage('');
            setActiveStep(0);
            setMaxSteps(0)
        }
        else{
            image.splice(step, 1);
            setImage(image);
            setActiveStep(0);
            setMaxSteps(image.length)
        }
    }


    const newUpload = async () => {
        await Promise.all(image.map(item =>
            new Promise((resolve, reject) => {
                const imageName = uuidv4();
                storage.ref(`media/${user.uid}/${imageName}`)
                    .put(item)
                    .on('state_changed', (snapshot) => {
                            // progress function ....
                            setProgress(Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100));
                            setLoading(true);
                        },
                        reject,
                        () => {
                            // complete function ....
                            storage.ref(`media/${user.uid}/`)
                                .child(imageName)
                                .getDownloadURL()
                                .then(url => {
                                    resolve({
                                        mediaPath: url,
                                        type: item.type
                                    });
                                });
                        });
            })
        )).then((values) => {
            db.collection("posts").add({
                timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                hasImage: true,
                caption: caption,
                media: values,
                user: db.doc('users/' + user.uid),
                uid: user.uid
            })
                .then(function(docRef) {
                    console.log("Document written with ID: ", docRef.id);
                    db.collection("users").doc(user.uid).update({
                        post: firebase.firestore.FieldValue.arrayUnion(docRef.id)
                    })
                    setOpenSnack(true);
                    setImage('');
                    handleClose(true);
                    setProgress('0');
                    setCaption("");
                    setLoading(false);
                    setImage('');
                    setActiveStep(0);
                    setMaxSteps(0)
                })
                .catch(function(error) {
                    console.error("Error adding document: ", error);
                });
        })

    }


    // const handleUpload = () => {
    //     if(image) {
    //         const imageName = uuidv4();
    //         const uploadTask = storage.ref(`media/${user.uid}/${imageName}`).put(image);
    //         uploadTask.on(
    //             "state_changed",
    //             (snapshot => {
    //                 const progressData = Math.round(
    //                     (snapshot.bytesTransferred / snapshot.totalBytes) * 100
    //                 );
    //                 setProgress(progressData);
    //                 setLoading(true);
    //             }),
    //             (error => {
    //                 console.log(error);
    //             }),
    //             () => {
    //                 storage
    //                     .ref(`media/${user.uid}/`)
    //                     .child(imageName)
    //                     .getDownloadURL()
    //                     .then(url => {
    //                         db.collection("posts").add({
    //                             timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    //                             hasImage: true,
    //                             caption: caption,
    //                             mediaUrl: url,
    //                             user: db.doc('users/' + user.uid),
    //                             mediaType: image.type,
    //                             uid: user.uid
    //                         })
    //                             .then(function(docRef) {
    //                                 console.log("Document written with ID: ", docRef.id);
    //                                 db.collection("users").doc(user.uid).update({
    //                                     post: firebase.firestore.FieldValue.arrayUnion(docRef.id)
    //                                 })
    //                             })
    //                             .catch(function(error) {
    //                                 console.error("Error adding document: ", error);
    //                             });
    //                         setOpenSnack(true);
    //                         setImage(null);
    //                         handleClose(true);
    //                         setProgress('0');
    //                         setCaption("");
    //                         setLoading(false);
    //                     })
    //             }
    //         )
    //     }
    // }

    useEffect(() => {
        if(caption.length > 0 && image){
            setDisable(false);
        }else {
            setDisable(true)
        }
    },[caption, caption.length, image])

    console.log()
    return (
        <Modal
            open={open}
            onClose={handleClose}
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
                            InputProps={{ disableUnderline: true, style : {fontSize: "1rem"}}}
                        />
                    </div>
                    {
                        image.length > 0 ? (
                            <div className="popup__review">
                                {
                                    image[activeStep]?.type === "video/mp4" ? (
                                        <video controls className={classes.reviewImg} muted="muted">
                                            <source src={window.URL.createObjectURL(image[activeStep])} type="video/mp4"/>
                                        </video>
                                    ) : (
                                        <img className={classes.reviewImg} src={window.URL.createObjectURL(image[activeStep])} alt="" />
                                    )
                                }
                                <div className={classes.buttonRemove}>
                                    <IconButton aria-label="Cancel" color="inherit" onClick={() => removeImage(activeStep)} >
                                        <CancelTwoToneIcon />
                                    </IconButton>
                                </div>
                                <MobileStepper
                                    variant="dots"
                                    steps={maxSteps}
                                    position="static"
                                    activeStep={activeStep}
                                    nextButton={
                                        <Button size="small" onClick={handleNext} disabled={activeStep === maxSteps - 1}>
                                            {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
                                        </Button>
                                    }
                                    backButton={
                                        <Button size="small" onClick={handleBack} disabled={activeStep === 0}>
                                            {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
                                        </Button>
                                    }
                                />

                            </div>
                        ) : null
                    }

                </div>
                <div className="popup__picker">
                    <h3 style={{textTransform: "inherit", fontSize: "1rem", letterSpacing: "0"}}>Add to this post </h3>
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
                            <Tooltip title="Location">
                                <IconButton color="inherit" component="span">
                                    <Badge color="secondary">
                                        <LocationOnTwoToneIcon className={classes.popIcon}/>
                                    </Badge>
                                </IconButton>
                            </Tooltip>
                        </div>
                    </div>
                </div>
                <div className="upload__button">
                    <Button
                        classes={{
                            disabled: classes.buttonDisable
                        }}
                        type="submit"
                        onClick={newUpload}
                        // disabled={disable}
                    >
                        Create Now
                    </Button>
                    {loading && <CircularProgress size={24} value={progress} className={classes.buttonProgress} /> }
                </div>

            </div>
        </Modal>
    )
}
export default Popup