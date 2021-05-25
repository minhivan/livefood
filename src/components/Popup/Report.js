import React, {useState} from "react";
import {Button, IconButton, Modal} from "@material-ui/core";
import Divider from "@material-ui/core/Divider";
import {Link} from "react-router-dom";
import {makeStyles} from "@material-ui/core/styles";
import {green} from "@material-ui/core/colors";
import CancelTwoToneIcon from "@material-ui/icons/CancelTwoTone";

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
    paper: {
        position: 'absolute',
        width: 500,
        backgroundColor: theme.palette.background.paper,
        boxShadow: theme.shadows[5],
        padding: '0',
        borderRadius: "8px",
        maxHeight: "300px",
        "&:focus": {
            outline: "none"
        },
        display: "flex",
        flexDirection: "column"
    },
    modalHeader: {
        display: "flex",
        justifyContent: "center",
        padding: "15px",
        borderBottom: "1px solid #39CCCC"
    },
    buttonClose: {
        position: "fixed",
        right: "5px",
        top: "5px"
    },
    btnAction: {
        display: "flex",
        justifyContent: "center",
    },
    btnNormal: {
        color : "#282626",
        minHeight: "48px",
        width : "100%",
        textTransform: "capitalize",
        fontSize: "16px"
    },
    btnRed: {
        color : "#d8102a",
        minHeight: "48px",
        width : "100%",
        textTransform: "capitalize",
        fontSize: "16px"
    },
    btnLabel: {
        fontWeight: "normal"
    },
    buttonProgress: {
        color: green[500],
        position: 'absolute',
        top: '50%',
        left: '50%',
        marginTop: -12,
        marginLeft: -12,
    },
}));


export default function Report(props) {

    const {open, handleClose, postID} = props;

    const [modalStyle] = useState(getModalStyle);
    const classes = useStyles();
    return (
        <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="simple-modal-title"
            aria-describedby="simple-modal-description"
        >
            <div style={modalStyle} className={classes.paper}>
                <div className={classes.modalHeader}>
                    <h2>Report</h2>
                    <div className={classes.buttonClose}>
                        <IconButton aria-label="Cancel" color="inherit" onClick={handleClose} >
                            <CancelTwoToneIcon />
                        </IconButton>
                    </div>
                </div>
                <Divider />
                <div className={classes.btnAction}>
                    <Button
                        classes={{
                            root: classes.btnNormal,
                            label: classes.btnLabel,
                        }}
                    >
                        It's spam
                    </Button>
                </div>
                <Divider />
                <div className={classes.btnAction}>
                    <Button
                        classes={{
                            root: classes.btnNormal,
                            label: classes.btnLabel,
                        }}
                    >
                        Nudity or sexual activity
                    </Button>
                </div>
                <Divider />
                <div className={classes.btnAction}>
                    <Button
                        classes={{
                            root: classes.btnNormal,
                            label: classes.btnLabel,
                        }}
                    >
                        Hate speech or symbols
                    </Button>
                </div>
                <Divider />
                <div className={classes.btnAction}>
                    <Button
                        classes={{
                            root: classes.btnNormal,
                            label: classes.btnLabel,
                        }}
                    >
                        I just don't like it
                    </Button>
                </div>
            </div>

        </Modal>
    )
}