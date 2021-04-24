import React, { useState} from "react";
import { makeStyles } from '@material-ui/core/styles';

import MediaViewer from "../MediaViewer";
import {Play as PlayIcon} from "react-feather";



const useStyles = makeStyles((theme) => ({
    imgContainer: {
        width: "100%",
        height: "100%"
    },
    img: {
        objectFit: "cover",
        width: "100%",
        height: "100%",
        cursor: "pointer",
        boxShadow: "0px 0px 5px 0px #ddc4c4bf",
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

    const classes = useStyles();
    const [open, setOpen] = useState(false);
    // const [postPic, setPostPic] = useState([]);

    function handleOpen(post, id){
        setOpen(true);
    }

    const handleClose = () => {
        setOpen(false);
    };

    let media;
    if(props.post.mediaType === "video/mp4"){
        media =
            <>
                <video
                    className={classes.img}
                    muted="muted"
                    onClick={() => handleOpen(props.post, props.id)}
                >
                    <source src={props.post.mediaUrl} type="video/mp4"/>
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
                src={props.post.mediaUrl}
                onClick={() => handleOpen(props.post, props.id)}
            />
    }

    return (
            <div className="explore__gridSmall" key={props.id}>
                {/*<img src={props.post.mediaUrl}  alt="" className={classes.img} onClick={() => handleOpen(props.post, props.id)} />*/}
                {media}
                <MediaViewer open={open} id={props.id} post={props.post} postAuthor={props.postAuthor} handleClose={handleClose}  />
            </div>
    );
}