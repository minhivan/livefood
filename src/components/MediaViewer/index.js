import React, {useEffect, useState} from "react";
import {IconButton, Modal} from "@material-ui/core";
import CancelTwoToneIcon from "@material-ui/icons/CancelTwoTone";
import {makeStyles} from "@material-ui/core/styles";
// import {db} from "../../firebase";
// import ListComment from "../Posts/Comments";
import CardHeader from "@material-ui/core/CardHeader";
import Avatar from "@material-ui/core/Avatar";
import {Link} from "react-router-dom";
// import dayjs from "dayjs";
// import Card from "@material-ui/core/Card";
import Divider from '@material-ui/core/Divider';
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import {ToggleButton} from "@material-ui/lab";
import FavoriteRoundedIcon from "@material-ui/icons/FavoriteRounded";
import FavoriteBorderTwoToneIcon from "@material-ui/icons/FavoriteBorderTwoTone";
import ModeCommentOutlinedIcon from "@material-ui/icons/ModeCommentOutlined";
import BookmarkBorderOutlinedIcon from "@material-ui/icons/BookmarkBorderOutlined";
import ShareIcon from "@material-ui/icons/Share";
// import clsx from "clsx";
// import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import CardActions from "@material-ui/core/CardActions";

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
        maxHeight: "600px",
        height: "100%",
        display: "flex",
        justifyContent: "space-between",
        overflow: "hidden"
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
        width: "335px",
        height: "100%",
        overflowY: "scroll"
    },
    captionText: {
        whiteSpace: "pre-line",
        lineHeight: "26px"
    },
    modalBody: {
        height: "auto"
    },
    action: {
        borderTop: "1px solid rgba(var(--b6a,219,219,219),1)"
    },
    displayLike: {
        padding: "0 0 20px 20px",
        borderBottom: "1px solid rgba(var(--b6a,219,219,219),1)"
    },
    likeButton: {
        border: "0",
        backgroundColor: "none",
        borderRadius: "50%",
        '&:hover': {
            color: 'red',
        }
    }
}));

function MediaViewer(props){
    const classes = useStyles();
    const [modalStyle] = useState(getModalStyle);
    const [selected, setSelected] = useState(false);

    // const [user] = useAuthState(auth);
    dayjs.extend(relativeTime);
    let postCreated  = null;

    if(props?.post?.timestamp){
        postCreated = new Date(props?.post?.timestamp.seconds * 1000).toLocaleString();
    }



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
                            <div className={classes.buttonClose}>
                                <IconButton aria-label="Cancel" color="inherit" onClick={props.handleClose} >
                                    <CancelTwoToneIcon />
                                </IconButton>
                            </div>
                        </div>
                        <Divider />
                        <div className={classes.modalBody}>
                            <div className="post__caption">
                                <Link to={`/profile/${props.postAuthor?.uid}`} className="post__user">{props.postAuthor?.displayName}</Link>
                                <span className={classes.captionText}>{props.post.caption}</span>
                            </div>
                        </div>

                        <CardActions disableSpacing className={classes.action}>
                            <div className="action__like">
                                <ToggleButton
                                    value="check"
                                    selected={selected}
                                    className={classes.likeButton}
                                    onChange={() => {
                                        setSelected(!selected);
                                    }}
                                >
                                    {
                                        selected ? <FavoriteRoundedIcon style={{color: "red"}}/> : <FavoriteBorderTwoToneIcon />
                                    }
                                </ToggleButton>

                            </div>
                            <div className="action__comment">
                                <IconButton aria-label="comment">
                                    <ModeCommentOutlinedIcon/>
                                </IconButton>
                            </div>
                            <div className="action__share">
                                <IconButton aria-label="share">
                                    <BookmarkBorderOutlinedIcon />
                                </IconButton>
                            </div>
                            <div className="action__share">
                                <IconButton aria-label="share">
                                    <ShareIcon />
                                </IconButton>
                            </div>

                            {/*<div className="action__expand">*/}
                            {/*    <IconButton*/}
                            {/*        className={clsx(classes.expand, {*/}
                            {/*            [classes.expandOpen]: expanded,*/}
                            {/*        })}*/}
                            {/*        onClick={handleExpandClick}*/}
                            {/*        aria-expanded={expanded}*/}
                            {/*        aria-label="show more"*/}
                            {/*    >*/}
                            {/*        <ExpandMoreIcon />*/}
                            {/*    </IconButton>*/}
                            {/*</div>*/}
                        </CardActions>

                        <div className={classes.displayLike}>
                            <span><b>0 Likes</b></span>
                        </div>
                    </div>
                </div>
                {/*<ListComment comments={comments} />*/}
            </div>
        </Modal>
    )
}
export default MediaViewer