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
        cursor: "pointer"
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


export default function VideoItem(props) {

    const classes = useStyles();
    const [open, setOpen] = useState(false);

    function handleOpen(post, id){
        setOpen(true);
    }

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <div className="explore__gridSmall" key={props.id}>
            <video
                loop
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
            <MediaViewer open={open} id={props.id} post={props.post} postAuthor={props.postAuthor} comments={props.comments} handleClose={handleClose}  />
        </div>
    );
}