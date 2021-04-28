import React, {useEffect, useState} from "react";
import {Button, CardContent, Collapse, IconButton, Modal, TextField} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";

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
    root: {
        fontSize: "0.875rem"
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
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        borderRadius: "16px"
    },
    imgHolder: {
        width: "600px",
        position: "relative",
        overflow : "hidden",
        backgroundColor: "rgb(232, 231, 224)"
    },
    img: {
        objectFit: "contain",
        height: "100%",
        width: "100%",
    },
    details: {
        backgroundColor: "rgba(0,0,0,.8)",
        color: "#fff",
        padding: "20px",
        minHeight: ""
    }
}));

function Previewer({data, open, handleClose}){
    const classes = useStyles();
    const [modalStyle] = useState(getModalStyle);


    return (
        <Modal
            className={classes.root}
            open={open}
            onClose={handleClose}
            aria-labelledby="simple-modal-title"
            aria-describedby="simple-modal-description"
        >
            <div style={modalStyle} className={classes.paper}>
                <div className={classes.imgHolder}>
                    <img src={data?.mediaUrl} alt="" className={classes.img}/>
                </div>
                <div className={classes.details}>
                    <h2 id="simple-modal-title">{data?.dishName}</h2>
                    <p id="simple-modal-description" style={{fontWeight: "bold", paddingTop: "10px"}}>
                        {new Intl.NumberFormat().format(data?.price)} đ
                    </p>
                </div>
            </div>
        </Modal>
    )
}
export default Previewer