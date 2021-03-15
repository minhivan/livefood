import React, {useState} from "react";
import {Avatar, Badge, Button, IconButton, Modal, TextField} from "@material-ui/core";
import CancelTwoToneIcon from "@material-ui/icons/CancelTwoTone";
import CardHeader from "@material-ui/core/CardHeader";
import avt1 from "../../images/Avatar/avatar1.png";
import {makeStyles} from "@material-ui/core/styles";
import PhotoCameraTwoToneIcon from "@material-ui/icons/PhotoCameraTwoTone";
import VideoCallTwoToneIcon from "@material-ui/icons/VideoCallTwoTone";
import GroupAddTwoToneIcon from "@material-ui/icons/GroupAddTwoTone";

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



function Popup(props){
    const classes = useStyles();
    const [modalStyle] = useState(getModalStyle);
    const [caption, setCaption] = useState('');

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
                            <Avatar aria-label="recipe" className={classes.avatar} src={avt1}/>
                        }
                        title={
                            <span className={classes.username}>{props.username}</span>
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
                        props.image ? (
                            <div className="popup__review">
                                <img className={classes.reviewImg} src={URL.createObjectURL(props.image)} alt="Picture" />
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
                    <Button onClick={props.handleUpload}>Create</Button>
                </div>

            </div>
        </Modal>
    )
}
export default Popup