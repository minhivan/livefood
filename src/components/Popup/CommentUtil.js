import React, {useState} from "react";
import Divider from "@material-ui/core/Divider";
import {Button, Modal} from "@material-ui/core";
// import {Link} from "react-router-dom";
import {makeStyles} from "@material-ui/core/styles";
import {green} from "@material-ui/core/colors";
import {handleDeleteComment} from "../../hooks/services";

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
        width: 300,
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
        fontWeight: "bold"
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



const CommentUtil = (props) => {
    const {open, handleClose, postId, postUid, commentId, commentUid , userLogged, setOpenSnack} = props;
    const [modalStyle] = useState(getModalStyle);
    const classes = useStyles();

    console.log(commentUid, userLogged?.uid)

    return (
        <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="simple-modal-title"
            aria-describedby="simple-modal-description"
        >
            <div style={modalStyle} className={classes.paper}>
                <Divider />
                {
                    postUid === userLogged?.uid || commentUid === userLogged?.uid ? (
                        <>
                            <div className={classes.btnAction}>
                                <Button
                                    classes={{
                                        root: classes.btnRed,
                                        label: classes.btnLabel,
                                    }}
                                    onClick={
                                        () => {
                                            handleDeleteComment(postId, commentId);
                                            handleClose(true);
                                        }
                                    }
                                >
                                    Delete
                                </Button>
                            </div>
                            <Divider />
                        </>
                    ) : (
                        <>
                            <div className={classes.btnAction}>
                                <Button
                                    classes={{
                                        root: classes.btnRed,
                                        label: classes.btnLabel,
                                    }}
                                    onClick={
                                        () => {
                                            handleClose(true);
                                            setOpenSnack(true);
                                        }
                                    }

                                >
                                    Report
                                </Button>
                            </div>
                            <Divider />
                        </>
                    )
                }

                <div className={classes.btnAction}>
                    <Button
                        classes={{
                            root: classes.btnNormal,
                            label: classes.btnLabel,
                        }}
                        onClick={props.handleClose}
                    >
                        Cancel
                    </Button>
                </div>
                <Divider />
            </div>

        </Modal>
    )

}


export default CommentUtil