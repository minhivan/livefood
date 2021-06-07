import React, {useEffect, useState} from "react";
import {
    Avatar,
    Badge,
    Button, Chip,
    CircularProgress,
    IconButton, MenuItem,
    Modal, Paper, Popover, Select,
    TextField
} from "@material-ui/core";
import CancelTwoToneIcon from "@material-ui/icons/CancelTwoTone";
import CardHeader from "@material-ui/core/CardHeader";
import {makeStyles} from "@material-ui/core/styles";
// import PhotoCameraTwoToneIcon from "@material-ui/icons/PhotoCameraTwoTone";
// import VideoCallTwoToneIcon from "@material-ui/icons/VideoCallTwoTone";
// import LocationOnTwoToneIcon from '@material-ui/icons/LocationOnTwoTone';
import {auth, db, storage} from "../../firebase";
import firebase from "firebase";
import {useAuthState} from "react-firebase-hooks/auth";
import {green} from "@material-ui/core/colors";
import {v4 as uuidv4} from "uuid";
// import {useCollection} from "react-firebase-hooks/firestore";
// import MobileStepper from '@material-ui/core/MobileStepper';
// import Paper from '@material-ui/core/Paper';
// import Typography from '@material-ui/core/Typography';
import SentimentSatisfiedRoundedIcon from "@material-ui/icons/SentimentSatisfiedRounded";
import {Picker} from "emoji-mart";
import FormControl from "@material-ui/core/FormControl";
import VideoLibraryRoundedIcon from '@material-ui/icons/VideoLibraryRounded';
import LocationOnTwoToneIcon from '@material-ui/icons/LocationOnTwoTone';
import ListFoodShopCheckIn from "../Popup/ListFoodShopCheckIn";

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
        width: 750,
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
    },
    pickerContainer: {
        display: "flex",
        width: "100%",
        flexWrap: "wrap",
        overflowY: "auto",
        justifyContent: "center",
    },
    listChip: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: "center",
        flexWrap: 'wrap',
        listStyle: 'none',
        padding: theme.spacing(0.5),
        margin: 0,
    },
    chip: {
        margin: theme.spacing(0.5),
        minWidth: "90px",
        padding: "10px",
        textTransform: "capitalize",
        fontSize: "0.8rem",
    },
    tag: {
        padding: "20px 0"
    },
    tagTitle: {
        fontWeight: "bold",
        fontSize: "16px"
    }

}));


function AddVideo(props){
    const {open, videoUpload, setVideoUpload, handleClose, setOpenSnack} = props;
    const [user] = useAuthState(auth);
    const classes = useStyles();
    const [modalStyle] = useState(getModalStyle);

    const [caption, setCaption] = useState('');
    const [progress, setProgress] = useState('');
    const [loading, setLoading] = useState(false);
    const [disable, setDisable] = useState(true);
    const [anchorElPicker, setAnchorElPicker] = useState(null);
    const [checkIn, setCheckIn] = useState(false);
    const [dataCheckIn, setDataCheckIn] = useState(null);
    const [postStatus, setPostStatus] = useState("public");
    const [selectedChip, setSelectedChip] = useState([]);

    const listChip = [
        { key: 0, label: 'cuisine' },
        { key: 1, label: 'occasion' },
        { key: 2, label: 'preparation' },
        { key: 3, label: 'lunch' },
        { key: 4, label: 'course' },
        { key: 5, label: 'dietary' },
        { key: 6, label: 'breakfast' },
        { key: 7, label: 'cheap food shop' },
        { key: 8, label: 'coffee shop' },
        { key: 9, label: 'street food' },
    ];

    const handleSelectChip = (data) => {
        if( ! selectedChip.some(chips => chips.key === data.key)) {
            setSelectedChip([...selectedChip, data]);
        }
    };


    const handleDeleteChip = (chipToDelete) => () => {
        setSelectedChip((chips) => chips.filter((chip) => chip.key !== chipToDelete.key));
    };


    const openEmoji = Boolean(anchorElPicker);
    const id = openEmoji ? 'popup-emoji' : undefined;

    const handleClickEmoji = (event) => {
        setAnchorElPicker(event.currentTarget);
    }
    const handleCloseEmoji = () => {
        setAnchorElPicker(null);
    };

    const handleOpenCheckIn = () => {
        setCheckIn(true)
    }

    const handleCloseCheckIn = () => {
        setCheckIn(false);
    }

    const handleSetCheckInData = (data) => {
        setDataCheckIn(data);
    }

    const handleRemoveCheckIn = () => {
        setDataCheckIn(null);
    }

    const addEmoji = (event) => {
        let emoji = event.native;
        setCaption(caption + emoji);
    }

    const removeImage = () => {
        setVideoUpload('');
    }

    const handleReset = () => {
        setProgress('0');
        setCaption("");
        setLoading(false);
        setVideoUpload("");
        setOpenSnack(true);
        setDisable(false);
        handleClose(true);
    }

    const handleUpload = () => {
        setDisable(true);
        if(videoUpload) {
            const imageName = uuidv4();
            const uploadTask = storage.ref(`videos/${user.uid}/${imageName}`).put(videoUpload);
            uploadTask.on(
                "state_changed",
                (snapshot => {
                    const progressData = Math.round(
                        (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                    );
                    // setProgress(parseFloat(progressData));
                    setLoading(true);
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
                            const dataSet = {
                                timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                                caption: caption ?? "",
                                media: [{
                                    mediaPath: url,
                                    type: videoUpload.type
                                }],
                                type: "video",
                                user: db.doc('users/' + user.uid),
                                uid: user.uid,
                                postTags: selectedChip ? selectedChip.map((data) => data.label) : "",
                            }

                            if(dataCheckIn) {
                                Object.assign(dataSet, {
                                    checkIn: {
                                        uid: dataCheckIn.uid,
                                        displayName: dataCheckIn.displayName,
                                    }
                                });
                            }

                            db.collection("posts").add(dataSet)
                                .then(function(docRef) {
                                    console.log("Document written with ID: ", docRef.id);
                                    db.collection("users").doc(user.uid).update({
                                        post: firebase.firestore.FieldValue.arrayUnion(docRef.id)
                                    }).catch(function(error) {
                                        console.error("Error adding document: ", error);
                                    });
                                    handleReset();
                                    setDisable(false);
                                }).catch(function(error) {
                                    console.error("Error adding document: ", error);
                                });
                        })
                }
            )
        }
    }

    useEffect(() => {
        if(videoUpload){
            setDisable(false);
        }else {
            setDisable(true)
        }
    },[videoUpload])


    return (
        <>
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
                        <div className={classes.inputHead}>
                            <CardHeader
                                avatar={
                                    <Avatar aria-label="recipe" className={classes.avatar} src={user?.photoURL}/>
                                }
                                title={
                                    <span className={classes.username}>{user?.displayName}</span>
                                }
                                subheader={
                                    <Select
                                        style={{minWidth: "100px"}}
                                        displayEmpty
                                        inputProps={{ 'aria-label': 'Status' }}
                                        value={postStatus}
                                        onChange={event => setPostStatus(event.target.value)}
                                    >
                                        <MenuItem value={`public`}><span>Public</span></MenuItem>
                                        <MenuItem value={`private`}><span>Private</span></MenuItem>
                                    </Select>
                                }
                                className={classes.cardHeader}
                            />
                            {
                                dataCheckIn ? (
                                    <div className={classes.fellingSelect} >
                                        <Chip
                                            color="primary"
                                            size="small"
                                            label={`is at ${dataCheckIn.displayName}`}
                                            onDelete={() => handleRemoveCheckIn()}
                                        />
                                    </div>
                                ) : null
                            }
                        </div>

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

                        {
                            videoUpload ? (
                                <div className={classes.tag}>
                                    <span className={classes.tagTitle}>Pin some tag to your post ?</span>
                                    <Paper elevation={0} component="ul" className={classes.listChip}>

                                        {selectedChip.map((data) => {
                                            return (
                                                <li key={data.key}>
                                                    <Chip
                                                        label={data.label}
                                                        onDelete={handleDeleteChip(data)}
                                                        className={classes.chip}
                                                    />
                                                </li>
                                            );
                                        })}
                                    </Paper>
                                    <div className={classes.pickerContainer}>
                                        {listChip.map((data) => {
                                            return (
                                                <Chip
                                                    key={data.key}
                                                    label={data.label}
                                                    clickable
                                                    color="primary"
                                                    onClick={() => handleSelectChip(data)}
                                                    className={classes.chip}
                                                />
                                            );
                                        })}
                                    </div>
                                </div>
                            ) : null
                        }


                    </div>
                    <div className="popup__picker">
                        <h3 style={{textTransform: "inherit", fontSize: "1rem", letterSpacing: "0"}}>Add or drop video file here</h3>
                        <div className="popup__iconPicker">
                            <div>
                                <label htmlFor="video-upload" className="upload__pickerButton">
                                    <IconButton color="inherit" component="span" >
                                        <Badge color="secondary">
                                            <VideoLibraryRoundedIcon className={classes.popIcon}/>
                                        </Badge>
                                    </IconButton>
                                </label>
                                <IconButton color="inherit" component="span" onClick={() => handleOpenCheckIn()}>
                                    <Badge color="secondary">
                                        <LocationOnTwoToneIcon className={classes.popIcon} />
                                    </Badge>
                                </IconButton>
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

            {
                checkIn ? (
                    <ListFoodShopCheckIn open={checkIn} handleClose={handleCloseCheckIn} userLogged={user} handleSetCheckInData={handleSetCheckInData}/>
                ) : null
            }
        </>
    )
}

export default AddVideo;