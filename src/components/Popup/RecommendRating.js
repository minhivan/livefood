import React, {useEffect, useState} from "react";
import {useAuthState} from "react-firebase-hooks/auth";
import {auth, db, storage} from "../../firebase";
import {v4 as uuidv4} from "uuid";
import firebase from "firebase";
import {
    Avatar, Box,
    Button,
    CircularProgress,
    IconButton,
    MenuItem,
    Modal,
    Popover,
    Select,
    TextField
} from "@material-ui/core";
import CancelTwoToneIcon from "@material-ui/icons/CancelTwoTone";
import CardHeader from "@material-ui/core/CardHeader";
import FormControl from "@material-ui/core/FormControl";
import SentimentSatisfiedRoundedIcon from "@material-ui/icons/SentimentSatisfiedRounded";
import {Picker} from "emoji-mart";
import {makeStyles} from "@material-ui/core/styles";
import {green} from "@material-ui/core/colors";
import {Rating} from "@material-ui/lab";



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
    inputHead: {
        display: "flex",
        alignItems: "flex-start",
    },
    root: {
        padding: "16px",
        width: 200,
        display: 'flex',
        alignItems: 'center',
    },
}));


const labels = {
    1: 'Worst',
    2: 'Poor',
    3: 'Ok',
    4: 'Good',
    5: 'Excellent',
};


export default function RecommendRating(props){
    const {open, userLogged, handleClose, shopId, voteRating} = props;
    const classes = useStyles();
    const [modalStyle] = useState(getModalStyle);
    const [caption, setCaption] = useState('');
    const [progress, setProgress] = useState('');
    const [loading, setLoading] = useState(false);
    const [disable, setDisable] = useState(true);
    const [anchorElPicker, setAnchorElPicker] = useState(null);
    const [value, setValue] = React.useState(4);
    const [hover, setHover] = React.useState(-1);

    const openEmoji = Boolean(anchorElPicker);
    const id = openEmoji ? 'popup-emoji' : undefined;




    useEffect(() => {
        if(caption && value){
            setDisable(false);
        }else {
            setDisable(true)
        }
    },[caption, value])


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

    const handleReset = () => {
        setProgress('0');
        setCaption("");
        setLoading(false);
        setDisable(false);
        handleClose(true);
    }


    const handleUpload = () => {
        db.collection("votes").doc(shopId).collection("data").add({
            user: db.doc('users/' + userLogged.uid),
            uid: userLogged.uid,
            avatar: userLogged.photoURL,
            from: userLogged.displayName,
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            comment: caption,
            rating: value,
        })
            .then(function(docRef) {
                // console.log("Document written with ID: ", docRef.id);
                if(typeof voteRating == 'undefined'){
                    db.collection("users").doc(shopId).update({
                        voteRating: value,
                        voteCount: firebase.firestore.FieldValue.increment(1)
                    })

                }
                else{
                    let avg = parseFloat((parseFloat(voteRating) + parseFloat(value)) / 2);
                    db.collection("users").doc(shopId).update({
                        voteRating: avg,
                        voteCount: firebase.firestore.FieldValue.increment(1)
                    })
                }
                handleReset();
            })
            .catch(function(error) {
                console.error("Error adding document: ", error);
            });
    }

    return (
        <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="simple-modal-title"
            aria-describedby="simple-modal-description"
        >
            <div style={modalStyle} className={classes.paper}>

                <div className={classes.modalHeader}>
                    <h2>Your recommendation</h2>
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
                                <Avatar aria-label="recipe" className={classes.avatar} src={userLogged.photoURL}/>
                            }
                            title={
                                <span className={classes.username}>{userLogged.displayName}</span>
                            }
                            subheader={
                                <span>Public</span>
                            }
                            className={classes.cardHeader}
                        />
                        <div className={classes.root}>
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
                    </div>

                    <div className="popup__text">
                        <TextField
                            className={classes.inputText}
                            multiline
                            placeholder="What do you think ?"
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
                        Vote
                    </Button>
                    {loading && <CircularProgress size={24} value={progress} className={classes.buttonProgress} /> }
                </div>

            </div>
        </Modal>
    )
}