import React, {useEffect, useState} from "react";
import clsx from "clsx";
import PropTypes from 'prop-types';
import {handleDislikePost, handleLikePost, handleSavePost, handleUnSavedPost} from "../../hooks/services";
import {makeStyles} from "@material-ui/core/styles";
import {ToggleButton} from "@material-ui/lab";
import FavoriteRoundedIcon from "@material-ui/icons/FavoriteRounded";
import FavoriteBorderTwoToneIcon from "@material-ui/icons/FavoriteBorderTwoTone";
import IconButton from "@material-ui/core/IconButton";
import ModeCommentOutlinedIcon from "@material-ui/icons/ModeCommentOutlined";
import BookmarkRoundedIcon from "@material-ui/icons/BookmarkRounded";
import BookmarkBorderOutlinedIcon from "@material-ui/icons/BookmarkBorderOutlined";

import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import CardActions from "@material-ui/core/CardActions";
import ListUserLikePost from "../Popup/ListUserLikePost";
import {db} from "../../firebase";
import firebase from "firebase";


const useStyles = makeStyles((theme) => ({
    expand: {
        transform: 'rotate(0deg)',
        marginLeft: 'auto',
        transition: theme.transitions.create('transform', {
            duration: theme.transitions.duration.shortest,
        }),
    },
    expandOpen: {
        transform: 'rotate(180deg)',
    },
    action: {
        borderTop: "1px solid rgba(var(--b6a,219,219,219),1)",
        justifyContent: "space-between"
    },
    actionButton: {
        border: "0",
        backgroundColor: "none",
        borderRadius: "50%",
        color: "rgba(0, 0, 0, 0.54)",
        '&:hover': {
            color: 'black',
        }
    },
    selected: {
        backgroundColor: "unset !important"
    },
    displayLike: {
        padding: "0 0 20px 20px",
        borderBottom: "1px solid rgba(var(--b6a,219,219,219),1)"
    },
    likesCount: {
        cursor: "pointer",
        '&:hover': {
            textDecoration: "underline",
        }
    }


}));



export default function PostAction({postId, uid, postLike, postSave, expanded, setExpanded, hasData, handleFocus, userLogged}){
    const classes = useStyles();
    const [selected, setSelected] = useState(false);
    const [saveSelected, setSaveSelected] = useState(false);
    const [openLikesList, setOpenLikesList] = useState(false);
    const [likesList, setLikesList] = useState([]);


    const handleOpenLikesList = () => {
        setOpenLikesList(true);
    }

    const handleCloseLikesList = () => {
        setOpenLikesList(false);
    }


    const handleExpandClick = () => {
        setExpanded(!expanded);
    };

    // Handle like and dislike action
    const likePost = () => {
        setSelected(true);
        handleLikePost(postId, uid)
    }

    const dislikePost = () => {
        setSelected(false);
        handleDislikePost(postId, uid)
    }

    const savePost = () => {
        // Save post id to user data, and push to post data
        setSaveSelected(true);
        handleSavePost(postId, uid);
    }

    const unsavedPost = () => {
        // Save post id to user data, and push to post data
        setSaveSelected(false);
        handleUnSavedPost(postId, uid);
    }

    useEffect(() => {
        if(typeof postLike !== 'undefined' && postLike?.includes(uid)){
            setSelected(true);
        }

        if(typeof postSave !== 'undefined' && postSave?.includes(uid)){
            setSaveSelected(true);
        }
    }, [postLike, postSave, uid])

    useEffect(() => {
        db.collection("users")
            .where(firebase.firestore.FieldPath.documentId(), 'in', postLike.slice(0,9))
            .get().then(snapshot => {
            setLikesList(
                snapshot.docs.map((doc => ({
                    id: doc.id,
                    data: doc.data(),
                })))
            );
        })
    }, [])

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



    return(
        <>
            <CardActions disableSpacing className={classes.action}>
                <div className="post__button">
                    <div className="action__like">
                        <ToggleButton
                            value="check"
                            selected={selected}
                            // className={classes.likeButton}
                            classes={{
                                root: classes.actionButton,
                                selected: classes.selected,
                            }}
                            onClick={() => {
                                if(!selected) likePost();
                                else dislikePost();
                            }}
                        >
                            {
                                selected ? <FavoriteRoundedIcon style={{color: "red"}}/> : <FavoriteBorderTwoToneIcon />
                            }
                        </ToggleButton>
                    </div>
                    <div className="action__comment">
                        <IconButton aria-label="comment" onClick={handleFocus}>
                            <ModeCommentOutlinedIcon/>
                        </IconButton>
                    </div>
                    <div className="action__share">
                        <ToggleButton
                            value="check"
                            selected={saveSelected}
                            // className={classes.likeButton}
                            classes={{
                                root: classes.actionButton,
                                selected: classes.selected,
                            }}
                            onClick={() => {
                                if(!saveSelected) savePost();
                                else unsavedPost();
                            }}
                        >
                            {
                                saveSelected ? <BookmarkRoundedIcon style={{color: "black"}}/> : <BookmarkBorderOutlinedIcon />
                            }
                        </ToggleButton>
                        {/*<IconButton aria-label="share">*/}
                        {/*	<BookmarkBorderOutlinedIcon />*/}
                        {/*</IconButton>*/}
                    </div>
                </div>
                {
                     hasData ? (
                        <div className="action__expand">
                            <IconButton
                                className={clsx(classes.expand, {
                                    [classes.expandOpen]: expanded,
                                })}
                                onClick={handleExpandClick}
                                aria-expanded={expanded}
                                aria-label="show more"
                            >
                                <ExpandMoreIcon />
                            </IconButton>
                        </div>
                    ) : null
                }
            </CardActions>

            {
                postLike?.length > 0 ? (
                    <div className={classes.displayLike}>
                        <span className={classes.likesCount} onClick={handleOpenLikesList}><b>{postLike?.length.toLocaleString()} {postLike?.length === 1 ? 'Like' : 'Likes'}</b></span>
                    </div>
                ) : null
            }

            <ListUserLikePost open={openLikesList} handleClose={handleCloseLikesList} userLogged={userLogged} countLike={postLike?.length} data={likesList} handleLoadMore={handleLoadMore}/>
        </>
    )
}

PostAction.propTypes = {
    postId: PropTypes.string.isRequired,
    uid: PropTypes.string.isRequired,
    postLike: PropTypes.array,
    postSave: PropTypes.array,
};