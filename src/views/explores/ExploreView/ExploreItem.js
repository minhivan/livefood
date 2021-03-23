import React, { useState} from "react";
import { makeStyles } from '@material-ui/core/styles';

import MediaViewer from "../../../components/MediaViewer";



const useStyles = makeStyles((theme) => ({
    imgContainer: {
        width: "100%",
        height: "100%"
    },
    img: {
        objectFit: "cover",
        width: "100%",
        height: "100%",
        borderRadius: "10px",
        cursor: "pointer"
    },
    paper: {
        position: 'absolute',
        maxWidth: 935,
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
        right: "0",
        top: "0"
    },


}));


export default function ExploreItem(props) {

    const classes = useStyles();
    const [open, setOpen] = useState(false);
    const [postPic, setPostPic] = useState([]);

    function handleOpen(post, id){
        setOpen(true);
        setPostPic({
            post: post,
            id: id
        })
    }

    const handleClose = () => {
        setOpen(false);
        setPostPic([]);
    };


    return (
            <div className="explore__gridSmall" key={props.id}>
                <img src={props.post.imageUrl}  alt="" className={classes.img} onClick={() => handleOpen(props.post, props.id)} />
                <MediaViewer open={open} post={props.post} author={props.author} comments={props.comments} handleClose={handleClose}  />
            </div>
    );
}