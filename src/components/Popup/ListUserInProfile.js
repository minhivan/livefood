import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import Divider from "@material-ui/core/Divider";
import {DialogContent} from "@material-ui/core";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import Avatar from "@material-ui/core/Avatar";
import ListItemText from "@material-ui/core/ListItemText";
import {Link} from "react-router-dom";
import Button from "@material-ui/core/Button";
import {handleUserFollow, handleUserUnfollow} from "../../hooks/services";
import React from "react";
import {makeStyles} from "@material-ui/core/styles";
import {blue} from "@material-ui/core/colors";
import {checkMyFollowingList} from "../../hooks/services";
import IconButton from "@material-ui/core/IconButton";
import AddCircleTwoToneIcon from "@material-ui/icons/AddCircleTwoTone";

const useStyles = makeStyles((theme) => ({
    root: {
        borderRadius: "16px",

    },
    avatar: {
        backgroundColor: blue[100],
        color: blue[600],
    },
    button: {
        overflow: "hidden",
        textOverflow: "ellipsis",
        position: "relative",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minWidth: "150px",
        color: "white",
        backgroundColor: "#0095f6",
        "&:hover": {
            backgroundColor: "#0186db",
        },
        marginRight: "15px",
        textTransform: "capitalize"
    },
    buttonUnfollow: {
        overflow: "hidden",
        textOverflow: "ellipsis",
        position: "relative",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minWidth: "150px",
        color: "#454444",
        // "&:hover": {
        //     backgroundColor: "#c3d6fa",
        // },
        marginRight: "15px",
        textTransform: "capitalize"
    },
    dialog: {
        maxWidth: "600px",
        width: "420px",
        padding: "10px",
        maxHeight : "500px"
    },
    dialogTitle: {
        textAlign: "center",
        fontWeight: "bold"
    },
    displayName: {
        maxWidth: "120px",
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",
        display: "inline-block"
    },
    opening: {
        display: "flex",
        alignItems: "center",
        color: "#65676B",
        padding: "20px 0"
    },
}));


export default function ListUserInProfile(props) {

    const classes = useStyles();
    const { handleClose, type, open, data, userLogged, authFollowingList, countUser, handleLoadMore} = props;
    return (
        <Dialog
            open={open}
            onClose={handleClose}
            aria-labelledby="simple-dialog-title"
            PaperProps={{
                classes: {
                    root: classes.root,
                }
            }}
            className={classes.root}
        >
            {
                type === 1 ? (
                    <DialogTitle id="simple-dialog-title" className={classes.dialogTitle}>
                        Following
                    </DialogTitle>
                ) : (
                    <DialogTitle id="simple-dialog-title" className={classes.dialogTitle}>
                        Follower
                    </DialogTitle>
                )
            }
            <Divider />
            <DialogContent className={classes.dialog}>
                <List>
                    {
                        data ? (data.map(({id, data}) => (
                            <ListItem key={id}>
                                <>
                                    <ListItemAvatar>
                                        <Avatar className={classes.avatar} src={data?.photoURL} />
                                    </ListItemAvatar>
                                    <ListItemText onClick={handleClose}>
                                        <Link to={`/profile/${id}`} className={classes.displayName}>{data?.displayName}</Link>
                                    </ListItemText>

                                </>
                                {
                                    checkMyFollowingList(authFollowingList, id) ? (
                                        userLogged.uid !== id ? (<Button
                                            variant="outlined"
                                            className={classes.buttonUnfollow}
                                            onClick={() => handleUserUnfollow(userLogged.uid, id)}
                                        >
                                            Unfollow
                                        </Button>) : null


                                    ) : (
                                        userLogged.uid !== id ? (
                                            <Button
                                                variant="contained"
                                                className={classes.button}
                                                onClick={() => handleUserFollow(userLogged.uid, id)}
                                            >
                                                Follow
                                            </Button>
                                        ) : null
                                    )
                                }
                            </ListItem>
                        ))) : null
                    }
                </List>
                {
                    data ? (
                        data?.length < countUser && (
                            <div className="comment__see-more-btn">
                                <IconButton aria-label="see more" onClick={() => handleLoadMore(type, data?.length)}>
                                    <AddCircleTwoToneIcon />
                                </IconButton>
                            </div>
                        )
                    ) : null
                }
            </DialogContent>
        </Dialog>
    );
}

// 30 =>