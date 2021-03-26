import React, {useEffect, useState} from "react";
import {IconButton, Modal} from "@material-ui/core";
import CancelTwoToneIcon from "@material-ui/icons/CancelTwoTone";
import {makeStyles} from "@material-ui/core/styles";
// import {db} from "../../firebase";
// import ListComment from "../Post/Comments";
import CardHeader from "@material-ui/core/CardHeader";
import Avatar from "@material-ui/core/Avatar";
import {Link} from "react-router-dom";
// import dayjs from "dayjs";
// import Card from "@material-ui/core/Card";
import Divider from '@material-ui/core/Divider';
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

// import {auth, db, storage} from "../../firebase";
// import firebase from "firebase";
// import {useAuthState} from "react-firebase-hooks/auth";

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
        maxWidth: 950,
        backgroundColor: theme.palette.background.paper,
        boxShadow: theme.shadows[5],
        "&:focus": {
            outline: "none"
        },
        minHeight: "600px",
        display: "flex",
        justifyContent: "space-between"
    },
    modalHeader: {
        display: "flex",
        justifyContent: "flex-start",
    },
    buttonClose: {
        position: "fixed",
        right: "0",
        top: "0"
    },
    imgHolder: {
        width: "600px",
        paddingBottom: "100%",
        position: "relative",
        overflow : "hidden",
    },
    img: {
        objectFit: "cover",
        height: "100%",
        left: "0",
        position: "absolute",
        top: "0",
        width: "100%",
    },
    leftPanel: {
        height: "100%",
        maxWidth: "600px"
    },
    rightPanel: {
        width: "335px"
    }
}));

function MediaViewer(props){
    // const [user] = useAuthState(auth);
    dayjs.extend(relativeTime);
    let postCreated  = null;

    if(props?.post?.timestamp){
        postCreated = new Date(props?.post?.timestamp.seconds * 1000).toLocaleString();
    }


    const classes = useStyles();
    const [modalStyle] = useState(getModalStyle);



    let media;

    if(props.post.mediaType === "video/mp4"){
        media = <div className={classes.imgHolder}>
            <video controls className={classes.img} muted="muted">
                <source src={props.post.mediaUrl} type="video/mp4"/>
            </video>
        </div>
    } else{
        media = <div className={classes.imgHolder}>
            <img src={props.post.mediaUrl} alt="" className={classes.img}/>
        </div>
    }



    return (
        <Modal
            open={props.open}
            onClose={props.handleClose}
            aria-labelledby="simple-modal-title"
            aria-describedby="simple-modal-description"
        >
            <div style={modalStyle} className={classes.paper}>
                <div className={classes.leftPanel}>
                    {media}
                </div>
                <div className={classes.rightPanel}>
                    <div className="review__data">
                        <div className={classes.modalHeader}>
                            <CardHeader
                                avatar={
                                    <Avatar className={classes.avatar} alt={props.postAuthor?.displayName} src={props.postAuthor.photoURL}/>
                                }
                                title={
                                    <Link to={`/profile/${props.postAuthor?.uid}`}>{props.postAuthor?.displayName}</Link>
                                }
                                subheader={dayjs(postCreated).fromNow()}
                            />
                        </div>
                        <Divider />
                        <div className={classes.modalBody}>
                            <div className="post__caption">
                                <Link to={`/profile/${props.postAuthor?.uid}`} className="post__user">{props.postAuthor?.displayName}</Link>
                                <span>{props.post.caption}</span>
                            </div>
                        </div>
                    </div>

                    <div className={classes.buttonClose}>
                        <IconButton aria-label="Cancel" color="inherit" onClick={props.handleClose} >
                            <CancelTwoToneIcon />
                        </IconButton>
                    </div>
                </div>

                {/*<ListComment comments={comments} />*/}
            </div>
        </Modal>
    )
}
export default MediaViewer