import React, { useState} from "react";
import { makeStyles } from '@material-ui/core/styles';

import MediaViewer from "../MediaViewer";
import {Play as PlayIcon} from "react-feather";
import {Modal} from "@material-ui/core";



const useStyles = makeStyles((theme) => ({
    imgContainer: {
        width: "100%",
        height: "100%"
    },
    img: {
        objectFit: "cover",
        width: "100%",
        height: "100%",
        minHeight: "250px",
        cursor: "pointer",
        borderRadius: "16px"
    },
    icon: {
        color: "#050505",
    },
    none: {
        width: "35px",
        height: "35px",
        borderColor: "#a5a0a0",
        borderWidth: "1px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        borderStyle: "solid",
        borderRadius: "50%",
        position: "absolute",
        top: "20px",
        right: "20px",
        zIndex: "99",
        backgroundColor: "#fff"
    }
}));


export default function ExploreItem(props) {

    const {postId, post, userLogged, postAuthor, classPath} = props;

    const classes = useStyles();
    // const [postPic, setPostPic] = useState([]);
    const [open, setOpen] = React.useState(false);

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    let media;
    if(post.mediaType === "video/mp4"){
        media =
            <>
                <video
                    className={classes.img}
                    muted="muted"
                    onClick={() => handleOpen()}
                >
                    <source src={post.mediaUrl} type="video/mp4"/>
                </video>
                <div className={classes.none}>
                    <PlayIcon
                        className={classes.icon}
                        size="15"
                    />
                </div>
            </>
    } else{
        media = <img
                alt=""
                className={classes.img}
                src={post.mediaUrl}
                onClick={() => handleOpen()}
            />
    }

    return (
            <div className={`explore__gridSmall ${classPath}`} key={postId}>
                {/*<img src={props.post.mediaUrl}  alt="" className={classes.img} onClick={() => handleOpen(props.post, props.id)} />*/}
                {media}
                <MediaViewer userLogged={userLogged} open={open} postId={postId} post={post} postAuthor={postAuthor} handleClose={handleClose}  />
            </div>
    );
}