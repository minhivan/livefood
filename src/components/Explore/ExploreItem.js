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
        minHeight: "220px",
        cursor: "pointer",
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

    const {postId, post, userLogged, postAuthor, masonry} = props;

    const classes = useStyles();
    // const [postPic, setPostPic] = useState([]);
    const [open, setOpen] = React.useState(false);

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };




    return (
        <div className={`explore__gridSmall ${masonry ? "explore__masonry-item" : ""}`} key={postId}>

            {
                post?.media[0]?.type === "video/mp4" ? (
                    <video className={classes.img}
                           muted="muted"
                           onClick={() => handleOpen()}>
                        <source src={post?.media[0]?.mediaPath} type="video/mp4"/>
                    </video>
                ) : (
                    <img
                        alt=""
                        className={classes.img}
                        onClick={() => handleOpen()}
                        src={post?.media[0]?.mediaPath}
                    />
                )
            }
            {
                open ? (
                    <MediaViewer userLogged={userLogged} open={open} postId={postId} post={post} postAuthor={postAuthor} handleClose={handleClose}  />
                ) : null
            }
        </div>
    );
}