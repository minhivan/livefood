import React, {useState} from "react";
import Divider from "@material-ui/core/Divider";
import {Button, Modal} from "@material-ui/core";
import {Link} from "react-router-dom";
import {makeStyles} from "@material-ui/core/styles";
import {green} from "@material-ui/core/colors";
import {handleReportPost, handleDeletePost, handleUserUnfollow} from "../../hooks/services";
import id from "emoji-mart/dist/components/search";

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



const PostUtil = (props) => {
    const [modalStyle] = useState(getModalStyle);
    const classes = useStyles();

    let isYourPost  = false;
    if(props.uid === props.opponentID){
        isYourPost = true;
    }

    return (
        <Modal
            open={props.open}
            onClose={props.handleClose}
            aria-labelledby="simple-modal-title"
            aria-describedby="simple-modal-description"
        >
            <div style={modalStyle} className={classes.paper}>
                <Divider />
                {
                    isYourPost ? (
                        <>
                            <div className={classes.btnAction}>
                                <Button
                                    classes={{
                                        root: classes.btnRed,
                                        label: classes.btnLabel,
                                    }}
                                    onClick={
                                        () => {
                                            handleDeletePost(props.id);
                                            props.handleRemove(props.id);
                                            props.handleClose(true);
                                        }
                                    }
                                >
                                    Delete
                                </Button>
                            </div>
                            <Divider />

                            <div className={classes.btnAction}>
                                <Button
                                    classes={{
                                        root: classes.btnRed,
                                        label: classes.btnLabel,
                                    }}
                                    onClick={
                                        () => {
                                            // handleUserUnfollow(props.uid, props.opponentID);
                                            props.handleClose(true);
                                        }
                                    }
                                >
                                    Edit
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
                                            handleReportPost(props.uid, props.id);
                                            props.handleRemove(props.id);
                                            props.handleClose(true);
                                        }
                                    }
                                >
                                    Report
                                </Button>
                            </div>
                            <Divider />
                            <div className={classes.btnAction}>
                                <Button
                                    classes={{
                                        root: classes.btnRed,
                                        label: classes.btnLabel,
                                    }}
                                    onClick={
                                        () => {
                                            handleUserUnfollow(props.uid, props.opponentID);
                                            props.handleRemove(props.id);
                                            props.handleClose(true);
                                        }
                                    }
                                >
                                    Unfollow
                                </Button>
                            </div>
                            <Divider />
                        </>
                    )
                }


                <div className={classes.btnAction}>
                    <Button
                        component={Link}
                        to={`p/${props.postID}`}
                        classes={{
                            root: classes.btnNormal,
                            label: classes.btnLabel,
                        }}
                    >
                        Go to post
                    </Button>
                </div>
                <Divider />

                {
                    !props.isSave ? (
                        <>
                            <div className={classes.btnAction}>
                                <Button
                                    classes={{
                                        root: classes.btnNormal,
                                        label: classes.btnLabel,
                                    }}

                                >
                                    Save post
                                </Button>
                            </div>
                            <Divider />
                        </>
                    ) : null
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


export default PostUtil