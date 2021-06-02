import React, {useState} from "react";
import Divider from "@material-ui/core/Divider";
import {Button, Modal} from "@material-ui/core";
import {Link} from "react-router-dom";
import {makeStyles} from "@material-ui/core/styles";
import {green} from "@material-ui/core/colors";
import {
    handleReportPost,
    handleDeletePost,
    handleUserUnfollow,
    handleSavePost,
    handleUserFollow
} from "../../hooks/services";

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
    const {open, handleClose, uid, opponentID, postID, handleReport, handleOpenEdit, setOpenSnack, savePost, isFollow, userLoggedData} = props;

    const [modalStyle] = useState(getModalStyle);
    const classes = useStyles();


    console.log(isFollow)

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
                    uid === opponentID ? (
                        <>
                            <div className={classes.btnAction}>
                                <Button
                                    classes={{
                                        root: classes.btnRed,
                                        label: classes.btnLabel,
                                    }}
                                    onClick={
                                        () => {
                                            handleDeletePost(postID, uid);
                                            // handleRemove(postID);
                                            handleClose(true);
                                            setOpenSnack(true);
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
                                            // handleUserUnfollow(uid, opponentID);
                                            handleOpenEdit();
                                            // handleClose(true);
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
                                            handleReport();
                                            handleClose(true);
                                        }
                                    }
                                >
                                    Report
                                </Button>
                            </div>
                            <Divider />
                            {
                                isFollow ? (
                                    <>
                                        <div className={classes.btnAction}>
                                            <Button
                                                classes={{
                                                    root: classes.btnRed,
                                                    label: classes.btnLabel,
                                                }}
                                                onClick={
                                                    () => {
                                                        handleUserUnfollow(uid, opponentID);
                                                        setOpenSnack(true);
                                                        handleClose(true);
                                                    }
                                                }
                                            >
                                                Unfollow
                                            </Button>
                                        </div>
                                        <Divider />
                                    </>
                                ) : (
                                    <>
                                        <div className={classes.btnAction}>
                                            <Button
                                                classes={{
                                                    root: classes.btnNormal,
                                                    label: classes.btnLabel,
                                                }}
                                                onClick={
                                                    () => {
                                                        handleUserFollow(userLoggedData, opponentID);
                                                        setOpenSnack(true);
                                                        handleClose(true);
                                                    }
                                                }
                                            >
                                                Follow
                                            </Button>
                                        </div>
                                        <Divider />
                                    </>
                                )
                            }

                        </>
                    )
                }


                <div className={classes.btnAction}>
                    <Button
                        component={Link}
                        to={`/p/${postID}`}
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
                    !savePost ? (
                        <>
                            <div className={classes.btnAction}>
                                <Button
                                    classes={{
                                        root: classes.btnNormal,
                                        label: classes.btnLabel,
                                    }}
                                    onClick={() => {
                                        setOpenSnack(true);
                                        handleSavePost(postID, uid)
                                        handleClose(true);
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
                        onClick={handleClose}
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