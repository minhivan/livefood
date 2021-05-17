import React, {useEffect, useState} from "react";
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
import {checkMyFollowingList, handleUserFollow, handleUserUnfollow} from "../../hooks/services";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import AddCircleTwoToneIcon from "@material-ui/icons/AddCircleTwoTone";
import PropTypes from "prop-types";
import {makeStyles} from "@material-ui/core/styles";
import {blue} from "@material-ui/core/colors";
import {useDocument} from "react-firebase-hooks/firestore";
import {db} from "../../firebase";
import firebase from "firebase";

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


export default function ListUserLikePost(props){
    const classes = useStyles();
    const { open, handleClose, userLogged, likesCount, postLike } = props;

    const [authData] = useDocument(userLogged && db.collection('users').doc(userLogged.uid));
    const authFollowingList = authData?.data()?.following;
    const [likesList, setLikesList] = useState([]);
    const [userLoggedData, setUserLoggedData] = useState({});

    useEffect(() => {
        if(userLogged){
            setUserLoggedData({
                uid: userLogged.uid,
                photoURL: userLogged.photoURL,
                displayName: userLogged.displayName
            })
        }
    }, [userLogged])


    useEffect(() => {
        const unsubscribe = db.collection("users")
            .where(firebase.firestore.FieldPath.documentId(), 'in', postLike.slice(0,9))
            .onSnapshot(snapshot => {
                setLikesList(
                    snapshot.docs.map((doc => ({
                        id: doc.id,
                        data: doc.data(),
                    })))
                );
        })
        return () => {
            unsubscribe();
        }
    }, [postLike])

    const handleLoadMore = (length) => {

        return db.collection("users")
            .where(firebase.firestore.FieldPath.documentId(), 'in', postLike.slice(length,length+9))
            .get().then(snapshot => {
                const temp = snapshot.docs.map((doc => ({
                    id: doc.id,
                    data: doc.data(),
                })))
                setLikesList([...likesList, ...temp]);
            })
    }

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
            <DialogTitle id="simple-dialog-title" className={classes.dialogTitle}>
                Likes
            </DialogTitle>
            <Divider />
            <DialogContent className={classes.dialog}>
                <List>
                    {
                        likesList ? (likesList.map(({id, data}) => (
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
                                    userLogged ? (
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
                                                    onClick={() => handleUserFollow(userLoggedData, id)}
                                                >
                                                    Follow
                                                </Button>
                                            ) : null
                                        )
                                    ) : null
                                }
                            </ListItem>
                        ))) : null
                    }
                </List>
                {
                    likesList ? (
                        likesList?.length < likesCount && (
                            <div className="comment__see-more-btn">
                                <IconButton aria-label="see more" onClick={() => handleLoadMore(likesList?.length)}>
                                    <AddCircleTwoToneIcon />
                                </IconButton>
                            </div>
                        )
                    ) : null
                }
            </DialogContent>
        </Dialog>
    )
}

// const { open, handleClose, data, userLogged, authFollowingList, countLike ,handleLoadMore } = props;

// ListUserLikePost.propTypes = {
//     open: PropTypes.bool.isRequired,
//     handleClose: PropTypes.bool.isRequired,
//     userLogged: PropTypes.object,
//     authFollowingList: PropTypes.array,
//     countLike: PropTypes.number,
//     handleLoadMore : PropTypes.func,
// };