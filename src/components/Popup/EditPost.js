import React, {useEffect, useState} from "react";
import {
    Avatar,
    Badge,
    Button,
    CircularProgress,
    IconButton, MenuItem,
    Modal, Popover, Select,
    TextField,
} from "@material-ui/core";
import CancelTwoToneIcon from "@material-ui/icons/CancelTwoTone";
import CardHeader from "@material-ui/core/CardHeader";
import {makeStyles} from "@material-ui/core/styles";
import PhotoCameraTwoToneIcon from "@material-ui/icons/PhotoCameraTwoTone";
// import VideoCallTwoToneIcon from "@material-ui/icons/VideoCallTwoTone";
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
import SentimentSatisfiedRoundedIcon from "@material-ui/icons/SentimentSatisfiedRounded";
import {Picker} from "emoji-mart";
import FormControl from "@material-ui/core/FormControl";



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
    inputHead: {
        display: "flex",
        alignItems: "flex-start",
    },
    fellingSelect: {
        minWidth: "150px",
        padding: "16px"
    }
}));


function EditPost(props){
    const {open, post, handleClose, setOpenSnack, postId} = props;
    const [user] = useAuthState(auth);
    const classes = useStyles();
    const [modalStyle] = useState(getModalStyle);
    const [caption, setCaption] = useState(post?.caption ?? '');
    const [progress, setProgress] = useState('');
    const [loading, setLoading] = useState(false);
    const [disable, setDisable] = useState(true);
    const [activeStep, setActiveStep] = React.useState(0);
    const [maxSteps, setMaxSteps] = useState(post?.media?.length ?? '');
    const [image, setImage] = useState(post?.media ?? '');
    const [newImage, setNewImage] = useState('');
    const [felling, setFelling] = useState(post?.felling ??'');


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

    const handleNext = () => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const removeImage = (step) => {
        if(image.length > 0){
            setImage('');
            setActiveStep(0);
            setMaxSteps(0)
        }
        else{
            if(newImage.length === 1){
                setNewImage('');
                setActiveStep(0);
                setMaxSteps(0)
            }
            else{
                newImage.splice(step, 1);
                setNewImage(newImage);
                setActiveStep(0);
                setMaxSteps(newImage.length)
            }
        }
    }

    const newUpload = async () => {
        setDisable(true);
        if(newImage){
            await Promise.all(newImage.map(item =>
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
                db.collection("posts").doc(postId).update({
                    timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                    caption: caption,
                    media: values,
                    felling: felling,
                }).then(() => {
                    handleClose(true);
                    setLoading(false);
                    setOpenSnack(true);
                    setDisable(false);
                })
                    .catch(function(error) {
                        setDisable(true);
                        console.error("Error adding document: ", error);
                    });
            })

        }
        else{
            setLoading(true);
            db.collection("posts").doc(postId).update({
                timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                caption: caption,
                felling: felling,
            }).then(() => {
                handleClose(true);
                setLoading(false);
                setOpenSnack(true);
            }).catch(function(error) {
                setDisable(true);
                console.error("Error update document: ", error);
            });
        }
    }


    const handleChange = (event) => {
        const imageList = event.target.files
        if(event.target.files){
            setImage('');
            setNewImage(Array.from(imageList));
            setMaxSteps(imageList.length);
        }
    }

    useEffect(() => {
        if(caption.length > 0 && (image || newImage)){
            setDisable(false);
        }else {
            setDisable(true)
        }
    },[caption, caption.length, image, newImage])



    return (
        <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="simple-modal-title"
            aria-describedby="simple-modal-description"
        >
            <div style={modalStyle} className={classes.paper}>
                <input accept="image/*|video/*" type="file" onChange={handleChange} onClick={e => (e.target.value = null)} multiple="multiple" id="update-media" className={classes.input}/>
                <div className={classes.modalHeader}>
                    <h2>What's on your mind ?</h2>
                    <div className={classes.buttonClose}>
                        <IconButton aria-label="Cancel" color="inherit" onClick={handleClose} >
                            <CancelTwoToneIcon />
                        </IconButton>
                    </div>
                </div>
                <div className="popup__caption">
                    <div className={classes.inputHead}>
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
                        <FormControl className={classes.fellingSelect}>
                            <Select
                                displayEmpty
                                inputProps={{ 'aria-label': 'Felling' }}
                                value={felling}
                                onChange={event => setFelling(event.target.value)}
                            >
                                <MenuItem value="">
                                    <em>Felling</em>
                                </MenuItem>
                                <MenuItem value={`happy`}> 🙂 <span style={{paddingLeft: "5px"}}>Happy</span></MenuItem>
                                <MenuItem value={`sad`}> 😔 <span style={{paddingLeft: "5px"}}>Sad</span></MenuItem>
                                <MenuItem value={`love`}>🥰 <span style={{paddingLeft: "5px"}}>Loved</span></MenuItem>
                            </Select>

                        </FormControl>
                    </div>

                    <div className="popup__text">
                        <TextField
                            className={classes.inputText}
                            multiline
                            placeholder="What's on your mind ... "
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
                        image ? (
                            <div className="popup__review">
                                {
                                    image[activeStep]?.type === "video/mp4" ? (
                                        <video controls className={classes.reviewImg} muted="muted">
                                            <source src={image[activeStep]?.mediaPath} type="video/mp4"/>
                                        </video>
                                    ) : (
                                        <img className={classes.reviewImg} src={image[activeStep]?.mediaPath} alt="" />
                                    )
                                }
                                <div className={classes.buttonRemove}>
                                    <IconButton aria-label="Cancel" color="inherit" onClick={() => removeImage(activeStep)} >
                                        <CancelTwoToneIcon />
                                    </IconButton>
                                </div>
                                {
                                    image.length > 1 ? (
                                        <MobileStepper
                                            variant="dots"
                                            steps={maxSteps}
                                            position="static"
                                            activeStep={activeStep}
                                            nextButton={
                                                <IconButton onClick={handleNext} aria-label="Next" disabled={activeStep === maxSteps - 1} >
                                                    <KeyboardArrowRight />
                                                </IconButton>
                                            }
                                            backButton={
                                                <IconButton onClick={handleBack} disabled={activeStep === 0}  aria-label="Back">
                                                    <KeyboardArrowLeft />
                                                </IconButton>
                                            }
                                        />
                                    ) : null
                                }
                            </div>
                        ) : (
                            newImage ? (
                                <div className="popup__review">
                                    {
                                        newImage[activeStep]?.type === "video/mp4" ? (
                                            <video controls className={classes.reviewImg} muted="muted">
                                                <source src={window.URL.createObjectURL(newImage[activeStep])} type="video/mp4"/>
                                            </video>
                                        ) : (
                                            <img className={classes.reviewImg} src={window.URL.createObjectURL(newImage[activeStep])} alt="" />
                                        )
                                    }
                                    <div className={classes.buttonRemove}>
                                        <IconButton aria-label="Cancel" color="inherit" onClick={() => removeImage(activeStep)} >
                                            <CancelTwoToneIcon />
                                        </IconButton>
                                    </div>
                                    {
                                        newImage.length > 1 ? (
                                            <MobileStepper
                                                variant="dots"
                                                steps={maxSteps}
                                                position="static"
                                                activeStep={activeStep}
                                                nextButton={
                                                    <IconButton onClick={handleNext} aria-label="Next" disabled={activeStep === maxSteps - 1} >
                                                        <KeyboardArrowRight />
                                                    </IconButton>
                                                }
                                                backButton={
                                                    <IconButton onClick={handleBack} disabled={activeStep === 0}  aria-label="Back">
                                                        <KeyboardArrowLeft />
                                                    </IconButton>
                                                }
                                            />
                                        ) : null
                                    }
                                </div>
                            ) : null
                        )
                    }



                </div>
                <div className="popup__picker">
                    <h3 style={{textTransform: "inherit", fontSize: "1rem", letterSpacing: "0"}}>Update new media ? </h3>
                    <div className="popup__iconPicker">

                        <div>
                            <label htmlFor="update-media" className="upload__pickerButton">
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
                        onClick={newUpload}
                        disabled={disable}
                    >
                        Update
                    </Button>
                    {loading && <CircularProgress size={24} value={progress} className={classes.buttonProgress} /> }
                </div>

            </div>
        </Modal>
    )
}
export default EditPost